import React, { useState, useEffect } from 'react';
import { WorldCity } from '../types';

const INITIAL_CITIES: WorldCity[] = [
  { id: 'nyc', name: 'New York', timezone: 'America/New_York' },
  { id: 'lon', name: 'London', timezone: 'Europe/London' },
  { id: 'tky', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'dxb', name: 'Dubai', timezone: 'Asia/Dubai' },
];

const AVAILABLE_CITIES: WorldCity[] = [
  { id: 'lax', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 'chi', name: 'Chicago', timezone: 'America/Chicago' },
  { id: 'nyc', name: 'New York', timezone: 'America/New_York' },
  { id: 'lon', name: 'London', timezone: 'Europe/London' },
  { id: 'par', name: 'Paris', timezone: 'Europe/Paris' },
  { id: 'ber', name: 'Berlin', timezone: 'Europe/Berlin' },
  { id: 'mos', name: 'Moscow', timezone: 'Europe/Moscow' },
  { id: 'dxb', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 'sin', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'tky', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'syd', name: 'Sydney', timezone: 'Australia/Sydney' },
];

const WorldClockView: React.FC = () => {
  const [now, setNow] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [cities, setCities] = useState<WorldCity[]>(() => {
    const saved = localStorage.getItem('lumina_world_cities');
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_world_cities', JSON.stringify(cities));
  }, [cities]);

  const formatCityTime = (timezone: string) => {
    try {
      return now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return "--:--";
    }
  };

  const getTimeOffset = (timezone: string) => {
    try {
      const cityDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
      const diff = (cityDate.getTime() - now.getTime()) / 3600000;
      const rounded = Math.round(diff);
      return rounded === 0 ? 'Same time' : `${rounded > 0 ? '+' : ''}${rounded} hrs`;
    } catch (e) {
      return "N/A";
    }
  };

  const addCity = (city: WorldCity) => {
    if (!cities.find(c => c.id === city.id)) {
      setCities(prev => [...prev, city]);
    }
    setIsAdding(false);
  };

  const removeCity = (id: string) => {
    setCities(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500 relative">
      
      {/* City Picker Overlay */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-appBg/60 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
           <div className="w-full max-w-sm neu-outset rounded-[40px] p-8 max-h-[70vh] flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-appText uppercase tracking-widest">Select City</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-appText active:scale-90 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {AVAILABLE_CITIES.map(city => {
                  const exists = cities.find(c => c.id === city.id);
                  return (
                    <button
                      key={city.id}
                      onClick={() => addCity(city)}
                      disabled={!!exists}
                      className={`w-full p-5 rounded-2xl flex justify-between items-center transition-all ${exists ? 'opacity-30 cursor-default' : 'neu-outset hover:bg-appText/5 active:neu-pressed'}`}
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-appText">{city.name}</span>
                      <span className="text-[9px] font-bold text-appMuted uppercase">{city.timezone.split('/')[0]}</span>
                    </button>
                  );
                })}
              </div>
           </div>
        </div>
      )}

      {/* Header with Functional Plus Button */}
      <div className="px-2 flex justify-between items-center">
        <h2 className="text-[11px] font-black text-appMuted uppercase tracking-[0.3em] select-none opacity-80">Global Context</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-10 h-10 rounded-2xl neu-outset flex items-center justify-center text-appText transition-all active:neu-pressed hover:scale-110 active:scale-95 group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 gap-5">
        {cities.length === 0 ? (
          <div className="neu-inset p-12 rounded-[32px] flex flex-col items-center justify-center text-center gap-4">
             <div className="w-12 h-12 rounded-full neu-outset flex items-center justify-center text-appMuted/30">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
             </div>
             <p className="text-[10px] font-black text-appMuted uppercase tracking-widest opacity-40">No cities added</p>
          </div>
        ) : (
          cities.map(city => (
            <div key={city.id} className="neu-outset p-7 rounded-[40px] flex items-center justify-between group overflow-hidden relative transition-all duration-300 hover:shadow-xl">
              {/* Delete Button - Visible on Hover */}
              <button 
                onClick={() => removeCity(city.id)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center active:scale-90"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm md:text-base font-black text-appText uppercase tracking-widest drop-shadow-sm">{city.name}</span>
                <span className="text-[10px] font-black text-appMuted uppercase tracking-tight opacity-90">
                  {getTimeOffset(city.timezone)}
                </span>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-appText tabular-nums tracking-tighter drop-shadow-sm">
                    {formatCityTime(city.timezone).split(' ')[0]}
                  </span>
                  <span className="text-[11px] font-black text-appMuted uppercase">
                    {formatCityTime(city.timezone).split(' ')[1]}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorldClockView;