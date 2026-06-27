export default function MetricCard({ icon, label, value, accentColor }) {
  return (
    <div
      className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-5 transition-transform duration-200 hover:scale-[1.02] min-w-[180px]"
      style={accentColor ? { borderLeftWidth: "3px", borderLeftColor: accentColor } : undefined}
    >
      <div className="flex items-start gap-4">
        {icon && <span className="text-2xl leading-none shrink-0">{icon}</span>}

        <div className="min-w-0">
          <p className="text-3xl font-bold text-[#F9FAFB] leading-tight truncate">
            {value}
          </p>
          <p className="text-sm text-[#9CA3AF] mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
