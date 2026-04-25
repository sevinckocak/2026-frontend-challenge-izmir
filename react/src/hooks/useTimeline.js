import { useMemo } from 'react';
import { useInvestigation } from '../context/InvestigationContext';

export function useTimeline() {
  const { filteredEvents } = useInvestigation();

  const groupedByDate = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(event => {
      const date = event.timestamp
        ? new Date(event.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Unknown Date';
      if (!groups[date]) groups[date] = [];
      groups[date].push(event);
    });
    return groups;
  }, [filteredEvents]);

  return { groupedByDate, total: filteredEvents.length };
}
