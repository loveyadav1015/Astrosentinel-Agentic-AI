import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import StepFlow from '../components/StepFlow';
import TierLegend from '../components/TierLegend';
import { getDashboardStats, getLastScanTime } from '../data/mockData';

// Lazy-load the heavy 3D scene
const HeroScene = lazy(() => import('../three/HeroScene'));

// Simple check for low-end devices
const isLowEnd = typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 2;

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const stats = getDashboardStats();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen">
      {/* ── 3D Hero Section ───────────────────────────────────────── */}
      <section className="relative w-full" style={{ height: '100vh' }}>
        
        {/* 3D Solar System Background */}
        {!isLowEnd ? (
          <div className="absolute inset-0 z-0">
            <Suspense fallback={
              <div className="w-full h-full bg-[#0B0F1A] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#9CA3AF] text-sm">Initializing solar system...</span>
                </div>
              </div>
            }>
              <HeroScene style={{ width: '100%', height: '100%', display: 'block' }} />
            </Suspense>
          </div>
        ) : (
          /* Fallback for low-end devices */
          <div className="absolute inset-0 z-0 bg-[#0B0F1A]"
            style={{
              background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #0B0F1A 70%)',
            }}
          >
            {/* CSS stars fallback */}
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.2,
                  animation: `pulse-dot ${2 + Math.random() * 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
        
        {/* Gradient fade at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0F1A] to-transparent z-[2]" />
        
        {/* Hero Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-end min-h-[100vh] pb-28 px-6 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
              System Operational — Monitoring Active
            </div>
          </div>
          
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 animate-fade-in-up delay-100"
            style={{ animationFillMode: 'both', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
          >
            Astro<span className="text-blue-500">Sentinel</span>
          </h1>
          
          <p
            className="text-xl md:text-2xl text-[#d1d5db] max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed"
            style={{ animationFillMode: 'both', textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}
          >
            Autonomous NEO threat monitoring. No human required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
            <Link
              to="/dashboard"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              View Live Dashboard
            </Link>
            <Link
              to="/about"
              className="border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:-translate-y-0.5 backdrop-blur-sm bg-white/5"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon="🌍" label="Objects Monitored Today" value={stats.total} />
          <MetricCard icon="🚨" label="Active Alerts" value={stats.critical + stats.elevated} accentColor="#EF4444" />
          <MetricCard icon="🕐" label="Last Scan" value={getLastScanTime().split(',')[1]?.trim() || 'Just now'} />
          <MetricCard
            icon="✅"
            label="System Status"
            value="Operational"
            accentColor="#22C55E"
          />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            Three autonomous agents working in concert to keep Earth safe.
          </p>
        </div>
        <StepFlow />
      </section>

      {/* ── Risk Tiers ───────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Risk Classification Tiers
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            Every near-Earth object is classified into one of three threat levels.
          </p>
        </div>
        <TierLegend />
      </section>

      {/* ── Subscribe CTA ────────────────────────────────────────── */}
      <section className="border-t border-[#1F2937]">
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Informed
          </h2>
          <p className="text-[#9CA3AF] mb-8">
            Subscribe to receive real-time threat alerts and daily summary reports directly to your inbox.
          </p>
          
          {subscribed ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 font-medium">
              ✓ Subscribed successfully. You'll receive your first report within 24 hours.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
              >
                Subscribe to Alerts
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
