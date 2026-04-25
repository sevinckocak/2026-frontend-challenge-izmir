import React, { useMemo } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import VideoPlayer from './VideoPlayer';

// ── Seeded chart data (consistent across renders) ──────────────────────────
function seeded(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}
const r1 = seeded(1), r2 = seeded(2), r3 = seeded(3), r4 = seeded(4);

const SIGNAL_DATA  = Array.from({ length: 40 }, (_, i) => 45 + 28 * Math.sin(i * 0.35) + 14 * Math.sin(i * 1.1) + (r1() - 0.5) * 10);
const NETWORK_DATA = Array.from({ length: 40 }, (_, i) => 55 + 20 * Math.sin(i * 0.6 + 1) + (r2() - 0.5) * 18);
const CALL_DATA    = Array.from({ length: 18 }, () => Math.floor(r3() * 14) + 1);
const TRAFFIC_DATA = Array.from({ length: 40 }, (_, i) => 35 + 18 * Math.sin(i * 0.4 + 2) + (r4() - 0.5) * 14);

// ── Mini chart components ───────────────────────────────────────────────────
function LineChart({ data, color }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 36 - ((v - min) / range) * 32 - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,38 ${pts} 100,38`} fill={`url(#g-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function BarChart({ data, color }) {
  const max = Math.max(...data);
  const w = 100 / data.length;
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * 36;
        return <rect key={i} x={i * w + 0.4} y={40 - h} width={w - 0.8} height={h} fill={color} opacity="0.75" />;
      })}
    </svg>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-[#050c18] border border-cyan-500/10 rounded p-2 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold text-cyan-400/60 uppercase tracking-wider truncate">{title}</p>
        <button className="text-gray-700 hover:text-gray-500 text-xs leading-none">⋯</button>
      </div>
      <div className="flex-1 min-h-0 h-16">{children}</div>
      {subtitle && <p className="text-[9px] text-gray-700">{subtitle}</p>}
    </div>
  );
}

// ── Network graph ───────────────────────────────────────────────────────────
const NET_NODES = [
  { id: 'qodo',    x: 145, y: 95,  label: 'Qodo',           sub: 'Kayıp',            color: '#ef4444', r: 13 },
  { id: 'alican',  x: 225, y: 55,  label: 'Alican',         sub: 'Zanlı A',          color: '#f59e0b', r: 10 },
  { id: 'cem',     x: 65,  y: 50,  label: 'Cem',            sub: 'Tanıdık',          color: '#06b6d4', r: 9 },
  { id: 'ela',     x: 230, y: 145, label: 'Ela',            sub: 'Tanıdık',          color: '#8b5cf6', r: 9 },
  { id: 'can',     x: 55,  y: 150, label: 'Can',            sub: 'Şüpheli',          color: '#6b7280', r: 8 },
  { id: 'mert',    x: 160, y: 175, label: 'Mert',           sub: 'Şüpheli',          color: '#6b7280', r: 8 },
  { id: 'assoc1',  x: 145, y: 22,  label: 'Bilinen Tanıdık', sub: '',                color: '#374151', r: 7 },
  { id: 'assoc2',  x: 30,  y: 105, label: 'Bilinen Tanıdık', sub: '',                color: '#374151', r: 7 },
];

const NET_EDGES = [
  { from: 'qodo', to: 'alican',  color: '#ef4444', w: 2.5, dash: '' },
  { from: 'qodo', to: 'cem',     color: '#06b6d4', w: 1.5, dash: '' },
  { from: 'qodo', to: 'ela',     color: '#8b5cf6', w: 1.5, dash: '' },
  { from: 'qodo', to: 'can',     color: '#4b5563', w: 1,   dash: '3,2' },
  { from: 'qodo', to: 'mert',    color: '#4b5563', w: 1,   dash: '3,2' },
  { from: 'alican','to': 'assoc1', color: '#374151', w: 0.8, dash: '2,3' },
  { from: 'cem',  to: 'assoc2',  color: '#374151', w: 0.8, dash: '2,3' },
  { from: 'alican','to': 'ela',   color: '#6b7280', w: 0.8, dash: '2,3' },
];

function nodeById(id) { return NET_NODES.find(n => n.id === id); }

