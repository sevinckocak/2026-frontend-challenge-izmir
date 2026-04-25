import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { useTimeline } from '../../hooks/useTimeline';
import TimelineEvent from './TimelineEvent';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';

export default function Timeline() {
  const { loading, error, selectedEvent, setSelectedEvent } = useInvestigation();
  const { groupedByDate, total } = useTimeline();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (total === 0) return <EmptyState />;

  let globalIndex = 0;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 min-w-0">
      <div className="max-w-2xl mx-auto">
        {Object.entries(groupedByDate).map(([date, events]) => (
          <div key={date} className="mb-6">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-4 sticky top-0 bg-gray-950/95 backdrop-blur-sm py-2 z-10 -mx-1 px-1">
              <div className="h-px flex-1 bg-gray-800" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600/80 whitespace-nowrap">
                {date}
              </span>
              <div className="h-px flex-1 bg-gray-800" />
            </div>

            {/* Events with vertical line */}
            <div className="relative">
              <div className="absolute left-[calc(2rem-0.5px)] top-0 bottom-0 w-px bg-gray-800" />
              {events.map(event => {
                const idx = globalIndex++;
                return (
                  <TimelineEvent
                    key={event.id}
                    event={event}
                    index={idx}
                    isSelected={selectedEvent?.id === event.id}
                    onClick={() =>
                      setSelectedEvent(selectedEvent?.id === event.id ? null : event)
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
