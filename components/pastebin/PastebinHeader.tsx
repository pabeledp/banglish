'use client';

import React from 'react';
import Link from 'next/link';
import { WorkspaceMode, LanguageMode } from '@/lib/pastebinTypes';
import { 
  FileText, 
  FileEdit, 
  Table2, 
  Languages, 
  ArrowLeft, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';

interface PastebinHeaderProps {
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
  phoneticActive: boolean;
  onTogglePhonetic: () => void;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  saveStatus: 'saved' | 'saving' | 'dirty';
  lastSavedAt: number | null;
}

export default function PastebinHeader({
  mode,
  onModeChange,
  phoneticActive,
  onTogglePhonetic,
  language,
  onLanguageChange,
  saveStatus,
}: PastebinHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#090d16]/90 backdrop-blur-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left: Brand & Back to Home */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/"
              className="p-2 sm:p-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 transition-all duration-200 flex items-center gap-1.5 text-xs font-mono"
              title="মূল ওয়েবসাইটে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">হোম</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#00f2fe]/20 via-[#00d2ff]/10 to-[#10b981]/20 p-0.5 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.15)] group-hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all">
                  <img src="/assets/banglish-logo-192.png" alt="Banglish" className="w-full h-full object-contain p-1" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-[#00f2fe] bg-clip-text text-transparent">
                      Banglish
                    </span>
                    <span className="bg-gradient-to-r from-[#00f2fe] to-[#10b981] bg-clip-text text-transparent font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
                      PasteBin
                    </span>
                  </h1>
                </div>
                <p className="hidden md:block text-[11px] text-gray-400 font-bangla -mt-0.5">
                  অল-ইন-ওয়ান স্মার্ট ওয়ার্কস্পেস ও রিয়েলটাইম ফোনেটিক এডিটর
                </p>
              </div>
            </div>
          </div>

          {/* Center: 3-in-1 Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-gray-950/70 border border-gray-800/90 shadow-inner">
            <button
              type="button"
              onClick={() => onModeChange('text')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'text'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-[#00f2fe] border border-cyan-500/40 shadow-[0_0_12px_rgba(0,242,254,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
              }`}
              title="ক্লাসিক টেক্সট ও কোড এডিটর"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00f2fe]" />
              <span className="hidden xs:inline">টেক্সট & কোড</span>
              <span className="xs:hidden">Text</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('docs')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'docs'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-[#10b981] border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
              }`}
              title="নোট ও রিচ টেক্সট ডকুমেন্ট"
            >
              <FileEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#10b981]" />
              <span className="hidden xs:inline">ডক মোড</span>
              <span className="xs:hidden">Docs</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('sheet')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                mode === 'sheet'
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
              }`}
              title="স্প্রেডশীট ও টেবিল হিসাব"
            >
              <Table2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden xs:inline">শীট মোড</span>
              <span className="xs:hidden">Sheet</span>
            </button>
          </div>

          {/* Right: Phonetic Switcher, Sync Badge, GitHub */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Auto-save Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-950/60 border border-gray-800/80 text-[11px] text-gray-400 font-mono">
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span className="text-cyan-300">অটো-সেভিং...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-gray-300 font-bangla">অটো-সেভড</span>
                </>
              )}
            </div>

            {/* Phonetic Engine Switcher Toggle (Bangla ⇄ English) */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-950/80 border border-gray-800 shadow-inner">
              <button
                type="button"
                onClick={onTogglePhonetic}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  phoneticActive
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_14px_rgba(0,242,254,0.35)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/50'
                }`}
                title={phoneticActive ? 'বাংলিশ ফোনেটিক চালু (Hind Siliguri Font)' : 'ফোনেটিক বন্ধ (English Poppins)'}
              >
                <Sparkles className={`w-3.5 h-3.5 ${phoneticActive ? 'text-cyan-200 animate-pulse' : 'text-gray-500'}`} />
                <span className="font-bangla">{phoneticActive ? 'বাংলিশ' : 'English'}</span>
                <span className={`text-[10px] font-mono font-bold px-1 py-0.2 rounded ${
                  phoneticActive ? 'bg-cyan-900/80 text-cyan-200' : 'bg-gray-800 text-gray-400'
                }`}>
                  {phoneticActive ? 'BN' : 'EN'}
                </span>
              </button>
            </div>

            {/* Engine GitHub Repository Link Placeholder */}
            <a
              href="https://github.com/pabeledp/Banglish-Avro-Keyboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 rounded-xl bg-gray-950/80 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800 transition-all duration-200 flex items-center justify-center"
              title="Banglish Swift Engine on GitHub"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>

          </div>

        </div>
      </div>
    </header>
  );
}
