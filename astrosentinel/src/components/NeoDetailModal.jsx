import RiskBadge from './RiskBadge';

const tierColors = {
  Watch: '#3B82F6',
  Elevated: '#F59E0B',
  Critical: '#EF4444',
};

function MetricCard({ label, value }) {
  return (
    <div className="bg-[#0B0F1A] rounded-lg p-3">
      <p className="text-[#9CA3AF] text-xs mb-1">{label}</p>
      <p className="text-white text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function NeoDetailModal({ neo, onClose }) {
  if (!neo) return null;

  const barColor = tierColors[neo.tier] || '#3B82F6';

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#111827]/85 backdrop-blur-md border border-[#1F2937]/80 rounded-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8">
          <h2 className="text-2xl font-bold text-white">{neo.name}</h2>
          <RiskBadge tier={neo.tier} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MetricCard label="Est. Diameter" value={`${neo.diameter} m`} />
          <MetricCard label="Velocity" value={`${neo.velocity} km/s`} />
          <MetricCard label="Miss Distance" value={`${neo.missDistance} LD`} />
          <MetricCard label="Approach Date" value={neo.approachDate} />
        </div>

        {/* Risk Assessment */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Risk Assessment</h3>
          <p className="text-[#9CA3AF] text-sm leading-relaxed">
            {neo.rationale}
          </p>
        </div>

        {/* Confidence */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">Confidence</h3>
            <span className="text-[#9CA3AF] text-sm font-medium">
              {neo.confidence}%
            </span>
          </div>
          <div className="w-full bg-[#0B0F1A] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${neo.confidence}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
        </div>

        {/* Orbit Visualization Placeholder */}
        <div>
          <h3 className="text-white font-semibold mb-2">
            Orbit Visualization
          </h3>
          <div className="border-2 border-dashed border-[#1F2937] rounded-lg h-48 flex items-center justify-center">
            <p className="text-[#9CA3AF] text-sm">
              Orbit visualization coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
