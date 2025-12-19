
import React, { useState } from 'react';
import AlarmCard from './AlarmCard';

interface AlarmItem {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  days: string[];
  soundName?: string;
}

const BentoGrid: React.FC = () => {
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: '1', time: '06:30', label: 'Workout', isActive: true, days: ['Mon', 'Wed', 'Fri'], soundName: 'Default' },
    { id: '2', time: '08:45', label: 'Work Call', isActive: false, days: ['Tue', 'Thu'], soundName: 'Default' },
    { id: '3', time: '07:15', label: 'Meditation', isActive: true, days: ['Sat', 'Sun'], soundName: 'Zen Garden' },
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const updateDays = (id: string, newDays: string[]) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, days: newDays } : a));
  };

  const updateSound = (id: string, name: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, soundName: name } : a));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 auto-rows-min md:auto-rows-[190px]">
      {/* Fix: Passed sound prop instead of non-existent soundName, added required period prop, and fixed onSoundChange callback signature */}
      <AlarmCard 
        className="md:col-span-2 md:row-span-1 min-h-[160px] md:min-h-0"
        time={alarms[0].time} 
        period="am"
        label={alarms[0].label} 
        isActive={alarms[0].isActive}
        days={alarms[0].days}
        sound={{ name: alarms[0].soundName || 'Default' }}
        onToggle={() => toggleAlarm(alarms[0].id)}
        onDaysChange={(days) => updateDays(alarms[0].id, days)}
        onSoundChange={(s) => updateSound(alarms[0].id, s.name)}
      />
      
      <div className="glass p-5 md:p-6 rounded-[24px] flex flex-col justify-center items-center gap-1 md:gap-2 group hover:border-[#CCFF00]/30 transition-all min-h-[120px] md:min-h-0">
        <div className="text-white/40 uppercase text-[10px] md:text-xs font-bold tracking-wider">Sleep Score</div>
        <div className="text-3xl md:text-4xl font-black text-[#CCFF00]">92</div>
      </div>

      <AlarmCard 
        className="min-h-[160px] md:min-h-0"
        time={alarms[1].time} 
        period="am"
        label={alarms[1].label} 
        isActive={alarms[1].isActive}
        days={alarms[1].days}
        sound={{ name: alarms[1].soundName || 'Default' }}
        onToggle={() => toggleAlarm(alarms[1].id)}
        onDaysChange={(days) => updateDays(alarms[1].id, days)}
        onSoundChange={(s) => updateSound(alarms[1].id, s.name)}
      />

      <AlarmCard 
        className="min-h-[160px] md:min-h-0"
        time={alarms[2].time} 
        period="am"
        label={alarms[2].label} 
        isActive={alarms[2].isActive}
        days={alarms[2].days}
        sound={{ name: alarms[2].soundName || 'Default' }}
        onToggle={() => toggleAlarm(alarms[2].id)}
        onDaysChange={(days) => updateDays(alarms[2].id, days)}
        onSoundChange={(s) => updateSound(alarms[2].id, s.name)}
      />

      <div className="glass p-5 md:p-6 rounded-[24px] flex flex-col justify-between md:row-span-1 group min-h-[120px] md:min-h-0">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase">Phase</span>
         </div>
         <div className="text-sm md:text-lg font-medium text-white/80">Next Light Cycle: 7:10 AM</div>
      </div>
    </div>
  );
};

export default BentoGrid;
