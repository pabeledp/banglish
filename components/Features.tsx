'use client';

import React from 'react';

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-20 relative bg-white/70 border-t border-b border-emerald-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold font-bangla uppercase tracking-wider">
            মূল বৈশিষ্ট্যসমূহ
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-bangla tracking-tight leading-snug">
            ম্যাক ব্যবহারকারীদের জন্য প্রতিটি বিষয়ের নিখুঁত সমন্বয়
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-bangla leading-relaxed">
            কোনো ভারী Configuration বা Framework ছাড়া—Raw Swift Code দিয়ে তৈরি Lightweight ও আধুনিক Architecture।
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Feature 1: Native macOS Support */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">Native macOS Support</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                macOS InputMethodKit চালিত, Apple-এর M1/M2/M3/M4/M5 ও Intel প্রসেসরে 100% সমর্থিত। Rosetta ছাড়া সরাসরি Native speed-এ চলে।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Zero Rosetta Dependency • Apple Silicon
            </div>
          </div>

          {/* Feature 2: Avro Style Phonetic Engine */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-teal-50 text-teal-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm4 4h.01M11 9h.01M15 9h.01M19 9h.01M7 13h.01M11 13h.01M15 13h.01M19 13h.01M8 17h8"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">Avro Style Phonetic Engine</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                পরিচিত Avro Phonetic Layout—<span className="font-mono text-emerald-700 font-semibold">'k'</span> লিখলে <span className="font-bold text-slate-900">'ক'</span>, <span className="font-mono text-emerald-700 font-semibold">'kh'</span> লিখলে <span className="font-bold text-slate-900">'খ'</span>। কোনো নতুন কীবোর্ড লেআউট মুখস্থ করার ঝামেলা নেই।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-teal-700">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              100% Avro Phonetic Matching Scheme
            </div>
          </div>

          {/* Feature 3: 100% Free & Open Source */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">100% Free & Open Source</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                কোনো Hidden Charge, Trial License বা Premium Subscription নেই। সবার জন্য আজীবন উন্মুক্ত এবং MIT Open Source License প্রাপ্ত।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              MIT License • Lifetime Free
            </div>
          </div>

          {/* Feature 4: System-Wide Compatibility */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">System-Wide Compatibility</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                Adobe Illustrator, Photoshop, Premiere Pro, After Effects, Final Cut Pro, Chrome, Safari, Notes, VS Code সহ সব Mac App-এ নিরবচ্ছিন্ন সাপোর্ট।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Adobe Suite & Pro Video Tools Ready
            </div>
          </div>

          {/* Feature 5: Absolute Privacy & 100% Offline */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-teal-50 text-teal-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">100% Offline & Absolute Privacy</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                কোনো Internet Request, Data Collection বা Telemetry নেই। আপনার টাইপ করা প্রতিটি অক্ষর সরাসরি Mac-এর Memory-তেই process হয়।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-teal-700">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              Zero Telemetry • No Network Access
            </div>
          </div>

          {/* Feature 6: Ultra Lightweight & Battery Friendly */}
          <div className="hover-card group p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 text-emerald-600 p-3 inline-flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mb-2 sm:mb-3">Raw Swift Code & 0% Idle CPU</h3>
              <p className="text-slate-600 font-bangla leading-relaxed text-sm sm:text-base">
                Raw Swift Code-এ তৈরি হওয়ায় ব্যাকগ্রাউন্ডে 0% CPU usage এবং মাত্র কয়েক MB Memory লাগে। আপনার MacBook-এর Battery Life একদম অক্ষুণ্ণ থাকে।
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              0% Idle CPU • Instant Response
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
