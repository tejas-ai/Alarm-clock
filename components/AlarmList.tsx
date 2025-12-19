
import React, { useState } from 'react';
import { Alarm } from '../types';
import AlarmCard from './AlarmCard';

interface Props {
  mini?: boolean;
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onSunriseToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (newAlarm: Alarm) => void;
}

const AlarmList: React.FC<Props> = ({ mini, alarms, onToggle, onSunriseToggle, onDelete, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState("07:00");
  const [newPeriod, setNewPeriod] = useState<'am' | 'pm'>('am');
  const [newLabel, setNewLabel] = useState("");

  const handleAdd = () => {
    onAdd({
      id: Date.now().toString(),
      time: newTime,
      period: newPeriod,
      isActive: true,
      sunriseEnabled: true,
      label: newLabel || "New Alarm"
    });
    setIsAdding(false);
    setNewLabel("");
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {!mini && (
        <div className="flex justify-between items-center px-2">
           <h2 className="text-xs font-black text-appMuted uppercase tracking-widest">Manage Schedule</h2>
           <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isAdding ? 'neu-pressed text-red-500' : 'neu-outset text-appText'}`}
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               {isAdding ? (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               ) : (
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               )}
             </svg>
           </button>
        </div>
      )}

      {isAdding && !mini && (
        <div className="neu-outset p-6 rounded-[32px] flex flex-col gap-6 mb-2 animate-in slide-in-from-top-4 duration-500">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-appMuted tracking-widest block mb-2">Time</label>
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-appBg neu-inset border-none rounded-xl p-3 text-appText font-bold focus:ring-1 focus:ring-appText/20"
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] font-black uppercase text-appMuted tracking-widest block mb-2">Period</label>
              <div className="flex h-12 rounded-xl overflow-hidden neu-inset p-1 gap-1">
                {(['am', 'pm'] as const).map(p => (
                  <button 
                    key={p}
                    onClick={() => setNewPeriod(p)}
                    className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${newPeriod === p ? 'bg-white/20 shadow-sm text-appText' : 'text-appMuted'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-appMuted tracking-widest block mb-2">Label</label>
            <input 
              type="text" 
              placeholder="e.g. Gym Session"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-appBg neu-inset border-none rounded-xl p-3 text-appText font-bold focus:ring-1 focus:ring-appText/20 placeholder:text-appMuted/20"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="w-full py-4 rounded-2xl bg-appText text-appBg font-black uppercase tracking-widest shadow-lg hover:scale-[0.98] active:scale-95 transition-all"
          >
            Create Alarm
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5">
        {alarms.length > 0 ? alarms.map(alarm => (
          <AlarmCard 
            key={alarm.id}
            time={alarm.time}
            period={alarm.period}
            label={alarm.label || "Alarm"}
            isActive={alarm.isActive}
            sunriseEnabled={alarm.sunriseEnabled}
            onToggle={() => onToggle(alarm.id)}
            onSunriseToggle={() => onSunriseToggle(alarm.id)}
            onDelete={mini ? undefined : () => onDelete(alarm.id)}
          />
        )) : (
          <div className="py-12 flex flex-col items-center opacity-30">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-sm font-bold uppercase tracking-widest">No Alarms Set</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmList;