import React from 'react';
import Simulator from './Simulator';

export default function Hero() {
  return (
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
          
          {/* System Compatibility Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs sm:text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
              <svg className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" fill="currentColor" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z" />
              </svg>
              Apple Silicon & Intel Mac
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
              <svg className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" fill="currentColor" viewBox="0 0 88 88">
                <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z" />
              </svg>
              Windows 10 / 11 (64-bit)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 border border-slate-200 shadow-xs">
              <svg className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% Offline & Absolute Privacy
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-4 px-1 max-w-2xl mx-auto">
            {/* Primary macOS CTA Button */}
            <a
              href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-3.5 py-3 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-base shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group text-left"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z" />
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="font-sans text-xs sm:text-base">macOS (.dmg)</span>
                <span className="text-[10px] sm:text-xs font-bangla text-emerald-100 font-normal hidden xs:inline">ম্যাকের জন্য ফ্রি</span>
              </div>
            </a>

            {/* Primary Windows CTA Button */}
            <a
              href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-3.5 py-3 sm:px-7 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs sm:text-base shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 group text-left"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current transition-transform duration-300 group-hover:scale-110 flex-shrink-0" viewBox="0 0 88 88">
                <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z" />
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

        {/* Live Simulator Component */}
        <Simulator />

      </div>
    </section>
  );
}
