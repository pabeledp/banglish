'use client';

import React, { useState } from 'react';

export default function InstallationGuide() {
  const [activeTab, setActiveTab] = useState<'mac' | 'win'>('mac');

  return (
    <section id="installation" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold font-bangla uppercase tracking-wider">
            ইনস্টলেশন গাইড
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-bangla tracking-tight leading-snug">
            সহজ ৩টি ধাপে Banglish সেটআপ সম্পন্ন করুন
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-bangla leading-relaxed">
            মিনিটখানেকের মধ্যেই আপনার প্রিয় ম্যাকে বা উইন্ডোজে বাংলা টাইপ করার প্রস্তুতি নিয়ে ফেলুন।
          </p>
        </div>

        {/* OS Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs">
            <button 
              type="button" 
              onClick={() => setActiveTab('mac')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'mac' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <svg className="w-4 h-4 fill-current text-slate-800" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z"/>
              </svg>
              <span className="font-bangla font-semibold">macOS ইনস্টলেশন</span>
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('win')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'win' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <svg className="w-4 h-4 fill-current text-sky-500" viewBox="0 0 88 88">
                <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z"/>
              </svg>
              <span className="font-bangla font-semibold">Windows ইনস্টলেশন</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">Beta</span>
            </button>
          </div>
        </div>

        {/* macOS Installation Content */}
        {activeTab === 'mac' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Step 1 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    1
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla mb-2">Installer রান করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-4">
                    প্রথমে <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">Banglish.dmg</span> ফাইলটি ডাউনলোড করে ওপেন করুন এবং ডাবল-ক্লিক করে ইনস্টল করুন।
                  </p>
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 font-bangla mb-3">
                    <span>ফাইলটি ডাউনলোড করতে ক্লিক করুন</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </a>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 font-bangla leading-normal">
                  🔒 <strong>সিকিউরিটি নোটিশ:</strong> অ্যাপ ওপেন না হলে নিচের সিকিউরিটি গাইড দেখুন।
                </div>
              </div>

              {/* Step 2 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla mb-2">লগ আউট ও পুনরায় লগ ইন</h3>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-3">
                    ইনস্টল শেষ হলে আপনার ম্যাক একবার <strong>Log Out</strong> করে আবার <strong>Log In</strong> করুন (অথবা Restart দিন)।
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 font-bangla leading-normal">
                  ⚠️ <strong>বিশেষ দ্রষ্টব্য:</strong> নতুন ইনপুট সোর্স সিস্টেমে ইনডেক্স করতে macOS এই সেশন রিফ্রেশ প্রয়োজন করে।
                </div>
              </div>

              {/* Step 3 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla mb-2">কীবোর্ড লিস্টে যোগ করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-3">
                    <strong>System Settings</strong> ➔ <strong>Keyboard</strong> ➔ <strong>Text Input</strong> (Input Sources) ➔ ক্লিক করুন <strong>(+)</strong> বাটন ➔ <strong>Bangla</strong> সিলেক্ট করে <strong>Banglish</strong> অ্যাড করে নিন।
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-900 font-mono">
                  Shortcut: <span className="font-bold">Ctrl + Space</span>
                </div>
              </div>

            </div>

            {/* macOS Security / Gatekeeper Helpful Tip Banner */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-amber-50/60 to-emerald-50/60 border border-amber-200/90 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-300 shadow-xs">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div className="space-y-2 text-xs sm:text-sm font-bangla flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      ম্যাকের সিকিউরিটির (Gatekeeper) কারণে অ্যাপ ওপেন না হলে করণীয়:
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold uppercase">Security Guide</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    ম্যাকের ডিফল্ট সিকিউরিটির কারণে যদি অ্যাপ সরাসরি ওপেন হতে বাধা দেয়, তাহলে খুব সহজেই সিস্টেম সেটিংস থেকে অনুমোদন দিতে পারেন:
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">System Settings</span>
                    <span className="text-slate-400 font-sans">➔</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">Privacy & Security</span>
                    <span className="text-slate-400 font-sans">➔</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">Allow applications downloaded from</span>
                    <span className="text-slate-400 font-sans">➔</span>
                    <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold shadow-xs">Open Anyway</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 pt-1">
                    <strong>Privacy & Security</strong> ট্যাবে গিয়ে <em>"Allow applications downloaded from"</em> সেকশনের পাশে থাকা <strong>"Open Anyway"</strong> বাটনে ক্লিক করলেই অ্যাপটি সফলভাবে চালু হয়ে যাবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Windows Installation Content */}
        {activeTab === 'win' && (
          <div className="space-y-8">
            {/* Windows Beta Notice Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 flex-shrink-0 font-bold text-sm">
                  β
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 font-bangla text-sm sm:text-base">Windows সংস্করণটি বর্তমানে Public Beta (টেস্টিং রিলিজ) পর্যায়ে রয়েছে</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wide">Under Construction</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-bangla mt-0.5 leading-relaxed">
                    এটি পরীক্ষামূলক বা প্রিভিউ রিলিজ হিসেবে উন্মুক্ত করা হয়েছে এবং দ্রুত গতিতে নিয়মিত আপডেট করা হচ্ছে। কোনো বাগ বা সাজেশন থাকলে সরাসরি আমাদের জানান।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              
              {/* Step 1 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    1
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla">Setup ফাইল ডাউনলোড করুন</h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">Beta</span>
                  </div>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-4">
                    নিচের বাটন থেকে সরাসরি <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">Banglish-Setup.exe</span> বিটা ফাইলটি ডাউনলোড করে নিন।
                  </p>
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 font-bangla mb-3">
                    <span>Banglish-Setup.exe (Beta) ডাউনলোড করতে ক্লিক করুন</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </a>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 font-bangla leading-normal">
                  ⚡ <strong>সাপোর্ট:</strong> Windows 10 ও Windows 11 (64-bit) পাবলিক বিটা।
                </div>
              </div>

              {/* Step 2 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla mb-2">ইনস্টলার রান করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-3">
                    ডাউনলোড করা <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">Banglish-Setup.exe</span> ফাইলটিতে ডাবল ক্লিক করে অন-স্ক্রিন ইন্সট্রাকশন অনুযায়ী Next চেপে ইন্সটল সম্পন্ন করুন।
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 font-bangla leading-normal">
                  🛡️ <strong>SmartScreen পপআপ আসলে:</strong> "More info" ➔ "Run anyway" ক্লিক করুন।
                </div>
              </div>

              {/* Step 3 */}
              <div className="hover-card relative bg-white/95 rounded-2xl p-6 sm:p-7 border border-sky-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold text-lg flex items-center justify-center font-sans mb-5 shadow-sm">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla mb-2">টাইপ শুরু করুন</h3>
                  <p className="text-sm text-slate-600 font-bangla leading-relaxed mb-3">
                    ইনস্টলেশন শেষ হলেই যেকোনো অ্যাপে (Chrome, Word, Notepad, Photoshop ইত্যাদি) স্বাচ্ছন্দ্যে ফোনেটিক বাংলা টাইপ করতে পারবেন।
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-sky-50 border border-sky-200/70 text-xs text-sky-900 font-mono">
                  Switch Key: <span className="font-bold">F12</span> or <span className="font-bold">Win + Space</span>
                </div>
              </div>

            </div>

            {/* Windows SmartScreen Helpful Tip Banner */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-sky-50/90 via-sky-50/60 to-emerald-50/60 border border-sky-200/90 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-300 shadow-xs">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <div className="space-y-2 text-xs sm:text-sm font-bangla flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      উইন্ডোজ ডিফেন্ডার (SmartScreen) সতর্কবার্তা দেখালে করণীয়:
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 font-semibold uppercase">Windows Guide</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    নতুন রিলিজ বা আনরেকগনাইজড অ্যাপের ক্ষেত্রে Windows Defender SmartScreen "Windows protected your PC" পপআপ প্রদর্শন করতে পারে। এটি স্বাভাবিক এবং নিরাপদ:
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">More info</span>
                    <span className="text-slate-400 font-sans">➔</span>
                    <span className="px-3 py-1 rounded-lg bg-sky-600 text-white font-bold shadow-xs">Run anyway</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 pt-1">
                    পপআপের নীল টেক্সট <strong>"More info"</strong>-এ ক্লিক করলেই নিচে <strong>"Run anyway"</strong> বাটন দৃশ্যমান হবে; সেটিতে ক্লিক করে ইনস্টলেশন শুরু করুন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Adobe & Creative Cloud Indic Box */}
        <div className="hover-card mt-10 rounded-2xl sm:rounded-3xl bg-white/95 border-2 border-emerald-200/90 p-6 sm:p-8 md:p-9 shadow-lg shadow-emerald-950/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-100/50 via-teal-50/30 to-transparent rounded-full blur-2xl pointer-events-none -z-0" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Adobe Illustrator, Photoshop & After Effects Pro Guide</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-bold font-bangla text-slate-900 leading-snug">
                যুক্তাক্ষর ঠিকঠাক দেখাতে Adobe Indic Text Engine অন করুন
              </h4>

              <p className="text-sm sm:text-base text-slate-600 font-bangla leading-relaxed">
                Adobe অ্যাপগুলোতে যুক্তাক্ষর ভাঙা এড়াতে খুব সহজ একটি সেটিং:
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono font-medium">Preferences / Settings</span>
                <span className="text-slate-400">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-mono font-medium">Type</span>
                <span className="text-slate-400">➔</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-mono font-bold border border-emerald-300">&quot;South Asian and Middle Eastern&quot; (Indic)</span>
              </div>

              <p className="text-xs text-slate-500 font-bangla pt-1">
                এরপর Hind Siliguri, Kalpurush বা যেকোনো Unicode Font সিলেক্ট করে স্বাচ্ছন্দ্যে টাইপ করুন।
              </p>
            </div>

            <div className="flex-shrink-0 w-full sm:w-auto">
              <a href="#simulator" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all active:scale-95 font-bangla">
                <span>লাইভ টেস্ট করুন</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
