'use client';

import React from 'react';
import { 
  Sparkles, 
  Copy, 
  Download, 
  Trash2, 
  Languages, 
  Check 
} from 'lucide-react';
import { LanguageMode } from '@/lib/pastebinTypes';

interface FloatingActionsProps {
  phoneticActive: boolean;
  onTogglePhonetic: () => void;
  onConvertPhonetic: () => void;
  onCopyContent: () => void;
  onOpenExportModal: () => void;
  onOpenClearModal: () => void;
  copied: boolean;
}

export default function FloatingActions({
  phoneticActive,
  onTogglePhonetic,
  onConvertPhonetic,
  onCopyContent,
  onOpenExportModal,
  onOpenClearModal,
  copied,
}: FloatingActionsProps) {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-gray-900/90 backdrop-blur-2xl border border-gray-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none animate-in slide-in-from-bottom-6 duration-200">
      
      {/* 1. Language Mode Toggle Switch (BN ⇄ EN) */}
      <button
        type="button"
        onClick={onTogglePhonetic}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          phoneticActive
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_12px_rgba(0,242,254,0.3)]'
            : 'bg-gray-800 text-gray-300 hover:text-white'
        }`}
        title={phoneticActive ? 'বাংলা ফোনেটিক সক্রিয়' : 'ইংরেজি মোড সক্রিয়'}
      >
        <Languages className="w-3.5 h-3.5" />
        <span className="font-bangla">{phoneticActive ? 'বাংলা (BN)' : 'English (EN)'}</span>
      </button>

      <div className="h-4 w-[1px] bg-gray-700 mx-0.5" />

      {/* 2. 1-Click Phonetic Converter Button */}
      <button
        type="button"
        onClick={onConvertPhonetic}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold shadow-[0_0_10px_rgba(0,242,254,0.15)] transition-all cursor-pointer font-bangla"
        title="বাংলিশ থেকে ইউনিকোড বাংলায় রূপান্তর করুন"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
        <span className="hidden sm:inline">বাংলিশ ➔ বাংলা</span>
        <span className="sm:hidden">বাংলা রূপান্তর</span>
      </button>

      {/* 3. Copy to Clipboard Button */}
      <button
        type="button"
        onClick={onCopyContent}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
        title="ক্লিপবোর্ডে কপি করুন"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300">কপিকৃত!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-gray-300" />
            <span className="hidden xs:inline">কপি</span>
          </>
        )}
      </button>

      {/* 4. Download / Export Modal Trigger */}
      <button
        type="button"
        onClick={onOpenExportModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
        title="ফাইল ডাউনলোড ও এক্সপোর্ট"
      >
        <Download className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">এক্সপোর্ট</span>
      </button>

      <div className="h-4 w-[1px] bg-gray-700 mx-0.5" />

      {/* 5. Clear Canvas Button */}
      <button
        type="button"
        onClick={onOpenClearModal}
        className="p-1.5 rounded-xl bg-gray-800/80 hover:bg-rose-950/60 text-gray-400 hover:text-rose-400 border border-transparent hover:border-rose-800/60 transition-all cursor-pointer"
        title="বর্তমান ক্যানভাস পরিষ্কার করুন"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

    </div>
  );
}
