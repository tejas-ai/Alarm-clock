
import React, { useState, useRef, useEffect } from 'react';
import { sounds as sfx } from '../services/sounds';

interface AlarmCardProps {
  time: string;
  period: 'am' | 'pm';
  label: string;
  isActive: boolean;
  days: string[];
  sound?: { name: string; url?: string };
  effects?: { fade: boolean; vibrate: boolean };
  onToggle: () => void;
  onDelete?: () => void;
  onDaysChange?: (days: string[]) => void;
  onSoundChange?: (sound: { name: string; url?: string }) => void;
  onEffectsChange?: (effects: { fade: boolean; vibrate: boolean }) => void;
  uiSoundsEnabled?: boolean;
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_SOUNDS: { name: string; url?: string }[] = [
  { name: 'Classic Bell' },
  { name: 'Zen Garden' },
  { name: 'Summer Rain' },
  { name: 'Digital Pulse' },
];

const AlarmCard: React.FC<AlarmCardProps> = ({ 
  time, 
  period,
  label, 
  isActive, 
  days,
  sound = { name: 'Classic Bell' } as { name: string; url?: string },
  effects = { fade: false, vibrate: true },
  onToggle, 
  onDelete,
  onDaysChange,
  onSoundChange,
  onEffectsChange,
  uiSoundsEnabled,
  className = "" 
}) => {
  const [showSounds, setShowSounds] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => sfx.stopAll(0.3);
  }, []);

  const playFeedback = () => {
    if (uiSoundsEnabled) sfx.playTick();
  };

  const toggleDay = (day: string) => {
    playFeedback();
    if (!onDaysChange) return;
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    onDaysChange(newDays);
  };

  const toggleEffect = (key: 'fade' | 'vibrate') => {
    playFeedback();
    if (!onEffectsChange) return;
    onEffectsChange({ ...effects, [key]: !effects[key] });
  };

  const handlePreview = (s: { name: string; url?: string }) => {
    if (previewing === s.name) {
      sfx.stopAll(0.3);
      setPreviewing(null);
    } else {
      sfx.playPreview(s, 0.5);
      setPreviewing(s.name);
      // Auto stop after 5 seconds for preview
      setTimeout(() => setPreviewing(p => p === s.name ? null : p), 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSoundChange) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newSound = {
          name: file.name.split('.')[0],
          url: event.target?.result as string
        };
        onSoundChange(newSound);
        setShowSounds(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`neu-outset p-5 rounded-[28px] flex flex-col gap-5 transition-all duration-500 hover:scale-[1.01] relative group ${className}`}>
      {onDelete && (
        <button 
          onClick={() => { playFeedback(); onDelete(); }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest uppercase text-appMuted">
            {label || "Alarm"}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-4xl font-black transition-colors duration-300 tabular-nums ${isActive ? 'text-appText' : 'text-appMuted'}`}>
              {time}
            </span>
            <span className={`text-xs font-bold uppercase ${isActive ? 'text-appText/60' : 'text-appMuted/40'}`}>
              {period}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => { playFeedback(); onToggle(); }}
          className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center neu-inset`}
        >
          <div className={`w-6 h-6 rounded-full transition-transform duration-300 transform shadow-md ${
              isActive 
                  ? 'translate-x-6 bg-appText' 
                  : 'translate-x-0 bg-appBg'
          }`} />
        </button>
      </div>

      <div className="flex justify-between gap-1">
        {WEEKDAYS.map((day) => {
          const isSelected = days.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`flex-1 h-8 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center ${
                isSelected
                  ? 'text-appText neu-pressed'
                  : 'text-appMuted/40 hover:text-appMuted'
              }`}
            >
              {day[0]}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => { playFeedback(); setShowSounds(!showSounds); }}
          className={`flex-1 h-12 px-4 rounded-2xl flex items-center justify-between transition-all overflow-hidden ${showSounds ? 'neu-pressed' : 'neu-inset'}`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <svg className={`w-4 h-4 ${sound?.url ? 'text-blue-500' : 'text-appMuted'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"/>
            </svg>
            <span className="text-[10px] font-black uppercase text-appText tracking-widest truncate">
              {sound.name}
            </span>
          </div>
          <svg className={`w-4 h-4 text-appMuted transition-transform duration-300 ${showSounds ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>

        <div className="flex gap-2">
            <button 
                onClick={() => toggleEffect('fade')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${effects.fade ? 'neu-pressed text-appText' : 'neu-outset text-appMuted'}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </button>
            <button 
                onClick={() => toggleEffect('vibrate')}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${effects.vibrate ? 'neu-pressed text-appText' : 'neu-outset text-appMuted'}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </button>
        </div>
      </div>

      {showSounds && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 gap-2">
            {DEFAULT_SOUNDS.map((s) => (
              <div key={s.name} className="flex gap-1">
                <button
                  onClick={() => {
                    playFeedback();
                    onSoundChange?.(s);
                  }}
                  className={`flex-1 py-3 px-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                    sound.name === s.name ? 'text-appText neu-pressed' : 'text-appMuted/60 neu-outset'
                  }`}
                >
                  {s.name}
                </button>
                <button 
                  onClick={() => handlePreview(s)}
                  className={`w-10 rounded-xl flex items-center justify-center transition-all ${previewing === s.name ? 'text-red-500 neu-pressed' : 'text-appMuted/40 neu-outset'}`}
                >
                  {previewing === s.name ? (
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            className="hidden"
          />
          
          <button
            onClick={() => { playFeedback(); fileInputRef.current?.click(); }}
            className="w-full h-12 rounded-2xl border border-dashed border-appMuted/30 text-[10px] font-black uppercase tracking-widest text-appMuted hover:text-appText hover:border-appText transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Upload Custom Sound
          </button>
        </div>
      )}
    </div>
  );
};

export default AlarmCard;
