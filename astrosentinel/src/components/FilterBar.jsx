import React from "react";

const inputClasses =
  "bg-[#0B0F1A] border border-[#1F2937] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors";

export default function FilterBar({
  tierFilter,
  setTierFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}) {
  const handleClear = () => {
    setTierFilter("All");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="bg-[#111827]/70 backdrop-blur-sm border border-[#1F2937]/80 rounded-xl p-4 flex flex-wrap gap-4 items-end">
      {/* Tier Select */}
      <div className="flex flex-col">
        <label className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-1">
          Tier
        </label>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className={inputClasses}
        >
          <option value="All">All</option>
          <option value="Watch">Watch</option>
          <option value="Elevated">Elevated</option>
          <option value="Critical">Critical</option>
        </select>
      </div>

      {/* Date From */}
      <div className="flex flex-col">
        <label className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-1">
          Date From
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Date To */}
      <div className="flex flex-col">
        <label className="text-xs text-[#9CA3AF] uppercase tracking-wider mb-1">
          Date To
        </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className={inputClasses}
        />
      </div>

      {/* Clear Filters */}
      <div className="ml-auto">
        <button
          onClick={handleClear}
          className="text-sm text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
