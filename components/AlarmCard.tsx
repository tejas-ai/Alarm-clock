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
  onLabelChange?: (label: string) => void;
  uiSoundsEnabled?: boolean;
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
  onLabelChange,
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

  const toggleEffect = (type: 'fade' | 'vibrate') => {
    playFeedback();
    if (!onEffectsChange) return;
    onEffectsChange({
      ...effects,
      [type]: !effects[type]
    });
  };

  const handlePreview = (s: { name: string; url?: string }) => {
    if (previewing === s.name) {
      sfx.stopAll(0.3);
      setPreviewing(null);
    } else {
      sfx.playPreview(s, 0.5);
      setPreviewing(s.name);
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

  const hours = time.split(':')[0];
  const mins = time.split(':')[1];

  return (
    <div className={`p-6 rounded-[32px] flex flex-col gap-6 transition-all duration-500 relative group neu-outset ${className} ${!isActive ? 'opacity-60' : ''}`}>
      {onDelete && (
        <button 
          onClick={() => { playFeedback(); onDelete(); }}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      {/* Header with Switch & Label Input */}
      <div className="flex justify-between items-center gap-4">
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Alarm Label"
          className="bg-transparent border-none outline-none text-[10px] font-black tracking-[0.2em] uppercase text-appMuted placeholder:text-appMuted/30 flex-1"
        />
        <button 
          onClick={() => { playFeedback(); onToggle(); }}
          className={`w-12 h-6 rounded-full transition-all duration-300 p-1 flex items-center ${isActive ? 'bg-appText' : 'bg-appText/10'}`}
        >
          <div className={`w-4 h-4 rounded-full transition-transform duration-300 transform ${
              isActive 
                  ? 'translate-x-6 bg-appBg' 
                  : 'translate-x-0 bg-appText/40'
          }`} />
        </button>
      </div>

      {/* Time Display */}
      <div className="flex items-baseline gap-2">
        <div className="flex items-center">
          <span className="text-6xl font-black text-appText tracking-tighter tabular-nums">{hours}</span>
          <span className="text-4xl font-black text-appMuted/30 mx-1">:</span>
          <span className="text-6xl font-black text-appText tracking-tighter tabular-nums">{mins}</span>
        </div>
        <span className="text-xl font-black uppercase text-appMuted tracking-tight">{period}</span>
      </div>

      {/* Days Selection */}
      <div className="flex justify-between gap-1">
        {WEEKDAYS.map((day, idx) => {
          const isSelected = days.includes(day);
          return (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                isSelected
                  ? 'neu-pressed text-appText'
                  : 'text-appMuted/40 hover:text-appText/60'
              }`}
            >
              {DAY_LABELS[idx]}
            </button>
          );
        })}
      </div>

      {/* Bottom Controls: Sound & Effects */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          {/* Sound Selection Bar */}
          <button 
            onClick={() => { playFeedback(); setShowSounds(!showSounds); }}
            className={`flex-1 h-14 px-5 rounded-2xl flex items-center justify-between transition-all bg-appText/[0.03] border border-appText/[0.05] active:bg-appText/[0.08]`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <svg className={`w-4 h-4 flex-shrink-0 ${sound?.url ? 'text-blue-500' : 'text-appMuted'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z"/>
              </svg>
              <span className="text-[10px] font-black uppercase text-appText/60 tracking-[0.2em] truncate">
                {sound.name}
              </span>
            </div>
            <svg className={`w-4 h-4 text-appMuted transition-transform duration-300 ${showSounds ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>

          {/* Effect Toggles */}
          <div className="flex gap-2">
            <button 
              onClick={() => toggleEffect('fade')}
              title="Gradual volume increase"
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${effects.fade ? 'neu-pressed text-appText' : 'neu-outset text-appMuted/30'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m-8-5h8m-8-5h8M3 17v-4a4 4 0 014-4h1a4 4 0 014 4v4m-8 0h8" />
              </svg>
            </button>
            <button 
              onClick={() => toggleEffect('vibrate')}
              title="Vibration"
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${effects.vibrate ? 'neu-pressed text-appText' : 'neu-outset text-appMuted/30'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 11h3m-3-4h2m-2 8h2M3 11h3m-3-4h2m-2 8h2" />
              </svg>
            </button>
          </div>
        </div>

        {showSounds && (
          <div className="flex flex-col gap-1.5 mt-1 animate-in slide-in-from-top-2 duration-300 bg-appBg/50 backdrop-blur-md p-3 rounded-2xl border border-appText/10">
            <div className="grid grid-cols-1 gap-1">
              {DEFAULT_SOUNDS.map((s) => (
                <div key={s.name} className="flex gap-1">
                  <button
                    onClick={() => {
                      playFeedback();
                      onSoundChange?.(s);
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all ${
                      sound.name === s.name ? 'neu-inset text-appText' : 'text-appMuted hover:text-appText'
                    }`}
                  >
                    {s.name}
                  </button>
                  <button 
                    onClick={() => handlePreview(s)}
                    className={`w-12 rounded-xl flex items-center justify-center transition-all ${previewing === s.name ? 'text-blue-500' : 'text-appMuted/30'}`}
                  >
                    {previewing === s.name ? (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
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
              className="w-full h-11 rounded-xl border border-dashed border-appMuted/20 text-[9px] font-black uppercase tracking-widest text-appMuted hover:text-appText transition-all flex items-center justify-center gap-3 mt-1"
            >
              Upload Custom
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmCard;