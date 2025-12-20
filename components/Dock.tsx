import React, { useState, useEffect, useRef } from 'react';
import { NavTab } from '../types';

interface Props {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const Dock: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const dockRef = useRef<HTMLDivElement>(null);

  const tabs: { id: NavTab; icon: React.ReactNode }[] = [
    { 
        id: 'Clock', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    },
    { 
        id: 'World', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
    },
    { 
        id: 'Alarm', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )
    },
    { 
        id: 'Focus', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
    },
    { 
        id: 'Calendar', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
    },
    { 
        id: 'Stopwatch', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3M12 2v2M20 7l-1.4 1.4M4 7l1.4 1.4M12 22a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        )
    },
    { 
        id: 'Timer', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2v6l4 4-4 4v6h12v-6l-4-4 4-4V2H6z" />
          </svg>
        )
    },
    { 
        id: 'Settings', 
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const activeIndex = tabs.findIndex(t => t.id === activeTab);
  const itemWidthPercent = 100 / tabs.length;

  return (
    <div ref={dockRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-md p-2 rounded-[32px] neu-outset backdrop-blur-md bg-appBg/80 z-50 overflow-hidden">
      {/* Scroll Progress line at the very top */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-appMuted/5">
        <div className="h-full bg-appText transition-all duration-300 ease-out shadow-[0_0_8px_currentColor]" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="relative flex justify-between items-center w-full">
        {/* Sliding Indicator */}
        <div 
          className="absolute h-12 rounded-2xl neu-pressed bg-appText/5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{ 
            width: `calc(${itemWidthPercent}% - 8px)`, 
            left: `calc(${activeIndex * itemWidthPercent}% + 4px)`,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative z-10 flex-1 h-12 flex items-center justify-center transition-all duration-500 ${activeTab === tab.id ? 'text-appText scale-110' : 'text-appMuted hover:text-appText/60'}`}
            aria-label={tab.id}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dock;