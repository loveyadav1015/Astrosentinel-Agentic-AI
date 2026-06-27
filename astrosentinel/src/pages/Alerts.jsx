import React, { useState, useEffect, useMemo } from 'react';
import FilterBar from '../components/FilterBar';
import RiskBadge from '../components/RiskBadge';

export default function Alerts() {
  const [tierFilter, setTierFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // --- LIVE DATA STATES ---
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH LIVE DATA ---
  useEffect(() => {
    fetch('http://localhost:5000/api/neo')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch from backend');
        return res.json();
      })
      .then((data) => {
        // Map the live NASA objects into the format your Alerts table expects
        const mappedAlerts = data.objects.map((obj) => {
          // Determine tier based on live metrics
          let currentTier = 'Watch';
          if (obj.isHazardous) currentTier = 'Critical';
          else if (obj.sizeMax > 200) currentTier = 'Elevated';

          return {
            id: obj.id,
            timestamp: new Date().toISOString(), // Backend fetches today's data
            objectName: obj.name,
            tier: currentTier,
            diameter: obj.sizeMax,
            missDistance: obj.distance,
            // Simulate delivery metadata for a realistic UI
            channels: obj.isHazardous ? 'SMS, Email, Push' : 'System Log',
            status: 'Sent'
          };
        });

        // Sort so Critical alerts appear at the top
        mappedAlerts.sort((a, b) => (a.tier === 'Critical' ? -1 : (b.tier === 'Critical' ? 1 : 0)));

        setAlertsData(mappedAlerts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching live alerts:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredAlerts = useMemo(() => {
    return alertsData.filter((alert) => {
      // Tier filter
      if (tierFilter !== 'All' && alert.tier !== tierFilter) return false;
      
      // Date range filter
      const alertDate = new Date(alert.timestamp).toISOString().split('T')[0];
      if (dateFrom && alertDate < dateFrom) return false;
      if (dateTo && alertDate > dateTo) return false;
      
      return true;
    });
  }, [tierFilter, dateFrom, dateTo, alertsData]);

  const formatTimestamp = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- LOADING / ERROR STATES ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#040814] text-blue-400 font-mono">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
        LOADING THREAT ASSESSMENTS...
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Alert History</h1>
          <p className="text-[#9CA3AF]">
            Complete log of all threat assessment alerts dispatched by the Reporter Agent.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar
            tierFilter={tierFilter}
            setTierFilter={setTierFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-[#9CA3AF]">
          Showing <span className="text-white font-medium">{filteredAlerts.length}</span> of {alertsData.length} active logs
        </div>

        {/* Alerts Table */}
        <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0B0F1A] text-[#9CA3AF] uppercase text-xs tracking-wider">
                  <th className="px-4 py-3.5 font-medium">Timestamp</th>
                  <th className="px-4 py-3.5 font-medium">Object Name</th>
                  <th className="px-4 py-3.5 font-medium">Risk Tier</th>
                  <th className="px-4 py-3.5 font-medium">Diameter (m)</th>
                  <th className="px-4 py-3.5 font-medium">Miss Distance (km)</th>
                  <th className="px-4 py-3.5 font-medium">Delivery Channels</th>
                  <th className="px-4 py-3.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[#9CA3AF]">
                      No alerts match the selected filters.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert, i) => (
                    <tr
                      key={alert.id}
                      className={`${
                        i % 2 === 0 ? 'bg-[#111827]' : 'bg-[#111827]/50'
                      } hover:bg-[#1F2937] transition-colors border-t border-[#1F2937]/50`}
                    >
                      <td className="px-4 py-3.5 text-[#9CA3AF] whitespace-nowrap">
                        {formatTimestamp(alert.timestamp)}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-white">
                        {alert.objectName}
                      </td>
                      <td className="px-4 py-3.5">
                        <RiskBadge tier={alert.tier} />
                      </td>
                      <td className="px-4 py-3.5 tabular-nums">
                        {alert.diameter}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums">
                        {alert.missDistance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {alert.channels.split(', ').map((ch) => (
                            <span
                              key={ch}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/5 border border-[#1F2937] text-[#9CA3AF]"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            alert.status === 'Sent'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            alert.status === 'Sent' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}