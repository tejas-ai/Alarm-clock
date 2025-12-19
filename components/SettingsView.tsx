
import React from 'react';
import { sounds as sfx } from '../services/sounds';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  uiSounds: boolean;
  onToggleUiSounds: () => void;
}

const SettingsView: React.FC<Props> = ({ theme, onToggleTheme, uiSounds, onToggleUiSounds }) => {
  const handleToggle = (fn: () => void) => {
    if (uiSounds) sfx.playClick();
    fn();
  };

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <section className="space-y-4">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Appearance</h2>
        
        <div className="neu-outset p-6 rounded-[32px] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black text-appText uppercase tracking-widest">Dark Mode</span>
            <span className="text-[10px] font-bold text-appMuted uppercase mt-1">Adaptive visual theme</span>
          </div>
          <button 
            onClick={() => handleToggle(onToggleTheme)}
            className={`w-16 h-9 rounded-full transition-all duration-300 p-1 flex items-center neu-inset border border-white/5`}
          >
            <div className={`w-7 h-7 rounded-full transition-all duration-500 transform shadow-lg flex items-center justify-center ${
                theme === 'dark' 
                    ? 'translate-x-7 bg-appText text-appBg' 
                    : 'translate-x-0 bg-appBg text-appText'
            }`}>
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              )}
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Audio</h2>
        
        <div className="neu-outset p-6 rounded-[32px] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-black text-appText uppercase tracking-widest">UI Sound FX</span>
            <span className="text-[10px] font-bold text-appMuted uppercase mt-1">Interactions & Taps</span>
          </div>
          <button 
            onClick={() => handleToggle(onToggleUiSounds)}
            className={`w-16 h-9 rounded-full transition-all duration-300 p-1 flex items-center neu-inset border border-white/5`}
          >
            <div className={`w-7 h-7 rounded-full transition-all duration-500 transform shadow-lg flex items-center justify-center ${
                uiSounds 
                    ? 'translate-x-7 bg-appText text-appBg' 
                    : 'translate-x-0 bg-appBg text-appText'
            }`} />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Founder</h2>
        <div className="neu-outset p-6 rounded-[32px] flex flex-col gap-1 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <svg className="w-24 h-24 text-appText" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            </div>
            <span className="text-xs font-black text-appText uppercase tracking-[0.2em]">Tejas J.H</span>
            <span className="text-[9px] font-bold text-appMuted uppercase tracking-widest">Visionary & Lead Engineer</span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">System</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="neu-outset p-5 rounded-[28px] flex flex-col items-center justify-center text-center gap-2">
            <span className="text-[9px] font-black text-appMuted uppercase tracking-widest">Version</span>
            <span className="text-xs font-black text-appText">v2.6.0-LUMINA</span>
          </div>
          <div className="neu-outset p-5 rounded-[28px] flex flex-col items-center justify-center text-center gap-2">
            <span className="text-[9px] font-black text-appMuted uppercase tracking-widest">Engine</span>
            <span className="text-xs font-black text-appText">Lumina Audio v1</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
