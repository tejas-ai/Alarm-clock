
import React, { useState, useEffect } from 'react';
import { Lap } from '../types';

const StopwatchView: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => setTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleStartStop = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    if (time > 0) {
      setLaps(prev => [{ id: prev.length + 1, time: formatTime(time) }, ...prev]);
    }
    setTime(0);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Circular Display */}
      <div className="w-64 h-64 rounded-full neu-outset flex items-center justify-center relative mb-12">
        {/* Ring markers */}
        <div className="absolute inset-4 rounded-full border-[6px] border-[#31456a]/5" />
        <div className="w-56 h-56 rounded-full neu-inset flex items-center justify-center">
            <span className="text-3xl font-black text-[#31456a] tabular-nums">
                {formatTime(time)}
            </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex justify-between gap-6 mb-12">
        <button 
            onClick={handleStartStop}
            className="flex-1 py-4 rounded-xl neu-outset text-sm font-black text-[#31456a] active:neu-pressed neu-button transition-all"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
            onClick={handleReset}
            className="flex-1 py-4 rounded-xl neu-outset text-sm font-black text-red-500 active:neu-pressed neu-button transition-all"
        >
          Reset
        </button>
      </div>

      {/* Lap List */}
      <div className="w-full space-y-4">
        {laps.map(lap => (
          <div key={lap.id} className="w-full h-14 rounded-xl neu-outset flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#31456a]">{lap.id}</span>
                <span className="text-xs font-bold text-[#31456a]/40 uppercase tracking-tight">Lap</span>
            </div>
            <span className="text-sm font-black text-[#31456a] tabular-nums">{lap.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StopwatchView;
