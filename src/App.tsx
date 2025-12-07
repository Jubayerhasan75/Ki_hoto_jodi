import React, { useState } from 'react';
import { CalculatorType } from './types';
import MoneyCalculator from './components/MoneyCalculator';
import TimeCalculator from './components/TimeCalculator';
import CustomScenario from './components/CustomScenario';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorType>(CalculatorType.MONEY);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">কি হতো যদি?</h1>
            </div>
            {/* Simple API Key Status Indicator (Optional/Dev only) */}
             <div className="text-xs text-slate-400 hidden sm:block">
                v1.1.0
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Intro Text */}
        <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                ছোট পরিবর্তন, <span className="text-indigo-600">বিশাল প্রভাব</span>
            </h2>
            <p className="text-slate-600 text-lg">
                আপনার দৈনন্দিন ছোট ছোট অভ্যাস পরিবর্তন করলে দীর্ঘমেয়াদে কত টাকা বা সময় সাশ্রয় হতে পারে, তা দেখে নিন।
            </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                <button 
                    onClick={() => setActiveTab(CalculatorType.MONEY)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === CalculatorType.MONEY 
                        ? 'bg-emerald-500 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    💰 টাকা সাশ্রয়
                </button>
                <button 
                    onClick={() => setActiveTab(CalculatorType.TIME)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === CalculatorType.TIME 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    ⏳ সময় সাশ্রয়
                </button>
                <button 
                    onClick={() => setActiveTab(CalculatorType.CUSTOM)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === CalculatorType.CUSTOM 
                        ? 'bg-violet-500 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    ✨ কাস্টম
                </button>
            </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="animate-fade-in-up">
            {activeTab === CalculatorType.MONEY && <MoneyCalculator />}
            {activeTab === CalculatorType.TIME && <TimeCalculator />}
            {activeTab === CalculatorType.CUSTOM && <CustomScenario />}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-center text-slate-500 text-sm">
        <p>© ২০২৫ কি হতো যদি? প্রজেক্ট | ছোট অভ্যাস, বড় সঞ্চয় ❤️</p>
      </footer>
    </div>
  );
};

export default App;