import React, { useState, useEffect, Suspense, lazy } from 'react';
import MetricCard from '../components/MetricCard';
import NeoTable from '../components/NeoTable';
import AlertFeed from '../components/AlertFeed';
import NeoDetailModal from '../components/NeoDetailModal';

const DashboardScene = lazy(() => import('../three/DashboardScene'));

export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedNeo, setSelectedNeo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('Loading...');

  // --- FETCH LIVE DATA FROM BACKEND ---
  const fetchTelemetry = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/neo')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from backend');
        return res.json();
      })
      .then((data) => {
        setTelemetry(data);
        setLastUpdated(new Date().toLocaleString());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching live telemetry:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  // Run once when dashboard loads
  useEffect(() => {
    fetchTelemetry();
  }, []);

  // --- MAP LIVE DATA TO YOUR UI VARIABLES ---
  // If telemetry isn't loaded yet, default to safe empty values so the UI doesn't crash
  const neoObjects = telemetry?.objects || [];
  
  // Filter hazardous objects for the alert feed
  const alertHistory = neoObjects.filter(neo => neo.isHazardous);
  
  // Map your backend stats to match your UI's expected card categories
  const stats = {
    total: telemetry?.totalMonitored || 0,
    critical: telemetry?.activeAlerts || 0,
    elevated: Math.floor((telemetry?.totalMonitored || 0) * 0.1), // Estimated "Watch" tier
    watch: (telemetry?.totalMonitored || 0) - (telemetry?.activeAlerts || 0)
  };

  // --- EVENT HANDLERS ---
  const handleRefresh = () => {
    fetchTelemetry(); // Actually fetch fresh data now!
  };

  const handleDownloadPDF = () => {
    const content = `AstroSentinel Daily Brief\n${'='.repeat(40)}\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY\n- Total NEOs Tracked: ${stats.total}\n- Critical: ${stats.critical}\n\nOBJECT DETAILS\n${neoObjects.map(n => `\n${n.name} [${n.isHazardous ? 'CRITICAL' : 'SAFE'}]\n  Diameter: ${n.sizeMax}m | Velocity: ${n.velocity} km/s | Miss: ${n.distance} km`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astrosentinel-brief-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectNeoFromScene = (neo) => {
    const fullNeo = neoObjects.find(n => n.name === neo.name) || neo;
    setSelectedNeo(fullNeo);
  };

  // --- LOADING / ERROR SCREENS ---
  if (loading && !telemetry) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#040814] text-blue-400 font-mono">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        CONNECTING TO NASA DEEP SPACE NETWORK...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#040814] text-red-400 font-mono">
        ⚠️ SYSTEM ERROR: {error}
      </div>
    );
  }

  // --- RENDER MAIN UI ---
  return (
    <div className="min-h-screen">
      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <div className="border-b border-[#1F2937] bg-transparent  top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#9CA3AF]">
              Last updated: <span className="text-white font-medium">{lastUpdated}</span>
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
              <span className="text-green-400 font-medium">Live Feed</span>
            </div>
            
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Brief
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* ── 3D Earth + NEO Mini Scene ────────────────────────────── */}
        <div className="mb-6">
          <Suspense fallback={
            <div
              className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl flex items-center justify-center"
              style={{ height: 280 }}
            >
              <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Loading Earth view...
              </div>
            </div>
          }>
            <DashboardScene neoObjects={neoObjects} onSelectNeo={handleSelectNeoFromScene} />
          </Suspense>
        </div>

        {/* ── Summary Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard icon="🛸" label="Total NEOs Tracked" value={stats.total} />
          <MetricCard icon="🔴" label="Critical Objects" value={stats.critical} accentColor="#EF4444" />
          <MetricCard icon="🟠" label="Elevated Objects" value={stats.elevated} accentColor="#F59E0B" />
          <MetricCard icon="🔵" label="Watch Objects" value={stats.watch} accentColor="#3B82F6" />
        </div>

        {/* ── Main Content: Table + Sidebar ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3">
            <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1F2937] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Near-Earth Object Tracker</h2>
                <span className="text-xs text-[#9CA3AF]">{stats.total} objects</span>
              </div>
              <NeoTable data={neoObjects} onViewDetails={setSelectedNeo} />
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <AlertFeed alerts={alertHistory.slice(0, 8)} />
          </div>
        </div>
      </div>

      <NeoDetailModal neo={selectedNeo} onClose={() => setSelectedNeo(null)} />
    </div>
  );
}