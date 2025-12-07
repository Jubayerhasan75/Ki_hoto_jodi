import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend } from 'recharts';
import { TimeCalcData } from '../types';
import { getSavingsInsight } from '../services/geminiService';

const TIME_PRESETS = [
  {
    id: 'social',
    title: 'সোশ্যাল মিডিয়া',
    icon: '📱',
    current: 4,
    goal: 1,
    desc: 'ফেসবুক/ইনস্টাগ্রাম ৪ ঘণ্টা থেকে ১ ঘণ্টায়'
  },
  {
    id: 'tv',
    title: 'টিভি/সিরিজ',
    icon: '📺',
    current: 3,
    goal: 0.5,
    desc: 'বিঞ্জ-ওয়াচিং কমিয়ে দিনে ৩০ মিনিট'
  },
  {
    id: 'traffic',
    title: 'যানজট (অপচয়)',
    icon: '🚌',
    current: 3,
    goal: 1.5,
    desc: 'রাস্তার জ্যামে বসে থাকা সময়'
  }
];

const TimeCalculator: React.FC = () => {
  const [data, setData] = useState<TimeCalcData>({
    currentDailyHours: 4,
    goalDailyHours: 1,
  });

  const [activePreset, setActivePreset] = useState<string>('social');
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculations
  const savedHoursPerDay = Math.max(0, data.currentDailyHours - data.goalDailyHours);
  const yearlySavedHours = savedHoursPerDay * 365;
  const yearlySavedDays = yearlySavedHours / 24;
  
  // Assumptions
  const booksRead = Math.floor(yearlySavedHours / 10); // 10 hours per book
  const skillsLearned = (yearlySavedHours / 240).toFixed(1); // 240 hours per skill

  // Chart Data (Daily breakdown)
  const pieData = [
    { name: 'অপচয় করা সময়', value: data.currentDailyHours, color: '#f43f5e' }, // Rose 500
    { name: 'লক্ষ্যমাত্রা', value: data.goalDailyHours, color: '#3b82f6' }, // Blue 500
    { name: 'বাকি সময়', value: Math.max(0, 24 - data.currentDailyHours), color: '#f1f5f9' }, // Slate 100
  ];

 const fetchInsight = useCallback(async () => {
  if (savedHoursPerDay <= 0) {
    setInsight("সময় বাঁচাতে শুরু করুন!");
    return;
  }
  setLoadingInsight(true);
  const result = await getSavingsInsight(savedHoursPerDay, 'TIME');
  setInsight(result);
  setLoadingInsight(false);
}, [savedHoursPerDay]);


  useEffect(() => {
  const timer = setTimeout(() => {
    fetchInsight();
  }, 1500);
  return () => clearTimeout(timer);
}, [fetchInsight]);


  const applyPreset = (preset: typeof TIME_PRESETS[0]) => {
    setData({
      currentDailyHours: preset.current,
      goalDailyHours: preset.goal
    });
    setActivePreset(preset.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Scenarios */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">কোথায় সময় বেশি যাচ্ছে?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                activePreset === preset.id 
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{preset.icon}</span>
                <span className={`font-bold ${activePreset === preset.id ? 'text-blue-700' : 'text-slate-700'}`}>
                  {preset.title}
                </span>
              </div>
              <p className="text-sm text-slate-500">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Slider Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-rose-400 to-blue-500 rounded-r-xl"></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-4">
                    <span>বর্তমানে দৈনিক ব্যয় করছেন</span>
                    <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs">{data.currentDailyHours} ঘণ্টা</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="12" 
                    step="0.5"
                    value={data.currentDailyHours}
                    onChange={(e) => {
                        setData(prev => ({...prev, currentDailyHours: parseFloat(e.target.value)}));
                        setActivePreset('');
                    }}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                />
                <p className="text-xs text-slate-400 mt-2">সর্বোচ্চ ১২ ঘণ্টা পর্যন্ত</p>
             </div>
             
             <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-4">
                    <span>আপনার লক্ষ্য (Target)</span>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">{data.goalDailyHours} ঘণ্টা</span>
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="12" 
                    step="0.5"
                    value={data.goalDailyHours}
                    onChange={(e) => {
                        setData(prev => ({...prev, goalDailyHours: parseFloat(e.target.value)}));
                        setActivePreset('');
                    }}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-slate-400 mt-2">যত কমাবেন, তত লাভ</p>
             </div>
         </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-6 opacity-95 flex items-center gap-2">
                <span>⏳</span> সময় সাশ্রয়ের ফলাফল
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/5">
                    <div className="text-3xl font-extrabold text-yellow-300">{yearlySavedHours}</div>
                    <div className="text-xs font-medium text-indigo-100 mt-1 uppercase">ঘণ্টা / বছর</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/5">
                    <div className="text-3xl font-extrabold text-yellow-300">{yearlySavedDays.toFixed(1)}</div>
                    <div className="text-xs font-medium text-indigo-100 mt-1 uppercase">দিন / বছর</div>
                </div>
            </div>

            <h4 className="text-sm font-bold text-indigo-200 mb-3 uppercase tracking-wide border-b border-indigo-500 pb-2">এই সময়ে যা করা সম্ভব:</h4>
            <ul className="space-y-4">
                <li className="flex items-center gap-4">
                    <div className="bg-white text-indigo-600 p-2 rounded-full shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    </div>
                    <div>
                        <span className="font-bold text-xl block">{booksRead} টি</span>
                        <span className="text-sm text-indigo-200">নতুন বই পড়া যাবে</span>
                    </div>
                </li>
                <li className="flex items-center gap-4">
                    <div className="bg-white text-indigo-600 p-2 rounded-full shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                    </div>
                    <div>
                        <span className="font-bold text-xl block">{skillsLearned} টি</span>
                        <span className="text-sm text-indigo-200">নতুন স্কিল শেখা যাবে</span>
                    </div>
                </li>
            </ul>
          </div>

          <div className="mt-8 pt-4 border-t border-white/20">
             <div className="flex items-start gap-2">
                 <span className="text-lg">💡</span>
                 <div>
                    <p className="text-xs text-indigo-200 font-bold mb-1">AI পরামর্শ:</p>
                    {loadingInsight ? (
                        <span className="animate-pulse text-sm">বুদ্ধি খাটাচ্ছি...</span>
                    ) : (
                        <p className="text-md font-bold text-white leading-tight">"{insight}"</p>
                    )}
                 </div>
             </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 min-h-[350px] flex flex-col items-center justify-center relative">
          <h3 className="text-lg font-bold text-slate-700 mb-2 w-full text-left border-l-4 border-blue-500 pl-3">২৪ ঘণ্টার হিসাব</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ReTooltip 
                formatter={(val: number) => `${val} ঘণ্টা`} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-8">
             <div className="text-center">
                 <span className="block text-3xl font-bold text-slate-800">{data.currentDailyHours}h</span>
                 <span className="text-xs text-slate-400">বর্তমান ব্যয়</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeCalculator;