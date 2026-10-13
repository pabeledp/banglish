'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Download, 
  Copy, 
  FilePlus, 
  Plus 
} from 'lucide-react';

interface PastebinHeaderProps {
  phoneticActive: boolean;
  onTogglePhonetic: () => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  lastSavedAt: number | null;
  onAddNewNote?: () => void;
}

export default function PastebinHeader({
  phoneticActive,
  onTogglePhonetic,
  saveStatus,
  onAddNewNote,
}: PastebinHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100/80 bg-white/90 backdrop-blur-md transition-all duration-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 gap-2 sm:gap-4">
          
          {/* Left: Brand & Back to Home */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link 
              href="/"
              className="p-1.5 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/80 transition-all duration-200 flex items-center gap-1.5 text-xs font-bangla font-medium shrink-0"
              title="মূল ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">হোমে ফিরুন</span>
            </Link>

            <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/80 p-1 flex items-center justify-center border border-emerald-200/60 shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
                <img src="/assets/banglish-logo-192.png" alt="Banglish" className="w-full h-full object-contain" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Banglish
                  </span>
                  <span className="text-[9px] sm:text-xs font-mono font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    PasteBin
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-emerald-700 font-bangla -mt-0.5 truncate">
                  বাংলায় লিখি বিজয়ের সুর • অল-ইন-ওয়ান স্মার্ট ওয়ার্কস্পেস
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Quick Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {onAddNewNote && (
              <button
                type="button"
                onClick={onAddNewNote}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-all text-xs font-medium cursor-pointer shadow-2xs font-bangla"
                title="নতুন ড্রাফট খুলুন"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>নতুন নোট</span>
              </button>
            )}
          </div>

          {/* Right: Phonetic Switcher, Sync Badge, GitHub */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Auto-save Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-800 font-mono">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />
                  <span className="font-bangla">সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="font-bangla font-medium">অটো-সেভড</span>
                </>
              )}
            </div>

            {/* Phonetic Engine Switcher Toggle (Bangla ⇄ English) */}
            <button
              type="button"
              onClick={onTogglePhonetic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                phoneticActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title={phoneticActive ? 'বাংলিশ ফোনেটিক চালু (Hind Siliguri Font)' : 'ইংরেজি মোড চালু (Poppins Font)'}
            >
              <Sparkles className={`w-3.5 h-3.5 ${phoneticActive ? 'text-emerald-100' : 'text-slate-400'}`} />
              <span className="font-bangla">{phoneticActive ? 'বাংলিশ ফোনেটিক' : 'English Mode'}</span>
              <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                phoneticActive ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {phoneticActive ? 'BN' : 'EN'}
              </span>
            </button>

            {/* Engine GitHub Repository Link */}
            <a
              href="https://github.com/pabeledp/Banglish-Avro-Keyboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all duration-200 flex items-center justify-center shadow-2xs"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>

          </div>

        </div>
      </div>
    </header>
  );
}
