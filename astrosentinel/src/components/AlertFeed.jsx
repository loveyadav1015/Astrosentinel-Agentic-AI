import { Link } from 'react-router-dom';
import RiskBadge from './RiskBadge';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${hours}:${minutes}`;
}

export default function AlertFeed({ alerts }) {
  const visibleAlerts = alerts.slice(0, 8);
  const hasCritical = alerts.some((alert) => alert.tier === 'Critical');

  return (
    <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#F9FAFB] text-lg font-semibold flex items-center gap-2">
          Recent Alerts
          {hasCritical && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
          )}
        </h3>
      </div>

      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between gap-3 py-2 border-b border-[#1F2937] last:border-b-0"
          >
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {alert.objectName}
              </p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">
                {formatTimestamp(alert.timestamp)}
              </p>
            </div>
            <RiskBadge tier={alert.tier} />
          </div>
        ))}

        {visibleAlerts.length === 0 && (
          <p className="text-[#9CA3AF] text-sm text-center py-4">
            No recent alerts
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1F2937]">
        <Link
          to="/alerts"
          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View All Alerts →
        </Link>
      </div>
    </div>
  );
}
