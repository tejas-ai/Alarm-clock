import React from 'react';
import { UserStats } from '../types';

interface Props {
  stats: UserStats;
}

const ScoreOverview: React.FC<Props> = ({ stats }) => {
  const percentage = stats.luminaIndex;
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="w-full grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Lumina Index Card */}
      <div className="col-span-1 neu-outset p-5 rounded-[32px] flex flex-col items-center justify-between text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <span className="text-[9px] font-black text-appMuted uppercase tracking-widest mb-4">Lumina Index</span>
        
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%" cy="50%" r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-appMuted/5"
            />
            {/* Progress Stroke */}
            <circle
              cx="50%" cy="50%" r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              className="text-appText transition-all duration-1000 ease-out"
              style={{
                strokeDasharray,
                strokeDashoffset
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-appText leading-none">{stats.luminaIndex}</span>
            <span className="text-[8px] font-bold text-appMuted uppercase">/100</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-appText/5 border border-white/5">
           <div className={`w-1.5 h-1.5 rounded-full ${stats.luminaIndex > 80 ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
           <span className="text-[9px] font-black text-appText/60 uppercase tracking-tighter">
             {stats.luminaIndex > 80 ? 'Optimal' : 'Rising'}
           </span>
        </div>
      </div>

      {/* Streak & Consistency Bento */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="flex-1 neu-outset p-5 rounded-[28px] flex flex-col justify-center gap-1 group">
          <span className="text-[9px] font-black text-appMuted uppercase tracking-widest">Consistency</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-appText">{stats.alarmsConsistency}%</span>
            <div className="flex-1 h-1.5 bg-appMuted/10 rounded-full overflow-hidden">
               <div 
                className="h-full bg-appText transition-all duration-1000" 
                style={{ width: `${stats.alarmsConsistency}%` }} 
               />
            </div>
          </div>
        </div>

        <div className="flex-1 neu-outset p-5 rounded-[28px] flex items-center justify-between group">
           <div className="flex flex-col gap-0.5">
             <span className="text-[9px] font-black text-appMuted uppercase tracking-widest">Active Streak</span>
             <span className="text-2xl font-black text-appText">{stats.streak} Days</span>
           </div>
           <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-orange-500">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.234-2.32-.659-3.354a5.205 5.205 0 01-.892 1.492 1 1 0 11-1.48-1.345 3.221 3.221 0 00.73-1.466c.14-.574.196-1.182.196-1.812a1 1 0 00-2.504-.812z" clipRule="evenodd" />
             </svg>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreOverview;