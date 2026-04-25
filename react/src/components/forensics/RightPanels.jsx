import React from 'react';
import VideoPlayer from './VideoPlayer';
import qodoFoto from '../../assets/qodo_foto.png';
import qodoKanit from '../../assets/qodo_kanıt.png';

// ── Network graph ────────────────────────────────────────────────────────────
const NET_NODES = [
  { id: 'qodo',   x: 145, y: 90,  label: 'Qodo',            sub: 'Kayıp',   color: '#ef4444', r: 13 },
  { id: 'alican', x: 225, y: 50,  label: 'Alican',          sub: 'Zanlı A', color: '#f59e0b', r: 10 },
  { id: 'cem',    x: 65,  y: 45,  label: 'Cem',             sub: 'Tanıdık', color: '#06b6d4', r: 9  },
  { id: 'ela',    x: 230, y: 140, label: 'Ela',             sub: 'Tanıdık', color: '#8b5cf6', r: 9  },
  { id: 'can',    x: 55,  y: 145, label: 'Can',             sub: 'Şüpheli', color: '#6b7280', r: 8  },
  { id: 'mert',   x: 155, y: 170, label: 'Mert',            sub: 'Şüpheli', color: '#6b7280', r: 8  },
  { id: 'assoc1', x: 145, y: 18,  label: 'Bilinen Tanıdık', sub: '',        color: '#374151', r: 7  },
  { id: 'assoc2', x: 28,  y: 100, label: 'Bilinen Tanıdık', sub: '',        color: '#374151', r: 7  },
];

const NET_EDGES = [
  { from: 'qodo',   to: 'alican', color: '#ef4444', w: 2.5, dash: ''    },
  { from: 'qodo',   to: 'cem',    color: '#06b6d4', w: 1.5, dash: ''    },
  { from: 'qodo',   to: 'ela',    color: '#8b5cf6', w: 1.5, dash: ''    },
  { from: 'qodo',   to: 'can',    color: '#4b5563', w: 1,   dash: '3,2' },
  { from: 'qodo',   to: 'mert',   color: '#4b5563', w: 1,   dash: '3,2' },
  { from: 'alican', to: 'assoc1', color: '#374151', w: 0.8, dash: '2,3' },
  { from: 'cem',    to: 'assoc2', color: '#374151', w: 0.8, dash: '2,3' },
  { from: 'alican', to: 'ela',    color: '#6b7280', w: 0.8, dash: '2,3' },
];

function nodeById(id) { return NET_NODES.find(n => n.id === id); }

function NetworkGraph() {
  return (
    <svg viewBox="0 0 280 200" className="w-full h-full">
      {NET_EDGES.map((e, i) => {
        const a = nodeById(e.from), b = nodeById(e.to);
        if (!a || !b) return null;
        return (
          <line key={i}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={e.color} strokeWidth={e.w}
            strokeDasharray={e.dash} opacity="0.65"
          />
        );
      })}
      {NET_NODES.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.r + 5} fill={n.color} opacity="0.07" />
          <circle cx={n.x} cy={n.y} r={n.r}     fill={n.color} opacity="0.85" />
          <text x={n.x} y={n.y - n.r - 4} textAnchor="middle" fontSize="7" fill="#d1d5db" fontFamily="monospace">
            {n.label}
          </text>
          {n.sub && (
            <text x={n.x} y={n.y + n.r + 9} textAnchor="middle" fontSize="5.5" fill="#6b7280" fontFamily="monospace">
              {n.sub}
            </text>
          )}
        </g>
      ))}
      {/* Pulsing ring around Qodo */}
      <circle cx={145} cy={90} r={20} fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.35" strokeDasharray="3,3">
        <animateTransform attributeName="transform" type="rotate" from="0 145 90" to="360 145 90" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── Evidence photos ──────────────────────────────────────────────────────────
const PHOTOS = [
  { src: qodoFoto,  label: 'Qodo Fotoğrafı',   sub: 'Son Bilinen'   },
  { src: qodoKanit, label: 'Evde Bulunan Eşya', sub: 'Fiziksel Kanıt' },
];

function PhotoCard({ src, label, sub }) {
  return (
    <div className="flex-1 relative rounded overflow-hidden border border-cyan-500/10 hover:border-amber-500/40 transition-colors group cursor-pointer min-w-0">
      <img src={src} alt={label} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-1.5">
        <p className="text-[9px] text-white font-semibold leading-tight truncate">{label}</p>
        <p className="text-[8px] text-gray-500 leading-tight">{sub}</p>
      </div>
      <div className="absolute inset-0 ring-1 ring-amber-500/0 group-hover:ring-amber-500/35 rounded transition-all pointer-events-none" />
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, className = '', action }) {
  return (
    <div className={`flex flex-col border-b border-cyan-500/8 ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 flex-shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400/65">{title}</p>
        <div className="flex items-center gap-2">
          {action}
          <button className="text-gray-700 hover:text-gray-400 text-xs leading-none">×</button>
        </div>
      </div>
      <div className="flex-1 px-3 pb-3 min-h-0">{children}</div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function RightPanels() {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col bg-[#06101e] border-l border-cyan-500/10 overflow-hidden">

      {/* 1. Visual Evidence — takes the top 2/3 */}
      <Section title="Görsel ve İşitsel Kanıtlar" className="flex-[2] min-h-0">
        <div className="flex flex-col gap-2 h-full">
          {/* Video — fills available height */}
          <div className="flex-1 min-h-0 rounded overflow-hidden border border-cyan-500/10">
            <VideoPlayer />
          </div>
          {/* Photos side by side */}
          <div className="flex gap-2 h-28 flex-shrink-0">
            {PHOTOS.map(p => <PhotoCard key={p.label} {...p} />)}
          </div>
        </div>
      </Section>

      {/* 2. Connection Analysis — bottom 1/3 */}
      <Section
        title="Bağlantı Analizi"
        className="flex-1 min-h-0"
        action={<span className="text-[9px] text-gray-700">8 düğüm · 8 bağlantı</span>}
      >
        <NetworkGraph />
      </Section>

    </div>
  );
}
