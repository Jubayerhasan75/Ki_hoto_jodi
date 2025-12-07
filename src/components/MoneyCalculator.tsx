import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getSavingsInsight } from '../services/geminiService';

const PRESETS = [
  {
    id: 'cigarette',
    title: 'ধূমপান বর্জন',
    icon: '🚭',
    cost: 16,
    current: 10,
    goal: 0,
    desc: 'দিনে ১০টি সিগারেট থেকে ০-তে নামলে',
    period: 'daily'
  },
  {
    id: 'rickshaw',
    title: 'রিকশা vs হাঁটা',
    icon: '🚶',
    cost: 40,
    current: 2,
    goal: 0,
    desc: 'দিনে ২ বার রিকশার বদলে হাঁটলে',
    period: 'daily'
  },
  {
    id: 'tea',
    title: 'অতিরিক্ত চা/কফি',
    icon: '☕',
    cost: 15,
    current: 5,
    goal: 2,
    desc: 'দিনে ৫ কাপ থেকে ২ কাপে আনলে',
    period: 'daily'
  },
  {
    id: 'restaurant',
    title: 'রেস্টুরেন্টে খাওয়া',
    icon: '🍕',
    cost: 800,
    current: 4,
    goal: 1,
    desc: 'মাসে ৪ বার থেকে ১ বার করলে',
    period: 'monthly'
  },
  {
    id: 'online_order',
    title: 'অনলাইন অর্ডার',
    icon: '📦',
    cost: 500,
    current: 6,
    goal: 2,
    desc: 'মাসে ৬টি পার্সেল থেকে ২টিতে আনলে',
    period: 'monthly'
  }
];

