
import React, { useRef } from 'react';

interface AlarmCardProps {
  time: string;
  label: string;
  isActive: boolean;
  days: string[];
  soundName?: string;
  onToggle: () => void;
  onDaysChange?: (days: string[]) => void;
  onSoundChange?: (name: string) => void;
  className?: string;
}

const ALL_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmCard: React.FC<AlarmCardProps> = ({ 
  time, 
  label, 
  isActive, 
  days, 
  soundName = "Default",
  onToggle, 
  onDaysChange,
  onSoundChange,
  className = "" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDay = (day: string) => {
    if (!onDaysChange) return;
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    onDaysChange(newDays);
  };

  const handleSoundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSoundChange) {
      onSoundChange(file.name);
    }
  };

  return (
    <div className={`glass p-5 md:p-6 rounded-[24px] flex flex-col justify-between transition-all duration-500 hover:scale-[1.01] cursor-pointer group ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] md:text-sm font-semibold tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
            {label}
          </span>
          <div 
            onClick={handleSoundClick}
            className="flex items-center gap-1.5 mt-1 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-full transition-all border border-white/5"
          >
            <svg className="w-3 h-3 text-[#CCFF00]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-[9px] font-medium text-white/40 truncate max-w-[80px]">
              {soundName}
            </span>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="audio/*" 
              className="hidden" 
            />
          </div>
        </div>
        <div 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`w-10 h-5 md:w-12 md:h-6 rounded-full transition-colors duration-300 flex items-center px-1 ${isActive ? 'bg-[#CCFF00]' : 'bg-white/10'}`}
        >
          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg transition-transform duration-300 transform ${isActive ? 'translate-x-5 md:translate-x-6 bg-black' : 'translate-x-0 bg-white/40'}`} />
        </div>
      </div>

      <div className="mt-2 md:mt-4">
        <span className={`text-4xl md:text-5xl font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/20'}`}>
          {time}
        </span>
      </div>

      <div className="mt-4 flex justify-between gap-1">
        {ALL_DAYS.map((day) => {
          const isSelected = days.includes(day);
          return (
            <button
              key={day}
              onClick={(e) => {
                e.stopPropagation();
                toggleDay(day);
              }}
              className={`flex-1 text-[9px] md:text-[10px] font-bold py-1.5 rounded-lg transition-all duration-300 border ${
                isSelected 
                  ? 'bg-[#CCFF00] text-black border-[#CCFF00]' 
                  : 'bg-white/5 text-white/30 border-white/5 hover:border-white/20'
              }`}
            >
              {day[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AlarmCard;
