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
  {data.map((asteroid) => (
    <tr key={asteroid.id} className="border-t border-[#1F2937]">
      <td className="py-3 px-5 text-white">{asteroid.name}</td>
      <td className="py-3 px-5">{asteroid.sizeMax} m</td>
      <td className="py-3 px-5">{asteroid.velocity} km/s</td>
      <td className="py-3 px-5">{asteroid.distance.toLocaleString()} km</td>
      
      {/* FIX: Replace the broken date logic with this: */}
      <td className="py-3 px-5 text-slate-400">
        {new Date().toLocaleDateString()}
      </td>
      
      <td className="py-3 px-5">
        {asteroid.isHazardous ? (
          <span className="text-red-400">Critical</span>
        ) : (
          <span className="text-blue-400">Watch</span>
        )}
      </td>
      {/* ... action buttons ... */}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}
