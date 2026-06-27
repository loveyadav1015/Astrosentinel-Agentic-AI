import React from "react";

const nodes = [
  {
    title: "Monitor Agent",
    subtitle: "Polls NASA API",
    borderClass: "border-[#1F2937]",
  },
  {
    title: "Shared Data Store",
    subtitle: "PostgreSQL + Cache",
    borderClass: "border-blue-500/30",
  },
  {
    title: "Reasoning Engine",
    subtitle: "LLM Risk Classification",
    borderClass: "border-[#1F2937]",
  },
  {
    title: "Reporter Agent",
    subtitle: "Alerts & Reports",
    borderClass: "border-[#1F2937]",
  },
];

const arrowLabels = ["Raw Data", "Classified Objects", "Alerts"];

function Arrow({ label }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center shrink-0">
      {/* Vertical arrow (mobile) */}
      <div className="flex lg:hidden flex-col items-center py-2">
        <span className="text-xs text-blue-400 mb-1 font-medium">{label}</span>
        <div className="w-px h-6 bg-blue-500" />
        <span className="text-blue-500 text-lg leading-none">▼</span>
      </div>

      {/* Horizontal arrow (desktop) */}
      <div className="hidden lg:flex flex-col items-center px-2">
        <span className="text-xs text-blue-400 mb-1 font-medium whitespace-nowrap">
          {label}
        </span>
        <div className="flex items-center">
          <div className="h-px w-10 bg-blue-500" />
          <span className="text-blue-500 text-lg leading-none">▶</span>
        </div>
      </div>
    </div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-0">
      {nodes.map((node, i) => (
        <React.Fragment key={node.title}>
          <div
            className={`bg-[#111827]/70 backdrop-blur-sm border ${node.borderClass} rounded-xl p-6 min-w-[180px] text-center flex flex-col items-center justify-center w-full lg:w-auto lg:flex-1`}
          >
            <h4 className="text-white font-bold text-base mb-1">
              {node.title}
            </h4>
            <p className="text-sm text-[#9CA3AF]">{node.subtitle}</p>
          </div>

          {i < nodes.length - 1 && <Arrow label={arrowLabels[i]} />}
        </React.Fragment>
      ))}
    </div>
  );
}
