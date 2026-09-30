export default function TaskFilter({
  currentFilter,
  onFilterChange,
  counts,
}) {
  const filters = [
    { id: 'All', label: 'All', count: counts.all },
    { id: 'Pending', label: 'Pending', count: counts.pending },
    { id: 'In Progress', label: 'In Progress', count: counts.inProgress },
    { id: 'Completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {filters.map((f) => {
        const isActive = currentFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer shrink-0 ${
              isActive
                ? 'bg-[#0f172a] text-white font-semibold shadow-xs'
                : 'bg-white border border-gray-200/90 text-gray-600 hover:text-gray-900 font-medium'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[11px] ${
                isActive ? 'text-gray-300' : 'text-gray-400'
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
