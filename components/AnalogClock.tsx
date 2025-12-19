
import React from 'react';

interface Props {
  time: Date;
}

const AnalogClock: React.FC<Props> = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();
  const date = time.getDate();

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

  // Helper to calculate shadow offset based on hand angle
  const getHandShadow = (deg: number, distance: number) => {
    const rad = (deg - 90) * (Math.PI / 180);
    const x = Math.cos(rad) * distance;
    const y = Math.sin(rad) * distance;
    return `${x}px ${y}px ${distance * 2}px rgba(0,0,0,0.2)`;
  };

  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center select-none group">
      {/* Main Outer Bezel - Polished Neumorphic Rim */}
      <div className="absolute inset-0 rounded-full neu-outset shadow-[12px_12px_24px_var(--shadow-dark),-12px_-12px_24px_var(--shadow-light)]" />
      
      {/* Precision Inner Bezel */}
      <div className="absolute inset-[3.5%] rounded-full border-[1.5px] border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.05)] pointer-events-none" />

      {/* Recessed Dial Face with Sunburst Texture */}
      <div className="absolute inset-[8.5%] rounded-full neu-inset flex items-center justify-center border border-white/5 overflow-hidden">
        
        {/* Sunburst Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_80%)] pointer-events-none" />

        {/* Dial Indices - High Hierarchy */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          {Array.from({ length: 60 }).map((_, i) => {
            const isHour = i % 5 === 0;
            const isQuarter = i % 15 === 0;
            const angle = (i * 6 * Math.PI) / 180;
            
            const r1 = isQuarter ? 41 : isHour ? 43 : 46;
            const r2 = 49;
            
            const x1 = 50 + r1 * Math.cos(angle);
            const y1 = 50 + r1 * Math.sin(angle);
            const x2 = 50 + r2 * Math.cos(angle);
            const y2 = 50 + r2 * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="currentColor"
                className="text-appText transition-colors duration-500"
                strokeOpacity={isQuarter ? 0.6 : isHour ? 0.3 : 0.1}
                strokeWidth={isHour ? 1.8 : 0.8}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Primary Numbers */}
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
                transform: `rotate(${deg}deg) translateY(-70px) rotate(-${deg}deg)`
              }}
            >
              {isQuarter ? (
                <span className="text-appText font-black text-2xl opacity-95 tracking-tighter dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
                  {num}
                </span>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-appText opacity-15" />
              )}
            </div>
          );
        })}

        {/* Refined Complication Window */}
        <div className="absolute bottom-[23%] flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-lg bg-appText/5 border border-white/10 shadow-inner">
                <span className="text-[11px] font-black text-appText/80 tabular-nums uppercase tracking-widest">
                  {hours >= 12 ? 'PM' : 'AM'}
                </span>
                <div className="w-[1.5px] h-3 bg-appText/10 rounded-full" />
                <span className="text-[11px] font-black text-appText/80 tabular-nums">
                  {date.toString().padStart(2, '0')}
                </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10">
                <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
                <span className="text-[8px] font-black text-green-600/60 dark:text-green-400/60 uppercase tracking-tighter">Live</span>
            </div>
        </div>

        {/* Hour Hand - Ridged Design with Dynamic Shadow */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[9px] h-[72px] origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            filter: `drop-shadow(${getHandShadow(hourDeg, 3)})`,
          }} 
        >
          {/* Ridged Body */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-appText to-appText/70 flex overflow-hidden">
            <div className="w-1/2 h-full bg-white/10" />
          </div>
          {/* Lume Segment */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-5 bg-white/20 rounded-full blur-[0.5px] dark:bg-blue-400/30" />
        </div>
        
        {/* Minute Hand - Tapered Lance with Ridge */}
        <div 
          className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[5px] h-[105px] origin-bottom z-10" 
          style={{ 
            transform: `translateX(-50%) rotate(${minDeg}deg)`,
            filter: `drop-shadow(${getHandShadow(minDeg, 4)})`,
          }} 
        >
           {/* Ridged Body */}
           <div className="absolute inset-0 rounded-full bg-gradient-to-r from-appText to-appText/80 flex overflow-hidden">
             <div className="w-1/2 h-full bg-white/10" />
           </div>
           {/* Lume Segment */}
           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-white/20 rounded-full blur-[0.5px] dark:bg-blue-400/30" />
        </div>
        
        {/* Second Hand - Needle style with balanced counterweight */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none" 
          style={{ transform: `rotate(${secDeg}deg)` }}
        >
          {/* Tip Needle */}
          <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[1px] h-[120px] bg-[#ff3b30] rounded-full" />
          {/* Counterbalance Tail */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[3px] h-[35px] bg-appText/60 rounded-full translate-y-3" />
        </div>

        {/* Center Hub Pin Assembly */}
        <div className="w-10 h-10 rounded-full neu-outset z-30 flex items-center justify-center border border-white/10 shadow-xl">
            <div className="w-5 h-5 rounded-full bg-appBg shadow-inner flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#ff3b30] shadow-[0_0_8px_rgba(255,59,48,0.7)]" />
            </div>
        </div>

        {/* Sapphire Crystal Lens Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
        <div className="absolute top-[8%] left-[12%] w-[35%] h-[35%] bg-gradient-to-tr from-white/15 to-transparent blur-2xl rounded-full transform rotate-45 pointer-events-none" />
      </div>

      {/* Circadian Outer Atmosphere Glow */}
      <div className={`absolute -inset-8 rounded-full transition-all duration-[3000ms] pointer-events-none opacity-50 ${
        hours >= 18 || hours < 6 
        ? 'shadow-[inset_0_0_80px_rgba(30,58,138,0.25)]' 
        : 'shadow-[inset_0_0_80px_rgba(251,146,60,0.15)]'
      }`} />
    </div>
  );
};

export default AnalogClock;
