
import React, { useState, useEffect } from 'react';
import { getSleepInsight, suggestWakeUpTime } from '../services/gemini';

const SleepAssistant: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing sleep trends...");
  const [bedtime, setBedtime] = useState("22:30");
  const [suggestion, setSuggestion] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
        const text = await getSleepInsight("6h 42m total sleep, high efficiency.");
        setInsight(text || "");
    };
    fetchInsight();
  }, []);

  const handleSuggest = async () => {
      setLoading(true);
      const time = await suggestWakeUpTime(bedtime);
      setSuggestion(time);
      setLoading(false);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="glass p-6 md:p-8 rounded-[24px] md:rounded-[32px] border-l-4 border-[#CCFF00]">
        <div className="flex items-center gap-3 mb-3 md:mb-4">
          <div className="p-2 bg-[#CCFF00] rounded-lg">
             <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>
          </div>
          <span className="font-bold text-sm md:text-base text-white/90">Lumina AI Insight</span>
        </div>
        <p className="text-lg md:text-xl leading-relaxed text-white/80 italic font-medium">"{insight}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 md:p-6 rounded-[24px]">
          <h3 className="text-[10px] md:text-xs font-bold text-white/40 uppercase mb-4 tracking-wider">Optimizer</h3>
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center text-sm">
                <span>Bedtime:</span>
                <input 
                    type="time" 
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="bg-white/10 border-none rounded-lg p-2 text-white focus:ring-1 focus:ring-[#CCFF00] text-sm"
                />
             </div>
             <button 
                onClick={handleSuggest}
                disabled={loading}
                className="w-full bg-[#CCFF00] text-black font-bold py-3 rounded-xl hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50 text-sm"
             >
                {loading ? 'Thinking...' : 'Calculate Wake Window'}
             </button>
             {suggestion && (
                <div className="mt-2 p-4 bg-white/5 rounded-xl text-center animate-in slide-in-from-top-2 duration-500">
                    <div className="text-[10px] font-bold text-white/40 uppercase">Optimal Time</div>
                    <div className="text-2xl md:text-3xl font-black text-[#CCFF00]">{suggestion}</div>
                </div>
             )}
          </div>
        </div>

        <div className="glass p-5 md:p-6 rounded-[24px] flex flex-col justify-between gap-4">
           <div>
            <h3 className="text-[10px] md:text-xs font-bold text-white/40 uppercase mb-4 tracking-wider">Weekly Activity</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-white/60">Avg Sleep</span>
                    <span className="font-bold">7h 12m</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[72%]" />
                </div>
            </div>
           </div>
           <button className="w-full border border-white/10 text-white/60 font-bold py-2 rounded-xl hover:bg-white/5 transition-all text-[10px] md:text-xs uppercase tracking-widest">Reports</button>
        </div>
      </div>
    </div>
  );
};

export default SleepAssistant;
