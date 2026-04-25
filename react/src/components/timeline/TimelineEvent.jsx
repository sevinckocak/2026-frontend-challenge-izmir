import React, { useCallback } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const TYPE_CONFIG = {
  checkin: {
    label: 'Check-in',
    color: 'text-blue-400',
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    dot: 'bg-blue-500',
    ring: 'ring-blue-500/30',
    icon: '📍',
  },
  message: {
    label: 'Message',
    color: 'text-purple-400',
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/20',
    dot: 'bg-purple-500',
    ring: 'ring-purple-500/30',
    icon: '💬',
  },
  sighting: {
    label: 'Sighting',
    color: 'text-amber-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    dot: 'bg-amber-500',
    ring: 'ring-amber-500/30',
    icon: '👁',
  },
  note: {
    label: 'Note',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
    icon: '📝',
  },
  tip: {
    label: 'Tip',
    color: 'text-red-400',
    bg: 'bg-red-500/5',
    border: 'border-red-500/20',
    dot: 'bg-red-500',
    ring: 'ring-red-500/30',
    icon: '⚠',
  },
};

function TimelineEvent({ event, isSelected, onClick, index }) {
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.note;

  const handleVisible = useCallback(entry => {
    entry.target.classList.add('visible');
  }, []);

  const ref = useIntersectionObserver(handleVisible);

  const time = event.timestamp
    ? new Date(event.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      ref={ref}
      className="timeline-event"
      style={{ transitionDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div
        onClick={onClick}
        className={`relative ml-8 mb-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 ${config.bg} ${config.border} ${
          isSelected ? `ring-1 ${config.ring} shadow-md` : ''
        }`}
      >
        {/* Timeline dot */}
        <div
          className={`absolute -left-[2.125rem] top-[1.125rem] w-2.5 h-2.5 rounded-full ${config.dot} ring-2 ring-gray-950 z-10`}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                {config.icon} {config.label}
              </span>
              {event.location && (
                <span className="text-xs text-gray-600 truncate">
                  · {event.location}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-200 font-medium mb-1 leading-snug">
              {event.person}
            </p>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {event.content}
            </p>
          </div>
          <time className="text-xs text-gray-700 flex-shrink-0 tabular-nums mt-0.5">
            {time}
          </time>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TimelineEvent);
