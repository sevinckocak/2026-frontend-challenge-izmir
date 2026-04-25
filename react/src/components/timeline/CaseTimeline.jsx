import React, { useMemo, useRef } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const TYPE_CONFIG = {
  checkin:  { label: 'Konum',       color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/8',    dot: 'bg-blue-500',    icon: '📍' },
  message:  { label: 'Mesaj',       color: 'text-purple-400',  border: 'border-purple-500/30',  bg: 'bg-purple-500/8',  dot: 'bg-purple-500',  icon: '💬' },
  sighting: { label: 'Görüntüleme', color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/8',   dot: 'bg-amber-500',   icon: '👁' },
  note:     { label: 'Not',         color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8', dot: 'bg-emerald-500', icon: '📝' },
  tip:      { label: 'İpucu',       color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/8',     dot: 'bg-red-500',     icon: '⚠' },
};

export default function CaseTimeline() {
  const { filteredEvents, loading, selectedEvent, setSelectedEvent } = useInvestigation();
  const scrollRef = useRef(null);

  const sorted = useMemo(
    () => [...filteredEvents].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [filteredEvents]
  );

  return (
    <div className="h-48 flex-shrink-0 bg-[#050c18] border-t border-cyan-500/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-8 border-b border-cyan-500/8 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/70">
          OLAY ZAMAN ÇİZELGESİ
        </span>
        <div className="h-px flex-1 bg-cyan-500/8" />
        <span className="text-[10px] text-gray-700">{sorted.length} olay</span>
      </div>

      {/* Timeline scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-4 gap-0 min-h-0">
        {loading ? (
          <div className="w-full flex items-center justify-center text-gray-700 text-xs">Yükleniyor...</div>
        ) : sorted.length === 0 ? (
          <div className="w-full flex items-center justify-center text-gray-700 text-xs">Olay bulunamadı</div>
        ) : (
          <div className="flex items-center h-full py-2">
            {sorted.map((event, i) => {
              const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.note;
              const isSelected = selectedEvent?.id === event.id;
              const time = event.timestamp
                ? new Date(event.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                : '';

              return (
                <div key={event.id} className="flex items-center flex-shrink-0">
                  {/* Connector */}
                  {i > 0 && (
                    <div className="relative w-10 flex items-center">
                      <div className="w-full h-px bg-cyan-500/15" />
                      <div className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-500/25" />
                    </div>
                  )}

                  {/* Event card */}
                  <div className="flex flex-col items-center group" style={{ width: 128 }}>
                    {/* Time above */}
                    <span className="text-[10px] font-mono text-gray-600 mb-1.5 tabular-nums">{time}</span>

                    {/* Card */}
                    <div
                      onClick={() => setSelectedEvent(isSelected ? null : event)}
                      className={`
                        w-full cursor-pointer border rounded p-2 transition-all duration-150
                        hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30
                        ${cfg.bg} ${cfg.border}
                        ${isSelected ? 'ring-1 ring-amber-400/60 shadow-md shadow-amber-400/10' : ''}
                      `}
                    >
                      <div className={`text-[10px] font-bold ${cfg.color} mb-0.5 truncate`}>
                        {cfg.icon} {cfg.label}
                      </div>
                      <div className="text-white text-[11px] font-medium truncate leading-tight">
                        {event.person}
                      </div>
                      {event.location && (
                        <div className="text-gray-600 text-[10px] truncate mt-0.5">
                          📍 {event.location}
                        </div>
                      )}
                    </div>

                    {/* Dot below */}
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${cfg.dot} ring-2 ring-[#050c18]`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Time ruler */}
      <div className="h-5 border-t border-cyan-500/6 flex items-center px-4 flex-shrink-0">
        <div className="flex justify-between w-full">
          {['18:00', '18:20', '18:40', '19:00', '19:20', '19:40'].map(t => (
            <span key={t} className="text-[9px] text-gray-700 font-mono tabular-nums">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
