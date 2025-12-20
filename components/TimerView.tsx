import React, { useState, useEffect, useRef } from 'react';
import { sounds as sfx } from '../services/sounds';

const PRESETS = [1, 5, 10, 15, 30, 60];

const DEFAULT_SOUNDS = [
  { name: 'Classic Bell' },
  { name: 'Zen Garden' },
  { name: 'Summer Rain' },
  { name: 'Digital Pulse' },
];

const TimerView: React.FC<{ uiSoundsEnabled: boolean }> = ({ uiSoundsEnabled }) => {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [totalTime, setTotalTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [isAdjusting, setIsAdjusting] = useState(true);

  const [selectedSound, setSelectedSound] = useState<{ name: string; url?: string }>(() => {
    const saved = localStorage.getItem('lumina_timer_sound');
    return saved ? JSON.parse(saved) : { name: 'Classic Bell' };
  });
  const [showSounds, setShowSounds] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('lumina_timer_sound', JSON.stringify(selectedSound));
  }, [selectedSound]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsRinging(true);
      sfx.playAlarmSound(selectedSound, 1.0);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, selectedSound]);

  const handleStartCustom = () => {
    const total = (customHours * 3600) + (customMinutes * 60) + customSeconds;
    if (total <= 0) return;
    if (uiSoundsEnabled) sfx.playTick();
    setTimeLeft(total);
    setTotalTime(total);
    setIsActive(true);
    setIsAdjusting(false);
    setIsRinging(false);
  };

  const handleStartPreset = (seconds: number) => {
    if (uiSoundsEnabled) sfx.playTick();
    setTimeLeft(seconds);
    setTotalTime(seconds);
    setIsActive(true);
    setIsAdjusting(false);
    setIsRinging(false);
  };

  const toggleTimer = () => {
    if (uiSoundsEnabled) sfx.playClick();
    setIsActive(!isActive);
  };

  const stopAlarm = () => {
    if (uiSoundsEnabled) sfx.playClick();
    sfx.stopAll();
    setIsRinging(false);
    setIsAdjusting(true);
    setTimeLeft(0);
  };

  const handleReset = () => {
    if (uiSoundsEnabled) sfx.playClick();
    setIsActive(false);
    setIsRinging(false);
    setTimeLeft(0);
    setIsAdjusting(true);
    sfx.stopAll();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const adjustValue = (type: 'h' | 'm' | 's', delta: number) => {
    if (uiSoundsEnabled) sfx.playClick();
    if (type === 'h') setCustomHours(prev => Math.max(0, Math.min(23, prev + delta)));
    if (type === 'm') setCustomMinutes(prev => Math.max(0, Math.min(59, prev + delta)));
    if (type === 's') setCustomSeconds(prev => Math.max(0, Math.min(59, prev + delta)));
  };

  const progressPercent = totalTime > 0 ? (timeLeft / totalTime) : 0;
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progressPercent * circumference;

  return (
    <div className="w-full flex flex-col items-center gap-10 animate-in fade-in duration-700">
      
      {/* Circular Gauge Container */}
      <div className={`w-80 h-80 rounded-full neu-outset flex items-center justify-center relative transition-all duration-700 ${isRinging ? 'shadow-[0_0_80px_rgba(239,68,68,0.4)] ring-8 ring-red-500/20' : ''}`}>
        
        {/* Progress SVG */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 300 300">
          <defs>
            <filter id="progressGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="150" cy="150" r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-appMuted/10"
          />

          {/* Active Progress */}
          <circle
            cx="150" cy="150" r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={isAdjusting ? 0 : offset}
            strokeLinecap="round"
            filter="url(#progressGlow)"
            className={`transition-all duration-1000 ease-linear ${isRinging ? 'text-red-500 animate-pulse' : 'text-appText'}`}
          />

          {/* Needle Knob */}
          {!isAdjusting && timeLeft > 0 && (
            <g transform={`rotate(${(progressPercent * 360)}, 150, 150)`}>
              <circle
                cx="150"
                cy={150 - radius}
                r="8"
                className="fill-appBg stroke-appText stroke-[3px] shadow-2xl transition-all duration-1000 ease-linear"
              />
              <circle
                cx="150"
                cy={150 - radius}
                r="3"
                className="fill-appText"
              />
            </g>
          )}
        </svg>

        {/* Dial Face */}
        <div className="w-[82%] h-[82%] rounded-full neu-inset flex flex-col items-center justify-center relative z-10">
          {isAdjusting ? (
            <div className="flex gap-3 items-center">
              {/* Column for H/M/S */}
              {[
                { label: 'Hrs', val: customHours, type: 'h' },
                { label: 'Min', val: customMinutes, type: 'm' },
                { label: 'Sec', val: customSeconds, type: 's' }
              ].map((item, idx) => (
                <React.Fragment key={item.type}>
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => adjustValue(item.type as any, 1)} className="w-8 h-8 rounded-lg neu-outset flex items-center justify-center text-appText active:neu-pressed transition-transform active:scale-90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 15l7-7 7 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <div className="w-12 h-14 rounded-xl neu-inset flex items-center justify-center">
                      <span className="text-xl font-black text-appText tabular-nums">{item.val.toString().padStart(2, '0')}</span>
                    </div>
                    <button onClick={() => adjustValue(item.type as any, -1)} className="w-8 h-8 rounded-lg neu-outset flex items-center justify-center text-appText active:neu-pressed transition-transform active:scale-90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <span className="text-[7px] font-black text-appMuted uppercase tracking-widest mt-0.5">{item.label}</span>
                  </div>
                  {idx < 2 && <span className="text-xl font-black text-appMuted/30 pb-6">:</span>}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-500">
              <span className={`text-6xl font-black tabular-nums tracking-tighter ${isRinging ? 'text-red-500 animate-bounce' : 'text-appText'}`}>
                {isRinging ? "00:00" : formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-black text-appMuted uppercase tracking-[0.4em] mt-4">
                {isRinging ? "Alarm Finished" : (isActive ? "Time Remaining" : "Paused")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col gap-8">
        {isRinging ? (
          <button onClick={stopAlarm} className="w-full py-7 rounded-[32px] neu-outset bg-red-500 text-white font-black uppercase tracking-[0.3em] shadow-xl animate-pulse">Stop Alarm</button>
        ) : isAdjusting ? (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-3 gap-4">
              {PRESETS.map(min => (
                <button key={min} onClick={() => handleStartPreset(min * 60)} className="py-4 rounded-2xl neu-outset text-[11px] font-black text-appText uppercase tracking-widest hover:bg-appText/5 active:neu-pressed transition-all">
                  {min}m
                </button>
              ))}
            </div>
            <button onClick={handleStartCustom} className="w-full py-6 rounded-[32px] neu-outset bg-appText text-appBg font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">Start Timer</button>
          </div>
        ) : (
          <div className="flex gap-5">
            <button onClick={toggleTimer} className={`flex-1 py-6 rounded-[32px] neu-outset font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isActive ? 'text-orange-500' : 'text-appText'}`}>
              {isActive ? 'Pause' : 'Resume'}
            </button>
            <button onClick={handleReset} className="flex-1 py-6 rounded-[32px] neu-outset text-red-500/80 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerView;