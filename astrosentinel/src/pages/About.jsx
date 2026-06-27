import React, { Suspense, lazy } from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import FAQ from '../components/FAQ';

const AboutScene = lazy(() => import('../three/AboutScene'));

const techStack = [
  { name: 'NASA NEO API', desc: 'Primary data source for live near-Earth object telemetry and close-approach data', icon: '🛰' },
  { name: 'Node.js & Express', desc: 'High-performance backend for API orchestration and data pipeline routing', icon: '⚙️' },
  { name: 'Groq API (Llama 3.1)', desc: 'Lightning-fast LPU inference powering the RAG-based AI threat analyst', icon: '🧠' },
  { name: 'PostgreSQL', desc: 'Persistent state management for conversational history and system logs', icon: '💾' },
  { name: 'Three.js (R3F)', desc: 'Immersive 3D orbital visualization and interactive spatial rendering', icon: '🌌' },
  { name: 'React + Vite', desc: 'High-speed frontend framework for the real-time operator dashboard', icon: '⚛️' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling for a sleek, futuristic deep-space UI', icon: '🎨' },
  { name: 'RAG Architecture', desc: 'Retrieval-Augmented Generation pipeline bridging live data with LLM reasoning', icon: '🔗' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How AstroSentinel Works
          </h1>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto leading-relaxed">
            A fully autonomous, RAG-powered orbital defense system that monitors, classifies, 
            and analyzes near-Earth object threats in real-time.
          </p>
        </div>

        {/* ── Architecture Diagram ────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-2">System Architecture</h2>
          <p className="text-[#9CA3AF] mb-8">
            A unified pipeline integrating live deep-space telemetry with high-speed language processing 
            and interactive 3D rendering.
          </p>
          {/* 3D Agent Pipeline Visualization */}
          <div className="mb-8">
            <Suspense fallback={
              <div
                className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl flex items-center justify-center"
                style={{ height: 320 }}
              >
                <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading pipeline view...
                </div>
              </div>
            }>
              <AboutScene />
            </Suspense>
          </div>

          {/* Flat architecture fallback */}
          <ArchitectureDiagram />
        </section>

        {/* ── How the pipeline works ─────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">The Pipeline</h2>
          <div className="space-y-6 mt-6">
            <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">1️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Live Data Ingestion</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    The Node.js backend acts as the central nervous system, continuously polling NASA's 
                    NeoWs REST API. It ingests current-day close approach data, stripping away excess 
                    metadata to calculate exact diameters, relative velocities, and miss distances. 
                    This creates a lightweight, highly accurate telemetry string for the system to process.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">2️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">RAG Intelligence & Assessment</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    When an operator queries the system, AstroSentinel utilizes a Retrieval-Augmented Generation 
                    (RAG) pipeline. The live NASA telemetry is injected directly into the context window of 
                    the Llama 3.1 model via Groq's high-speed LPUs. This grants the AI agent complete, 
                    hallucination-free awareness of the current solar system state, allowing it to accurately 
                    classify threats into Watch, Elevated, or Critical tiers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">3️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Operator Interface & Logging</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    The processed data is beamed to a React-based frontend featuring an immersive Three.js 
                    orbital visualization. Operators can interact with the AI agent in real-time through a 
                    persistent chat interface. All threat assessments, queries, and conversational states 
                    are securely logged and managed via a PostgreSQL database pool, ensuring full auditability 
                    of the defense network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <FAQ />
        </section>

        {/* ── Tech Stack ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-4 flex items-start gap-4 hover:border-blue-500/30 transition-colors"
              >
                <span className="text-2xl mt-0.5">{tech.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">{tech.name}</h3>
                  <p className="text-[#9CA3AF] text-sm mt-0.5">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}