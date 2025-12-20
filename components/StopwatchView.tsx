import React, { useState, useEffect, useRef } from 'react';
import { Lap } from '../types';

const StopwatchView: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const lastTimeRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  const animate = (now: number) => {
    if (lastTimeRef.current !== undefined) {
      const delta = now - lastTimeRef.current;
      setTime(prev => prev + delta);
    }
    lastTimeRef.current = now;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return { m: minutes, s: seconds, c: centiseconds };
  };

  const handleStartStop = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning && time === 0) return;
    const { m, s, c } = formatTime(time);
    const lapTime = `${m}:${s}.${c}`;
    setLaps(prev => [{ id: prev.length + 1, time: lapTime }, ...prev]);
  };

  const { m, s, c } = formatTime(time);
  
  // Calculate rotation for the millisecond hand (0-1000ms = 360deg)
  const msRotation = (time % 1000) * 0.36;
  // Calculate rotation for seconds (0-60s = 360deg)
  const sRotation = (time % 60000) * 0.006;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-in fade-in duration-700">
      
      {/* Central Chronograph Dial */}
      <div className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full neu-outset flex items-center justify-center mb-12 transition-all duration-700 ${isRunning ? 'shadow-[0_0_50px_rgba(49,69,106,0.15)] scale-[1.02]' : 'scale-100'}`}>
        
        {/* Background Dial Markings */}
        <div className="absolute inset-0 rounded-full opacity-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute top-1/2 left-1/2 w-0.5 h-3 bg-appText origin-bottom -translate-x-1/2"
              style={{ transform: `rotate(${i * 30}deg) translateY(-130px)` }}
            />
          ))}
        </div>

        {/* Outer Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            className="text-appMuted/10"
          />
          {isRunning && (
            <circle 
              cx="50" cy="50" r="46" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeDasharray="289"
              strokeDashoffset={289 - (msRotation / 360) * 289}
              strokeLinecap="round"
              className="text-appText/20 transition-all duration-[16ms] linear"
            />
          )}
        </svg>

        {/* Inner Recessed Face */}
        <div className="w-[85%] h-[85%] rounded-full neu-inset flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Animated "Pulse" Background when running */}
          {isRunning && (
            <div className="absolute inset-0 bg-appText/[0.02] animate-pulse pointer-events-none" />
          )}

          {/* Chronograph Needle (Seconds) */}
          <div 
            className="absolute top-1/2 left-1/2 w-[2px] h-[45%] bg-appText/10 origin-bottom -translate-x-1/2 z-0 rounded-full transition-transform duration-[16ms] linear"
            style={{ transform: `translateX(-50%) rotate(${sRotation}deg) translateY(-100%)` }}
          />

          {/* Time Display */}
          <div className="z-10 flex flex-col items-center">
            <div className="flex items-baseline gap-1 select-none">
              <span className="text-5xl font-black text-appText tabular-nums tracking-tighter">{m}</span>
              <span className="text-3xl font-black text-appText/20 mb-1">:</span>
              <span className="text-5xl font-black text-appText tabular-nums tracking-tighter">{s}</span>
              <span className="text-2xl font-black text-appMuted/40 ml-1 tabular-nums w-[1.5ch] text-left">{c}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse' : 'bg-appMuted/20'}`} />
              <span className="text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">
                {isRunning ? 'Chrono Active' : 'Chrono Standby'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Suite */}
      <div className="w-full flex justify-between gap-4 mb-10 px-2">
        <button 
          onClick={handleReset}
          className="flex-1 h-16 rounded-[24px] neu-outset flex items-center justify-center group active:neu-pressed transition-all"
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-red-500/70 group-hover:text-red-500 transition-colors">Reset</span>
        </button>
        
        <button 
          onClick={handleLap}
          disabled={!isRunning && time === 0}
          className={`flex-1 h-16 rounded-[24px] neu-outset flex items-center justify-center group active:neu-pressed transition-all ${(!isRunning && time === 0) ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <span className="text-[11px] font-black uppercase tracking-widest text-appText/70 group-hover:text-appText transition-colors">Lap</span>
        </button>

        <button 
          onClick={handleStartStop}
          className={`flex-[1.5] h-16 rounded-[24px] neu-outset flex items-center justify-center relative overflow-hidden transition-all active:neu-pressed ${isRunning ? 'text-orange-500' : 'text-appText'}`}
        >
          {isRunning && (
             <div className="absolute inset-0 bg-appText/[0.03] animate-shimmer" />
          )}
          <span className="relative text-[11px] font-black uppercase tracking-[0.2em]">{isRunning ? 'Stop' : 'Start'}</span>
        </button>
      </div>

      {/* Lap List View */}
      <div className="w-full space-y-3 px-2 max-h-64 overflow-y-auto custom-scrollbar pb-6">
        {laps.length === 0 ? (
          <div className="w-full py-12 rounded-[32px] border border-dashed border-appText/5 flex flex-col items-center justify-center opacity-30">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest">No Laps Recorded</span>
          </div>
        ) : (
          laps.map((lap, index) => (
            <div 
              key={`${lap.id}-${index}`} 
              className="w-full h-16 rounded-[24px] neu-outset flex items-center justify-between px-8 animate-in slide-in-from-top-4 duration-500 ease-out"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl neu-inset flex items-center justify-center">
                  <span className="text-[10px] font-black text-appText/40 tabular-nums">#{laps.length - index}</span>
                </div>
                <span className="text-[10px] font-black text-appMuted uppercase tracking-widest">Lap Segment</span>
              </div>
              <span className="text-sm font-black text-appText tabular-nums tracking-tight">{lap.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StopwatchView;