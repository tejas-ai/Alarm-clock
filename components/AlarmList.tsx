
import React, { useState } from 'react';
import { Alarm } from '../types';

interface Props {
  mini?: boolean;
}

const AlarmList: React.FC<Props> = ({ mini }) => {
  // Fix: Explicitly treat 'period' literals as 'am' | 'pm' to avoid 'string' inference in ternary expressions
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: '1', time: '5:00', period: 'am', isActive: true },
    { id: '2', time: '6:00', period: 'am', isActive: false },
    ...(mini ? [] : [
        { id: '3', time: '8:30', period: 'am' as const, isActive: true },
        { id: '4', time: '10:15', period: 'pm' as const, isActive: false }
    ])
  ]);

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {alarms.map(alarm => (
        <div key={alarm.id} className="w-full h-16 rounded-xl neu-outset flex items-center justify-between px-6 transition-all active:scale-[0.99]">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#31456a]">{alarm.time}</span>
            <span className="text-xs font-bold text-[#31456a]/40 uppercase">{alarm.period}</span>
          </div>
          
          <button 
            onClick={() => toggleAlarm(alarm.id)}
            className={`w-14 h-8 rounded-full transition-all duration-300 p-1 flex items-center neu-inset`}
          >
            <div className={`w-6 h-6 rounded-full transition-transform duration-300 transform shadow-md ${
                alarm.isActive 
                    ? 'translate-x-6 bg-[#31456a]' 
                    : 'translate-x-0 bg-white'
            }`} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlarmList;
