import { useEffect, useCallback } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const TYPE_CONFIG = {
  checkin:  { label: 'Konum Kaydı',    color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    badge: 'bg-blue-500/15 text-blue-300',    icon: '📍' },
  message:  { label: 'Mesaj',          color: 'text-purple-400',  border: 'border-purple-500/30',  bg: 'bg-purple-500/10',  badge: 'bg-purple-500/15 text-purple-300',  icon: '💬' },
  sighting: { label: 'Görüntüleme',    color: 'text-amber-400',   border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   badge: 'bg-amber-500/15 text-amber-300',   icon: '👁' },
  note:     { label: 'Not',            color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/15 text-emerald-300', icon: '📝' },
  tip:      { label: 'İpucu / İhbar',  color: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/10',     badge: 'bg-red-500/15 text-red-300',     icon: '⚠' },
};

// Parse "Label: Value | Label2: Value2" into [{label, value}]
function parseContent(content) {
  if (!content || content === 'No details available') return [];
  return content.split(' | ').map(part => {
    const idx = part.indexOf(': ');
    if (idx > -1) return { label: part.slice(0, idx).trim(), value: part.slice(idx + 2).trim() };
    return { label: null, value: part.trim() };
  }).filter(p => p.value);
}

function formatTimestamp(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('tr-TR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return ts;
  }
}

export default function EventModal() {
  const { selectedEvent, setSelectedEvent } = useInvestigation();

  const close = useCallback(() => setSelectedEvent(null), [setSelectedEvent]);

  // Close on Escape key
  useEffect(() => {
    if (!selectedEvent) return;
    const handler = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedEvent, close]);

  if (!selectedEvent) return null;

  const cfg = TYPE_CONFIG[selectedEvent.type] || TYPE_CONFIG.note;
  const fields = parseContent(selectedEvent.content);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={close}
    >
      {/* Panel — stop propagation so clicks inside don't close */}
      <div
        className="relative w-full max-w-md rounded-xl border border-cyan-500/20 shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#07101f' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${cfg.border} ${cfg.bg}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-lg leading-none">{cfg.icon}</span>
            <div>
              <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${cfg.color}`}>
                {cfg.label}
              </p>
              <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                {selectedEvent.id}
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="w-7 h-7 rounded-full bg-gray-800/70 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Meta row */}
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Kişi</p>
              <p className="text-white font-semibold text-sm leading-none">{selectedEvent.person}</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Zaman</p>
              <p className="text-cyan-300 font-mono text-[11px] leading-tight">
                {formatTimestamp(selectedEvent.timestamp)}
              </p>
            </div>
          </div>

          {/* Location */}
          {selectedEvent.location && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Konum</p>
              <div className="flex items-center gap-1.5 bg-[#040c18] border border-cyan-500/10 rounded px-3 py-2">
                <span className="text-xs">📍</span>
                <span className="text-cyan-200 text-xs font-medium">{selectedEvent.location}</span>
              </div>
            </div>
          )}

          {/* Content fields */}
          {fields.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Olay Detayları</p>
              <div className="rounded-lg border border-cyan-500/10 overflow-hidden divide-y divide-cyan-500/8">
                {fields.map((f, i) => (
                  <div key={i} className="flex gap-3 px-3 py-2 hover:bg-cyan-500/4 transition-colors">
                    {f.label && (
                      <span className="text-[10px] text-gray-500 font-medium w-28 flex-shrink-0 pt-px leading-relaxed">
                        {f.label}
                      </span>
                    )}
                    <span className="text-[11px] text-gray-200 leading-relaxed flex-1 break-words">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer badge */}
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
              {cfg.icon} {cfg.label}
            </span>
            <span className="text-[10px] text-gray-700">· Olay #{selectedEvent.id?.split('-').pop()}</span>
          </div>
        </div>

        {/* Scanline decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 2px, #06b6d4 3px)',
          }}
        />
      </div>
    </div>
  );
}
