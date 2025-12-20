import React, { useState } from 'react';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CalendarView: React.FC = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date();

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });

  // Create grid items
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square rounded-2xl opacity-5" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
    days.push(
      <div 
        key={d} 
        className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 ${
          isToday 
            ? 'neu-pressed bg-appText/5 text-appText' 
            : 'neu-outset text-appText/80 hover:bg-appText/5'
        }`}
      >
        <span className={`text-sm font-black ${isToday ? 'scale-110' : ''}`}>{d}</span>
        {isToday && (
          <div className="absolute bottom-2 w-1 h-1 rounded-full bg-appText animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-appMuted uppercase tracking-[0.4em] mb-1 opacity-60">{currentYear}</span>
          <h2 className="text-2xl font-black text-appText uppercase tracking-tight">{monthName}</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={prevMonth}
            className="w-12 h-12 rounded-2xl neu-outset flex items-center justify-center text-appText active:neu-pressed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextMonth}
            className="w-12 h-12 rounded-2xl neu-outset flex items-center justify-center text-appText active:neu-pressed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-3 px-1">
        {WEEKDAYS.map(day => (
          <span key={day} className="text-[9px] font-black text-appMuted text-center tracking-widest opacity-40">
            {day}
          </span>
        ))}
      </div>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-3 p-1">
        {days}
      </div>
    </div>
  );
};

export default CalendarView;