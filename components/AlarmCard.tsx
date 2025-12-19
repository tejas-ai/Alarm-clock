
import React from 'react';

interface AlarmCardProps {
  time: string;
  period: 'am' | 'pm';
  label: string;
  isActive: boolean;
  sunriseEnabled?: boolean;
  onToggle: () => void;
  onSunriseToggle?: () => void;
  onDelete?: () => void;
  className?: string;
}

const AlarmCard: React.FC<AlarmCardProps> = ({ 
  time, 
  period,
  label, 
  isActive, 
  sunriseEnabled,
  onToggle, 
  onSunriseToggle,
  onDelete,
  className = "" 
}) => {
  return (
    <div className={`neu-outset p-5 rounded-[28px] flex flex-col gap-4 transition-all duration-500 hover:scale-[1.01] relative group ${className}`}>
      {onDelete && (
        <button 
          onClick={onDelete}
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
          onClick={onToggle}
          className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center neu-inset`}
        >
          <div className={`w-6 h-6 rounded-full transition-transform duration-300 transform shadow-md ${
              isActive 
                  ? 'translate-x-6 bg-appText' 
                  : 'translate-x-0 bg-appBg'
          }`} />
        </button>
      </div>

      <div className="pt-2 border-t border-appText/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg transition-colors ${sunriseEnabled ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-400' : 'bg-appText/5 text-appMuted'}`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-appText/60 uppercase tracking-tighter leading-none">Sunrise Mode</span>
            <span className="text-[8px] font-medium text-appMuted uppercase tracking-tight">30m Gradual Brighten</span>
          </div>
        </div>

        <button 
          onClick={onSunriseToggle}
          className={`w-9 h-5 rounded-full transition-all duration-300 p-0.5 flex items-center ${sunriseEnabled ? 'neu-pressed' : 'neu-inset'}`}
        >
          <div className={`w-4 h-4 rounded-full transition-transform duration-300 transform ${
              sunriseEnabled 
                  ? 'translate-x-4 bg-orange-400 shadow-sm' 
                  : 'translate-x-0 bg-appText/10'
          }`} />
        </button>
      </div>
    </div>
  );
};

export default AlarmCard;