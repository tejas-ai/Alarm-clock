import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, Alarm, Todo } from './types';
import { sounds as sfx } from './services/sounds';
import AnalogClock from './components/AnalogClock';
import AlarmList from './components/AlarmList';
import StopwatchView from './components/StopwatchView';
import SettingsView from './components/SettingsView';
import TodoView from './components/TodoView';
import Dock from './components/Dock';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('Clock');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const [ringingProgress, setRingingProgress] = useState(0);

  // UI Sounds State
  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(() => {
    return localStorage.getItem('lumina_ui_sounds') !== 'false';
  });

  const toggleUiSounds = () => {
    setUiSoundsEnabled(prev => {
        localStorage.setItem('lumina_ui_sounds', (!prev).toString());
        return !prev;
    });
  };

  const handleTabChange = (tab: NavTab) => {
    if (uiSoundsEnabled) sfx.playClick();
    setActiveTab(tab);
  };

  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('lumina_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('lumina_theme', theme);
  }, [theme]);

  // Alarms State
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('lumina_alarms');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '05:00', period: 'am', isActive: true, label: "Wake Up", days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], sound: { name: 'Classic Bell' }, effects: { fade: true, vibrate: true } },
      { id: '2', time: '08:30', period: 'am', isActive: true, label: "Deep Work", days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], sound: { name: 'Digital Pulse' }, effects: { fade: false, vibrate: true } },
    ];
  });

  useEffect(() => {
    localStorage.setItem('lumina_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Todos State
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('lumina_todos');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lumina_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, reminder?: number) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: 'medium',
      createdAt: Date.now(),
      reminder,
      reminderFired: false,
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Audio Logic
  useEffect(() => {
    if (ringingAlarm) {
      const vol = ringingAlarm.effects?.fade ? Math.max(0.1, ringingProgress) : 1.0;
      sfx.playAlarmSound(ringingAlarm.sound || { name: 'Classic Bell' }, vol);
    } else {
      sfx.stopAll();
    }
  }, [ringingAlarm]);

  useEffect(() => {
    if (ringingAlarm && ringingAlarm.effects?.fade) {
      sfx.setVolume(Math.max(0.1, ringingProgress));
    }
  }, [ringingProgress, ringingAlarm]);

  // Clock Ticks & Reminder Check
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const nowTs = now.getTime();

      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      const isPm = currentHours >= 12;
      const displayHours = currentHours % 12 || 12;
      const timeString = `${displayHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
      const periodString = isPm ? 'pm' : 'am';

      // Check Alarms
      if (currentSeconds === 0) {
        const triggered = alarms.find(a => 
          a.isActive && 
          a.time === timeString && 
          a.period === periodString &&
          a.days.includes(currentDay)
        );
        if (triggered && !ringingAlarm) {
          setRingingAlarm(triggered);
          setRingingProgress(0);
        }
      }

      // Check Todo Reminders
      setTodos(prev => {
        let changed = false;
        const next = prev.map(t => {
          if (!t.completed && t.reminder && !t.reminderFired && t.reminder <= nowTs) {
            changed = true;
            if (uiSoundsEnabled) sfx.playTick();
            return { ...t, reminderFired: true };
          }
          return t;
        });
        return changed ? next : prev;
      });

    }, 1000);

    return () => clearInterval(timer);
  }, [alarms, ringingAlarm, uiSoundsEnabled]);

  useEffect(() => {
    let fadeTimer: number;
    if (ringingAlarm) {
        fadeTimer = window.setInterval(() => {
            setRingingProgress(prev => Math.min(prev + 0.05, 1)); 
        }, 1000);
    }
    return () => clearInterval(fadeTimer);
  }, [ringingAlarm]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const addAlarm = (newAlarm: Alarm) => {
    setAlarms(prev => [...prev, newAlarm]);
  };

  const updateAlarmDays = (id: string, days: string[]) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, days } : a));
  };

  const updateAlarmSound = (id: string, sound: { name: string; url?: string }) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, sound } : a));
  };

  const updateAlarmEffects = (id: string, effects: { fade: boolean; vibrate: boolean }) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, effects } : a));
  };

  const dismissAlarm = () => {
    if (uiSoundsEnabled) sfx.playClick();
    setRingingAlarm(null);
    setRingingProgress(0);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center px-6 pt-10 pb-48 overflow-y-auto bg-appBg">
      
      {/* Ringing Overlay */}
      {ringingAlarm && (
        <div 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 bg-appBg/90 backdrop-blur-xl animate-in fade-in zoom-in duration-500"
            style={{ opacity: ringingAlarm.effects?.fade ? Math.max(0.4, ringingProgress) : 1 }}
        >
           <div className="w-64 h-64 rounded-full neu-outset flex items-center justify-center mb-12 animate-bounce">
              <div className="w-56 h-56 rounded-full neu-inset flex flex-col items-center justify-center">
                 <span className="text-5xl font-black text-appText tabular-nums">{ringingAlarm.time}</span>
                 <span className="text-xl font-bold uppercase text-appMuted">{ringingAlarm.period}</span>
              </div>
           </div>
           <h2 className="text-2xl font-black text-appText mb-2 uppercase tracking-widest">{ringingAlarm.label || "Alarm"}</h2>
           <button onClick={dismissAlarm} className="w-full max-w-xs py-6 rounded-3xl neu-outset text-appText font-black uppercase tracking-[0.2em] active:neu-pressed transition-all shadow-xl">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-end mb-12 relative z-10 px-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-appMuted uppercase tracking-[0.4em]">Lumina</span>
          <h1 className="text-3xl font-black text-appText tracking-tight -mt-1.5 italic">
            {activeTab}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md z-10 flex flex-col items-center flex-1">
        {activeTab === 'Clock' && (
          <div className="flex flex-col items-center gap-16 w-full">
            <AnalogClock time={currentTime} />
            <div className="w-full space-y-8">
               <div className="flex items-center gap-6 px-4">
                 <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-appMuted" />
                 <h3 className="text-[10px] font-black text-appMuted uppercase tracking-[0.25em] whitespace-nowrap">Schedule</h3>
                 <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-appMuted" />
               </div>
               <AlarmList 
                mini 
                alarms={alarms.filter(a => a.isActive)} 
                onToggle={toggleAlarm} 
                onDelete={deleteAlarm}
                onAdd={addAlarm}
                onUpdateDays={updateAlarmDays}
                onUpdateSound={updateAlarmSound}
                onUpdateEffects={updateAlarmEffects}
                uiSoundsEnabled={uiSoundsEnabled}
               />
            </div>
          </div>
        )}

        {activeTab === 'Alarm' && (
          <AlarmList 
            alarms={alarms} 
            onToggle={toggleAlarm} 
            onDelete={deleteAlarm}
            onAdd={addAlarm}
            onUpdateDays={updateAlarmDays}
            onUpdateSound={updateAlarmSound}
            onUpdateEffects={updateAlarmEffects}
            uiSoundsEnabled={uiSoundsEnabled}
          />
        )}

        {activeTab === 'Focus' && (
          <TodoView 
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            uiSoundsEnabled={uiSoundsEnabled}
          />
        )}

        {activeTab === 'Stopwatch' && <StopwatchView />}

        {activeTab === 'Settings' && (
          <SettingsView 
            theme={theme} 
            onToggleTheme={toggleTheme} 
            uiSounds={uiSoundsEnabled}
            onToggleUiSounds={toggleUiSounds}
          />
        )}
      </div>

      <Dock activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default App;