import React, { useCallback } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const EVENT_TYPES = [
  { id: 'checkin', label: 'Check-in', dot: 'bg-blue-500', active: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  { id: 'message', label: 'Message', dot: 'bg-purple-500', active: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { id: 'sighting', label: 'Sighting', dot: 'bg-amber-500', active: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { id: 'note', label: 'Note', dot: 'bg-emerald-500', active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { id: 'tip', label: 'Tip', dot: 'bg-red-500', active: 'bg-red-500/20 text-red-300 border-red-500/40' },
];

export default React.memo(function Filters() {
  const { filters, toggleTypeFilter, setFilter, resetFilters, filteredEvents, events } =
    useInvestigation();

  const handleSearch = useCallback(
    e => setFilter('search', e.target.value),
    [setFilter]
  );

  const hasActiveFilters =
    filters.types.length > 0 || filters.person || filters.search;

  return (
    <div className="flex items-center gap-3 px-6 py-2.5 bg-gray-900/80 border-b border-gray-800 flex-shrink-0">
      <input
        type="text"
        placeholder="Search evidence..."
        value={filters.search}
        onChange={handleSearch}
        className="bg-gray-800 text-gray-200 placeholder-gray-600 text-xs px-3 py-1.5 rounded border border-gray-700 focus:border-amber-500/60 focus:outline-none w-44 transition-colors"
      />

      <div className="w-px h-5 bg-gray-700" />

      <div className="flex items-center gap-1.5">
        {EVENT_TYPES.map(type => {
          const isActive = filters.types.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggleTypeFilter(type.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-all duration-150 ${
                isActive
                  ? type.active
                  : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-600 hover:text-gray-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type.dot}`} />
              {type.label}
            </button>
          );
        })}
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-xs text-gray-600 hover:text-amber-400 transition-colors ml-1"
        >
          × Clear
        </button>
      )}

      <span className="text-xs text-gray-600 ml-auto tabular-nums">
        {filteredEvents.length}
        <span className="text-gray-700">/{events.length}</span> events
      </span>
    </div>
  );
});
