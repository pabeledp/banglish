'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DictionaryApp from '@/components/DictionaryApp';
import Link from 'next/link';

export default function HomePage() {
  const [activeInstallTab, setActiveInstallTab] = useState<'mac' | 'win'>('mac');
  const [simText, setSimText] = useState('amar sonar bangla ami tomay valobasi.');

  const phoneticMap: Record<string, string> = {
    'amra': 'আমরা',
    'valobasa': 'ভালোবাসা',
    'valobasha': 'ভালোবাসা',
    'bhalobasa': 'ভালোবাসা',
    'bhalobasha': 'ভালোবাসা',
    'ami': 'আমি',
    'tumi': 'তুমি',
    'apni': 'আপনি',
    'bangla': 'বাংলা',
    'banglish': 'বাংলিশ',
    'bangladesh': 'বাংলাদেশ',
    'kemon': 'কেমন',
    'acho': 'আছো',
    'desh': 'দেশ',
    'dhaka': 'ঢাকা',
    'shundor': 'সুন্দর',
    'sundor': 'সুন্দর',
    'dhonnobad': 'ধন্যবাদ',
    'shagotom': 'স্বাগতম',
    'gan': 'গান',
    'gai': 'গাই',
    'shobar': 'সবার',
    'notun': 'নতুন'
  };

  const getSimulatedBangla = (text: string) => {
    return text.split(' ').map(w => {
      const clean = w.replace(/[.,!?]/g, '').toLowerCase();
      return phoneticMap[clean] || w;
    }).join(' ');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* ========================================== */}
        {/* 1. Hero Section                            */}
        {/* ========================================== */}
        <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            {/* Top Announcement Pill */}
            <div className="flex justify-center mb-6 px-2">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-medium shadow-xs hover:border-emerald-300 transition-all text-center">
                <span className="flex h-2 w-2 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bangla font-semibold">Best iAvro Alternative for macOS & Windows • সম্পূর্ণ ফ্রি ও আধুনিক</span>
              </div>
            </div>

            {/* Main Headline & Subtitle */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 font-bangla leading-[1.3] sm:leading-[1.35] lg:leading-[1.4] py-1">
                macOS ও Windows-এর জন্য <span className="text-emerald-600 font-bold inline-block px-1">দ্রুততম, নিখুঁত</span> ও সম্পূর্ণ ফ্রি বাংলা টাইপিং সফটওয়্যার
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-bangla font-normal max-w-3xl mx-auto leading-relaxed sm:leading-loose px-2">
                Apple-এর InputMethodKit ও Windows আর্কিটেকচারে তৈরি—সরাসরি সিস্টেমে কাজ করবে। কোনো জটিল Third-Party Keyboard ঝামেলা ছাড়াই টাইপ করুন স্বাচ্ছন্দ্যে।
              </p>

              {/* System Compatibility Chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs sm:text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
                  <svg className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" fill="currentColor" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z"/></svg>
                  Apple Silicon & Intel Mac
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
                  <svg className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" fill="currentColor" viewBox="0 0 88 88"><path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z"/></svg>
                  Windows 10 / 11 (64-bit)
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
                  <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  100% Offline & Privacy
                </span>
              </div>

              {/* Action CTAs (Side-by-side on all screens including mobile) */}
              <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-4 px-1 max-w-2xl mx-auto">
                {/* Primary macOS CTA Button */}
                <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-3.5 py-3 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group text-left">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="font-sans text-xs sm:text-base">macOS (.dmg)</span>
                    <span className="text-[10px] sm:text-xs font-bangla text-emerald-100 font-normal hidden xs:inline">ম্যাকের জন্য ফ্রি</span>
                  </div>
                </a>

                {/* Primary Windows CTA Button */}
                <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-3.5 py-3 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group text-left">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" viewBox="0 0 88 88">
                    <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z"/>
                  </svg>
                  <div className="flex flex-col leading-tight">
                    <span className="font-sans text-xs sm:text-base">Windows (.exe)</span>
                    <span className="text-[10px] sm:text-xs font-bangla text-sky-100 font-normal hidden xs:inline">উইন্ডোজ ১০/১১</span>
                  </div>
                </a>
              </div>

              <p className="text-xs text-slate-600 font-sans tracking-wide">
                <span className="text-emerald-700 font-semibold">Try Banglish For Free</span> • কোনো কার্ড, রেজিস্ট্রেশন বা সাইনআপ লাগবে না
              </p>
            </div>

            {/* Typewriter Simulator */}
            <div id="simulator" className="mt-12 sm:mt-16 max-w-4xl mx-auto">
              <div className="hover-card relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 font-mono">Banglish Interactive Simulator</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Swift 6.0</span>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase font-mono">English / Phonetic Input:</label>
                    <input 
                      type="text" 
                      value={simText} 
                      onChange={(e) => setSimText(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                    <span className="text-xs font-semibold text-emerald-800 uppercase font-mono">Live Bangla Output:</span>
                    <div className="text-2xl font-bold text-slate-900 font-bangla">
                      {getSimulatedBangla(simText)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================== */}
        {/* 2. Embedded Tri-Lingual Dictionary Section */}
        {/* ========================================== */}
        <section id="dictionary-preview" className="py-12 bg-slate-50/60 border-y border-slate-200/60">
          <DictionaryApp />
        </section>

        {/* ========================================== */}
        {/* 3. OS Installation Section                */}
        {/* ========================================== */}
        <section id="installation" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold font-mono uppercase tracking-wider border border-emerald-200/60">
                Setup Guide
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-bangla">
                সহজ ৩-ধাপের ইনস্টলেশন নির্দেশিকা
              </h2>
            </div>

            {/* OS Switcher Tabs */}
            <div className="flex justify-center mb-10">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveInstallTab('mac')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeInstallTab === 'mac' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span className="font-bangla font-semibold">macOS ইনস্টলেশন</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInstallTab('win')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeInstallTab === 'win' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <span className="font-bangla font-semibold">Windows ইনস্টলেশন</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            {activeInstallTab === 'mac' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center font-sans">1</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">Installer রান করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla">Banglish.dmg ফাইলটি ডাউনলোড করে ওপেন করুন এবং ডাবল-ক্লিক করে ইনস্টল করুন।</p>
                </div>
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center font-sans">2</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">লগ আউট ও রি-লগইন</h3>
                  <p className="text-sm text-slate-600 font-bangla">ইনস্টল শেষ হলে আপনার ম্যাক একবার Log Out করে আবার Log In করুন।</p>
                </div>
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center font-sans">3</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">কীবোর্ড যুক্ত করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla">System Settings ➔ Keyboard ➔ Input Sources থেকে Bangla সিলেক্ট করে Banglish অ্যাড করে নিন।</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center font-sans">1</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">Setup ফাইল ডাউনলোড</h3>
                  <p className="text-sm text-slate-600 font-bangla">অফিশিয়াল Banglish-Setup.exe ফাইলটি সরাসরি ডাউনলোড করুন।</p>
                </div>
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center font-sans">2</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">ইনস্টলার রান করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla">Banglish-Setup.exe রান করে ইন্সটল সম্পন্ন করুন। SmartScreen আসলে "More info" ➔ "Run anyway" চাপুন।</p>
                </div>
                <div className="hover-card bg-white rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center font-sans">3</div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla">টাইপ শুরু করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla">যেকোনো অ্যাপে F12 বা Win + Space দিয়ে সরাসরি ফোনেটিক বাংলা টাইপ করতে পারবেন।</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================== */}
        {/* 4. Final CTA Banner                       */}
        {/* ========================================== */}
        <section className="py-16 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 sm:p-12 md:p-14 text-white text-center shadow-2xl shadow-emerald-600/30 relative overflow-hidden">
              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-bangla leading-tight text-white">
                  আজই আপনার Mac বা Windows কম্পিউটারে ইনস্টল করুন Banglish
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-emerald-50 font-bangla">
                  ফ্রি, নিরাপদ ও স্বাচ্ছন্দ্যময় বাংলা টাইপিং ও ৩-ভাষার অভিধানের নতুন অভিজ্ঞতা উপভোগ করুন।
                </p>

                <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 max-w-xl mx-auto">
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="flex-1 sm:flex-initial px-3.5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-xs sm:text-base shadow-lg transition-all duration-300 font-sans flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z"/></svg>
                    <span>macOS (.dmg)</span>
                  </a>
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="flex-1 sm:flex-initial px-3.5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-sky-900/40 hover:bg-sky-900/60 text-white font-bold text-xs sm:text-base border border-sky-300/50 shadow-lg transition-all duration-300 font-sans flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 88 88"><path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z"/></svg>
                    <span>Windows (.exe)</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-emerald-100 font-mono">
                  <span>macOS 12+ (Apple Silicon & Intel) • Windows 10 & 11 (64-bit) • 100% Free Forever</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
