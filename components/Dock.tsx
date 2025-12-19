
import React from 'react';
import { NavTab } from '../types';

interface Props {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const Dock: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavTab; icon: React.ReactNode }[] = [
    { 
        id: 'Clock', 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
        id: 'Alarm', 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
        id: 'Stopwatch', 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
        id: 'Timer', 
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> 
    }
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm flex justify-between p-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            activeTab === tab.id 
              ? 'neu-pressed text-[#31456a]' 
              : 'neu-outset text-[#31456a]/40 neu-button'
          }`}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
};

export default Dock;
