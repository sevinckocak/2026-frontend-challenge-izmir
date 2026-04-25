import React, { useMemo } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

function PersonCard({ person, count, index, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-800/50 transition-all duration-150 hover:-translate-y-px ${
        selected
          ? 'bg-amber-500/10 border-l-2 border-l-amber-500'
          : 'hover:bg-gray-800/40 border-l-2 border-l-transparent'
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700">
          <span className={`text-xs font-bold ${selected ? 'text-amber-400' : 'text-gray-400'}`}>
            {person.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-medium truncate ${selected ? 'text-amber-300' : 'text-gray-300'}`}>
            {person}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {count} event{count !== 1 ? 's' : ''}
          </p>
        </div>
        {selected && (
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
        )}
      </div>
    </button>
  );
}

const MemoPersonCard = React.memo(PersonCard);

export default function PeopleList() {
  const { uniquePeople, events, filters, setFilter } = useInvestigation();

  const personCounts = useMemo(() => {
    const counts = {};
    events.forEach(e => {
      if (e.person && e.person !== 'Unknown') {
        counts[e.person] = (counts[e.person] || 0) + 1;
      }
    });
    return counts;
  }, [events]);

  const handleClick = person => {
    setFilter('person', filters.person === person ? '' : person);
  };

  return (
    <div className="w-60 flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Persons of Interest
        </h2>
        <p className="text-xs text-gray-700 mt-0.5">{uniquePeople.length} individuals</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {uniquePeople.length === 0 ? (
          <p className="text-gray-700 text-xs text-center py-10">No persons found</p>
        ) : (
          uniquePeople.map((person, i) => (
            <MemoPersonCard
              key={person}
              person={person}
              index={i}
              count={personCounts[person] || 0}
              selected={filters.person === person}
              onClick={() => handleClick(person)}
            />
          ))
        )}
      </div>
    </div>
  );
}
