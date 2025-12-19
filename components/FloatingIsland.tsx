
import React, { useState } from 'react';

const FloatingIsland: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[60]">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`glass rounded-full transition-all duration-500 ease-in-out flex items-center justify-center overflow-hidden cursor-pointer shadow-xl ${
          isExpanded ? 'w-[85vw] max-w-[340px] h-[56px] md:h-[64px] px-4' : 'w-[120px] md:w-[140px] h-[40px] md:h-[48px]'
        }`}
      >
        {!isExpanded ? (
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#CCFF00] uppercase">Quick Set</span>
        ) : (
          <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-top-2 duration-300">
             <button className="text-[9px] md:text-[10px] font-bold uppercase text-white/50 hover:text-white px-2 md:px-3 py-1.5 hover:bg-white/10 rounded-full transition-all whitespace-nowrap">15m Nap</button>
             <div className="w-px h-3 bg-white/10" />
             <button className="text-[9px] md:text-[10px] font-bold uppercase text-white/50 hover:text-white px-2 md:px-3 py-1.5 hover:bg-white/10 rounded-full transition-all whitespace-nowrap">30m Deep</button>
             <div className="w-px h-3 bg-white/10" />
             <button className="text-[9px] md:text-[10px] font-bold uppercase text-[#CCFF00] px-2 md:px-3 py-1.5 hover:bg-[#CCFF00]/10 rounded-full transition-all whitespace-nowrap">Custom</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingIsland;
