
import React from 'react';

interface Props {
  time: Date;
}

const AnalogClock: React.FC<Props> = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Smooth continuous motion for hands
  const milliseconds = time.getMilliseconds();
  const smoothSeconds = seconds + milliseconds / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = (hours % 12) + smoothMinutes / 60;

  const secDeg = smoothSeconds * 6;
  const minDeg = smoothMinutes * 6;
  const hourDeg = smoothHours * 30;

  const quarterNumbers = [3, 6, 9, 12];
  const allIndices = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none group">
      {/* Main Outer Bezel - Neumorphic Outset with softer shadows */}
      <div className="absolute inset-0 rounded-full neu-outset shadow-[15px_15px_30px_#b8bfcc,-15px_-15px_30px_#ffffff]" />
      
      {/* Depth Inner Shadow Ring - Creates the "stepped" look */}
      <div className="absolute inset-[4%] rounded-full shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]" />

      {/* Inner Dial Face - Recessed Neumorphic */}
      <div className="absolute inset-[8%] rounded-full neu-inset flex items-center justify-center border border-white/40 overflow-hidden">
        
        {/* SVG Tick Marks - Refined for precision */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          {Array.from({ length: 60 }).map((_, i) => {
            const isHour = i % 5 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            const r1 = isHour ? 43 : 46;
            const r2 = 49;
            const x1 = 50 + r1 * Math.cos(angle);
            const y1 = 50 + r1 * Math.sin(angle);
            const x2 = 50 + r2 * Math.cos(angle);
            const y2 = 50 + r2 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#31456a"
                strokeOpacity={isHour ? 0.35 : 0.12}
                strokeWidth={isHour ? 1.4 : 0.8}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Indices & Quarter Numbers - Clean Minimalist Look */}
        {allIndices.map(num => {
          const deg = num * 30;
          const isQuarter = quarterNumbers.includes(num);
          return (
            <div
              key={num}
              className="absolute flex items-center justify-center"
              style={{
                width: '32px',
                height: '32px',
                transform: `rotate(${deg}deg) translateY(-74px) rotate(-${deg}deg)`
              }}
            >
              {isQuarter ? (
                <span className="text-[#31456a] font-black text-xl opacity-80 tracking-tighter">{num}</span>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-[#31456a] opacity-20" />
              )}
            </div>
          );
        })}

        {/* Integrated Digital Complication (at 6 o'clock) */}
        <div className="absolute bottom-[24%] flex flex-col items-center">
            <div className="px-2 py-0.5 rounded-md bg-[#31456a]/5 border border-white/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[10px] font-black text-[#31456a]/60 tabular-nums uppercase tracking-widest">
                  {hours >= 12 ? 'PM' : 'AM'}
                </span>
            </div>
            <div className="mt-1 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
                <span className="text-[9px] font-bold text-[#31456a]/40 uppercase tracking-tighter">Live</span>
            </div>
        </div>

        {/* Hour Hand - Soft Gradient & Taper */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-2.5 h-16 bg-gradient-to-t from-[#1a2a44] to-[#31456a] rounded-full origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            boxShadow: '2px 4px 8px rgba(0,0,0,0.2)'
          }} 
        />
        
        {/* Minute Hand - Longer, Thinner, Elegant */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-1.5 h-24 bg-gradient-to-t from-[#31456a]/80 to-[#31456a] rounded-full origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${minDeg}deg)`,
            boxShadow: '1px 2px 6px rgba(0,0,0,0.1)'
          }} 
        />
        
        {/* Second Hand - Needle style with a counterbalance */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{ transform: `rotate(${secDeg}deg)` }}
        >
          {/* Tip */}
          <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 h-28 bg-[#ff3b30] rounded-full" />
          {/* Tail Counterbalance */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-1 h-8 bg-[#ff3b30] rounded-full opacity-40 translate-y-1" />
        </div>

        {/* Center Hub - High Fidelity Pin Assembly */}
        <div className="w-8 h-8 rounded-full neu-outset z-30 flex items-center justify-center shadow-lg border border-white/60">
            <div className="w-4 h-4 rounded-full bg-white shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] shadow-[0_0_5px_rgba(255,59,48,0.5)]" />
            </div>
        </div>

        {/* Sapphire Crystal Reflection Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/5 pointer-events-none" />
        <div className="absolute top-[10%] left-[15%] w-[30%] h-[30%] bg-white/20 blur-xl rounded-full transform rotate-45 pointer-events-none" />
      </div>

      {/* Circadian Shadow Hint - More subtle atmospheric glow */}
      <div className={`absolute -inset-4 rounded-full transition-all duration-[3000ms] pointer-events-none ${
        hours >= 18 || hours < 6 
        ? 'shadow-[inset_0_0_50px_rgba(26,42,68,0.15)]' 
        : 'shadow-[inset_0_0_50px_rgba(255,149,0,0.05)]'
      }`} />
    </div>
  );
};

export default AnalogClock;
