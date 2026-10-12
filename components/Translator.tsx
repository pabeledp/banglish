'use client';

import React, { useState, useEffect, useRef } from 'react';
import { transliteratePhonetic } from './Simulator';

const sourceLanguages = [
  { code: 'auto', name: 'যে কোনো ভাষা (Auto Detect)', icon: '🔍' },
  { code: 'en', name: 'English', sub: 'ইংরেজি', icon: '🇬🇧' },
  { code: 'bn', name: 'বাংলা', sub: 'Bengali', icon: '🇧🇩' },
  { code: 'ar', name: 'العربية', sub: 'Arabic', icon: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', sub: 'Hindi', icon: '🇮🇳' },
  { code: 'es', name: 'Español', sub: 'Spanish', icon: '🇪🇸' },
  { code: 'fr', name: 'Français', sub: 'French', icon: '🇫🇷' },
  { code: 'de', name: 'Deutsch', sub: 'German', icon: '🇩🇪' },
  { code: 'ja', name: '日本語', sub: 'Japanese', icon: '🇯🇵' },
  { code: 'zh', name: '中文', sub: 'Chinese', icon: '🇨🇳' },
  { code: 'tr', name: 'Türkçe', sub: 'Turkish', icon: '🇹🇷' },
  { code: 'ur', name: 'اردو', sub: 'Urdu', icon: '🇵🇰' }
];

const targetLanguages = [
  { code: 'bn', name: 'বাংলা (Bengali)', sub: 'ডিফল্ট', icon: '🇧🇩' },
  { code: 'en', name: 'English', sub: 'ইংরেজি', icon: '🇬🇧' },
  { code: 'ar', name: 'العربية', sub: 'আরবি', icon: '🇸🇦' }
];

const vulgarWords = [
  'চুদেছিস', 'চুদেছে', 'চুদে', 'চোদ', 'চোদা', 'চুদা', 'বাল', 'মাগী', 'খানকি', 'বেশ্যা', 
  'লুচ্চা', 'কুত্তা', 'খানকির', 'বোকাচোদা', 'মাদারচোদ', 'fuck', 'fucking', 'bitch', 
  'asshole', 'bastard', 'cunt', 'dick', 'pussy', 'slut', 'whore', 'choda', 'chuda', 'baal'
];

function hasProfanity(str: string): boolean {
  if (!str) return false;
  const low = str.toLowerCase();
  return vulgarWords.some(v => low.includes(v));
}

const offlineDict: Record<string, Record<string, string>> = {
  "you": { bn: "আপনি / তুমি", ar: "أنتَ / أنتِ / أنتم" },
  "u": { bn: "আপনি / তুমি", ar: "أنتَ" },
  "i": { bn: "আমি", ar: "أنا" },
  "me": { bn: "আমাকে", ar: "إياي" },
  "my": { bn: "আমার", ar: "لي / خاصتي" },
  "mine": { bn: "আমার", ar: "لي" },
  "we": { bn: "আমরা", ar: "نحن" },
  "us": { bn: "আমাদের / আমাদেরকে", ar: "لنا" },
  "our": { bn: "আমাদের", ar: "لنا" },
  "ours": { bn: "আমাদের", ar: "لنا" },
  "your": { bn: "আপনার / তোমার", ar: "لك" },
  "yours": { bn: "আপনার / তোমার", ar: "لك" },
  "he": { bn: "সে / তিনি", ar: "هو" },
  "him": { bn: "তাকে / তাঁকে", ar: "له" },
  "his": { bn: "তার / তাঁর", ar: "له" },
  "she": { bn: "সে / তিনি", ar: "هي" },
  "her": { bn: "তার / তাঁর", ar: "لها" },
  "hers": { bn: "তার / তাঁর", ar: "لها" },
  "they": { bn: "তারা / তাঁরা", ar: "هم" },
  "them": { bn: "তাদের / তাঁদেরকে", ar: "لهم" },
  "their": { bn: "তাদের / তাঁদের", ar: "لهم" },
  "theirs": { bn: "তাদের / তাঁদের", ar: "لهم" },
  "it": { bn: "এটি / এটা", ar: "هو / هي" },
  "its": { bn: "এটির / এর", ar: "له" },
  "this": { bn: "এই / এটি", ar: "هذا" },
  "that": { bn: "ওই / সেটা", ar: "ذلك" },
  "these": { bn: "এইগুলো / এগুলো", ar: "هؤلاء" },
  "those": { bn: "ওইগুলো / সেগুলো", ar: "أولئك" },
  "here": { bn: "এখানে", ar: "هনা" },
  "there": { bn: "সেখানে", ar: "هناك" },
  "what": { bn: "কী", ar: "ماذا" },
  "who": { bn: "কে / কারা", ar: "من" },
  "whom": { bn: "কাকে / কাদেরকে", ar: "من" },
  "whose": { bn: "কার / কাদের", ar: "لمن" },
  "where": { bn: "কোথায়", ar: "أين" },
  "when": { bn: "কখন", ar: "متى" },
  "why": { bn: "কেন", ar: "لماذا" },
  "how": { bn: "কীভাবে / কেমন", ar: "كيف" },
  "which": { bn: "কোনটি", ar: "أي" }
};

function toBanglaDigits(num: number): string {
  const bdDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => bdDigits[parseInt(d, 10)] || d).join('');
}

