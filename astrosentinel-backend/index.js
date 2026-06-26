require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');
const Groq = require('groq-sdk'); // 1. Added Groq SDK

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
    .then((client) => {
        console.log('✅ Connected to PostgreSQL');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS chats (
                id SERIAL PRIMARY KEY,
                role VARCHAR(50) NOT NULL,
                text TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        return client.query(createTableQuery).then(() => {
            console.log('✅ Chats table is ready');
            client.release();
        });
    })
    .catch((err) => console.error('❌ PostgreSQL connection error:', err.message));


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

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 AstroSentinel Backend running on http://localhost:${PORT}`);
});