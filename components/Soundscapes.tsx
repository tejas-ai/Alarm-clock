
import React, { useState } from 'react';

const sounds = [
    { id: 'rain', name: 'Summer Rain', icon: '🌧️', color: 'bg-blue-500' },
    { id: 'forest', name: 'Forest Path', icon: '🌲', color: 'bg-green-500' },
    { id: 'waves', name: 'Deep Ocean', icon: '🌊', color: 'bg-indigo-500' },
    { id: 'fire', name: 'Fireplace', icon: '🔥', color: 'bg-orange-500' },
];

const Soundscapes: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {sounds.map(sound => (
        <div 
          key={sound.id}
          onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
          className={`glass p-8 rounded-[32px] flex flex-col items-center gap-4 cursor-pointer transition-all duration-500 group relative ${
            activeSound === sound.id ? 'border-[#CCFF00] border-2 shadow-2xl scale-105' : 'hover:scale-102 border border-transparent'
          }`}
        >
          {activeSound === sound.id && (
              <div className="absolute top-4 right-4 flex gap-1">
                 <div className="w-1 h-3 bg-[#CCFF00] animate-pulse" />
                 <div className="w-1 h-3 bg-[#CCFF00] animate-pulse delay-75" />
                 <div className="w-1 h-3 bg-[#CCFF00] animate-pulse delay-150" />
              </div>
          )}
          <span className="text-4xl group-hover:scale-110 transition-transform">{sound.icon}</span>
          <span className={`font-bold text-sm uppercase tracking-widest ${activeSound === sound.id ? 'text-[#CCFF00]' : 'text-white/40'}`}>
            {sound.name}
          </span>
        </div>
      ))}

      <div className="md:col-span-4 glass p-8 rounded-[32px] mt-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Volume & Immersion</span>
              <span className="text-white font-black">{volume}%</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={volume} 
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full accent-[#CCFF00] h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-white/20 italic">Soundscapes sync with your heart rate for better relaxation.</span>
            <div className="flex items-center gap-4">
                <button className="px-4 py-2 glass rounded-full text-xs font-bold hover:bg-white/10 transition-all uppercase">Timer: 30m</button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Soundscapes;
