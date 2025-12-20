import React, { useState } from 'react';
import { Alarm } from '../types';
import AlarmCard from './AlarmCard';

interface Props {
  mini?: boolean;
  alarms: Alarm[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (newAlarm: Alarm) => void;
  onUpdateDays: (id: string, days: string[]) => void;
  onUpdateSound: (id: string, sound: { name: string; url?: string }) => void;
  onUpdateEffects: (id: string, effects: { fade: boolean; vibrate: boolean }) => void;
  onUpdateLabel: (id: string, label: string) => void;
  uiSoundsEnabled: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AlarmList: React.FC<Props> = ({ 
    mini, alarms, onToggle, onDelete, onAdd, 
    onUpdateDays, onUpdateSound, onUpdateEffects, onUpdateLabel, uiSoundsEnabled 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState("07:00");
  const [newPeriod, setNewPeriod] = useState<'am' | 'pm'>('am');
  const [newLabel, setNewLabel] = useState("");
  const [newDays, setNewDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [newSound, setNewSound] = useState<{ name: string; url?: string }>({ name: 'Classic Bell' });
  const [newEffects, setNewEffects] = useState({ fade: true, vibrate: true });

  const handleAdd = () => {
    onAdd({
      id: Date.now().toString(),
      time: newTime,
      period: newPeriod,
      isActive: true,
      label: newLabel || "New Alarm",
      days: newDays,
      sound: newSound,
      effects: newEffects
    });
    setIsAdding(false);
    setNewLabel("");
  };

  return (
    <div className="w-full flex flex-col gap-6">
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
                    className={`flex-1 rounded-lg text-[10px] font-black uppercase transition-all ${newPeriod === p ? 'bg-appText text-appBg shadow-sm' : 'text-appMuted hover:text-appText'}`}
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
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Wake Up"
              className="w-full bg-appBg neu-inset border-none rounded-xl p-3 text-appText font-bold focus:ring-1 focus:ring-appText/20"
            />
          </div>

          <button 
            onClick={handleAdd}
            className="w-full py-4 rounded-2xl bg-appText text-appBg font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Create Alarm
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-5">
        {alarms.map(alarm => (
          <AlarmCard 
            key={alarm.id}
            {...alarm}
            label={alarm.label || "Alarm"}
            onToggle={() => onToggle(alarm.id)}
            onDelete={mini ? undefined : () => onDelete(alarm.id)}
            onDaysChange={(days) => onUpdateDays(alarm.id, days)}
            onSoundChange={(sound) => onUpdateSound(alarm.id, sound)}
            onEffectsChange={(eff) => onUpdateEffects(alarm.id, eff)}
            onLabelChange={(label) => onUpdateLabel(alarm.id, label)}
            uiSoundsEnabled={uiSoundsEnabled}
          />
        ))}
      </div>
    </div>
  );
};

export default AlarmList;