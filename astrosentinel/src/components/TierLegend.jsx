import React from "react";
import RiskBadge from "./RiskBadge";

const tiers = [
  {
    tier: "Watch",
    color: "border-l-blue-500",
    description:
      "Objects tracked with standard monitoring. Low immediate risk but orbital parameters warrant continued observation.",
  },
  {
    tier: "Elevated",
    color: "border-l-amber-500",
    description:
      "Objects with concerning approach parameters. Increased monitoring frequency and preliminary contingency assessment initiated.",
  },
  {
    tier: "Critical",
    color: "border-l-red-500",
    description:
      "High-priority objects requiring immediate attention. Close approach distance, large diameter, or high velocity triggers full alert protocol.",
  },
];

export default function TierLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {tiers.map((t) => (
        <div
          key={t.tier}
          className={`bg-[#111827]/70 backdrop-blur-sm border-l-4 ${t.color} border border-[#1F2937]/80 rounded-xl p-5`}
        >
          <div className="mb-3">
            <RiskBadge tier={t.tier} size="md" />
          </div>
          <p className="text-sm text-[#9CA3AF]">{t.description}</p>
        </div>
      ))}
    </div>
  );
}
