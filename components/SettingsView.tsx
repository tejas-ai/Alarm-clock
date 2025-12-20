import React from 'react';
import { sounds as sfx } from '../services/sounds';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  uiSounds: boolean;
  onToggleUiSounds: () => void;
  timeFormat: '12h' | '24h';
  onToggleTimeFormat: () => void;
  clockMode: 'analog' | 'digital';
  onToggleClockMode: () => void;
}

const SettingsView: React.FC<Props> = ({ 
  theme, 
  onToggleTheme, 
  uiSounds, 
  onToggleUiSounds,
  timeFormat,
  onToggleTimeFormat,
  clockMode,
  onToggleClockMode
}) => {
  const handleToggle = (fn: () => void) => {
    if (uiSounds) sfx.playClick();
    fn();
  };

  return (
    <div className="w-full flex flex-col gap-10 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col gap-6">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Preferences</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Theme Mode Toggle */}
          <button 
            onClick={() => handleToggle(onToggleTheme)}
            className="neu-outset p-6 rounded-[28px] flex items-center justify-between group active:neu-pressed transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-black text-appText uppercase tracking-widest">Appearance</span>
              <span className="text-[10px] font-bold text-appMuted uppercase">{theme} Mode</span>
            </div>
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-appText">
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </div>
          </button>

          {/* Time Format Toggle */}
          <button 
            onClick={() => handleToggle(onToggleTimeFormat)}
            className="neu-outset p-6 rounded-[28px] flex items-center justify-between group active:neu-pressed transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-black text-appText uppercase tracking-widest">Time Format</span>
              <span className="text-[10px] font-bold text-appMuted uppercase">{timeFormat}</span>
            </div>
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-appText font-black text-[10px]">
              {timeFormat}
            </div>
          </button>

          {/* UI Sounds Toggle */}
          <button 
            onClick={() => handleToggle(onToggleUiSounds)}
            className="neu-outset p-6 rounded-[28px] flex items-center justify-between group active:neu-pressed transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-black text-appText uppercase tracking-widest">Acoustics</span>
              <span className="text-[10px] font-bold text-appMuted uppercase">{uiSounds ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className={`w-12 h-12 rounded-2xl neu-inset flex items-center justify-center transition-colors ${uiSounds ? 'text-appText' : 'text-appMuted/30'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </div>
          </button>

          {/* Clock Mode Toggle (Analog/Digital) Added at the bottom */}
          <button 
            onClick={() => handleToggle(onToggleClockMode)}
            className="neu-outset p-6 rounded-[28px] flex items-center justify-between group active:neu-pressed transition-all"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-black text-appText uppercase tracking-widest">Clock Style</span>
              <span className="text-[10px] font-bold text-appMuted uppercase">{clockMode} Mode</span>
            </div>
            <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-appText">
              {clockMode === 'analog' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8V4m0 4h4m-4 0l-4-4m4 8V4M7 21h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;