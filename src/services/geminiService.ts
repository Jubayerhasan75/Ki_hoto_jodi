import { GoogleGenAI } from "@google/genai";

const FALLBACK_MONEY = [
  "একটি ভালো বই কিনুন।",
  "ভবিষ্যতের জন্য বিনিয়োগ করুন।",
  "বন্ধুদের সাথে আড্ডা দিন।",
  "প্রিয়জনকে উপহার দিন।",
  "শখের কাজে খরচ করুন।",
  "একটি গাছ লাগান।",
  "ভালো কোনো রেস্টুরেন্টে খান।"
];

const FALLBACK_TIME = [
  "নতুন একটি ভাষা শিখুন।",
  "ব্যায়াম বা যোগব্যায়াম করুন।",
  "পরিবারকে সময় দিন।",
  "অনলাইন কোর্স করুন।",
  "পছন্দের বই পড়ুন।",
  "বাগান করুন।",
  "নতুন কোনো স্কিল শিখুন।"
];

// Simple in-memory cache to reduce API calls
const insightsCache: Record<string, string> = {};

// Circuit Breaker state
let isOfflineMode = false;

// Initialize AI lazily to prevent crash if key is missing on load
let ai: GoogleGenAI | null = null;
try {
  if (process.env.API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("AI Client init failed, defaulting to offline mode.");
}

const getRandomFallback = (type: 'MONEY' | 'TIME') => {
  const list = type === 'MONEY' ? FALLBACK_MONEY : FALLBACK_TIME;
  return list[Math.floor(Math.random() * list.length)];
};

export const getSavingsInsight = async (amount: number, type: 'MONEY' | 'TIME'): Promise<string> => {
  // 1. If Offline Mode is active or no API Key or AI client failed, return fallback immediately
  if (isOfflineMode || !process.env.API_KEY || !ai) {
    return getRandomFallback(type);
  }

  // 2. Check Cache
  const cacheKey = `${type}-${amount}`;
  if (insightsCache[cacheKey]) {
    return insightsCache[cacheKey];
  }
  
  try {
    const model = 'gemini-2.5-flash';
    let prompt = "";
    
    if (type === 'MONEY') {
      prompt = `
        Context: A user in Bangladesh has saved ৳${amount} by changing a habit.
        Task: Suggest ONE specific, attractive thing they can buy or do with this amount in Bangladesh. 
        Keep it short (max 10 words). Language: Bengali.
        Examples: 
        - 5000: একটি ভালো হেডফোন।
        - 20000: কক্সবাজার ট্যুর।
        - 100000: একটি ভালো ল্যাপটপ।
        output just the suggestion text.
      `;
    } else {
       prompt = `
        Context: A user has saved ${amount} hours in a year by reducing social media usage.
        Task: Suggest ONE productive skill or activity they could master in this time.
        Keep it short (max 10 words). Language: Bengali.
        Output just the suggestion text.
      `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const result = response.text ? response.text.trim() : getRandomFallback(type);
    
    // Save to cache
    insightsCache[cacheKey] = result;
    
    return result;

  } catch (error: any) {
    // 3. Handle Errors & Activate Circuit Breaker if Quota Exceeded
    if (error?.status === 429 || error?.code === 429 || error?.message?.includes('429')) {
      console.warn("Gemini API Quota Exceeded. Switching to Offline Mode.");
      isOfflineMode = true; // Activate circuit breaker
    } else {
      console.error("Gemini Error:", error);
    }
    return getRandomFallback(type);
  }
};