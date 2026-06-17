import RiskBadge from './RiskBadge';

const columns = [
  { label: 'Object Name', key: 'name' },
  { label: 'Est. Diameter (m)', key: 'diameter' },
  { label: 'Velocity (km/s)', key: 'velocity' },
  { label: 'Miss Distance (LD)', key: 'missDistance' },
  { label: 'Approach Date', key: 'approachDate' },
  { label: 'Risk Tier', key: 'tier' },
  { label: 'Action', key: null },
];

export default function NeoTable({ data, onViewDetails }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#0B0F1A] text-[#9CA3AF] uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.label} className="px-4 py-3.5">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((neo, index) => (
            <tr
              key={neo.id}
              className={`${
                index % 2 === 0 ? 'bg-[#111827]' : 'bg-[#111827]/50'
              } hover:bg-[#1F2937] transition-colors`}
            >
              <td className="px-4 py-3.5 font-medium text-white">
                {neo.name}
              </td>
              <td className="px-4 py-3.5 text-[#9CA3AF]">
                {neo.diameter}
              </td>
              <td className="px-4 py-3.5 text-[#9CA3AF]">
                {neo.velocity}
              </td>
              <td className="px-4 py-3.5 text-[#9CA3AF]">
                {neo.missDistance}
              </td>
              <td className="px-4 py-3.5 text-[#9CA3AF]">
                {neo.approachDate}
              </td>
              <td className="px-4 py-3.5">
                <RiskBadge tier={neo.tier} />
              </td>
              <td className="px-4 py-3.5">
                <button
                  onClick={() => onViewDetails(neo)}
                  className="border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
