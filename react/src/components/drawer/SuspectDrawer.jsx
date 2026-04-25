import { useEffect, useMemo } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const TYPE_CONFIG = {
  message:  { label: 'Mesaj',    color: 'text-purple-400',  bg: 'bg-purple-500/10',  border: 'border-purple-500/20', icon: '💬' },
  checkin:  { label: 'Konum',    color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',   icon: '📍' },
  sighting: { label: 'Görüntü', color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',  icon: '👁' },
  tip:      { label: 'İpucu',   color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20',    icon: '⚠' },
  note:     { label: 'Not',      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',icon: '📝' },
};

const CONF_CONFIG = {
  high:   { label: 'Aranıyor',             color: 'text-red-400',   bg: 'bg-red-500/15',   dot: 'bg-red-500',   ringColor: 'border-red-500/50' },
  medium: { label: 'Konumu Tespit Edildi', color: 'text-amber-400', bg: 'bg-amber-500/15', dot: 'bg-amber-500', ringColor: 'border-amber-500/50' },
  low:    { label: 'İlgili Kişi',          color: 'text-gray-400',  bg: 'bg-gray-500/10',  dot: 'bg-gray-500',  ringColor: 'border-gray-600/50' },
};

// Parses "Label: value | Label: value" content strings into a key→value map
function parseContent(content = '') {
  const result = {};
  content.split(' | ').forEach(part => {
    const idx = part.indexOf(': ');
    if (idx > -1) {
      result[part.slice(0, idx).trim().toLowerCase()] = part.slice(idx + 2).trim();
    }
  });
  return result;
}

function formatDateTime(ts) {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleString('tr-TR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
}

// ── Profile header ────────────────────────────────────────────────────────────
function ProfileHeader({ suspect }) {
  const cfg = CONF_CONFIG[suspect?.confidence] || CONF_CONFIG.low;
  const initial = (suspect?.name || '?').charAt(0).toUpperCase();

  return (
    <div className="px-5 pt-5 pb-4 border-b border-cyan-500/10 flex items-start gap-4">
      <div className={`w-16 h-16 rounded-full ${cfg.bg} border-2 ${cfg.ringColor} flex items-center justify-center flex-shrink-0`}>
        <span className={`text-2xl font-bold ${cfg.color}`}>{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-base leading-tight truncate">{suspect?.name}</h3>
        <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full ${cfg.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
        <p className="text-gray-600 text-[10px] mt-1.5">{suspect?.count} kayıt · soruşturma kapsamında</p>
      </div>
    </div>
  );
}

// ── Stats summary bar ─────────────────────────────────────────────────────────
function StatsBar({ grouped }) {
  const ORDER = ['tip', 'message', 'sighting', 'checkin', 'note'];
  const types = [
    ...ORDER.filter(t => grouped[t]),
    ...Object.keys(grouped).filter(t => !ORDER.includes(t)),
  ];

  if (!types.length) return null;

  return (
    <div className="px-5 py-3 border-b border-cyan-500/8 flex flex-wrap gap-2">
      {types.map(t => {
        const cfg = TYPE_CONFIG[t] || TYPE_CONFIG.note;
        return (
          <div key={t} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg}`}>
            <span className="text-xs leading-none">{cfg.icon}</span>
            <span className={`text-[10px] font-semibold ${cfg.color}`}>
              {grouped[t].length} {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Individual event renderers ────────────────────────────────────────────────
function MessageEvent({ event }) {
  const f = parseContent(event.content);
  const from = f['from'] || f['sender'] || f['kimden'] || event.person;
  const to   = f['to'] || f['receiver'] || f['kime'] || '?';
  const msg  = f['message'] || f['mesaj'] || f['text'] || f['içerik'] || event.content;

  return (
    <div className="rounded-lg bg-purple-500/8 border border-purple-500/20 p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold text-purple-300">{from}</span>
        <svg viewBox="0 0 16 8" className="w-4 h-2 flex-shrink-0 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 4h14M10 1l4 3-4 3" />
        </svg>
        <span className="text-[10px] text-purple-200/70">{to}</span>
        <span className="text-[10px] text-gray-700 font-mono ml-auto">{formatDateTime(event.timestamp)}</span>
      </div>
      <p className="text-[11px] text-gray-300 leading-relaxed border-l-2 border-purple-500/30 pl-2">{msg}</p>
      {event.location && (
        <p className="text-[10px] text-gray-700">📍 {event.location}</p>
      )}
    </div>
  );
}

function CheckinEvent({ event }) {
  const f = parseContent(event.content);
  const note = f['note'] || f['not'] || f['açıklama'] || f['description'];

  return (
    <div className="rounded-lg bg-blue-500/8 border border-blue-500/20 p-3 flex items-start gap-3">
      <span className="text-sm flex-shrink-0 mt-0.5">📍</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-blue-300 font-semibold leading-snug">{event.location || '—'}</p>
        <p className="text-[10px] text-gray-600 font-mono mt-0.5">{formatDateTime(event.timestamp)}</p>
        {note && <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{note}</p>}
      </div>
    </div>
  );
}

function SightingEvent({ event }) {
  const f = parseContent(event.content);
  const seenWith = f['seenwith'] || f['seen with'] || f['birlikte görüldü'] || f['with'];
  const note = f['note'] || f['not'] || f['açıklama'];

  return (
    <div className="rounded-lg bg-amber-500/8 border border-amber-500/20 p-3 flex items-start gap-3">
      <span className="text-sm flex-shrink-0 mt-0.5">👁</span>
      <div className="flex-1 min-w-0">
        {seenWith && (
          <p className="text-[11px] text-amber-300">
            <span className="text-gray-600 text-[10px]">Birlikte: </span>
            {seenWith}
          </p>
        )}
        {event.location && (
          <p className="text-[10px] text-gray-500 mt-0.5">{event.location}</p>
        )}
        {note && <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{note}</p>}
        <p className="text-[10px] text-gray-700 font-mono mt-1">{formatDateTime(event.timestamp)}</p>
      </div>
    </div>
  );
}

function TipEvent({ event }) {
  const f = parseContent(event.content);
  const tip = f['tip'] || f['ipucu'] || f['information'] || f['bilgi'] || event.content;
  const confidence = f['confidence'] || f['güven düzeyi'] || f['level'];
  const confColor =
    confidence === 'high'   ? 'text-red-400 bg-red-500/15' :
    confidence === 'medium' ? 'text-amber-400 bg-amber-500/15' :
    'text-gray-500 bg-gray-500/10';

  return (
    <div className="rounded-lg bg-red-500/8 border border-red-500/20 p-3 space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wide">İpucu</span>
        {confidence && (
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${confColor}`}>
            {confidence}
          </span>
        )}
        <span className="text-[10px] text-gray-700 font-mono ml-auto">{formatDateTime(event.timestamp)}</span>
      </div>
      <p className="text-[11px] text-gray-300 leading-relaxed">{tip}</p>
      {event.location && (
        <p className="text-[10px] text-gray-700">📍 {event.location}</p>
      )}
    </div>
  );
}

function NoteEvent({ event }) {
  const f = parseContent(event.content);
  const note = f['note'] || f['not'] || f['açıklama'] || f['description'] || event.content;

  return (
    <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/20 p-3 flex items-start gap-3">
      <span className="text-sm flex-shrink-0 mt-0.5">📝</span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-300 leading-relaxed">{note}</p>
        <p className="text-[10px] text-gray-600 font-mono mt-1">{formatDateTime(event.timestamp)}</p>
      </div>
    </div>
  );
}

const EVENT_COMPONENTS = {
  message: MessageEvent,
  checkin: CheckinEvent,
  sighting: SightingEvent,
  tip: TipEvent,
  note: NoteEvent,
};

function EventSection({ type, events }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.note;
  const Component = EVENT_COMPONENTS[type] || NoteEvent;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs">{cfg.icon}</span>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>
          {cfg.label}
        </p>
        <span className={`text-[9px] ${cfg.color} opacity-60 ml-0.5`}>· {events.length}</span>
      </div>
      <div className="space-y-2">
        {events.map(ev => <Component key={ev.id} event={ev} />)}
      </div>
    </div>
  );
}

// ── Main events area ──────────────────────────────────────────────────────────
function AllEvents({ suspectName, events }) {
  const personEvents = useMemo(() =>
    events
      .filter(e => e.person === suspectName)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [suspectName, events]
  );

  const grouped = useMemo(() => {
    const g = {};
    personEvents.forEach(e => {
      if (!g[e.type]) g[e.type] = [];
      g[e.type].push(e);
    });
    return g;
  }, [personEvents]);

  if (!personEvents.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-3">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
        <p className="text-gray-600 text-xs">Bu kişiye ait kayıt bulunamadı.</p>
      </div>
    );
  }

  const ORDER = ['tip', 'message', 'sighting', 'checkin', 'note'];
  const types = [
    ...ORDER.filter(t => grouped[t]),
    ...Object.keys(grouped).filter(t => !ORDER.includes(t)),
  ];

  return (
    <>
      <StatsBar grouped={grouped} />
      <div className="px-5 py-4">
        {types.map(type => (
          <EventSection key={type} type={type} events={grouped[type]} />
        ))}
      </div>
    </>
  );
}

// ── Root drawer ───────────────────────────────────────────────────────────────
export default function SuspectDrawer() {
  const { drawerOpen, selectedSuspect, closeDrawer, events } = useInvestigation();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity duration-300"
        style={{ zIndex: 900 }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(2px)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-10 w-96 flex flex-col border-l border-cyan-500/15 shadow-2xl"
        style={{ zIndex: 901 }}
        style={{
          backgroundColor: '#07101f',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/10 flex-shrink-0 bg-[#05090f]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/70">
              Şüpheli Dosyası
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="w-7 h-7 rounded-full bg-gray-800/70 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {selectedSuspect ? (
            <>
              <ProfileHeader suspect={selectedSuspect} />
              <AllEvents suspectName={selectedSuspect.name} events={events} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-700 text-xs">Kişi seçilmedi</p>
            </div>
          )}
        </div>

        {/* Scan line decoration */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #06b6d4 2px, #06b6d4 3px)',
          }}
        />
      </div>
    </>
  );
}
