
import React from 'react';

interface ClockProps {
  time: Date;
  expanded: boolean;
}

const Clock: React.FC<ClockProps> = ({ time, expanded }) => {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const dateString = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ${expanded ? 'scale-105 md:scale-110' : 'scale-100'}`}>
      <div className="relative group">
        <div className="text-[80px] sm:text-[100px] md:text-[160px] font-black tracking-tighter text-white leading-none animate-glow flex items-center select-none">
          <span>{hours}</span>
          <span className="opacity-30 mx-1 md:mx-2">:</span>
          <span>{minutes}</span>
        </div>
        
        {expanded && (
           <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 text-xl md:text-3xl font-light text-[#CCFF00]/80 animate-in fade-in zoom-in duration-500">
             {seconds}s
           </div>
        )}
      </div>
      
      <div className={`mt-4 md:mt-8 text-sm md:text-xl font-medium tracking-[0.2em] md:tracking-widest uppercase transition-all duration-700 ${expanded ? 'opacity-100 translate-y-2 md:translate-y-4' : 'opacity-40 translate-y-0'}`}>
        {dateString}
      </div>
    </div>
  );
};

export default Clock;
