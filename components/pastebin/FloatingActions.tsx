'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Download, 
  Trash2, 
  Check, 
  Globe, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { TARGET_LANGUAGES } from '@/lib/translatorService';

interface FloatingActionsProps {
  phoneticActive: boolean;
  onTogglePhonetic: () => void;
  onConvertPhonetic?: () => void;
  onTranslate: (targetLangCode: string) => void;
  isTranslating?: boolean;
  onCopyContent: () => void;
  onOpenExportModal: () => void;
  onOpenClearModal: () => void;
  copied: boolean;
}

export default function FloatingActions({
  phoneticActive,
  onTogglePhonetic,
  onConvertPhonetic,
  onTranslate,
  isTranslating = false,
  onCopyContent,
  onOpenExportModal,
  onOpenClearModal,
  copied,
}: FloatingActionsProps) {
  const [targetLang, setTargetLang] = useState('bn');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const langPickerRef = useRef<HTMLDivElement | null>(null);

  // Close language picker on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setShowLangPicker(false);
      }
    };
    if (showLangPicker) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showLangPicker]);

  const selectedLangObj = TARGET_LANGUAGES.find(l => l.code === targetLang) || TARGET_LANGUAGES[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 select-none animate-in slide-in-from-bottom-6 duration-200">
      
      {/* 1. Language Mode Toggle Switch */}
      <button
        type="button"
        onClick={onTogglePhonetic}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          phoneticActive
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
        }`}
        title={phoneticActive ? 'বাংলিশ ফোনেটিক চালু' : 'ইংরেজি মোড চালু'}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="font-bangla">{phoneticActive ? 'বাংলিশ (BN)' : 'English (EN)'}</span>
      </button>

      {/* 2. 1-Click Banglish to Bangla Conversion Button */}
      {onConvertPhonetic && (
        <button
          type="button"
          onClick={onConvertPhonetic}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-medium transition-all cursor-pointer font-bangla"
          title="বাংলিশ টেক্সটকে বাংলায় রূপান্তর করুন"
        >
          <span>বাংলিশ ➔ বাংলা</span>
        </button>
      )}

      <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

      {/* 3. Universal "Translate to" Action with Dropdown */}
      <div className="relative" ref={langPickerRef}>
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-700 hover:text-slate-900 font-sans cursor-pointer"
            title="টার্গেট ভাষা নির্বাচন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-[11px]">{selectedLangObj.flag} {selectedLangObj.nativeName}</span>
          </button>

          <button
            type="button"
            disabled={isTranslating}
            onClick={() => onTranslate(targetLang)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-2xs transition-all disabled:opacity-60 cursor-pointer font-bangla"
            title="যেকোনো ভাষা থেকে নির্বাচিত ভাষায় অনুবাদ করুন"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-[11px]">অনুবাদ...</span>
              </>
            ) : (
              <span className="text-[11px]">Translate</span>
            )}
          </button>
        </div>

        {showLangPicker && (
          <div className="absolute bottom-full mb-2 left-0 w-48 max-h-56 overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-1 z-50 space-y-0.5 ring-1 ring-black/5 animate-in fade-in duration-100">
            <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider font-mono">
              Translate to:
            </div>
            {TARGET_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setTargetLang(lang.code);
                  setShowLangPicker(false);
                  onTranslate(lang.code);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                  targetLang === lang.code ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </span>
                <span className="text-[10px] text-slate-400">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

      {/* 4. Copy to Clipboard Button */}
      <button
        type="button"
        onClick={onCopyContent}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all cursor-pointer font-bangla"
        title="ক্লিপবোর্ডে কপি করুন"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">কপিকৃত!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xs:inline">কপি</span>
          </>
        )}
      </button>

      {/* 5. Download / Export Modal Trigger */}
      <button
        type="button"
        onClick={onOpenExportModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-medium transition-all cursor-pointer font-bangla"
        title="ফাইল ডাউনলোড ও এক্সপোর্ট"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">এক্সপোর্ট</span>
      </button>

      {/* 6. Clear Canvas Button */}
      <button
        type="button"
        onClick={onOpenClearModal}
        className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
        title="বর্তমান ক্যানভাস পরিষ্কার করুন"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

    </div>
  );
}
