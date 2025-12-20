import React, { useState, useEffect } from 'react';

interface Props {
  time: Date;
  timeFormat?: '12h' | '24h';
}

const DigitalClock: React.FC<Props> = ({ time, timeFormat = '12h' }) => {
  const [prevTime, setPrevTime] = useState({ h: '', m: '' });
  const [animateH, setAnimateH] = useState(false);
  const [animateM, setAnimateM] = useState(false);

  const hoursRaw = time.getHours();
  const is12h = timeFormat === '12h';
  
  const displayHoursRaw = is12h ? (hoursRaw % 12 || 12) : hoursRaw;
  const currentHours = displayHoursRaw.toString().padStart(2, '0');
  const currentMinutes = time.getMinutes().toString().padStart(2, '0');
  const period = hoursRaw >= 12 ? 'PM' : 'AM';
  
  const day = time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const month = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dateNum = time.getDate();
  const dateString = `${day}, ${month} ${dateNum}`;

  useEffect(() => {
    if (currentHours !== prevTime.h) {
      setAnimateH(true);
      const timer = setTimeout(() => setAnimateH(false), 400);
      setPrevTime(p => ({ ...p, h: currentHours }));
      return () => clearTimeout(timer);
    }
  }, [currentHours]);

  useEffect(() => {
    if (currentMinutes !== prevTime.m) {
      setAnimateM(true);
      const timer = setTimeout(() => setAnimateM(false), 400);
      setPrevTime(p => ({ ...p, m: currentMinutes }));
      return () => clearTimeout(timer);
    }
  }, [currentMinutes]);

  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-16 animate-in fade-in duration-1000 w-full overflow-hidden group">
      
      {/* 
          Ambient Lighting Layers Removed for a cleaner look. 
          Retaining the typographic focus and depth anchor.
      */}

      <div className="relative flex flex-col items-center justify-center w-full z-10">
        
        {/* Systematic Typographic Block */}
        <div className="relative flex items-center select-none font-serif-clock text-appText">
          <div className="text-[120px] sm:text-[140px] md:text-[200px] font-bold leading-none tracking-tighter flex items-center justify-center">
            
            {/* Hours with change animation */}
            <span className={`inline-block transition-all duration-500 transform ${animateH ? 'scale-105 opacity-40 blur-[4px]' : 'scale-100 opacity-100 blur-0'}`}>
              {currentHours}
            </span>
            
            {/* Minimalist Colon - High Visibility Precision Dots */}
            <div className="flex flex-col gap-2.5 md:gap-4 mx-2 md:mx-4 opacity-20">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-current shadow-sm animate-pulse" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-current shadow-sm animate-pulse" />
            </div>
            
            {/* Minutes with change animation */}
            <span className={`inline-block transition-all duration-500 transform ${animateM ? 'scale-105 opacity-40 blur-[4px]' : 'scale-100 opacity-100 blur-0'}`}>
              {currentMinutes}
            </span>

            {/* Vertically Aligned Period Indicator */}
            {is12h && (
              <div className="ml-3 md:ml-4 self-center translate-y-3 md:translate-y-5">
                <span className="text-[18px] sm:text-[22px] md:text-[36px] font-black uppercase tracking-tight text-appText opacity-40">
                  {period}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Systematic Date Arrangement */}
        <div className="mt-8 md:mt-12 flex flex-col items-center relative">
          <span className="text-[12px] md:text-[14px] font-black text-appMuted uppercase tracking-[1em] opacity-90 text-center select-none">
            {dateString}
          </span>
        </div>
      </div>
      
      {/* Subtle depth anchor */}
      <div className="relative mt-12 w-[35%] h-[1.5px] overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-appText to-transparent" />
      </div>
    </div>
  );
};

export default DigitalClock;