<div align="center">

# 🌌 AstroSentinel

### Real-Time Near-Earth Object Tracker & AI-Powered Space Assistant

[![Live Demo](https://img.shields.io/badge/Live%20Demo-astrosentinel.netlify.app-blue?style=for-the-badge&logo=netlify)](https://astrosentinel.netlify.app/)
[![Frontend](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![AI](https://img.shields.io/badge/AI-Groq%20API-F55036?style=for-the-badge&logo=lightning)](https://groq.com/)
[![NASA](https://img.shields.io/badge/Data-NASA%20NeoWS%20API-E03C31?style=for-the-badge&logo=nasa)](https://api.nasa.gov/)
[![Hackathon](https://img.shields.io/badge/Hackathon-Agentic%20Arena%202026-purple?style=for-the-badge)](https://astrosentinel.netlify.app/)

</div>

---

## 🚀 About the Project

**AstroSentinel** is a full-stack **agentic web application** that autonomously monitors **Near-Earth Objects (NEOs)** using NASA's official NeoWS API. It features real-time asteroid data, risk classification, interactive 3D visuals, and an AI-powered chatbot — all backed by a Node.js/Express server, Supabase PostgreSQL, and the blazing-fast **Groq LLM API**.

> 🌐 **Frontend** → Deployed on **Netlify**
> ⚙️ **Backend** → Deployed on **Render**
> 🗄️ **Database** → Hosted on **Supabase**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🛰️ **Live NEO Tracker** | Fetches real-time asteroid data from NASA's NeoWS API via a secure backend cron job |
| 🤖 **AI Chatbot** | Groq-powered assistant for space science Q&A and personalized study plans |
| 📊 **Dashboard & Alerts** | Visual metrics, risk badges, and alert feeds for hazardous asteroids |
| 🔭 **3D Star Field** | Immersive Three.js space background on the landing page |
| 🗂️ **NEO Data Table** | Filterable, sortable asteroid table with detail modals |
| 🏷️ **Risk Classification** | Color-coded risk badges and tier legend for threat assessment |
| 🗄️ **Persistent Storage** | Supabase PostgreSQL stores fetched NEO records and chat history |
| 🔒 **Secure API Handling** | All API keys (NASA, Groq) are stored server-side — never exposed to the browser |

---

## 🤖 AI Agent Implementation

AstroSentinel is built around an agentic loop with three core capabilities:

1. **Perception** — Autonomously fetches live NASA NEO data via cron-scheduled tasks, continuously monitoring the skies without any user input.
2. **Memory** — Stores chat history and asteroid records in a persistent Supabase PostgreSQL database, enabling context-aware conversations and historical queries.
3. **Reasoning** — Utilizes the Groq LLM to process user queries, answer space science questions, and generate customized study plans based on live data.

---

## 🛠️ Tech Stack

### Frontend (`astrosentinel/`)
- **Framework:** React (Vite)
- **3D Graphics:** Three.js
- **Pages:** Landing, Dashboard, Alerts, About
- **Key Components:** `Chatbot`, `NeoTable`, `NeoDetailModal`, `AlertFeed`, `MetricCard`, `RiskBadge`, `StarField`, `FilterBar`, `StepFlow`, `TierLegend`, `ArchitectureDiagram`, `FAQ`

### Backend (`astrosentinel-backend/`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **AI Provider:** [Groq API](https://groq.com/) (free tier)
- **Data Source:** NASA NeoWS API
- **Database:** Supabase (PostgreSQL)

---

## 📁 Project Structure

```
ASTROSENTINEL/
│
├── astrosentinel/                  # ── Vite + React Frontend ──
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── background(1).png
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── AlertFeed.jsx
│   │   │   ├── ArchitectureDiagram.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NeoAsteroidIcon.jsx
│   │   │   ├── NeoDetailModal.jsx
│   │   │   ├── NeoTable.jsx
│   │   │   ├── RiskBadge.jsx
│   │   │   ├── StarField.jsx
│   │   │   ├── StepFlow.jsx
│   │   │   └── TierLegend.jsx
│   │   ├── pages/
│   │   │   ├── About.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Landing.jsx
│   │   ├── three/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env                        # ← You create this
│   ├── index.html
│   └── package.json
│
└── astrosentinel-backend/          # ── Node.js / Express Backend ──
    ├── index.js                    # Server entry point
    ├── .env                        # ← You create this
    └── package.json
```

---

## ⚡ Local Setup Guide

You will need **two terminal windows** — one for the backend, one for the frontend.

### ✅ Prerequisites

Make sure you have the following installed and ready:

- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) `v9+`
- A [Supabase](https://supabase.com/) account and project *(free tier)*
- A [NASA API Key](https://api.nasa.gov/) *(free, instant sign-up)*
- A [Groq API Key](https://console.groq.com/) *(free tier)*

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/astrosentinel.git
cd astrosentinel
```

---

### 2️⃣ Running the App

**Backend** — open your first terminal:

```bash
cd astrosentinel-backend
npm install
npm run dev
```

✅ Expected output:

```
🚀 AstroSentinel Backend running on http://localhost:5000
✅ Connected to PostgreSQL
```

> ⚠️ Keep this terminal running while you use the app.

**Frontend** — open a second terminal:

```bash
cd astrosentinel
npm install
npm run dev
```

**Access** — open your browser and navigate to:

```
http://localhost:5173
```

🎉 **AstroSentinel is now fully running on your machine!**

---

### 3️⃣ Environment Variables

Before running, create `.env` files in both folders.

**`astrosentinel-backend/.env`**

```env
# Supabase → Project Settings → API → copy both values from there
SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OR use a direct PostgreSQL connection string
# Supabase → Project Settings → Database → Connection String → URI
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres

# Get your free key at: https://api.nasa.gov/
NASA_API_KEY=your_nasa_api_key_here

# Get your free key at: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

NODE_ENV=development
PORT=5000
```

**`astrosentinel/.env`**

```env
# Points Vite to your locally running backend
VITE_API_URL=http://localhost:5000
```

---

## 🌐 Environment Variables — Quick Reference

### `astrosentinel-backend/.env`

| Variable | Description | Where to get it |
|---|---|---|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (keep secret!) | Supabase Dashboard → Project Settings → API |
| `DATABASE_URL` | Direct PostgreSQL connection string (alternative) | Supabase Dashboard → Project Settings → Database |
| `NASA_API_KEY` | NASA NeoWS data access key | [api.nasa.gov](https://api.nasa.gov/) |
| `GROQ_API_KEY` | Groq LLM key for the AI chatbot | [console.groq.com](https://console.groq.com/) |
| `NODE_ENV` | Set to `development` for local use | — |
| `PORT` | Backend port (default: `5000`) | — |

### `astrosentinel/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Set to `http://localhost:5000` for local development |

---

## 🔧 Troubleshooting for Judges

**`Connection Error` / Cannot connect to database**
→ Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are copied **exactly** from Supabase Dashboard → Project Settings → API. Do not add trailing slashes to the URL.

**`CORS error` in the browser console**
→ Ensure the backend is running on port `5000` and `VITE_API_URL=http://localhost:5000` is set in the frontend `.env`.

**`AI Chatbot not responding`**
→ Check that `GROQ_API_KEY` is set in the backend `.env` and is valid at [console.groq.com](https://console.groq.com/).

**`NASA data not loading`**
→ If asteroid data isn't visible, wait **60 seconds** for the internal cron job to complete its first sync, or manually trigger the `/api/neo` endpoint.

**`Port already in use`**
→ Kill the process with `lsof -ti:5000 | xargs kill` or change `PORT` in the backend `.env`.

---

## 🚀 Deployment

| Layer | Platform | Notes |
|---|---|---|
| **Frontend** | [Netlify](https://netlify.com/) | Set `VITE_API_URL` to your Render backend URL in Netlify env settings |
| **Backend** | [Render](https://render.com/) | Add all backend `.env` variables in Render's environment settings |
| **Database** | [Supabase](https://supabase.com/) | Use the **connection pooling URL** (port `6543`) for Render deployments |

---

## 📜 License

This project was built for a hackathon.

---

<div align="center">

Made with ❤️ for **Agentic Arena 2026**

**Love Yadav** · IIIT Lucknow

**[🌐 View Live Demo →](https://astrosentinel.netlify.app/)**

</div>
