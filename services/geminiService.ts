// =====================
// SAVINGS & TIME INSIGHT LOGIC (BANGLADESH EDITION)
// =====================

export const getSavingsInsight = (
  amount: number,
  type: "MONTHLY" | "YEARLY" | "TIME" | "MONEY"
): string => {

  // =====================
  // TIME (Yearly saved HOURS)
  // =====================
  if (type === "TIME") {
    if (amount < 0.5) {
      return "এই সময়টা বিশ্রাম, নামাজ বা ছোট দৈনন্দিন কাজে ব্যবহার করুন।";
    }
    if (amount < 1.5) {
      return "এই সময় দিয়ে বই পড়া বা নিজের পড়াশোনায় মনোযোগ দিতে পারেন।";
    }
    if (amount < 3) {
      return "এই সময় ব্যবহার করে নতুন একটি স্কিল শেখা শুরু করতে পারেন।";
    }
    if (amount < 5) {
      return "এই সময় দিয়ে freelancing, fitness বা side income শুরু করা সম্ভব।";
    }
    return "এই বিশাল সময় দিয়ে বড় প্রজেক্ট, ক্যারিয়ার উন্নয়ন বা পরিবারে সময় দিতে পারেন।";
  }

  // =====================
  // MONTHLY (Mashik) MONEY
  // =====================
  const monthlyRanges = [
    { min: 0, max: 200, text: "এই সঞ্চয় দিয়ে অন্তত খরচ নিয়ন্ত্রণের অভ্যাস তৈরি করুন।" },
    { min: 201, max: 500, text: "১GB–২GB ছোট ইন্টারনেট প্যাক নিতে পারেন।" },
    { min: 501, max: 1000, text: "ভালো মানের কলম/নোটবুক বা একটি ছোট গ্যাজেট কিনতে পারেন।" },
    { min: 1001, max: 3000, text: "একটি বই, ট্রিমার বা দরকারি ঘরোয়া জিনিস কিনতে পারেন।" },
    { min: 3001, max: 7000, text: "একটি হেডফোন/স্মার্ট ব্যান্ড বা অনলাইন কোর্স করতে পারেন।" },
    { min: 7001, max: 15000, text: "একটি ভালো স্মার্টওয়াচ বা একদিনের ট্যুরে যেতে পারেন।" },
    { min: 15001, max: 30000, text: "ফোন আপগ্রেড বা প্রয়োজনীয় গ্যাজেট কিনতে পারেন।" },
    { min: 30001, max: 100000, text: "একটি মানসম্মত ল্যাপটপ বা বড় গ্যাজেট কেনার জন্য জমাতে পারেন।" },
    { min: 100001, max: 999999999, text: "বড় কোনো কেনাকাটা বা বিনিয়োগে ব্যবহার করতে পারেন।" }
  ];

  // =====================
  // YEARLY (Bochhorik) MONEY
  // =====================
  const yearlyRanges = [
    { min: 0, max: 5000, text: "একটি ছোট জরুরি তহবিল তৈরি করুন।" },
    { min: 5001, max: 20000, text: "কক্সবাজার বা সাজেক ভ্রমণ পরিকল্পনা করতে পারেন।" },
    { min: 20001, max: 50000, text: "একটি ভালো স্মার্টফোন বা প্রয়োজনীয় গ্যাজেট কিনতে পারেন।" },
    { min: 50001, max: 100000, text: "ল্যাপটপ বা ক্যামেরায় বিনিয়োগ করা যায়।" },
    { min: 100001, max: 200000, text: "আইফোন বা মোটরবাইক কেনার পরিকল্পনা করতে পারেন।" },
    { min: 200001, max: 500000, text: "বিদেশ ভ্রমণ বা বড় বিনিয়োগের জন্য উপযুক্ত।" },
    { min: 500001, max: 2000000, text: "জমি বা বড় সম্পদের অগ্রিম দিতে পারবেন।" },
    { min: 2000001, max: 999999999, text: "দীর্ঘমেয়াদি সম্পদ ও বিনিয়োগের জন্য চমৎকার।" }
  ];

  // =====================
  // MONEY routing
  // =====================
  if (type === "MONEY") {
    // yearly amount ঢুকছে বলে yearly দিয়ে match
    for (const r of yearlyRanges) {
      if (amount >= r.min && amount <= r.max) {
        return r.text;
      }
    }
  }

  if (type === "MONTHLY") {
    for (const r of monthlyRanges) {
      if (amount >= r.min && amount <= r.max) {
        return r.text;
      }
    }
  }

  if (type === "YEARLY") {
    for (const r of yearlyRanges) {
      if (amount >= r.min && amount <= r.max) {
        return r.text;
      }
    }
  }

  // fallback
  return "এই সঞ্চয়টি ভবিষ্যতের জন্য সংরক্ষণ করুন।";
};
