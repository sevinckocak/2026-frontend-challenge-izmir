import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { fetchAllEvents } from '../services/investigationService';

const InvestigationContext = createContext(null);

const INITIAL_FILTERS = {
  types: [],
  person: '',
  search: '',
};

export function InvestigationProvider({ children }) {
  const [events, setEvents]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters]             = useState(INITIAL_FILTERS);

  // ── Drawer state ─────────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen]         = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchAllEvents()
      .then(data => {
        setEvents(data);
        setError(null);
      })
      .catch(err => setError(err.message || 'Failed to load investigation data.'))
      .finally(() => setLoading(false));
  }, []);

  const uniquePeople = useMemo(() => {
    const people = [
      ...new Set(events.map(e => e.person).filter(p => p && p !== 'Unknown')),
    ];
    return people.sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filters.types.length > 0 && !filters.types.includes(event.type)) return false;
      if (filters.person && event.person !== filters.person) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          event.content?.toLowerCase().includes(q) ||
          event.person?.toLowerCase().includes(q) ||
          event.location?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleTypeFilter = useCallback(type => {
    setFilters(prev => {
      const types = prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type];
      return { ...prev, types };
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  const openDrawer = useCallback((suspect) => {
    setSelectedSuspect(suspect);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <InvestigationContext.Provider
      value={{
        events,
        loading,
        error,
        selectedEvent,
        setSelectedEvent,
        filters,
        setFilter,
        toggleTypeFilter,
        resetFilters,
        filteredEvents,
        uniquePeople,
        drawerOpen,
        selectedSuspect,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const ctx = useContext(InvestigationContext);
  if (!ctx) throw new Error('useInvestigation must be used within InvestigationProvider');
  return ctx;
}
