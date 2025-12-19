
import React, { useState, useEffect, useMemo } from 'react';
import { NavTab, Alarm } from './types';
import AnalogClock from './components/AnalogClock';
import AlarmList from './components/AlarmList';
import StopwatchView from './components/StopwatchView';
import ImageAnalyzer from './components/ImageAnalyzer';
import Dock from './components/Dock';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab | 'Analyze'>('Clock');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunriseOpacity, setSunriseOpacity] = useState(0);
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  // Load alarms from local storage
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('lumina_alarms');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '05:00', period: 'am', isActive: true, sunriseEnabled: true, label: "Wake Up" },
      { id: '2', time: '08:30', period: 'am', isActive: true, sunriseEnabled: true, label: "Deep Work" },
    ];
  });

  // Save alarms to local storage
  useEffect(() => {
    localStorage.setItem('lumina_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const isPm = currentHours >= 12;
      const displayHours = currentHours % 12 || 12;
      const timeString = `${displayHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
      const periodString = isPm ? 'pm' : 'am';

      // 1. Check for Ringing Alarms (Triggered at second 0)
      if (currentSeconds === 0) {
        const triggered = alarms.find(a => 
          a.isActive && 
          a.time === timeString && 
          a.period === periodString
        );
        if (triggered && !ringingAlarm) {
          setRingingAlarm(triggered);
        }
      }

      // 2. Check for Sunrise Simulation
      let maxOpacity = 0;
      alarms.forEach(alarm => {
        if (!alarm.isActive || !alarm.sunriseEnabled) return;

        const [h, m] = alarm.time.split(':').map(Number);
        const alarmTime = new Date();
        let alarmHours = h;
        if (alarm.period === 'pm' && h !== 12) alarmHours += 12;
        if (alarm.period === 'am' && h === 12) alarmHours = 0;
        
        alarmTime.setHours(alarmHours, m, 0, 0);

        if (alarmTime.getTime() < now.getTime()) {
           alarmTime.setDate(alarmTime.getDate() + 1);
        }

        const diffMinutes = (alarmTime.getTime() - now.getTime()) / (1000 * 60);
        
        if (diffMinutes > 0 && diffMinutes <= 30) {
          const intensity = 1 - (diffMinutes / 30);
          maxOpacity = Math.max(maxOpacity, intensity);
        }
      });

      setSunriseOpacity(maxOpacity);
    }, 100);

    return () => clearInterval(timer);
  }, [alarms, ringingAlarm]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const toggleSunrise = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, sunriseEnabled: !a.sunriseEnabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const addAlarm = (newAlarm: Alarm) => {
    setAlarms(prev => [...prev, newAlarm]);
  };

  const dismissAlarm = () => {
    setRingingAlarm(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-6 pt-10 pb-36 overflow-hidden bg-[#E0E5EC]">
      
      {/* Sunrise Simulation Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-1000"
        style={{ 
          opacity: sunriseOpacity,
          background: 'radial-gradient(circle at 50% 100%, #FFF7AD 0%, #FFD194 50%, #ffffff 100%)' 
        }}
      />

      {/* Ringing Alarm Overlay */}
      {ringingAlarm && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 bg-[#E0E5EC]/90 backdrop-blur-xl animate-in fade-in zoom-in duration-500">
           <div className="w-64 h-64 rounded-full neu-outset flex items-center justify-center mb-12 animate-bounce">
              <div className="w-56 h-56 rounded-full neu-inset flex flex-col items-center justify-center">
                 <span className="text-5xl font-black text-[#31456a] tabular-nums">{ringingAlarm.time}</span>
                 <span className="text-xl font-bold uppercase text-[#31456a]/40">{ringingAlarm.period}</span>
              </div>
           </div>
           <h2 className="text-2xl font-black text-[#31456a] mb-2 uppercase tracking-widest">{ringingAlarm.label || "Alarm"}</h2>
           <p className="text-[#31456a]/60 font-medium mb-12">It's time to rise and shine.</p>
           
           <div className="flex flex-col w-full max-w-xs gap-4">
              <button 
                onClick={dismissAlarm}
                className="w-full py-6 rounded-3xl neu-outset text-[#31456a] font-black uppercase tracking-[0.2em] active:neu-pressed transition-all"
              >
                Dismiss
              </button>
              <button 
                onClick={dismissAlarm} // Simple dismiss for now
                className="w-full py-4 rounded-2xl neu-inset text-[#31456a]/40 font-bold uppercase tracking-widest text-sm"
              >
                Snooze 9m
              </button>
           </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-end mb-12 relative z-10 px-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-[#31456a]/40 uppercase tracking-[0.4em]">Lumina</span>
          <h1 className="text-3xl font-black text-[#31456a] tracking-tight -mt-1.5 italic">
            {activeTab}
          </h1>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'Analyze' ? 'Clock' : 'Analyze')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            activeTab === 'Analyze' ? 'neu-pressed text-[#31456a]' : 'neu-outset text-[#31456a]/60 neu-button'
          }`}
          title="Analyze Image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in duration-700 flex flex-col items-center">
        {activeTab === 'Clock' && (
          <div className="flex flex-col items-center gap-16 w-full">
            <AnalogClock time={currentTime} />
            <div className="w-full space-y-8">
               <div className="flex items-center gap-6 px-4">
                 <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#31456a]/10" />
                 <h3 className="text-[10px] font-black text-[#31456a]/30 uppercase tracking-[0.25em] whitespace-nowrap">Schedule</h3>
                 <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#31456a]/10" />
               </div>
               <AlarmList 
                mini 
                alarms={alarms.filter(a => a.isActive)} 
                onToggle={toggleAlarm} 
                onSunriseToggle={toggleSunrise}
                onDelete={deleteAlarm}
                onAdd={addAlarm}
               />
            </div>
          </div>
        )}

        {activeTab === 'Alarm' && (
          <AlarmList 
            alarms={alarms} 
            onToggle={toggleAlarm} 
            onSunriseToggle={toggleSunrise} 
            onDelete={deleteAlarm}
            onAdd={addAlarm}
          />
        )}

        {activeTab === 'Stopwatch' && (
          <StopwatchView />
        )}

        {activeTab === 'Timer' && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
             <div className="w-24 h-24 rounded-[32px] neu-inset flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#31456a]/5 to-transparent" />
                <svg className="w-10 h-10 text-[#31456a]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-[#31456a]/30 text-xs font-black uppercase tracking-[0.3em] text-center px-12">Timer Module Under Construction</p>
          </div>
        )}

        {activeTab === 'Analyze' && (
          <ImageAnalyzer />
        )}
      </div>

      <Dock activeTab={activeTab as NavTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
