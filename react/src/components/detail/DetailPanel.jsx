import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';

const TYPE_CONFIG = {
  checkin: { label: 'Check-in', color: 'text-blue-400', bg: 'bg-blue-500/8', border: 'border-blue-500/20' },
  message: { label: 'Message', color: 'text-purple-400', bg: 'bg-purple-500/8', border: 'border-purple-500/20' },
  sighting: { label: 'Sighting', color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/20' },
  note: { label: 'Note', color: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
  tip: { label: 'Tip', color: 'text-red-400', bg: 'bg-red-500/8', border: 'border-red-500/20' },
};

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="py-3 border-b border-gray-800/50 last:border-0">
      <p className="text-xs uppercase tracking-wider text-gray-600 mb-1.5">{label}</p>
      <p className="text-sm text-gray-300 leading-relaxed">{value}</p>
    </div>
  );
}

export default function DetailPanel() {
  const { selectedEvent, setSelectedEvent } = useInvestigation();

  if (!selectedEvent) {
    return (
      <div className="w-72 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col items-center justify-center">
        <div className="text-center px-8">
          <div className="w-16 h-16 rounded-full bg-gray-800/60 border border-gray-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl opacity-30">🔍</span>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            Select an event to<br />view details
          </p>
        </div>
      </div>
    );
  }

  const config = TYPE_CONFIG[selectedEvent.type] || TYPE_CONFIG.note;

  const timestamp = selectedEvent.timestamp
    ? new Date(selectedEvent.timestamp).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  return (
    <div className="w-72 flex-shrink-0 bg-gray-900 border-l border-gray-800 flex flex-col animate-fade-in">
      <div className={`px-5 py-4 border-b border-gray-800 flex-shrink-0 ${config.bg}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-gray-600 hover:text-gray-400 transition-colors text-lg w-6 h-6 flex items-center justify-center rounded hover:bg-gray-800"
          >
            ×
          </button>
        </div>
        <h3 className="text-white font-semibold text-sm">{selectedEvent.person}</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-1">
        <Field label="Timestamp" value={timestamp} />
        <Field label="Location" value={selectedEvent.location} />
        <Field label="Details" value={selectedEvent.content} />
        <div className="py-3">
          <p className="text-xs uppercase tracking-wider text-gray-600 mb-1.5">Event ID</p>
          <p className="text-xs text-gray-700 font-mono break-all">{selectedEvent.id}</p>
        </div>
      </div>
    </div>
  );
}
