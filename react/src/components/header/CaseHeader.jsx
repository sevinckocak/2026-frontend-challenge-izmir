import React, { useCallback } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import GuessModal from '../guess/GuessModal';

const FILTER_TYPES = [
  { id: 'checkin',  label: 'Konum Bilgisi',       dot: 'bg-blue-400',    active: 'bg-blue-500/20 text-blue-300 border-blue-500/50',   inactive: 'text-gray-600 border-gray-700/40 hover:text-blue-400 hover:border-blue-500/30' },
  { id: 'message',  label: 'Mesajlaşma Kayıtları', dot: 'bg-purple-400',  active: 'bg-purple-500/20 text-purple-300 border-purple-500/50', inactive: 'text-gray-600 border-gray-700/40 hover:text-purple-400 hover:border-purple-500/30' },
  { id: 'sighting', label: 'Görüntüleme',          dot: 'bg-amber-400',   active: 'bg-amber-500/20 text-amber-300 border-amber-500/50',  inactive: 'text-gray-600 border-gray-700/40 hover:text-amber-400 hover:border-amber-500/30' },
  { id: 'note',     label: 'Notlar',               dot: 'bg-emerald-400', active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50', inactive: 'text-gray-600 border-gray-700/40 hover:text-emerald-400 hover:border-emerald-500/30' },
  { id: 'tip',      label: 'İpucu',                dot: 'bg-red-400',     active: 'bg-red-500/20 text-red-300 border-red-500/50',       inactive: 'text-gray-600 border-gray-700/40 hover:text-red-400 hover:border-red-500/30' },
];

export default React.memo(function CaseHeader() {
  const { filters, toggleTypeFilter, setFilter, filteredEvents, events } = useInvestigation();

  const handleSearch = useCallback(e => setFilter('search', e.target.value), [setFilter]);

  return (
    <header className="flex items-center gap-3 px-4 h-12 bg-[#060b18] border-b border-cyan-500/10 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
          <circle cx="11" cy="11" r="7" fill="none" stroke="#06b6d4" strokeWidth="1.8" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-[11px] font-bold text-white tracking-[0.18em] uppercase leading-none">
            OLAY DOSYASI: QODO
          </p>
          <p className="text-[10px] text-gray-600 leading-none mt-0.5">Kayıp Kişi Soruşturması</p>
        </div>
      </div>

      <div className="w-px h-6 bg-gray-800 flex-shrink-0" />

      {/* Search */}
      <input
        type="text"
        placeholder="Search evidence..."
        value={filters.search}
        onChange={handleSearch}
        className="bg-[#0a1428] text-gray-300 placeholder-gray-600 text-xs px-3 py-1.5 rounded border border-cyan-500/15 focus:border-cyan-500/40 focus:outline-none w-40 flex-shrink-0"
      />

      {/* Type filters */}
      <div className="flex items-center gap-1.5">
        {FILTER_TYPES.map(type => {
          const isActive = filters.types.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggleTypeFilter(type.id)}
              className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded border font-medium transition-all duration-150 ${isActive ? type.active : type.inactive}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type.dot}`} />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4 flex-shrink-0">
        <span className="text-[11px] text-gray-700 tabular-nums">
          {filteredEvents.length}/{events.length} events
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-bold text-red-400 uppercase tracking-[0.2em]">AKTİF DURUM</span>
        </div>
        <div className="w-px h-5 bg-gray-800 flex-shrink-0" />
        <GuessModal />
      </div>
    </header>
  );
});
