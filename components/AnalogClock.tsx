
import React from 'react';

interface Props {
  time: Date;
}

const AnalogClock: React.FC<Props> = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees for each hand
  const secDeg = (seconds / 60) * 360;
  const minDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  // Generate all 12 numbers for the clock face
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="w-72 h-72 rounded-full neu-outset relative flex items-center justify-center group select-none">
      {/* Outer markings - Ticks for every minute */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div 
          key={i} 
          className={`absolute w-0.5 rounded-full ${i % 5 === 0 ? 'h-3.5 bg-[#31456a]/40' : 'h-1.5 bg-[#31456a]/10'}`} 
          style={{ transform: `rotate(${i * 6}deg) translateY(-112px)` }} 
        />
      ))}

      {/* Clock Face Numbers - Improved visibility and positioning */}
      {numbers.map(num => {
        const deg = num * 30;
        // Highlight 12, 3, 6, 9 as requested in visual cues
        const isMajor = num % 3 === 0;
        return (
          <div
            key={num}
            className={`absolute flex items-center justify-center text-[#31456a] font-black transition-all ${
              isMajor ? 'text-lg opacity-90' : 'text-xs opacity-40'
            }`}
            style={{
              width: '32px',
              height: '32px',
              transform: `rotate(${deg}deg) translateY(-88px) rotate(-${deg}deg)`
            }}
          >
            {num}
          </div>
        );
      })}

      {/* Inner Inset Face - Provides the "depth" */}
      <div className="w-52 h-52 rounded-full neu-inset relative flex items-center justify-center overflow-visible">
        
        {/* Hour Hand - Short, chunky, dark */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-2.5 h-14 bg-[#1a2a44] rounded-full origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            boxShadow: '1px 3px 6px rgba(0,0,0,0.2)'
          }} 
        />
        
        {/* Minute Hand - Longer, medium thickness, grey-blue */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1.5 h-20 bg-[#31456a]/80 rounded-full origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${minDeg}deg)`,
            boxShadow: '1px 2px 4px rgba(0,0,0,0.1)'
          }} 
        />
        
        {/* Second Hand - Thin, vibrant red needle */}
        <div 
          className="absolute bottom-[40%] left-1/2 -translate-x-1/2 w-0.5 h-26 bg-[#ff3b30] rounded-full origin-[center_84.6%] z-20" 
          style={{ 
            transform: `translateX(-50%) rotate(${secDeg}deg)`,
            transition: seconds === 0 ? 'none' : 'transform 0.2s cubic-bezier(0.4, 2.5, 0.6, 1)'
          }} 
        />

        {/* Center Hub - High fidelity pin cap */}
        <div className="w-6 h-6 rounded-full neu-outset z-30 shadow-md border border-white/80 flex items-center justify-center">
            <div className="w-3.5 h-3.5 rounded-full bg-white shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#31456a]/20" />
            </div>
        </div>
        
        {/* Subtle Decorative Inner Ring */}
        <div className="absolute w-[94%] h-[94%] rounded-full border border-white/5 z-0 pointer-events-none" />
      </div>
    </div>
  );
};

export default AnalogClock;