function NetworkGraph() {
  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 280 210" className="w-full h-full">
        {/* Edges */}
        {NET_EDGES.map((e, i) => {
          const a = nodeById(e.from), b = nodeById(e.to);
          if (!a || !b) return null;
          return (
            <line key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={e.color} strokeWidth={e.w}
              strokeDasharray={e.dash} opacity="0.7"
            />
          );
        })}
        {/* Nodes */}
        {NET_NODES.map(n => (
          <g key={n.id}>
            {/* Glow */}
            <circle cx={n.x} cy={n.y} r={n.r + 4} fill={n.color} opacity="0.08" />
            {/* Main circle */}
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity="0.85" />
            {/* Label */}
            <text x={n.x} y={n.y - n.r - 3} textAnchor="middle" fontSize="7" fill="#d1d5db" fontFamily="monospace">
              {n.label}
            </text>
            {n.sub && (
              <text x={n.x} y={n.y + n.r + 9} textAnchor="middle" fontSize="5.5" fill="#6b7280" fontFamily="monospace">
                {n.sub}
              </text>
            )}
          </g>
        ))}
        {/* Qodo pulsing ring */}
        <circle cx={145} cy={95} r={19} fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.4" strokeDasharray="3,3">
          <animateTransform attributeName="transform" type="rotate" from="0 145 95" to="360 145 95" dur="8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

// ── Evidence Panel ──────────────────────────────────────────────────────────
const PHOTO_ITEMS = [
  { icon: '🐱', label: 'Qodo Fotoğrafı' },
  { icon: '🎒', label: 'Son Kişisel Eşya' },
  { icon: '📷', label: 'Gözetim Görüntüsü' },
];

function EvidencePanel() {
  return (
    <div className="flex gap-2 h-full">
      {/* Real video player */}
      <div className="flex-1 min-w-0 rounded overflow-hidden border border-cyan-500/10">
        <VideoPlayer />
      </div>

      {/* Photo grid */}
      <div className="flex flex-col gap-1.5 w-20 flex-shrink-0">
        {PHOTO_ITEMS.map(({ icon, label }) => (
          <div
            key={label}
            className="flex-1 bg-[#040a16] border border-cyan-500/10 hover:border-cyan-500/30 rounded flex flex-col items-center justify-center p-1 cursor-pointer transition-colors"
          >
            <span className="text-lg leading-none mb-0.5">{icon}</span>
            <p className="text-[8px] text-gray-600 text-center leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel section wrapper ────────────────────────────────────────────────────
function Section({ title, children, className = '', action }) {
  return (
    <div className={`flex flex-col border-b border-cyan-500/8 flex-shrink-0 ${className}`}>
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

// ── Root RightPanels ─────────────────────────────────────────────────────────
export default function RightPanels() {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col bg-[#06101e] border-l border-cyan-500/10 overflow-y-auto">
      {/* 1. Digital Forensics */}
      <Section title="Dijital Adli Tıp Kanıtları" className="h-[220px]">
        <div className="grid grid-cols-2 gap-2 h-full">
          <ChartCard title="Sinyal Triangülasyonu" subtitle="Mobile · 14.05.2026">
            <LineChart data={SIGNAL_DATA} color="#06b6d4" />
          </ChartCard>
          <ChartCard title="Network Sinyal Verisi" subtitle="Genel">
            <LineChart data={NETWORK_DATA} color="#22c55e" />
          </ChartCard>
          <ChartCard title="Çağrı Kayıtları" subtitle="18:00 – 20:00">
            <BarChart data={CALL_DATA} color="#8b5cf6" />
          </ChartCard>
          <ChartCard title="Ağ Veri Trafiği" subtitle="Anlık">
            <LineChart data={TRAFFIC_DATA} color="#f59e0b" />
          </ChartCard>
        </div>
      </Section>

      {/* 2. Visual Evidence */}
      <Section title="Görsel ve İşitsel Kanıtlar" className="h-[210px]">
        <EvidencePanel />
      </Section>

      {/* 3. Connection Analysis */}
      <Section
        title="Bağlantı Analizi"
        className="flex-1"
        action={<span className="text-[9px] text-gray-700">8 düğüm · 8 bağlantı</span>}
      >
        <NetworkGraph />
      </Section>
    </div>
  );
}
