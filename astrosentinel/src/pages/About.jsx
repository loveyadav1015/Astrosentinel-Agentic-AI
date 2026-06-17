import React, { Suspense, lazy } from 'react';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import FAQ from '../components/FAQ';

const AboutScene = lazy(() => import('../three/AboutScene'));

const techStack = [
  { name: 'NASA NEO API', desc: 'Primary data source for near-Earth object close-approach data', icon: '🛰' },
  { name: 'Python', desc: 'Agent orchestration, data processing, and API integration', icon: '🐍' },
  { name: 'LLM (Claude API)', desc: 'Risk classification reasoning engine and natural language assessments', icon: '🧠' },
  { name: 'PostgreSQL', desc: 'Persistent storage for object tracking, alert history, and audit logs', icon: '💾' },
  { name: 'Plotly / Matplotlib', desc: 'Orbital visualization and trajectory rendering for PDF reports', icon: '📊' },
  { name: 'Slack Webhooks', desc: 'Real-time team notifications for Elevated and Critical tier events', icon: '💬' },
  { name: 'SMTP (Email)', desc: 'Stakeholder digest emails and critical alert notifications', icon: '📧' },
  { name: 'React + Vite', desc: 'Live operator dashboard with real-time data visualization', icon: '⚛️' },
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
            A fully autonomous multi-agent system that monitors, classifies, and reports 
            near-Earth object threats — operating continuously without human intervention.
          </p>
        </div>

        {/* ── Architecture Diagram ────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-2">System Architecture</h2>
          <p className="text-[#9CA3AF] mb-8">
            Three specialized agents coordinate through a shared data store to deliver 
            end-to-end threat assessment.
          </p>
          {/* 3D Agent Pipeline Visualization */}
          <div className="mb-8">
            <Suspense fallback={
              <div
                className="bg-[#111827] border border-[#1F2937] rounded-xl flex items-center justify-center"
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
            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">1️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Ingestion & Monitoring</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    The Monitor Agent continuously polls NASA's NeoWs API at configurable intervals 
                    (1–6 hours, increasing to 15 minutes during high-activity periods). It ingests 
                    close-approach data, orbital elements, diameter estimates, and hazard flags for 
                    all known near-Earth objects. New discoveries are cross-referenced with the 
                    Minor Planet Center within minutes of publication.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">2️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Risk Classification</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    The Reasoning Engine evaluates each object against a multi-factor risk model. 
                    It considers estimated diameter (mass proxy), relative velocity, minimum orbit 
                    intersection distance (MOID), close-approach distance in Lunar Distances, 
                    orbital uncertainty parameter, and the Palermo Technical Impact Hazard Scale. 
                    An LLM synthesizes these inputs into a human-readable risk assessment and assigns 
                    a tier: Watch, Elevated, or Critical.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl">3️⃣</span>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Reporting & Alerting</h3>
                  <p className="text-[#9CA3AF] leading-relaxed">
                    The Reporter Agent delivers classified threat data through three channels. 
                    Critical-tier objects trigger immediate Slack, email, and webhook alerts. 
                    Elevated objects generate hourly digest notifications. Watch-tier objects 
                    are compiled into daily summary reports. Auto-generated PDF briefs include 
                    orbital visualizations, risk rationale, and recommended actions for each 
                    flagged object.
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
                className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex items-start gap-4 hover:border-blue-500/30 transition-colors"
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
