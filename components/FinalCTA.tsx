'use client';

import React from 'react';
import DownloadCounterBar, { trackSoftwareDownload } from './DownloadCounterBar';

export default function FinalCTA() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 sm:p-12 md:p-14 text-white text-center shadow-2xl shadow-emerald-600/30 relative overflow-hidden">
          
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-bangla leading-tight text-white">
              আজই আপনার Mac বা Windows কম্পিউটারে ইনস্টল করুন Banglish
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-50 font-bangla">
              ফ্রি, নিরাপদ ও স্বাচ্ছন্দ্যময় বাংলা টাইপিংয়ের নতুন অভিজ্ঞতা উপভোগ করুন।
            </p>

            <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 pt-2 max-w-xl mx-auto">
              {/* CTA: Download for macOS */}
              <a
                href="https://raw.githubusercontent.com/pabeledp/banglish/main/public/downloads/Banglish_Installer.dmg"
                onClick={() => trackSoftwareDownload('mac')}
                className="flex-1 sm:flex-initial px-3.5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-slate-900 hover:bg-emerald-50 font-bold text-xs sm:text-base shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 font-sans flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z" />
                </svg>
                <span>macOS (.dmg)</span>
              </a>
              {/* CTA: Download for Windows */}
              <a
                href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe"
                onClick={() => trackSoftwareDownload('windows')}
                className="flex-1 sm:flex-initial px-3.5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-sky-900/40 hover:bg-sky-900/60 text-white font-bold text-xs sm:text-base border border-sky-300/50 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 font-sans flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 88 88">
                  <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z" />
                </svg>
                <div className="flex items-center gap-1.5">
                  <span>Windows (.exe)</span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 uppercase shadow-xs">BETA</span>
                </div>
              </a>
            </div>

            {/* Counter bar */}
            <DownloadCounterBar />

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-emerald-100 font-mono">
              <span>macOS 12+ (Apple Silicon & Intel) • Windows 10 & 11 (Beta Preview) • 100% Free Forever</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
