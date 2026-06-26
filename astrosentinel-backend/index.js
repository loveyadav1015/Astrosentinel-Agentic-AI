require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const PORT = Number.isFinite(Number(process.env.PORT)) ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// The Pool automatically reads the DATABASE_URL from your .env file
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test connection and auto-create the table on startup
(async () => {
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Connected to PostgreSQL');

        // This automatically builds your database structure!
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS chats (
                id SERIAL PRIMARY KEY,
                role VARCHAR(50) NOT NULL,
                text TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await client.query(createTableQuery);
        console.log('✅ Chats table is ready');
    } catch (err) {
        console.error('❌ PostgreSQL startup error:', err.message);
        process.exit(1);
    } finally {
        if (client) client.release();
    }
})();


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

// 2. Save a new message
app.post('/api/chat', async (req, res) => {
    try {
        const { role, text } = req.body;
        
        // Use $1 and $2 to safely insert data and prevent SQL injection
        const insertQuery = `
            INSERT INTO chats (role, text) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        
        const result = await pool.query(insertQuery, [role, text]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error saving chat:", error.message);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 AstroSentinel Backend running on http://localhost:${PORT}`);
});