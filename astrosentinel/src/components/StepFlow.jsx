import React from "react";

const steps = [
  {
    icon: "🔍",
    title: "Monitor Agent",
    desc: "Polls NASA NEO API every 1–6 hours for new close-approach objects and orbital updates.",
  },
  {
    icon: "🧠",
    title: "Reasoning Engine",
    desc: "LLM-based classifier evaluates size, velocity, and miss distance to assign risk tiers: Watch, Elevated, or Critical.",
  },
  {
    icon: "📢",
    title: "Reporter Agent",
    desc: "Delivers live dashboard updates, auto-generated PDF briefs, and webhook/email alerts to operators.",
  },
];

export default function StepFlow() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      {steps.map((step, i) => (
        <React.Fragment key={step.title}>
          <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-6 flex-1 text-center w-full">
            <div className="text-4xl mb-3">{step.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-[#9CA3AF]">{step.desc}</p>
          </div>

          {i < steps.length - 1 && (
            <span className="hidden lg:block text-blue-500 text-2xl shrink-0">
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
