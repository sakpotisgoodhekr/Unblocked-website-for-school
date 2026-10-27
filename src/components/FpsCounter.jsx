import React, { useState, useEffect, useRef } from 'react';
import { Activity, Gauge } from 'lucide-react';

export const FpsCounter = ({ darkMode = true, themeAccent = '#10b981' }) => {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.6);
  const [isExpanded, setIsExpanded] = useState(false);

  const frameTimesRef = useRef([]);
  const lastTimeRef = useRef(performance.now());
  const lastUpdateRef = useRef(performance.now());

  useEffect(() => {
    let animId;

    const measureFrame = (now) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0 && delta < 500) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 40) {
          frameTimesRef.current.shift();
        }
      }

      // Update displayed FPS roughly every 180ms to keep it smooth and human-readable
      if (now - lastUpdateRef.current >= 180 && frameTimesRef.current.length > 0) {
        lastUpdateRef.current = now;
        const avgDelta =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const currentFps = Math.min(144, Math.round(1000 / avgDelta));
        setFps(currentFps);
        setFrameTime(Math.round(avgDelta * 10) / 10);
      }

      animId = requestAnimationFrame(measureFrame);
    };

    animId = requestAnimationFrame(measureFrame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Determine health color badge
  const getStatusColor = () => {
    if (fps >= 55) return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    if (fps >= 35) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' };
    return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/30' };
  };

  const status = getStatusColor();

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className={`fixed top-3 right-4 z-[9999] select-none cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold transition-all duration-200 backdrop-blur-md shadow-lg border ${
        darkMode
          ? 'bg-slate-900/85 text-slate-200 border-white/10 hover:border-white/20'
          : 'bg-white/90 text-slate-800 border-slate-300/80 shadow-slate-400/20 hover:border-slate-400'
      }`}
      title="Real-Time FPS Monitor (Iframe & Renderer)"
      role="status"
      aria-label={`${fps} Frames Per Second`}
    >
      {/* Live pulse dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.bg}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status.bg}`} />
      </span>

      {/* Main FPS Readout */}
      <div className="flex items-baseline gap-0.5">
        <span className={`font-black ${status.text}`}>{fps}</span>
        <span className="text-[10px] text-slate-400 tracking-tight">FPS</span>
      </div>

      {/* Expanded Frametime and diagnostics on click */}
      {isExpanded && (
        <span className="text-[10px] pl-1 border-l border-white/10 text-slate-400 font-normal">
          {frameTime}ms
        </span>
      )}
    </div>
  );
};
