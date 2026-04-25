import React, { useMemo } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const PODO = new Set(['podo', 'qodo']);
const CONF_LEVELS = { high: 3, medium: 2, low: 1 };

function getStatusConfig(conf) {
  if (conf === 'high')   return { label: 'Aranıyor',             color: 'text-red-400',    bg: 'bg-red-500/10',    dot: 'bg-red-500',    border: 'border-l-red-500' };
  if (conf === 'medium') return { label: 'Konumu Tespit Edildi', color: 'text-amber-400',  bg: 'bg-amber-500/10',  dot: 'bg-amber-500',  border: 'border-l-amber-500' };
  return                        { label: 'İlgili Kişi',          color: 'text-gray-500',   bg: 'bg-gray-500/5',    dot: 'bg-gray-600',   border: 'border-l-gray-700' };
}

function useTopSuspects(limit = 6) {
  const { events } = useInvestigation();

  return useMemo(() => {
    const confMap = {};
    const countMap = {};

    events.filter(e => e.type === 'tip').forEach(e => {
      const m = e.content?.match(/confidence:\s*(\w+)/i);
      const level = m?.[1]?.toLowerCase() || 'low';
      const p = e.person;
      if (!confMap[p] || CONF_LEVELS[level] > CONF_LEVELS[confMap[p]]) confMap[p] = level;
    });

    events.forEach(e => {
      const name = e.person?.trim();
      if (!name || name === 'Unknown' || PODO.has(name.toLowerCase())) return;
      countMap[name] = (countMap[name] || 0) + 1;
    });

    return Object.keys(countMap)
      .map(name => ({
        name,
        confidence: confMap[name] || 'low',
        level: CONF_LEVELS[confMap[name] || 'low'],
        count: countMap[name],
      }))
      .sort((a, b) => b.level - a.level || b.count - a.count)
      .slice(0, limit);
  }, [events]);
}

function SuspectCard({ suspect, index }) {
  const { openDrawer } = useInvestigation();
  const s = getStatusConfig(suspect.confidence);
  const initial = suspect.name.charAt(0).toUpperCase();

  return (
    <div
      onClick={() => openDrawer(suspect)}
      className={`border-b border-cyan-500/8 p-3 hover:bg-cyan-500/4 cursor-pointer transition-colors border-l-2 ${s.border}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start gap-2.5">
        <div className={`w-9 h-9 rounded ${s.bg} border border-current/10 flex items-center justify-center flex-shrink-0`}>
          <span className={`text-sm font-bold ${s.color}`}>{initial}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-white text-xs font-semibold truncate leading-none">{suspect.name}</span>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
          </div>
          <p className={`text-[10px] font-medium leading-none ${s.color}`}>{s.label}</p>
          <p className="text-[10px] text-gray-700 mt-0.5">{suspect.count} kayıt</p>
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          <button className="w-5 h-5 bg-gray-800/60 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-colors" title="Dosya">
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-gray-600 hover:text-cyan-400">
              <rect x="2" y="1" width="10" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="5" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1" />
              <line x1="5" y1="8" x2="9" y2="8" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button className="w-5 h-5 bg-gray-800/60 hover:bg-cyan-500/20 rounded flex items-center justify-center transition-colors" title="Analiz">
            <svg viewBox="0 0 16 16" className="w-3 h-3 text-gray-600">
              <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <line x1="11.5" y1="11.5" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const MemoSuspectCard = React.memo(SuspectCard);

function FaceAnalysis() {
  return (
    <div className="h-24 bg-[#040912] rounded border border-cyan-500/10 overflow-hidden relative">
      <svg viewBox="0 0 110 65" className="w-full h-full">
        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1="20" y1={10 + i * 9} x2="90" y2={10 + i * 9} stroke="#06b6d4" strokeWidth="0.2" opacity="0.3" />
        ))}
        {/* Face outline */}
        <ellipse cx="55" cy="33" rx="22" ry="26" fill="none" stroke="#06b6d4" strokeWidth="0.6" opacity="0.25" />
        {/* Targeting corners */}
        <path d="M33,7 L38,7 M33,7 L33,12" stroke="#06b6d4" strokeWidth="0.8" />
        <path d="M77,7 L72,7 M77,7 L77,12" stroke="#06b6d4" strokeWidth="0.8" />
        <path d="M33,58 L38,58 M33,58 L33,53" stroke="#06b6d4" strokeWidth="0.8" />
        <path d="M77,58 L72,58 M77,58 L77,53" stroke="#06b6d4" strokeWidth="0.8" />
        {/* Feature markers */}
        <circle cx="46" cy="26" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" />
        <circle cx="64" cy="26" r="2" fill="none" stroke="#06b6d4" strokeWidth="0.6" opacity="0.5" />
        <circle cx="55" cy="37" r="1.5" fill="#06b6d4" opacity="0.3" />
        {/* Analysis bars */}
        <rect x="3" y="10" width="22" height="2.5" rx="1" fill="#06b6d4" opacity="0.12" />
        <rect x="3" y="10" width="17" height="2.5" rx="1" fill="#06b6d4" opacity="0.5" />
        <rect x="3" y="16" width="22" height="2.5" rx="1" fill="#06b6d4" opacity="0.12" />
        <rect x="3" y="16" width="13" height="2.5" rx="1" fill="#06b6d4" opacity="0.4" />
        <rect x="3" y="22" width="22" height="2.5" rx="1" fill="#06b6d4" opacity="0.12" />
        <rect x="3" y="22" width="19" height="2.5" rx="1" fill="#ef4444" opacity="0.5" />
        <rect x="3" y="28" width="22" height="2.5" rx="1" fill="#06b6d4" opacity="0.12" />
        <rect x="3" y="28" width="10" height="2.5" rx="1" fill="#f59e0b" opacity="0.5" />
        {/* Match % */}
        <text x="96" y="33" fontSize="8" fill="#06b6d4" textAnchor="middle" fontFamily="monospace">87%</text>
        <text x="96" y="42" fontSize="4.5" fill="#374151" textAnchor="middle" fontFamily="monospace">EŞLEŞME</text>
        {/* Scan line */}
        <line x1="33" y1="33" x2="77" y2="33" stroke="#06b6d4" strokeWidth="0.3" strokeDasharray="2,2" opacity="0.4" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/3 to-transparent animate-pulse pointer-events-none" />
    </div>
  );
}

export default function SuspectPanel() {
  const suspects = useTopSuspects();
  const { loading } = useInvestigation();

  return (
    <div className="w-56 flex-shrink-0 flex flex-col bg-[#07101f] border-r border-cyan-500/10 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-cyan-500/10 flex-shrink-0 bg-[#05090f]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/70">
          ŞÜPHELİLER VE İLGİLİ KİŞİLER
        </p>
        <p className="text-[10px] text-gray-700 mt-0.5">{suspects.length} birey</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <span className="text-gray-700 text-xs">Yükleniyor...</span>
          </div>
        ) : (
          suspects.map((s, i) => <MemoSuspectCard key={s.name} suspect={s} index={i} />)
        )}
      </div>

      <div className="border-t border-cyan-500/10 p-3 flex-shrink-0 bg-[#05090f]">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Yüz Analizi</p>
        <FaceAnalysis />
      </div>
    </div>
  );
}
