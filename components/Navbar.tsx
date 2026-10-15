'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-emerald-100/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/80 p-1.5 flex items-center justify-center border border-emerald-200/60 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
              <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" width={44} height={44} className="w-full h-full object-contain block" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Banglish</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span className="text-[11px] font-medium text-emerald-700 tracking-wider font-bangla -mt-1">বাংলায় লিখি বিজয়ের সুর</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/#simulator" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla">লাইভ সিমুলেটর</Link>
            <Link href="/#installation" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla">ইনস্টলেশন</Link>
            <Link href="/#cheatsheet" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla">টাইপিং গাইড</Link>
            <Link href="/pastebin" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla inline-flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform"></span>
              <span>পেস্টবিন</span>
            </Link>
            <Link href="/text-to-png-converter" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla inline-flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform"></span>
              <span>স্টিকার মেকার</span>
            </Link>
            <Link href="/blog" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla">ব্লগ</Link>
            <Link href="/contact" className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors font-bangla">যোগাযোগ</Link>
          </nav>

          {/* CTA & Quick Actions */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Header Main CTA with Dropdown */}
            <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
              <button 
                type="button" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <span className="font-sans">Download Banglish</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              <div className={`absolute right-0 top-full pt-1.5 w-64 transition-all z-50 ${isDropdownOpen ? 'block' : 'hidden'}`}>
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 py-2 overflow-hidden ring-1 ring-black/5">
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-slate-800 transition-colors group/item">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover/item:bg-emerald-100 flex items-center justify-center text-slate-800 group-hover/item:text-emerald-700 flex-shrink-0 transition-colors">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z"/></svg>
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 font-sans">macOS Installer</div>
                      <div className="text-[11px] text-slate-500 font-bangla">Banglish.dmg (Apple & Intel)</div>
                    </div>
                  </a>
                  <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 text-slate-800 transition-colors group/item border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 group-hover/item:bg-sky-200 flex items-center justify-center text-sky-700 flex-shrink-0 transition-colors">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 88 88"><path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z"/></svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 font-sans">
                          <span>Windows Installer</span>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">Beta</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-bangla">Banglish-Setup.exe (টেস্টিং রিলিজ)</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">.exe</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          <Link href="/#simulator" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bangla">লাইভ সিমুলেটর</Link>
          <Link href="/#installation" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bangla">ইনস্টলেশন</Link>
          <Link href="/#cheatsheet" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bangla">টাইপিং গাইড</Link>
          <Link href="/pastebin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-cyan-800 bg-cyan-50/70 hover:bg-cyan-100/70 font-bangla">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>পেস্টবিন</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-200/70 text-cyan-900 font-bold">NEW</span>
          </Link>
          <Link href="/text-to-png-converter" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 font-bangla">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>স্টিকার মেকার</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900 font-bold">NEW</span>
          </Link>
          <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bangla">ব্লগ</Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 font-bangla">যোগাযোগ</Link>
          
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="flex-1 text-center py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-sans shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 text-xs">
                <span>macOS (.dmg)</span>
              </a>
              <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="flex-1 text-center py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold font-sans shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 text-xs">
                <span>Windows (.exe)</span>
                <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-amber-400 text-slate-950">BETA</span>
              </a>
            </div>
            <div className="flex flex-row gap-2">
              <a href="https://www.facebook.com/banglishkeyboard/" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 font-medium font-sans flex items-center justify-center gap-1.5 text-xs">
                <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                <span>Facebook Page</span>
              </a>
              <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium font-sans flex items-center justify-center gap-1.5 text-xs">
                <svg className="w-4 h-4 fill-current text-slate-700" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
