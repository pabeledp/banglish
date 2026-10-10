'use client';

import React, { useState, useTransition } from 'react';
import { searchDictionary, LanguageMode } from '@/lib/dictionarySearch';
import { DictionaryEntry } from '@/lib/dictionaryData';
import { Search, Globe, ArrowRightLeft, Volume2, BookOpen, Sparkles, Copy, Check } from 'lucide-react';

export default function DictionaryApp() {
  const [query, setQuery] = useState('');
  const [sourceLang, setSourceLang] = useState<LanguageMode>('bn');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const results = searchDictionary(query, sourceLang);

  const swapLanguage = () => {
    if (sourceLang === 'bn') setSourceLang('en');
    else if (sourceLang === 'en') setSourceLang('ar');
    else setSourceLang('bn');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLanguageLabel = (lang: LanguageMode) => {
    switch (lang) {
      case 'bn': return 'বাংলা (Bengali)';
      case 'en': return 'English';
      case 'ar': return 'العربية (Arabic)';
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium shadow-xs">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="font-bangla font-semibold">৩ ভাষার ত্রিভাষিক অভিধান • Tri-Lingual Lexicon</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-bangla tracking-tight leading-tight">
            বাংলা ⇄ English ⇄ <span className="font-arabic font-bold text-emerald-700">العربية</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 font-bangla leading-relaxed max-w-2xl mx-auto">
            বাংলা, ইংরেজি ও আরবি ভাষার নির্ভুল শব্দভাণ্ডার, অর্থ, ব্যাকরণিক পরিচয় ও বাস্তব বাক্য প্রয়োগ। সরাসরি ফোনেটিক টাইপ (Banglish) করেও অনুসন্ধান করা যাবে।
          </p>
        </div>

        {/* Search & Language Mode Controls */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xl shadow-emerald-950/5 space-y-4">
            
            {/* Language Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-slate-500 font-medium">ইনপুট ভাষা:</span>
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => setSourceLang('bn')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sourceLang === 'bn' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
                  >
                    বাংলা
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sourceLang === 'en' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setSourceLang('ar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all font-arabic ${sourceLang === 'ar' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-950'}`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={swapLanguage}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
                title="ভাষা পরিবর্তন করুন"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>ভাষা পরিবর্তন</span>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => startTransition(() => setQuery(e.target.value))}
                placeholder={
                  sourceLang === 'bn' 
                    ? 'বাংলা শব্দ বা ফোনেটিক দিয়ে খুঁজুন (যেমন: ভালোবাসা, bhalobasha, শান্তি...)'
                    : sourceLang === 'en'
                    ? 'Search English words (e.g. peace, love, knowledge, country...)'
                    : 'ابحث باللغة العربية (مثال: سلام، حب، علم، وطن...)'
                }
                dir={sourceLang === 'ar' ? 'rtl' : 'ltr'}
                className="w-full pl-11 pr-10 py-3.5 sm:py-4 bg-slate-50/70 border border-slate-200/90 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans text-sm sm:text-base"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500 font-sans">
              <span className="flex items-center gap-1 text-slate-400"><Sparkles className="w-3 h-3 text-amber-500" /> জনপ্রিয় শব্দ:</span>
              {['শান্তি', 'ভালোবাসা', 'জ্ঞান', 'সততা', 'স্বাধীনতা', 'দেশ', 'bondhu'].map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => setQuery(word)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bangla transition-colors border border-slate-200/60"
                >
                  {word}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Results Counter & Stats */}
        <div className="max-w-5xl mx-auto flex items-center justify-between px-2 mb-6 text-xs sm:text-sm text-slate-500 font-bangla">
          <div>
            মোট ফলাফল: <strong className="text-slate-900 font-sans">{results.length}</strong> টি শব্দ পাওয়া গেছে
          </div>
          <div className="text-[11px] font-mono text-emerald-700">
            Reference: বাংলা একাডেমি • Cambridge • Classical Arabic
          </div>
        </div>

        {/* Dictionary Results Grid */}
        <div className="max-w-5xl mx-auto space-y-5">
          {results.length > 0 ? (
            results.map((entry) => (
              <div 
                key={entry.id} 
                className="hover-card bg-white/95 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
              >
                {/* Card Top: Category and Part of Speech Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {entry.partOfSpeech}
                    </span>
                    {entry.category && (
                      <span className="text-xs text-slate-500 font-bangla">
                        {entry.category}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(`${entry.bn} = ${entry.en} = ${entry.ar}`, entry.id)}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-600 transition-colors"
                    title="অনুলিপি করুন"
                  >
                    {copiedId === entry.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Main 3 Languages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 py-5">
                  
                  {/* 1. Bengali Column */}
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/70 space-y-1.5">
                    <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider font-mono">
                      বাংলা (Bengali)
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-950 font-bangla">
                      {entry.bn}
                    </div>
                    {entry.bnPronunciation && (
                      <div className="text-xs text-slate-500 font-bangla">
                        উচ্চারণ: {entry.bnPronunciation}
                      </div>
                    )}
                    {entry.definitionBn && (
                      <p className="text-xs text-slate-600 font-bangla pt-1 leading-relaxed">
                        {entry.definitionBn}
                      </p>
                    )}
                  </div>

                  {/* 2. English Column */}
                  <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/70 space-y-1.5">
                    <div className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider font-mono">
                      English
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-slate-950 font-sans">
                      {entry.en}
                    </div>
                    {entry.enPronunciation && (
                      <div className="text-xs text-slate-500 font-mono">
                        IPA: {entry.enPronunciation}
                      </div>
                    )}
                    {entry.definitionEn && (
                      <p className="text-xs text-slate-600 font-sans pt-1 leading-relaxed">
                        {entry.definitionEn}
                      </p>
                    )}
                  </div>

                  {/* 3. Arabic Column */}
                  <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/70 space-y-1.5 text-right" dir="rtl">
                    <div className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider font-mono text-left" dir="ltr">
                      العربية (Arabic)
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-950 font-arabic leading-relaxed">
                      {entry.ar}
                    </div>
                    {entry.arPronunciation && (
                      <div className="text-xs text-slate-500 font-sans text-left" dir="ltr">
                        Translit: <span className="font-semibold text-slate-700">{entry.arPronunciation}</span>
                      </div>
                    )}
                    {entry.definitionAr && (
                      <p className="text-xs text-slate-600 font-arabic pt-1 leading-relaxed text-right">
                        {entry.definitionAr}
                      </p>
                    )}
                  </div>

                </div>

                {/* Example Sentences */}
                {(entry.exampleBn || entry.exampleEn || entry.exampleAr) && (
                  <div className="pt-4 border-t border-slate-100 text-xs sm:text-sm space-y-2 bg-slate-50/50 p-4 rounded-xl">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>বাক্যে প্রয়োগ ও উদাহরণ (Example Usage):</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-600 pt-1">
                      {entry.exampleBn && (
                        <div className="font-bangla leading-relaxed">
                          <span className="font-semibold text-emerald-800">BN:</span> {entry.exampleBn}
                        </div>
                      )}
                      {entry.exampleEn && (
                        <div className="font-sans leading-relaxed">
                          <span className="font-semibold text-sky-800">EN:</span> {entry.exampleEn}
                        </div>
                      )}
                      {entry.exampleAr && (
                        <div className="font-arabic text-right leading-loose text-base" dir="rtl">
                          <span className="font-semibold text-amber-900 font-sans text-xs" dir="ltr">AR:</span> {entry.exampleAr}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/90 rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-bangla">
                কোনো শব্দ খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-sm text-slate-500 font-bangla max-w-sm mx-auto">
                অনুগ্রহ করে বানানের নির্ভুলতা যাচাই করুন অথবা ভিন্ন কোনো প্রতিশব্দ লিখে সন্ধান করুন।
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