export default function Translator() {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('bn');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);
  const [isTargetMenuOpen, setIsTargetMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const requestIdRef = useRef(0);

  const sourceLangObj = sourceLanguages.find(l => l.code === sourceLang) || { name: sourceLang, icon: '🌐' };
  const targetLangObj = targetLanguages.find(l => l.code === targetLang) || { name: targetLang, icon: '🌐' };

  const handleTranslate = async (text: string, srcLang: string, tgtLang: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setOutputText('');
      setDetectedLang(null);
      setIsLoading(false);
      return;
    }

    if (hasProfanity(trimmed)) {
      setOutputText('⚠️ শালীন ও শিষ্ট শব্দ ব্যবহার করুন।');
      setIsLoading(false);
      return;
    }

    const currentReqId = ++requestIdRef.current;

    // Detect language if auto
    let effectiveSrc = srcLang;
    if (srcLang === 'auto') {
      const isBn = /[\u0980-\u09FF]/.test(trimmed);
      const isAr = /[\u0600-\u06FF]/.test(trimmed);
      effectiveSrc = isBn ? 'bn' : (isAr ? 'ar' : 'en');
      setDetectedLang(effectiveSrc === 'bn' ? 'বাংলা' : (effectiveSrc === 'ar' ? 'العربية' : 'English'));
    } else {
      setDetectedLang(null);
    }

    let effectiveTgt = tgtLang;
    if (srcLang === 'auto' && effectiveSrc === 'bn' && effectiveTgt === 'bn') {
      effectiveTgt = 'en';
    }

    // 1. Instant check in offline dictionary
    const lowerKey = trimmed.toLowerCase().replace(/[.,!?]+$/, '');
    if (offlineDict[lowerKey] && offlineDict[lowerKey][effectiveTgt]) {
      setOutputText(offlineDict[lowerKey][effectiveTgt]);
      setIsLoading(false);
      return;
    }

    // Check Banglish phonetic if target is bn
    if (effectiveTgt === 'bn') {
      const phoneticCandidate = transliteratePhonetic(trimmed);
      if (phoneticCandidate && phoneticCandidate !== trimmed) {
        setOutputText(phoneticCandidate);
      }
    }

    // 2. Fetch from Official Google Cloud Translation API
    setIsLoading(true);

    try {
      const googleApiKey = 'AIzaSyCs9Fp4gp8oOnyFkogXUBtM8tyMSOYDvsk';
      const postPayload: Record<string, string> = {
        q: trimmed,
        target: effectiveTgt,
        format: 'text'
      };
      if (srcLang !== 'auto') {
        postPayload.source = srcLang;
      }

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      if (currentReqId !== requestIdRef.current) return;

      if (!response.ok) throw new Error('Translation failed');
      const data = await response.json();

      if (data?.data?.translations?.[0]) {
        const trObj = data.data.translations[0];
        const translated = trObj.translatedText;
        if (!hasProfanity(translated)) {
          setOutputText(translated);
        } else {
          fallbackTranslate(trimmed, effectiveTgt);
        }
      } else {
        fallbackTranslate(trimmed, effectiveTgt);
      }
    } catch {
      if (currentReqId === requestIdRef.current) {
        fallbackTranslate(trimmed, effectiveTgt);
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const fallbackTranslate = (text: string, tgt: string) => {
    if (tgt === 'bn') {
      const p = transliteratePhonetic(text);
      if (p && p !== text) {
        setOutputText(p);
        return;
      }
    }
    const words = text.split(/\s+/);
    const translated = words.map(w => {
      const clean = w.toLowerCase().replace(/[^a-zA-Z\u0980-\u09FF\u0600-\u06FF]/g, '');
      return offlineDict[clean]?.[tgt] || w;
    }).join(' ');
    setOutputText(translated);
  };

  const onInputChange = (val: string) => {
    setInputText(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      handleTranslate(val, sourceLang, targetLang);
    }, 300);
  };

  const swapLanguages = () => {
    if (sourceLang === 'auto') {
      setSourceLang(targetLang);
      setTargetLang('bn');
    } else {
      const prevSource = sourceLang;
      const prevTarget = targetLang;
      setSourceLang(prevTarget);
      setTargetLang(prevSource);
      handleTranslate(inputText, prevTarget, prevSource);
    }
  };

  const copyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const speakOutput = () => {
    if (!outputText || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = targetLang === 'bn' ? 'bn-BD' : (targetLang === 'ar' ? 'ar-SA' : 'en-US');
    window.speechSynthesis.speak(utterance);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onInputChange(text);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="dictionary" className="py-16 sm:py-24 relative bg-gradient-to-b from-white via-emerald-50/20 to-white border-t border-emerald-100/70 overflow-hidden">
      {/* Ambient glow decorations */}
      <div className="absolute top-1/4 -right-36 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-36 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold font-bangla border border-emerald-200/80 shadow-xs">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span>অভিধান ও তাৎক্ষণিক অনুবাদক</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-bangla tracking-tight leading-snug">
            বাংলা, ইংরেজি ও আরবি—<span className="text-emerald-600">সহজ ও তাৎক্ষণিক অনুবাদ</span>
          </h2>
        </div>

        {/* Main Dual-Pane Translator Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-emerald-100/90 shadow-xl shadow-emerald-950/5 p-4 sm:p-6 lg:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            
            {/* Left Box: Source Input */}
            <div className="flex flex-col bg-slate-50/70 rounded-2xl border border-slate-200/90 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all p-3.5 sm:p-4">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 font-sans uppercase tracking-wider text-[11px]">From:</span>
                  
                  {/* Source Dropdown */}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsSourceMenuOpen(!isSourceMenuOpen)}
                      className="appearance-none bg-white/80 hover:bg-white backdrop-blur-xl text-slate-800 text-xs font-semibold font-sans py-1.5 pl-2.5 pr-2 rounded-xl border border-white/80 hover:border-emerald-400 shadow-xs hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 font-bangla">
                        <span>{sourceLangObj.icon || '🔍'}</span>
                        <span>{sourceLang === 'auto' ? 'যে কোনো ভাষা' : sourceLangObj.name}</span>
                      </span>
                      <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSourceMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {isSourceMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-60 sm:w-64 max-h-72 overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-2xl p-1.5 z-50 ring-1 ring-emerald-950/5">
                        {sourceLanguages.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setSourceLang(item.code);
                              setIsSourceMenuOpen(false);
                              handleTranslate(inputText, item.code, targetLang);
                            }}
                            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${item.code === sourceLang ? 'bg-emerald-500/15 text-emerald-950 font-semibold' : 'text-slate-700 hover:bg-emerald-500/10 hover:text-emerald-950'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-sans">{item.name}</span>
                              {item.sub && <span className="text-[10px] text-slate-400 font-normal">({item.sub})</span>}
                            </div>
                            {item.code === sourceLang && (
                              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {detectedLang && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Detected: {detectedLang}
                    </span>
                  )}
                </div>

                {/* Clear button */}
                <button 
                  type="button" 
                  onClick={() => {
                    setInputText('');
                    setOutputText('');
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors inline-flex items-center gap-1 font-bangla text-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  <span>মুছুন</span>
                </button>
              </div>

              {/* Textarea */}
              <textarea 
                rows={3} 
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="এখানে কিছু লিখুন..." 
                className="w-full bg-transparent resize-none min-h-[90px] max-h-36 overflow-y-auto text-slate-800 text-sm sm:text-base focus:outline-none placeholder:text-slate-400 font-sans leading-relaxed"
              />

              {/* Bottom bar */}
              <div className="mt-auto pt-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/70">
                <span>{toBanglaDigits(inputText.length)} অক্ষর</span>
                <button 
                  type="button" 
                  onClick={handlePaste}
                  className="hover:text-emerald-700 transition-colors inline-flex items-center gap-1 font-bangla cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  <span>পেস্ট করুন</span>
                </button>
              </div>
            </div>

            {/* Right Box: Target Output */}
            <div className="flex flex-col bg-emerald-50/40 rounded-2xl border border-emerald-200/80 p-3.5 sm:p-4">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-emerald-200/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800 font-sans uppercase tracking-wider text-[11px]">To:</span>
                  
                  {/* Target Dropdown */}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setIsTargetMenuOpen(!isTargetMenuOpen)}
                      className="appearance-none bg-white/80 hover:bg-white backdrop-blur-xl text-slate-800 text-xs font-semibold font-sans py-1.5 pl-2.5 pr-2 rounded-xl border border-emerald-200 hover:border-emerald-400 shadow-xs hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-1 font-bangla">
                        <span>{targetLangObj.icon || '🌐'}</span>
                        <span>{targetLangObj.name}</span>
                      </span>
                      <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isTargetMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </button>

                    {isTargetMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 max-h-72 overflow-y-auto rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-2xl p-1.5 z-50 ring-1 ring-emerald-950/5">
                        {targetLanguages.map((item) => (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => {
                              setTargetLang(item.code);
                              setIsTargetMenuOpen(false);
                              handleTranslate(inputText, sourceLang, item.code);
                            }}
                            className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${item.code === targetLang ? 'bg-emerald-500/15 text-emerald-950 font-semibold' : 'text-slate-700 hover:bg-emerald-500/10 hover:text-emerald-950'}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{item.icon}</span>
                              <span className="font-sans">{item.name}</span>
                            </div>
                            {item.code === targetLang && (
                              <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <button 
                    type="button" 
                    onClick={swapLanguages}
                    title="ভাষা অদলবদল (Swap)"
                    className="p-1 rounded-lg hover:bg-emerald-100 text-slate-500 hover:text-emerald-800 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  </button>
                </div>

                {/* Speak button */}
                <button 
                  type="button" 
                  onClick={speakOutput}
                  className="text-emerald-700 hover:text-emerald-900 transition-colors inline-flex items-center gap-1 font-bangla text-xs cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                  <span>শুনুন</span>
                </button>
              </div>

              {/* Output Display */}
              <div className="w-full bg-transparent min-h-[90px] max-h-36 overflow-y-auto text-emerald-950 font-bangla text-base sm:text-lg font-medium leading-relaxed select-all">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>অনুবাদ করা হচ্ছে...</span>
                  </div>
                ) : (
                  outputText || <span className="text-slate-400 font-normal text-sm">অনুবাদ এখানে প্রদর্শিত হবে...</span>
                )}
              </div>

              {/* Bottom bar */}
              <div className="mt-auto pt-2.5 flex items-center justify-between text-xs text-emerald-700/80 border-t border-emerald-200/60">
                <span>{toBanglaDigits(outputText.length)} অক্ষর</span>
                <button 
                  type="button" 
                  onClick={copyOutput}
                  className="hover:text-emerald-950 transition-colors inline-flex items-center gap-1 font-bangla cursor-pointer font-semibold"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
