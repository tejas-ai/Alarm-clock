
import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import AnalogClock from './components/AnalogClock';
import AlarmList from './components/AlarmList';
import StopwatchView from './components/StopwatchView';
import ImageAnalyzer from './components/ImageAnalyzer';
import Dock from './components/Dock';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab | 'Analyze'>('Clock');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-6 pt-12 pb-32">
      {/* Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-[#31456a] tracking-tight">{activeTab}</h1>
        <button 
          onClick={() => setActiveTab(activeTab === 'Analyze' ? 'Clock' : 'Analyze')}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            activeTab === 'Analyze' ? 'neu-pressed text-[#31456a]' : 'neu-outset text-[#31456a]/60 neu-button'
          }`}
          title="Analyze Image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in duration-500 flex flex-col items-center">
        {activeTab === 'Clock' && (
          <div className="flex flex-col items-center gap-12 w-full">
            <AnalogClock time={currentTime} />
            <AlarmList mini />
          </div>
        )}

        {activeTab === 'Alarm' && (
          <AlarmList />
        )}

        {activeTab === 'Stopwatch' && (
          <StopwatchView />
        )}

        {activeTab === 'Timer' && (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
             <p className="text-[#31456a]/40 font-bold uppercase tracking-widest">Coming Soon</p>
          </div>
        )}

        {activeTab === 'Analyze' && (
          <ImageAnalyzer />
        )}
      </div>

      <Dock activeTab={activeTab as NavTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
