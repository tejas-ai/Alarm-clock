import React, { useState, useEffect, useMemo } from 'react';
import { NavTab, Alarm, Todo, UserStats } from './types';
import { sounds as sfx } from './services/sounds';
import AnalogClock from './components/AnalogClock';
import DigitalClock from './components/DigitalClock';
import WorldClockView from './components/WorldClockView';
import AlarmList from './components/AlarmList';
import StopwatchView from './components/StopwatchView';
import TimerView from './components/TimerView';
import SettingsView from './components/SettingsView';
import TodoView from './components/TodoView';
import CalendarView from './components/CalendarView';
import Dock from './components/Dock';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('Clock');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockMode, setClockMode] = useState<'analog' | 'digital'>(() => {
    return (localStorage.getItem('lumina_clock_mode') as 'analog' | 'digital') || 'digital';
  });
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('lumina_time_format') as '12h' | '24h') || '12h';
  });

  useEffect(() => {
    localStorage.setItem('lumina_clock_mode', clockMode);
  }, [clockMode]);

  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(() => {
    return localStorage.getItem('lumina_ui_sounds') !== 'false';
  });

  const toggleUiSounds = () => {
    setUiSoundsEnabled(prev => {
        localStorage.setItem('lumina_ui_sounds', (!prev).toString());
        return !prev;
    });
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('lumina_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('lumina_theme', theme);
  }, [theme]);

  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('lumina_alarms');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '05:00', period: 'am', isActive: true, label: "Wake Up", days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], sound: { name: 'Classic Bell' }, effects: { fade: true, vibrate: true } },
      { id: '2', time: '08:30', period: 'am', isActive: true, label: "Deep Work", days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], sound: { name: 'Digital Pulse' }, effects: { fade: false, vibrate: true } },
    ];
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('lumina_todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lumina_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('lumina_todos', JSON.stringify(todos));
  }, [todos]);

  const sortedUpcomingAlarms = useMemo(() => {
    const getWait = (a: Alarm) => {
        const [h, m] = a.time.split(':').map(Number);
        const a24 = a.period === 'pm' ? (h % 12) + 12 : (h % 12);
        const nowM = currentTime.getHours() * 60 + currentTime.getMinutes();
        const aM = a24 * 60 + m;
        return aM > nowM ? aM - nowM : aM - nowM + 1440;
    };
    return alarms.filter(a => a.isActive).sort((a, b) => getWait(a) - getWait(b));
  }, [alarms, currentTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab: NavTab) => {
    if (uiSoundsEnabled) sfx.playClick();
    setActiveTab(tab);
  };

  const getGreeting = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-4 md:px-6 pt-10 pb-48 overflow-y-auto bg-appBg transition-all duration-500">
      
      {/* Header Bar */}
      <div className="w-full max-w-lg flex items-start justify-between mb-8 relative z-10 px-4">
        <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-700">
          <span className="text-[10px] font-black text-appMuted uppercase tracking-[0.8em] mb-1.5 opacity-40">LUMINA</span>
          <h1 className="text-4xl font-black text-appText tracking-tighter italic leading-none">{activeTab}</h1>
        </div>
        <div className="flex flex-col items-end pt-1.5 animate-in fade-in slide-in-from-right-2 duration-700">
           <span className="text-[10px] font-black text-appText uppercase tracking-[0.45em] opacity-90 text-right">{getGreeting(currentTime)}</span>
           <div className="h-[2px] w-8 bg-appText/10 mt-1 rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center flex-1 gap-12">
        {activeTab === 'Clock' && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-1000 gap-10">
            
            <div className="w-full flex justify-center py-6">
              {clockMode === 'analog' ? (
                <AnalogClock time={currentTime} />
              ) : (
                <DigitalClock time={currentTime} timeFormat={timeFormat} />
              )}
            </div>
            
            <div className="w-full space-y-6">
               <div className="flex items-center gap-6">
                 <h3 className="text-[11px] font-black text-appMuted uppercase tracking-[1em] whitespace-nowrap opacity-90">Upcoming</h3>
                 <div className="h-[1px] flex-1 bg-appText/10" />
               </div>
               <AlarmList mini alarms={sortedUpcomingAlarms} onToggle={(id) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a))} onDelete={() => {}} onAdd={() => {}} onUpdateDays={() => {}} onUpdateSound={() => {}} onUpdateEffects={() => {}} onUpdateLabel={() => {}} uiSoundsEnabled={uiSoundsEnabled} />
            </div>
          </div>
        )}

        {activeTab === 'Focus' && (
          <div className="w-full flex flex-col gap-10 animate-in fade-in duration-700">
            <TodoView 
              todos={todos}
              onAdd={(text, reminder) => setTodos(prev => [{ id: Date.now().toString(), text, completed: false, priority: 'medium', createdAt: Date.now(), reminder }, ...prev])}
              onToggle={(id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))}
              onDelete={(id) => setTodos(prev => prev.filter(t => t.id !== id))}
              uiSoundsEnabled={uiSoundsEnabled}
            />
          </div>
        )}

        {activeTab === 'Alarm' && (
          <AlarmList 
            alarms={alarms} 
            onToggle={(id) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a))} 
            onDelete={(id) => setAlarms(prev => prev.filter(a => a.id !== id))}
            onAdd={(a) => setAlarms(prev => [...prev, a])}
            onUpdateDays={(id, days) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, days } : a))}
            onUpdateSound={(id, sound) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, sound } : a))}
            onUpdateEffects={(id, eff) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, effects: eff } : a))}
            onUpdateLabel={(id, label) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, label } : a))}
            uiSoundsEnabled={uiSoundsEnabled}
          />
        )}

        {activeTab === 'World' && <WorldClockView />}
        {activeTab === 'Calendar' && <CalendarView />}
        {activeTab === 'Stopwatch' && <StopwatchView />}
        {activeTab === 'Timer' && <TimerView uiSoundsEnabled={uiSoundsEnabled} />}
        {activeTab === 'Settings' && (
          <SettingsView 
            theme={theme} 
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
            uiSounds={uiSoundsEnabled}
            onToggleUiSounds={toggleUiSounds}
            timeFormat={timeFormat}
            onToggleTimeFormat={() => setTimeFormat(prev => prev === '12h' ? '24h' : '12h')}
            clockMode={clockMode}
            onToggleClockMode={() => setClockMode(prev => prev === 'analog' ? 'digital' : 'analog')}
          />
        )}
      </div>

      <Dock activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;