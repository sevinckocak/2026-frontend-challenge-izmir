import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Fix Vite + Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Dark CartoDB tiles for cyber aesthetic
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors &copy; <a href="https://carto.com">CARTO</a>';

function makeIcon(bgColor, borderColor, label, size = 26) {
  return L.divIcon({
    html: `
      <div style="
        background: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.38}px;
        font-weight: 800;
        color: #fff;
        font-family: monospace;
        box-shadow: 0 0 16px ${bgColor}90, 0 0 6px ${bgColor}60;
        letter-spacing: -0.5px;
      ">${label}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

function makeCrimeIcon() {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(239,68,68,0.15);
          animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></div>
        <div style="
          width: 32px;
          height: 32px;
          background: #ef4444;
          border: 2.5px solid #fff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 0 20px #ef444490;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 13px;">!</span>
        </div>
      </div>`,
    className: 'crime-pin',
    iconSize: [44, 44],
    iconAnchor: [22, 38],
    popupAnchor: [0, -38],
  });
}

// Podo's movement route
const ROUTE = [
  [38.4360, 27.1435], // Alsancak Kordon
  [38.4188, 27.1286], // Konak Meydanı
  [38.4085, 27.1172], // Asansör (crime scene)
];

const MARKERS = [
  { pos: [38.4085, 27.1172], type: 'crime',  label: 'KAÇIRILMA OLAY YERİ — Asansör (19:29)',        popup: 'Podo\'nun kaybolduğu son konum. Alican ile birlikte görüldü.' },
  { pos: [38.4360, 27.1435], type: 'start',  label: 'Başlangıç — Alsancak Kordon (18:05)',           popup: 'Podo\'nun akşam başlangıç noktası. Cem, Ela ve Alican ile buluştu.' },
  { pos: [38.4188, 27.1286], type: 'qodo',   label: 'Son Güçlü Konum — Konak Meydanı (19:05)',       popup: 'Podo\'nun son güçlü check-in kaydı. Alican ile buradaydı.' },
  { pos: [38.4088, 27.1169], type: 'suspectA', label: 'Zanlı A (Alican) — Asansör (19:36)',          popup: 'Alican, Podo\'dan sonra burada tek başına görüldü.' },
  { pos: [38.4211, 27.1281], type: 'suspectB', label: 'Konak Pier — Ela/Mert Görüntülemesi',         popup: 'Ela ve Mert, Podo\'yu burada gördüğünü sandı. Zayıf kayıt.' },
];

const ICON_MAP = {
  crime:    () => makeCrimeIcon(),
  start:    () => makeIcon('#22c55e', '#4ade80', '▶', 24),
  qodo:     () => makeIcon('#f59e0b', '#fbbf24', 'Q', 28),
  suspectA: () => makeIcon('#3b82f6', '#60a5fa', 'A', 24),
  suspectB: () => makeIcon('#8b5cf6', '#a78bfa', 'B', 22),
};

export default function InvestigationMap() {
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

        {/* Movement route */}
        <Polyline
          positions={ROUTE}
          color="#06b6d4"
          weight={2}
          dashArray="8,5"
          opacity={0.65}
        />

        {/* Markers */}
        {MARKERS.map(m => (
          <Marker key={m.label} position={m.pos} icon={ICON_MAP[m.type]()}>
            <Popup>
              <div style={{ fontFamily: 'monospace', fontSize: 11 }}>
                <strong style={{ color: '#06b6d4' }}>{m.label}</strong>
                <br />
                {m.popup}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay: crime label */}
      <div className="absolute top-3 left-3 z-[1000] bg-black/75 backdrop-blur border border-red-500/40 px-3 py-1.5 rounded pointer-events-none">
        <span className="text-red-400 text-[11px] font-bold uppercase tracking-wider">
          ⚠ KAÇIRILMA OLAY YERİ
        </span>
      </div>

      {/* Overlay: distances */}
      <div className="absolute bottom-10 right-3 z-[1000] space-y-1.5 pointer-events-none">
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
