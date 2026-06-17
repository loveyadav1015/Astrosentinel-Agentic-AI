import React, { useState } from "react";

const faqs = [
  {
    question: "How often does AstroSentinel check for new objects?",
    answer:
      "The Monitor Agent polls the NASA NeoWs API every 1–6 hours, with frequency increasing for Elevated/Critical objects. During high-activity periods, polling can reach every 15 minutes.",
  },
  {
    question: "What data source does it use?",
    answer:
      "NASA's CNEOS via NeoWs API for close-approach data, orbital elements, diameter estimates, and hazard classifications. Cross-references with Minor Planet Center for new discoveries.",
  },
  {
    question: "How is risk tier calculated?",
    answer:
      "Multi-factor model evaluating diameter, velocity, MOID, miss distance in LD, uncertainty parameter, and Palermo Scale. An LLM synthesizes into human-readable assessment.",
  },
  {
    question: "Who gets alerted?",
    answer:
      "Three channels: Slack webhooks, email digests, raw webhook payloads. Critical = immediate all channels. Elevated = hourly digest. Watch = daily summary.",
  },
  {
    question: "Can thresholds be customised?",
    answer:
      "Yes, classification thresholds adjustable. Custom alert routing per tier and quiet hours for Watch notifications.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-[#9CA3AF] shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={i}
            className="bg-[#111827] border border-[#1F2937] rounded-xl overflow-hidden mb-3"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-[#1F2937]/40 transition-colors cursor-pointer"
            >
              <span className="text-white font-semibold pr-4">
                {faq.question}
              </span>
              <ChevronIcon open={isOpen} />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 text-sm text-[#9CA3AF]">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
