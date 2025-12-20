import React, { useState, useEffect, useRef } from 'react';

interface Props {
  time: Date;
}

const AnalogClock: React.FC<Props> = ({ time: propTime }) => {
  const [displayTime, setDisplayTime] = useState(new Date());
  const requestRef = useRef<number>(null);

  // High-precision animation loop for a smooth sweep second hand
  const animate = () => {
    setDisplayTime(new Date());
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const seconds = displayTime.getSeconds();
  const minutes = displayTime.getMinutes();
  const hours = displayTime.getHours();
  const ms = displayTime.getMilliseconds();

  // Calculate angles with sub-second precision
  const smoothSeconds = seconds + ms / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = (hours % 12) + smoothMinutes / 60;

  const secDeg = smoothSeconds * 6;
  const minDeg = smoothMinutes * 6;
  const hourDeg = smoothHours * 30;

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center select-none animate-in zoom-in fade-in duration-1000">
      
      {/* Outer Circle (Main Face) */}
      <div className="absolute inset-0 rounded-full neu-outset flex items-center justify-center">
        
        {/* Simplified Hour Ticks (12, 3, 6, 9) */}
        {[0, 90, 180, 270].map(deg => (
          <div
            key={deg}
            className="absolute top-0 left-1/2 w-0.5 h-full -translate-x-1/2 pointer-events-none"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-appText/20 rounded-full" />
          </div>
        ))}

        {/* Inner Raised Disk (Neomorphic Layer) */}
        <div className="w-[45%] h-[45%] rounded-full neu-outset bg-appBg/50 backdrop-blur-sm z-10" />

        {/* --- Hands Assembly --- */}

        {/* Hour Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-1 h-16 sm:h-20 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
          style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
        >
          <div className="absolute bottom-0 left-0 w-full h-full bg-appText rounded-full opacity-90" />
        </div>

        {/* Minute Hand */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-1 h-24 sm:h-32 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
          style={{ transform: `translateX(-50%) rotate(${minDeg}deg)` }}
        >
          <div className="absolute bottom-0 left-0 w-full h-full bg-appText rounded-full opacity-90" />
        </div>

        {/* Second Hand (Red, per image) */}
        <div 
          className="absolute bottom-1/2 left-1/2 w-0.5 h-28 sm:h-36 origin-bottom transition-none z-30"
          style={{ transform: `translateX(-50%) rotate(${secDeg}deg)` }}
        >
          <div className="absolute bottom-[-10%] left-0 w-full h-[110%] bg-red-500 rounded-full shadow-sm" />
        </div>

        {/* Center Pivot Point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-appText z-40 shadow-sm" />
      </div>
    </div>
  );
};

export default AnalogClock;