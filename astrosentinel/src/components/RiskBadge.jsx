const tierStyles = {
  Watch: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Elevated: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Critical: "bg-red-500/15 text-red-400 border-red-500/30",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export default function RiskBadge({ tier = "Watch", size = "sm" }) {
  const colors = tierStyles[tier] || tierStyles.Watch;
  const sizing = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colors} ${sizing}`}
    >
      {tier === "Critical" && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      )}
      {tier}
    </span>
  );
}
