import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useInvestigation } from '../../context/InvestigationContext';

// Fix Vite + Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>';

// ── Static scene markers ──────────────────────────────────────────────────────
const ROUTE = [
  [38.4360, 27.1435], // Alsancak Kordon
  [38.4188, 27.1286], // Konak Meydanı
  [38.4085, 27.1172], // Asansör (crime scene)
];

const STATIC_MARKERS = [
  { pos: [38.4085, 27.1172], type: 'crime',    label: 'KAÇIRILMA OLAY YERİ — Asansör (19:29)',      popup: 'Podo\'nun kaybolduğu son konum. Alican ile birlikte görüldü.' },
  { pos: [38.4360, 27.1435], type: 'start',    label: 'Başlangıç — Alsancak Kordon (18:05)',         popup: 'Podo\'nun akşam başlangıç noktası. Cem, Ela ve Alican ile buluştu.' },
  { pos: [38.4188, 27.1286], type: 'qodo',     label: 'Son Güçlü Konum — Konak Meydanı (19:05)',     popup: 'Podo\'nun son güçlü check-in kaydı. Alican ile buradaydı.' },
  { pos: [38.4088, 27.1169], type: 'suspectA', label: 'Zanlı A (Alican) — Asansör (19:36)',          popup: 'Alican, Podo\'dan sonra burada tek başına görüldü.' },
  { pos: [38.4211, 27.1281], type: 'suspectB', label: 'Konak Pier — Ela/Mert Görüntülemesi',         popup: 'Ela ve Mert, Podo\'yu burada gördüğünü sandı. Zayıf kayıt.' },
];

// ── Location string → lat/lng lookup ─────────────────────────────────────────
// Ordered from most specific to least to prevent false partial matches
const LOCATION_COORDS = [
  { keys: ['konak meydanı', 'konak meydan'],  coords: [38.4188, 27.1286] },
  { keys: ['konak pier', 'pier'],              coords: [38.4211, 27.1281] },
  { keys: ['asansör', 'elevator'],            coords: [38.4085, 27.1172] },
  { keys: ['kordon', 'alsancak'],              coords: [38.4360, 27.1435] },
  { keys: ['konak'],                           coords: [38.4188, 27.1286] },
  { keys: ['kemeraltı', 'kemeralti'],          coords: [38.4126, 27.1355] },
  { keys: ['basmane'],                         coords: [38.4205, 27.1472] },
  { keys: ['bornova'],                         coords: [38.4619, 27.2164] },
  { keys: ['buca'],                            coords: [38.3833, 27.1775] },
  { keys: ['karşıyaka', 'karsiyaka'],          coords: [38.4558, 27.1061] },
  { keys: ['çiğli', 'cigli'],                 coords: [38.4894, 27.0750] },
  { keys: ['mavişehir', 'mavisehir'],          coords: [38.4750, 27.0850] },
];

export function resolveCoords(location) {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  for (const { keys, coords } of LOCATION_COORDS) {
    if (keys.some(k => lower.includes(k))) return coords;
  }
  return null;
}

// ── Icon factories ────────────────────────────────────────────────────────────
const TYPE_COLORS = {
  checkin:  { bg: '#3b82f6', border: '#93c5fd', glyph: '📍' },
  message:  { bg: '#8b5cf6', border: '#c4b5fd', glyph: '✉' },
  sighting: { bg: '#f59e0b', border: '#fde68a', glyph: '👁' },
  note:     { bg: '#10b981', border: '#6ee7b7', glyph: '📝' },
  tip:      { bg: '#ef4444', border: '#fca5a5', glyph: '⚠' },
};

function makeStaticIcon(type) {
  const MAP = {
    crime:    { bg: '#ef4444', border: '#fff', glyph: '!', size: 32, pin: true },
    start:    { bg: '#22c55e', border: '#4ade80', glyph: '▶', size: 24 },
    qodo:     { bg: '#f59e0b', border: '#fbbf24', glyph: 'Q', size: 28 },
    suspectA: { bg: '#3b82f6', border: '#60a5fa', glyph: 'A', size: 24 },
    suspectB: { bg: '#8b5cf6', border: '#a78bfa', glyph: 'B', size: 22 },
  };
  const c = MAP[type] || MAP.start;

  if (type === 'crime') {
    return L.divIcon({
      html: `
        <div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(239,68,68,0.15);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:32px;height:32px;background:#ef4444;border:2.5px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 0 20px #ef444490;display:flex;align-items:center;justify-content:center;">
            <span style="transform:rotate(45deg);font-size:13px;font-weight:800;color:#fff;">!</span>
          </div>
        </div>`,
      className: 'crime-pin',
      iconSize: [44, 44], iconAnchor: [22, 38], popupAnchor: [0, -38],
    });
  }

  return L.divIcon({
    html: `<div style="background:${c.bg};border:2px solid ${c.border};border-radius:50%;width:${c.size}px;height:${c.size}px;display:flex;align-items:center;justify-content:center;font-size:${c.size * 0.38}px;font-weight:800;color:#fff;font-family:monospace;box-shadow:0 0 16px ${c.bg}90;">${c.glyph}</div>`,
    className: '',
    iconSize: [c.size, c.size], iconAnchor: [c.size / 2, c.size / 2], popupAnchor: [0, -c.size / 2 - 4],
  });
}

function makeEventIcon(type, selected) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.note;
  const size = selected ? 30 : 20;
  const total = size + 14;
  const pulse = selected
    ? `<div style="position:absolute;inset:0;border-radius:50%;background:${c.bg}35;animation:ping 1s cubic-bezier(0,0,0.2,1) infinite;"></div>`
    : '';
  const ring = selected ? `outline:3px solid ${c.border};outline-offset:2px;` : '';

  return L.divIcon({
    html: `
      <div style="position:relative;width:${total}px;height:${total}px;display:flex;align-items:center;justify-content:center;">
        ${pulse}
        <div style="width:${size}px;height:${size}px;background:${c.bg};border:2px solid ${c.border};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.55)}px;box-shadow:0 0 ${selected ? 18 : 10}px ${c.bg}80;${ring}">
          ${c.glyph}
        </div>
      </div>`,
    className: '',
    iconSize: [total, total],
    iconAnchor: [total / 2, total / 2],
    popupAnchor: [0, -total / 2 - 2],
  });
}

// ── Inner components (must be inside MapContainer) ────────────────────────────

function MapController({ selectedEvent }) {
  const map = useMap();
  const prevId = useRef(null);

  useEffect(() => {
    if (!selectedEvent || selectedEvent.id === prevId.current) return;
    prevId.current = selectedEvent.id;

    if (!selectedEvent.location) return;
    const coords = resolveCoords(selectedEvent.location);
    if (coords) {
      map.flyTo(coords, Math.max(map.getZoom(), 15), { duration: 0.75 });
    }
  }, [selectedEvent, map]);

  return null;
}

function DynamicMarkers({ events, selectedId }) {
  const { setSelectedEvent } = useInvestigation();

  const resolved = useMemo(() =>
    events
      .filter(e => e.location)
      .map(e => ({ ...e, coords: resolveCoords(e.location) }))
      .filter(e => e.coords),
    [events]
  );

  const TYPE_LABEL = { checkin: 'Konum', message: 'Mesaj', sighting: 'Görüntü', note: 'Not', tip: 'İpucu' };

  return resolved.map(event => {
    const isSelected = event.id === selectedId;
    const time = event.timestamp
      ? new Date(event.timestamp).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
      : '';
    const c = TYPE_COLORS[event.type] || TYPE_COLORS.note;

    return (
      <Marker
        key={event.id}
        position={event.coords}
        icon={makeEventIcon(event.type, isSelected)}
        eventHandlers={{ click: () => setSelectedEvent(isSelected ? null : event) }}
      >
        <Popup>
          <div style={{ fontFamily: 'monospace', fontSize: 11, minWidth: 170, lineHeight: 1.6 }}>
            <div style={{ color: c.bg, fontWeight: 'bold', marginBottom: 3 }}>
              {c.glyph} {TYPE_LABEL[event.type] || event.type} — {event.person}
            </div>
            {event.location && (
              <div style={{ color: '#9ca3af', marginBottom: 2 }}>📍 {event.location}</div>
            )}
            {time && <div style={{ color: '#6b7280' }}>🕐 {time}</div>}
          </div>
        </Popup>
      </Marker>
    );
  });
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function InvestigationMap() {
  const { filteredEvents, selectedEvent } = useInvestigation();

  const mappableCount = useMemo(
    () => filteredEvents.filter(e => e.location && resolveCoords(e.location)).length,
    [filteredEvents]
  );

  return (
    <div className="flex-1 relative overflow-hidden min-h-0">
      <MapContainer
        center={[38.422, 27.130]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <ZoomControl position="bottomright" />

        {/* Podo's movement route */}
        <Polyline positions={ROUTE} color="#06b6d4" weight={2} dashArray="8,5" opacity={0.55} />

        {/* Fixed investigation scene markers */}
        {STATIC_MARKERS.map(m => (
          <Marker key={m.label} position={m.pos} icon={makeStaticIcon(m.type)}>
            <Popup>
              <div style={{ fontFamily: 'monospace', fontSize: 11 }}>
                <strong style={{ color: '#06b6d4' }}>{m.label}</strong>
                <br />
                {m.popup}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Dynamic markers from filtered timeline events */}
        <DynamicMarkers events={filteredEvents} selectedId={selectedEvent?.id} />

        {/* Pan/zoom to selected event */}
        <MapController selectedEvent={selectedEvent} />
      </MapContainer>

      {/* Top-left: crime label */}
      <div className="absolute top-3 left-3 z-[400] bg-black/75 backdrop-blur border border-red-500/40 px-3 py-1.5 rounded pointer-events-none">
        <span className="text-red-400 text-[11px] font-bold uppercase tracking-wider">
          ⚠ KAÇIRILMA OLAY YERİ
        </span>
      </div>

      {/* Top-right: live event count badge */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-black/75 backdrop-blur border border-cyan-500/25 px-2.5 py-1 rounded flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-cyan-400 text-[10px] font-mono">
            {mappableCount} olay haritada
          </span>
        </div>
        {selectedEvent?.location && resolveCoords(selectedEvent.location) && (
          <div className="bg-black/75 backdrop-blur border border-amber-500/40 px-2.5 py-1 rounded">
            <span className="text-amber-400 text-[10px] font-mono">
              ► {selectedEvent.person} · {selectedEvent.location}
            </span>
          </div>
        )}
      </div>

      {/* Bottom-right: legend */}
      <div className="absolute bottom-10 right-3 z-[400] space-y-1.5 pointer-events-none">
        <div className="bg-black/75 backdrop-blur border border-cyan-500/25 text-cyan-400 text-[10px] px-2 py-1 rounded font-mono">
          Mesafe: ~3.2km (Kordon → Asansör)
        </div>
        <div className="bg-black/75 backdrop-blur border border-red-500/25 text-red-400 text-[10px] px-2 py-1 rounded font-mono">
          Son Görülme: 19:29 — Asansör
        </div>
        <div className="bg-black/75 backdrop-blur border border-amber-500/25 text-amber-400 text-[10px] px-2 py-1 rounded font-mono">
          Zanlı A: Alican — YÜK. GÜVEN
        </div>
      </div>
    </div>
  );
}
