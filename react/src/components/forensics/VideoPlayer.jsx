import { useRef, useState, useCallback, useEffect } from 'react';
import qodoVideo from '../../assets/Qodo.mp4';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const [playing, setPlaying]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [muted, setMuted]             = useState(false);
  const [hovered, setHovered]         = useState(false);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else          { v.pause(); setPlaying(false); }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration || 0);
  }, []);

  const handleEnded = useCallback(() => setPlaying(false), []);

  const handleSeek = useCallback((e) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else v.requestFullscreen?.();
  }, []);

  return (
    <div
      className="relative bg-black rounded overflow-hidden w-full h-full group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={qodoVideo}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
        playsInline
      />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.10) 2px, rgba(0,0,0,0.10) 4px)',
        }}
      />

      {/* Top-left: recording badge */}
      <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] text-red-400 font-mono uppercase tracking-wider">Kayıt</span>
      </div>

      {/* Top-right: label */}
      <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded pointer-events-none">
        <span className="text-[8px] text-cyan-400/70 font-mono uppercase tracking-wider">
          Kaçırılma Anı
        </span>
      </div>

      {/* Center play/pause button — shown when paused or hovered */}
      <button
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
          !playing || hovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div className="w-9 h-9 rounded-full bg-black/50 border border-white/25 flex items-center justify-center backdrop-blur-sm hover:bg-black/70 transition-colors">
          {playing ? (
            /* Pause icon */
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="white">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            /* Play icon */
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="white">
              <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
            </svg>
          )}
        </div>
      </button>

      {/* Bottom controls — always visible */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 px-2 pb-1.5">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="relative h-1 bg-white/15 rounded-full cursor-pointer mb-1.5 group/seek"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-red-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm opacity-0 group-hover/seek:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white/75 hover:text-white transition-colors flex-shrink-0"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                <rect x="2.5" y="2" width="3.5" height="12" rx="1" />
                <rect x="10" y="2" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor">
                <path d="M3 2l11 6-11 6V2z" />
              </svg>
            )}
          </button>

          {/* Time */}
          <span className="text-[9px] text-white/50 font-mono tabular-nums flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            {muted ? (
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M2 5.5h3l4-3v11l-4-3H2V5.5z" fill="currentColor" stroke="none" opacity="0.5" />
                <line x1="11" y1="5" x2="15" y2="11" />
                <line x1="15" y1="5" x2="11" y2="11" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M2 5.5h3l4-3v11l-4-3H2V5.5z" fill="currentColor" stroke="none" />
                <path d="M11 4a5 5 0 0 1 0 8" />
              </svg>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M1 1h4M1 1v4M15 1h-4M15 1v4M1 15h4M1 15v-4M15 15h-4M15 15v-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
