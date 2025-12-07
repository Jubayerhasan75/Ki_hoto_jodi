import React, { useState, useEffect } from 'react';
import { getSavingsInsight } from '../services/geminiService';

const CustomScenario: React.FC = () => {
    // State for immediate calculation - using union type to support empty inputs
    const [name, setName] = useState('');
    const [costPerUnit, setCostPerUnit] = useState<number | string>('');
    const [currentUse, setCurrentUse] = useState<number | string>('');
    const [goalUse, setGoalUse] = useState<number | string>('');
    
    // Result State
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(false);

    // Helpers to safely convert state to number for calculation
    const getNum = (val: number | string) => (typeof val === 'number' ? val : 0);

    const cost = getNum(costPerUnit);
    const current = getNum(currentUse);
    const goal = getNum(goalUse);

    const savedPerDay = Math.max(0, current - goal);
    const dailySavingAmount = savedPerDay * cost;
    const yearlySavingAmount = dailySavingAmount * 365;

    useEffect(() => {
        const fetchInsight = async () => {
            if (yearlySavingAmount > 0) {
                setLoading(true);
                const result = await getSavingsInsight(yearlySavingAmount, 'MONEY');
                setInsight(result);
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchInsight();
        }, 1500);

        return () => clearTimeout(timer);
    }, [yearlySavingAmount]);

    // Handle number inputs allowing empty string
    const handleNumChange = (setter: React.Dispatch<React.SetStateAction<number | string>>, value: string) => {
        if (value === '') {
            setter('');
            return;
        }
        const num = parseFloat(value);
        if (!isNaN(num)) {
            setter(num);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 text-violet-600 mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">নিজের মতো হিসাব করুন</h2>
                <p className="text-slate-500 mt-2">আপনার অদ্ভুত সব আইডিয়া বা অভ্যাস এখানে বসিয়ে দেখুন কি সাশ্রয় হয়!</p>
            </div>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">অভ্যাস বা আইটেমের নাম</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="যেমন: বিকেলে ফুচকা খাওয়া, রিকশায় ঘোরা..." 
                            className="w-full p-4 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none focus:bg-white transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">প্রতিবারের খরচ (৳)</label>
                        <input 
                            type="number" 
                            value={costPerUnit}
                            onChange={(e) => handleNumChange(setCostPerUnit, e.target.value)}
                            placeholder="৫০" 
                            className="w-full p-4 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none focus:bg-white transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">এখন করছেন (দৈনিক)</label>
                            <input 
                                type="number" 
                                value={currentUse}
                                onChange={(e) => handleNumChange(setCurrentUse, e.target.value)}
                                placeholder="২" 
                                className="w-full p-4 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none focus:bg-white transition-all text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">লক্ষ্য (দৈনিক)</label>
                            <input 
                                type="number" 
                                value={goalUse}
                                onChange={(e) => handleNumChange(setGoalUse, e.target.value)}
                                placeholder="০" 
                                className="w-full p-4 border border-slate-200 bg-slate-50 rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none focus:bg-white transition-all text-center text-violet-600 font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Result */}
            {yearlySavingAmount > 0 && (
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-8 text-white shadow-xl animate-fade-in-up">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg opacity-90 mb-1">
                                যদি আপনি <span className="font-bold text-yellow-300">"{name || 'এটি'}"</span> কমিয়ে আনেন...
                            </h3>
                            <p className="text-4xl font-extrabold mt-2">
                                বছরে বাঁচবে ৳{yearlySavingAmount.toLocaleString('bn-BD')}
                            </p>
                            <p className="text-sm opacity-75 mt-2">
                                (দৈনিক সাশ্রয় ৳{dailySavingAmount})
                            </p>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-sm w-full">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🎁</span>
                                <div>
                                    <p className="text-xs font-bold text-violet-200 uppercase mb-1">এই টাকায় যা করা যেত</p>
                                    {loading ? (
                                        <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
                                    ) : (
                                        <p className="text-lg font-bold leading-tight">"{insight}"</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {yearlySavingAmount <= 0 && (
                <div className="text-center text-slate-400 py-10">
                    <p>ফলাফল দেখতে উপরের তথ্যগুলো পূরণ করুন 👆</p>
                </div>
            )}
        </div>
    );
};

export default CustomScenario;