const MoneyCalculator: React.FC = () => {
  // Allow string to support empty input field (UX improvement)
  const [data, setData] = useState<{
    itemCost: number | string;
    currentDailyUsage: number | string;
    goalDailyUsage: number | string;
  }>({
    itemCost: 16, 
    currentDailyUsage: 10,
    goalDailyUsage: 0,
  });

  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
  const [activePreset, setActivePreset] = useState<string>('cigarette');
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Helper to safely get number for calc
  const getNum = (val: number | string) => (typeof val === 'number' ? val : 0);

  const itemCost = getNum(data.itemCost);
  const currentDailyUsage = getNum(data.currentDailyUsage);
  const goalDailyUsage = getNum(data.goalDailyUsage);

  // Calculations
  const savedItemsPerPeriod = Math.max(0, currentDailyUsage - goalDailyUsage);
  
  let dailySaving = 0;
  let monthlySaving = 0;

  if (period === 'daily') {
    dailySaving = savedItemsPerPeriod * itemCost;
    monthlySaving = dailySaving * 30;
  } else {
    monthlySaving = savedItemsPerPeriod * itemCost;
    dailySaving = monthlySaving / 30;
  }

  const yearlySaving = monthlySaving * 12;
  const fiveYearSaving = yearlySaving * 5;

  const chartData = [
    { name: '১ মাস', amount: monthlySaving },
    { name: '১ বছর', amount: yearlySaving },
    { name: '৫ বছর', amount: fiveYearSaving },
  ];

  const fetchInsight = useCallback(async (amount: number) => {
    if (amount <= 1000) {
      setInsight("টাকা জমানো শুরু করুন, ম্যাজিক দেখুন!");
      return;
    }
    setLoadingInsight(true);
    const result = await getSavingsInsight(amount, 'MONEY');
    setInsight(result);
    setLoadingInsight(false);
  }, []);

  // Debounce API call for insight
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInsight(yearlySaving);
    }, 1500);
    return () => clearTimeout(timer);
  }, [yearlySaving, fetchInsight]);

  const handleChange = (field: keyof typeof data, value: string) => {
    // Handle empty string separately to allow deleting the value
    if (value === '') {
        setData(prev => ({ ...prev, [field]: '' }));
        setActivePreset('');
        return;
    }
    
    const numVal = parseFloat(value);
    // Only update if it's a valid number
    if (!isNaN(numVal)) {
        setData(prev => ({ ...prev, [field]: numVal }));
        setActivePreset('');
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setData({
      itemCost: preset.cost,
      currentDailyUsage: preset.current,
      goalDailyUsage: preset.goal
    });
    setPeriod((preset.period as 'daily' | 'monthly') || 'daily');
    setActivePreset(preset.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Scenario Selection */}
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-4">জনপ্রিয় কিছু দৃশ্যপট (Scenarios) বেছে নিন:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
                activePreset === preset.id 
                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200' 
                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{preset.icon}</span>
                <span className={`font-bold ${activePreset === preset.id ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {preset.title}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-tight">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Inputs */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-t-xl"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h4 className="text-md font-semibold text-slate-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            নিজের মতো করে হিসাব করুন
            </h4>
            
            {/* Frequency Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-lg self-start">
                <button 
                    onClick={() => setPeriod('daily')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${period === 'daily' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    দৈনিক হিসাব
                </button>
                <button 
                    onClick={() => setPeriod('monthly')}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${period === 'monthly' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    মাসিক হিসাব
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
                {period === 'daily' ? 'প্রতিটির খরচ কত? (৳)' : 'প্রতি অর্ডারে/বারে খরচ কত? (৳)'}
            </label>
            <input
              type="number"
              value={data.itemCost}
              onChange={(e) => handleChange('itemCost', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
                {period === 'daily' ? 'বর্তমানে দিনে কয়টি/কতবার?' : 'বর্তমানে মাসে কতবার?'}
            </label>
            <input
              type="number"
              value={data.currentDailyUsage}
              onChange={(e) => handleChange('currentDailyUsage', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-slate-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
                {period === 'daily' ? 'দিনে কমিয়ে কয়টি করবেন?' : 'মাসে কমিয়ে কয়বার করবেন?'}
            </label>
            <input
              type="number"
              value={data.goalDailyUsage}
              onChange={(e) => handleChange('goalDailyUsage', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-xl transform transition-transform hover:scale-[1.01]">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 opacity-95">
            <span>💰</span> আপনার মোট সাশ্রয়
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-emerald-100 font-medium">দৈনিক বাঁচবে</span>
              <span className="text-2xl font-bold tracking-tight">৳{Math.floor(dailySaving).toLocaleString('bn-BD')}</span>
            </div>
            {/* Monthly Savings */}
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-emerald-100 font-medium">মাসে বাঁচবে</span>
              <span className="text-3xl font-bold tracking-tight text-yellow-200">৳{Math.floor(monthlySaving).toLocaleString('bn-BD')}</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/20 pb-2">
              <span className="text-emerald-100 font-medium">বছরে বাঁচবে</span>
              <span className="text-4xl font-bold tracking-tight text-yellow-300">৳{yearlySaving.toLocaleString('bn-BD')}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-emerald-100 font-medium">৫ বছরে বাঁচবে</span>
              <span className="text-2xl font-bold tracking-tight opacity-90">৳{fiveYearSaving.toLocaleString('bn-BD')}</span>
            </div>
          </div>
          
          <div className="mt-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-inner">
            <p className="text-xs text-emerald-200 mb-2 uppercase tracking-wider font-bold">✨ বাৎসরিক সাশ্রয় দিয়ে যা সম্ভব</p>
            {loadingInsight ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-sm">ভেবে দেখছি...</span>
              </div>
            ) : (
              <p className="text-lg font-bold text-white leading-relaxed">
                {insight ? `"${insight}"` : "হিসাব করার জন্য তথ্য দিন..."}
              </p>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold text-slate-700 mb-6 border-l-4 border-emerald-500 pl-3">সাশ্রয়ের গ্রাফ</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f0fdfa'}}
                  formatter={(value: number) => [`৳${value.toLocaleString('bn-BD')}`, 'পরিমাণ']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#ffffff',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={1500}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#a7f3d0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">গ্রাফে ১ মাস, ১ বছর এবং ৫ বছরের তুলনা দেখানো হয়েছে</p>
        </div>
      </div>
    </div>
  );
};

export default MoneyCalculator;