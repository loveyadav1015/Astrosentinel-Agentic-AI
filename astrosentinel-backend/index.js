require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');
const Groq = require('groq-sdk');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000; // Added fallback port just in case

app.use(cors());
app.use(express.json());

// Initialize Groq with your API key
// Initialize Groq safely so it never crashes your server on startup
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY || "placeholder_key_until_env_is_read" 
});

// --- DATABASE CONNECTION ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(async (client) => {
        console.log('✅ Connected to PostgreSQL');
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS chats (
                    id SERIAL PRIMARY KEY,
                    role VARCHAR(50) NOT NULL,
                    text TEXT NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Chats table is ready');

            await client.query(`
                CREATE TABLE IF NOT EXISTS neo_objects (
                    id                    TEXT PRIMARY KEY,
                    name                  TEXT NOT NULL,
                    estimated_diameter_km FLOAT,
                    is_hazardous          BOOLEAN DEFAULT false,
                    close_approach_date   DATE,
                    miss_distance_km      FLOAT,
                    velocity_kph          FLOAT,
                    absolute_magnitude    FLOAT,
                    risk_tier             TEXT CHECK (risk_tier IN ('Critical','Elevated','Watch')),
                    orbital_data          JSONB,
                    raw_nasa_json         JSONB,
                    first_seen_at         TIMESTAMPTZ DEFAULT NOW(),
                    updated_at            TIMESTAMPTZ DEFAULT NOW()
                );
            `);
            console.log('✅ neo_objects table is ready');

            await client.query(`
                CREATE TABLE IF NOT EXISTS alerts (
                    id          SERIAL PRIMARY KEY,
                    neo_id      TEXT REFERENCES neo_objects(id) ON DELETE CASCADE,
                    neo_name    TEXT,
                    risk_tier   TEXT,
                    message     TEXT,
                    is_read     BOOLEAN DEFAULT false,
                    created_at  TIMESTAMPTZ DEFAULT NOW()
                );
            `);
            console.log('✅ Alerts table is ready');

            await client.query('CREATE INDEX IF NOT EXISTS idx_neo_date     ON neo_objects(close_approach_date DESC)');
            await client.query('CREATE INDEX IF NOT EXISTS idx_neo_tier     ON neo_objects(risk_tier)');
            await client.query('CREATE INDEX IF NOT EXISTS idx_alert_unread ON alerts(is_read, created_at DESC)');
            console.log('✅ Indexes are ready');
        } finally {
            client.release();
        }
    })
    .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));


// --- RISK CLASSIFICATION HELPER ---
function classifyRisk(neo) {
    const dist = parseFloat(neo.close_approach_data?.[0]?.miss_distance?.kilometers ?? 9999999);
    const hazardous = neo.is_potentially_hazardous_asteroid;
    if (hazardous && dist < 500000)  return 'Critical';
    if (hazardous || dist < 1000000) return 'Elevated';
    return 'Watch';
}

// --- NASA FETCH + TRANSFORM HELPER ---
async function fetchAndTransformNasa(startDate, endDate) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${process.env.NASA_API_KEY}`;
    const res = await axios.get(url);
    const data = res.data;
    const days = Object.values(data.near_earth_objects || {});
    return days.flat().map(neo => ({
        id:                    neo.id,
        name:                  neo.name,
        estimated_diameter_km: neo.estimated_diameter?.kilometers?.estimated_diameter_max ?? 0,
        is_hazardous:          neo.is_potentially_hazardous_asteroid,
        close_approach_date:   neo.close_approach_data?.[0]?.close_approach_date,
        miss_distance_km:      parseFloat(neo.close_approach_data?.[0]?.miss_distance?.kilometers ?? 0),
        velocity_kph:          parseFloat(neo.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour ?? 0),
        absolute_magnitude:    neo.absolute_magnitude_h,
        risk_tier:             classifyRisk(neo),
        raw_nasa_json:         neo,
    }));
}

// --- UPSERT HELPER ---
async function upsertNeos(neos) {
    const newAlerts = [];
    for (const n of neos) {
        const existing = await pool.query('SELECT risk_tier FROM neo_objects WHERE id=$1', [n.id]);
        const wasNew   = existing.rows.length === 0;
        const oldTier  = existing.rows[0]?.risk_tier;

        await pool.query(`
            INSERT INTO neo_objects
                (id,name,estimated_diameter_km,is_hazardous,close_approach_date,
                 miss_distance_km,velocity_kph,absolute_magnitude,risk_tier,raw_nasa_json,updated_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
            ON CONFLICT (id) DO UPDATE SET
                risk_tier=$9, miss_distance_km=$6, velocity_kph=$7,
                raw_nasa_json=$10, updated_at=NOW()
        `, [n.id, n.name, n.estimated_diameter_km, n.is_hazardous,
            n.close_approach_date, n.miss_distance_km, n.velocity_kph,
            n.absolute_magnitude, n.risk_tier, JSON.stringify(n.raw_nasa_json)]);

        if (wasNew || (oldTier !== n.risk_tier && n.risk_tier !== 'Watch')) {
            const msg = wasNew
                ? `New ${n.risk_tier} object detected: ${n.name} at ${Math.round(n.miss_distance_km).toLocaleString()} km`
                : `${n.name} escalated from ${oldTier} → ${n.risk_tier}`;
            const alertRow = await pool.query(
                `INSERT INTO alerts (neo_id,neo_name,risk_tier,message) VALUES ($1,$2,$3,$4) RETURNING *`,
                [n.id, n.name, n.risk_tier, msg]
            );
            newAlerts.push(alertRow.rows[0]);
        }
    }
    return newAlerts;
}

// --- SHARED REFRESH FUNCTION (used by cron + manual refresh route) ---
async function refreshNeoData() {
    const today = new Date().toISOString().split('T')[0];
    const end   = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    const neos  = await fetchAndTransformNasa(today, end);
    const alerts = await upsertNeos(neos);
    return { count: neos.length, alerts: alerts.length, newAlerts: alerts };
}


// --- NASA API ROUTE ---
app.get('/api/neo', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const apiKey = process.env.NASA_API_KEY;
        const nasaUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;

        const response = await axios.get(nasaUrl);
        const neoObjects = response.data.near_earth_objects[today] || [];
        
        const formattedData = {
            totalMonitored: response.data.element_count,
            activeAlerts: neoObjects.filter(neo => neo.is_potentially_hazardous_asteroid).length,
            objects: neoObjects.map(neo => ({
                id: neo.id,
                name: neo.name,
                sizeMax: Math.round(neo.estimated_diameter.meters.estimated_diameter_max),
                velocity: Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_second),
                distance: Math.round(neo.close_approach_data[0].miss_distance.kilometers),
                isHazardous: neo.is_potentially_hazardous_asteroid,
            }))
        };

        res.json(formattedData);
    } catch (error) {
        console.error("Error fetching from NASA:", error.message);
        res.status(500).json({ error: "Failed to fetch telemetry data from NASA." });
    }
});


// --- CHATBOT ROUTES ---

// 1. Fetch previous chat history
app.get('/api/chat', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM chats ORDER BY timestamp ASC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching chats:", error.message);
        res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
});


app.delete('/api/chat', async (req, res) => {
    try {
        await pool.query('DELETE FROM chats');
        res.status(200).json({ message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear chat' });
    }
});

// 2. NEW RAG AI Chat Route (Groq Llama 3)
app.post('/api/chat', async (req, res) => {
    try {
        const { role, text } = req.body;
        
        // Step A: Save the user's message to the database
        await pool.query('INSERT INTO chats (role, text) VALUES ($1, $2)', [role, text]);

        // Step B: Fetch the latest NASA data for the RAG context
        const today = new Date().toISOString().split('T')[0];
        const nasaUrl = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${process.env.NASA_API_KEY}`;
        const nasaRes = await axios.get(nasaUrl);
        const neoObjects = nasaRes.data.near_earth_objects[today] || [];
        
        // Format the data into a readable string for Llama 3
        const telemetryString = neoObjects.map(neo => 
            `- ${neo.name}: ${Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}m diameter, Velocity: ${Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_second)}km/s, Miss Distance: ${Math.round(neo.close_approach_data[0].miss_distance.kilometers)}km. Hazardous: ${neo.is_potentially_hazardous_asteroid ? 'YES' : 'NO'}`
        ).join('\n');

        // Step C: Call Groq to generate a response based on the telemetry
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are AstroSentinel AI, an advanced orbital defense monitoring assistant. 
                    Use ONLY the following live NASA telemetry data to answer the user's questions:
                    
                    CURRENT TELEMETRY DATA:
                    ${telemetryString}
                    
                    Rules:
                    1. Keep your answers concise, professional, and slightly futuristic.
                    2. If the user asks about an asteroid in the data, give them the exact stats.
                    3. If the user asks something not in the data, politely state that your sensors only cover the current telemetry.`
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "llama-3.1-8b-instant", 
            temperature: 0.5,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "System error: Neural link severed.";

        // Step D: Save the AI's response to the database
        const dbRes = await pool.query(
            'INSERT INTO chats (role, text) VALUES ($1, $2) RETURNING *',
            ['assistant', aiResponse]
        );

        // Step E: Send the AI's response back to the frontend
        res.status(201).json(dbRes.rows[0]);

    } catch (error) {
        console.error("AI Core Error:", error);
        res.status(500).json({ error: 'Failed to process AI telemetry response' });
    }
});


// --- GAP 1: NEW API ROUTES ---

// Route 1: GET /api/neo/history — 30-day grouped counts by risk tier
app.get('/api/neo/history', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                close_approach_date::text AS date,
                risk_tier,
                COUNT(*)::int AS count
            FROM neo_objects
            WHERE close_approach_date >= NOW() - INTERVAL '30 days'
            GROUP BY close_approach_date, risk_tier
            ORDER BY close_approach_date ASC
        `);

        const dateSet = [...new Set(result.rows.map(r => r.date))].sort();
        const byDate  = {};
        result.rows.forEach(r => {
            if (!byDate[r.date]) byDate[r.date] = { Critical: 0, Elevated: 0, Watch: 0 };
            byDate[r.date][r.risk_tier] = r.count;
        });

        res.json({
            dates:    dateSet,
            critical: dateSet.map(d => byDate[d]?.Critical  ?? 0),
            elevated: dateSet.map(d => byDate[d]?.Elevated  ?? 0),
            watch:    dateSet.map(d => byDate[d]?.Watch      ?? 0),
        });
    } catch (e) {
        console.error('Error in /api/neo/history:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Route 2: GET /api/stats — aggregate counts
app.get('/api/stats', async (req, res) => {
    try {
        const [counts, unread, lastScan] = await Promise.all([
            pool.query(`
                SELECT
                    COUNT(*)                                          AS total_tracked,
                    COUNT(*) FILTER (WHERE risk_tier = 'Critical')   AS critical_count,
                    COUNT(*) FILTER (WHERE risk_tier = 'Elevated')   AS elevated_count,
                    COUNT(*) FILTER (WHERE risk_tier = 'Watch')      AS watch_count
                FROM neo_objects
            `),
            pool.query(`SELECT COUNT(*) AS unread FROM alerts WHERE is_read = false`),
            pool.query(`SELECT MAX(updated_at) AS last_scan FROM neo_objects`),
        ]);

        const c = counts.rows[0];
        res.json({
            total_tracked:  parseInt(c.total_tracked),
            critical_count: parseInt(c.critical_count),
            elevated_count: parseInt(c.elevated_count),
            watch_count:    parseInt(c.watch_count),
            unread_alerts:  parseInt(unread.rows[0].unread),
            last_scan_at:   lastScan.rows[0].last_scan,
            system_status:  'operational',
        });
    } catch (e) {
        console.error('Error in /api/stats:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Route 3: PATCH /api/alerts/:id/read — mark alert as read
app.patch('/api/alerts/:id/read', async (req, res) => {
    try {
        await pool.query(
            'UPDATE alerts SET is_read = true WHERE id = $1', [req.params.id]
        );
        res.json({ ok: true });
    } catch (e) {
        console.error('Error in PATCH /api/alerts/:id/read:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Route 4: DELETE /api/alerts/:id — delete alert
app.delete('/api/alerts/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM alerts WHERE id = $1', [req.params.id]);
        res.json({ ok: true });
    } catch (e) {
        console.error('Error in DELETE /api/alerts/:id:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Route 5: POST /api/neo/refresh — manual trigger
app.post('/api/neo/refresh', async (req, res) => {
    try {
        const result = await refreshNeoData();
        res.json({
            updated_count:    result.count,
            new_alerts_count: result.alerts,
        });
    } catch (e) {
        console.error('Error in POST /api/neo/refresh:', e.message);
        res.status(500).json({ error: e.message });
    }
});

// Route 6: GET /api/neo/:id — full NASA detail (MUST be after /api/neo/history, /api/neo/refresh)
app.get('/api/neo/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // First try local DB for cached data
        const local = await pool.query(
            'SELECT * FROM neo_objects WHERE id = $1', [id]
        );

        // Fetch full detail from NASA (has orbital data + close approach history)
        const url = `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${process.env.NASA_API_KEY}`;
        const nasaRes  = await axios.get(url);
        const nasaData = nasaRes.data;

        // Merge local risk_tier + DB fields with NASA orbital detail
        const row = local.rows[0] ?? {};
        res.json({
            id,
            name:                  nasaData.name,
            risk_tier:             row.risk_tier,
            is_hazardous:          nasaData.is_potentially_hazardous_asteroid,
            estimated_diameter_km: row.estimated_diameter_km,
            miss_distance_km:      row.miss_distance_km,
            velocity_kph:          row.velocity_kph,
            absolute_magnitude:    nasaData.absolute_magnitude_h,
            close_approach_date:   row.close_approach_date,
            orbital_data: {
                semi_major_axis:        nasaData.orbital_data?.semi_major_axis,
                eccentricity:           nasaData.orbital_data?.eccentricity,
                inclination:            nasaData.orbital_data?.inclination,
                orbital_period:         nasaData.orbital_data?.orbital_period,
                first_observation_date: nasaData.orbital_data?.first_observation_date,
                last_observation_date:  nasaData.orbital_data?.last_observation_date,
            },
            close_approach_history: (nasaData.close_approach_data ?? [])
                .slice(-5)
                .map(ca => ({
                    date:             ca.close_approach_date,
                    miss_distance_km: parseFloat(ca.miss_distance?.kilometers ?? 0).toFixed(0),
                    velocity_kph:     parseFloat(ca.relative_velocity?.kilometers_per_hour ?? 0).toFixed(0),
                })),
        });
    } catch (e) {
        console.error('Error in GET /api/neo/:id:', e.message);
        res.status(500).json({ error: e.message });
    }
});


// --- NODE-CRON: Hourly refresh ---
if (process.env.NODE_ENV !== 'test') {
    cron.schedule('0 * * * *', async () => {
        try {
            const result = await refreshNeoData();
            console.log(`[CRON] ${result.count} NEOs updated, ${result.alerts} new alerts`);
        } catch (e) {
            console.error('[CRON ERROR]', e.message);
        }
    });
    console.log('⏰ Cron job scheduled: hourly NASA refresh');
}


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 AstroSentinel Backend running on http://localhost:${PORT}`);
});