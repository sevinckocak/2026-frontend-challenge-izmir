import { useState, useEffect } from 'react';

const PINNED = [
  { icon: '🌐', title: 'Tarayıcı' },
  { icon: '📁', title: 'Dosyalar' },
  { icon: '⚙️', title: 'Ayarlar' },
  { icon: '💻', title: 'Terminal' },
  { icon: '📊', title: 'Analiz' },
  { icon: '💬', title: 'İletişim' },
];

export default function Taskbar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="h-10 bg-[#08080f]/97 border-t border-gray-700/20 flex items-center px-2 gap-1.5 flex-shrink-0">
      {/* Start */}
      <button className="w-8 h-7 bg-[#1a1a2e] hover:bg-[#252545] rounded flex items-center justify-center transition-colors border border-[#2a2a4a] text-sm">
        ⊞
      </button>

      {/* Search bar */}
      <div className="flex items-center gap-1.5 bg-[#111] rounded px-2.5 py-1 border border-gray-700/30 w-32">
        <svg className="w-3 h-3 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="M16.5 16.5 22 22" />
        </svg>
        <span className="text-gray-600 text-xs">Ara</span>
      </div>

      <div className="w-px h-5 bg-gray-700/30" />

      {/* Pinned apps */}
      {PINNED.map((app, i) => (
        <button
          key={i}
          title={app.title}
          className="w-8 h-7 hover:bg-gray-700/25 rounded flex items-center justify-center text-sm transition-colors"
        >
          {app.icon}
        </button>
      ))}

      {/* Active window indicator */}
      <div className="flex items-center gap-1.5 bg-gray-800/40 rounded px-2 py-1 border border-gray-700/20">
        <span className="text-xs">🔍</span>
        <span className="text-xs text-gray-400">Qodo Soruşturması</span>
        <div className="w-1 h-1 rounded-full bg-cyan-400" />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Weather */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>☀️</span>
          <span>17°C Güneşli</span>
        </div>

        <div className="w-px h-4 bg-gray-700/30" />

        {/* System tray icons */}
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-xs" title="Ses">🔊</span>
          <span className="text-xs" title="Ağ">📡</span>
          <span className="text-xs" title="Bildirimler">🔔</span>
        </div>

        {/* Clock */}
        <div className="text-right min-w-[56px]">
          <p className="text-xs text-white font-mono leading-none">{timeStr}</p>
          <p className="text-[10px] text-gray-600 font-mono leading-none mt-0.5">{dateStr}</p>
        </div>
      </div>
    </div>
  );
}
