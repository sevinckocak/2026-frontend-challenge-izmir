import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="max-w-md w-full text-center px-6">
        <div className="inline-block border border-red-500/50 px-5 py-1 mb-10 -rotate-1">
          <span className="text-red-400/80 text-xs font-bold uppercase tracking-[0.4em]">
            Classified
          </span>
        </div>

        <p className="text-gray-600 text-xs uppercase tracking-[0.3em] mb-3">
          Investigation File
        </p>
        <h1 className="text-6xl font-black text-white mb-2 tracking-tight">Qodo</h1>
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-10">
          Missing Person · Status: Open
        </p>

        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Subject has been reported missing. Intelligence gathered from 5 independent
          sources has been compiled into a unified investigation timeline.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: 'Data Sources', value: '5' },
            { label: 'Priority', value: 'HIGH' },
            { label: 'Status', value: 'OPEN' },
          ].map(s => (
            <div
              key={s.label}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="text-amber-400 font-bold text-xl mb-1">{s.value}</div>
              <div className="text-gray-600 text-xs uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-bold px-10 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/20 uppercase tracking-wider text-sm w-full"
        >
          Open Investigation →
        </button>

        <p className="text-gray-700 text-xs mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
