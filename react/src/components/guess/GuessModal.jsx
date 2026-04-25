import { useState, useEffect, useRef } from 'react';

const MSG_FIRST = 'Abi çok iyi tahmin ama inanın ben de bilmiyorum.';
const MSG_REPEAT = 'Abi hepsinde cevabım aynı çok iyi tahmin ama inanın ben de bilmiyorum.';

export default function GuessModal() {
  const [open, setOpen] = useState(false);
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && !submitted) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, submitted]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function handleSubmit() {
    if (!guess.trim()) return;
    setAttemptCount(prev => prev + 1);
    setSubmitted(true);
  }

  function handleTryAgain() {
    setGuess('');
    setSubmitted(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const responseMsg = attemptCount > 1 ? MSG_REPEAT : MSG_FIRST;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1 rounded border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 hover:border-cyan-500/50 text-cyan-400 text-[11px] font-semibold transition-all"
      >
        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M6 6.5c0-1.1.9-1.5 2-1.5s2 .7 2 1.5c0 1.5-2 1.5-2 2.5" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
        </svg>
        Tahmin Et
      </button>

      {!open ? null : (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/65"
            style={{ zIndex: 1000, backdropFilter: 'blur(3px)' }}
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 1001 }}
          >
            <div
              className="w-full max-w-sm rounded-xl border border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden"
              style={{ backgroundColor: '#07101f' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/10 bg-[#05090f]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-400/80">
                    Katil Kim?
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-full bg-gray-800/70 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
                >
                  <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5">
                {!submitted ? (
                  <>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4">
                      Soruşturmayı incelediysen tahminini yaz. Kim yaptı?
                    </p>
                    <textarea
                      ref={inputRef}
                      value={guess}
                      onChange={e => setGuess(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                      placeholder="Tahminini buraya yaz..."
                      rows={3}
                      className="w-full bg-[#0a1428] text-gray-200 text-sm placeholder-gray-700 px-3 py-2.5 rounded-lg border border-cyan-500/15 focus:border-cyan-500/40 focus:outline-none resize-none leading-relaxed"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!guess.trim()}
                      className="mt-3 w-full py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Gönder
                    </button>
                  </>
                ) : (
                  <div className="text-center py-2">
                    {/* Quote icon */}
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor">
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                      </svg>
                    </div>

                    {/* User's guess */}
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Tahminin</p>
                    <p className="text-white text-sm font-semibold mb-5 px-2">{guess}</p>

                    {/* Response */}
                    <div className="bg-[#0a1428] rounded-lg border border-cyan-500/10 px-4 py-3 mb-5">
                      <p className="text-cyan-200 text-sm leading-relaxed">{responseMsg}</p>
                    </div>

                    <button
                      onClick={handleTryAgain}
                      className="text-[11px] text-gray-600 hover:text-gray-400 underline underline-offset-2 transition-colors"
                    >
                      Başka tahmin dene
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
