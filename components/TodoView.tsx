import React, { useState } from 'react';
import { Todo } from '../types';
import { breakdownTask } from '../services/gemini';
import { sounds as sfx } from '../services/sounds';

interface Props {
  todos: Todo[];
  onAdd: (text: string, reminder?: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  uiSoundsEnabled: boolean;
}

const TodoView: React.FC<Props> = ({ todos, onAdd, onToggle, onDelete, uiSoundsEnabled }) => {
  const [inputValue, setInputValue] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [showReminderInput, setShowReminderInput] = useState(false);
  const [breakingDown, setBreakingDown] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<Record<string, string>>({});

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    if (uiSoundsEnabled) sfx.playTick();
    const reminderTs = reminderDate ? new Date(reminderDate).getTime() : undefined;
    onAdd(inputValue, reminderTs);
    setInputValue("");
    setReminderDate("");
    setShowReminderInput(false);
  };

  const handleBreakdown = async (todo: Todo) => {
    if (uiSoundsEnabled) sfx.playClick();
    setBreakingDown(todo.id);
    const result = await breakdownTask(todo.text);
    setAiResponse(prev => ({ ...prev, [todo.id]: result || "" }));
    setBreakingDown(null);
  };

  const formatReminder = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4">
        <label className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Quick Add Task</label>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="What needs focus?"
              className="flex-1 h-14 bg-appBg neu-inset border-none rounded-2xl px-5 text-appText font-bold placeholder:text-appMuted/30 focus:ring-2 focus:ring-appText/5"
            />
            <button 
              onClick={() => { if (uiSoundsEnabled) sfx.playClick(); setShowReminderInput(!showReminderInput); }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showReminderInput ? 'neu-pressed text-appText' : 'neu-outset text-appMuted'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <button 
              onClick={handleAdd}
              className="w-14 h-14 rounded-2xl neu-outset flex items-center justify-center text-appText active:neu-pressed transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
          
          {showReminderInput && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <input 
                type="datetime-local" 
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                className="w-full h-12 bg-appBg neu-inset border-none rounded-xl px-4 text-appText font-bold text-sm focus:ring-2 focus:ring-appText/5"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="px-2 text-[10px] font-black text-appMuted uppercase tracking-[0.3em]">Active Tasks</h2>
        {todos.length === 0 ? (
          <div className="neu-inset p-10 rounded-[32px] flex flex-col items-center justify-center text-center opacity-40">
            <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            <span className="text-xs font-bold uppercase tracking-widest">Mind is clear</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {todos.map(todo => (
              <div 
                key={todo.id}
                className={`neu-outset p-5 rounded-[28px] flex flex-col gap-4 transition-all duration-300 ${todo.completed ? 'opacity-50 grayscale-[0.5]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { if (uiSoundsEnabled) sfx.playTick(); onToggle(todo.id); }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${todo.completed ? 'neu-pressed text-appText' : 'neu-inset text-transparent'}`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </button>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className={`text-sm font-bold text-appText truncate transition-all ${todo.completed ? 'line-through opacity-40' : ''}`}>
                      {todo.text}
                    </span>
                    {todo.reminder && (
                      <div className={`flex items-center gap-1.5 mt-1 ${todo.reminderFired && !todo.completed ? 'text-red-500' : 'text-appMuted'}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {formatReminder(todo.reminder)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!todo.completed && (
                      <button 
                        onClick={() => handleBreakdown(todo)}
                        disabled={breakingDown === todo.id}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${aiResponse[todo.id] ? 'bg-appText text-appBg shadow-inner' : 'neu-outset text-appMuted hover:text-appText'}`}
                      >
                        {breakingDown === todo.id ? (
                          <div className="w-4 h-4 border-2 border-appText/30 border-t-appText rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                      </button>
                    )}
                    <button 
                      onClick={() => { if (uiSoundsEnabled) sfx.playTick(); onDelete(todo.id); }}
                      className="w-9 h-9 rounded-xl neu-outset flex items-center justify-center text-red-500/50 hover:text-red-500 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {aiResponse[todo.id] && !todo.completed && (
                  <div className="mt-2 p-4 bg-appText/5 rounded-2xl border border-appText/5 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3 h-3 text-appText/40" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.586 15.586a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM16 10a6 6 0 11-12 0 6 6 0 0112 0z" /></svg>
                      <span className="text-[9px] font-black uppercase text-appText/40 tracking-widest">AI Breakdown</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-appText/70 font-medium whitespace-pre-wrap">
                      {aiResponse[todo.id]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoView;