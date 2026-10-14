'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  TextSpan,
  BackgroundTheme,
  StickerRenderOptions,
  renderSticker,
  canvasToBlob,
  downloadBlobAsFile,
  copyBlobToClipboard
} from '@/lib/stickerEngine';
import { BANGLA_FONTS, BanglaFontOption, loadCustomFontFile } from '@/lib/cardFonts';
import RgbColorPicker from '@/components/RgbColorPicker';
import CandidatePopup from '@/components/CandidatePopup';
import { getPhoneticCandidates } from '@/lib/banglishDictionary';

interface WordFormat {
  id: string;
  word: string;
  lineIndex: number;
  wordIndex: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
}

export default function TextToPNGConverterPage() {
  // --- Core State ---
  const [rawText, setRawText] = useState('আমাদের সোনার বাংলা\nআমি তোমায় ভালোবাসি');
  const [isPhoneticActive, setIsPhoneticActive] = useState(true);

  // Global Defaults
  const [globalFont, setGlobalFont] = useState(BANGLA_FONTS[0].family);
  const [globalFontSize, setGlobalFontSize] = useState(54);
  const [globalFontWeight, setGlobalFontWeight] = useState(600);
  const [globalColor, setGlobalColor] = useState('#10b981'); // Brand Emerald

  // Custom Per-Word Formatting Overrides (wordId -> Partial<WordFormat>)
  const [wordOverrides, setWordOverrides] = useState<Record<string, Partial<WordFormat>>>({
    'w-0-1': { fontFamily: BANGLA_FONTS[1].family, color: '#f59e0b', fontSize: 62, fontWeight: 700 } // "সোনার" in Galada Gold
  });
  const [selectedWordId, setSelectedWordId] = useState<string | null>('w-0-1');

  // Background and Canvas Styling
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState(12);
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [shadowBlur, setShadowBlur] = useState(16);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.35)');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [aspectRatio, setAspectRatio] = useState<'auto' | '1:1' | '16:9' | '9:16'>('auto');
  const [scale, setScale] = useState(2); // 2x HD by default

  // Custom Uploaded Fonts
  const [availableFonts, setAvailableFonts] = useState<BanglaFontOption[]>(BANGLA_FONTS);

  // Phonetic Candidates State
  const [activePhoneticToken, setActivePhoneticToken] = useState('');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  // UI Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Canvas Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Parse raw text into lines and words
  const parsedWords = useMemo(() => {
    const lines = rawText.split('\n');
    const result: WordFormat[] = [];
    lines.forEach((line, lineIndex) => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      words.forEach((word, wordIndex) => {
        const id = `w-${lineIndex}-${wordIndex}`;
        const override = wordOverrides[id] || {};
        result.push({
          id,
          word,
          lineIndex,
          wordIndex,
          fontFamily: override.fontFamily || globalFont,
          fontSize: override.fontSize || globalFontSize,
          fontWeight: override.fontWeight || globalFontWeight,
          color: override.color || globalColor
        });
      });
    });
    return result;
  }, [rawText, globalFont, globalFontSize, globalFontWeight, globalColor, wordOverrides]);

  // Construct structured lines for the Sticker Engine
  const structuredLines = useMemo(() => {
    const lines = rawText.split('\n');
    const result: TextSpan[][] = [];

    lines.forEach((line, lineIndex) => {
      const words = line.trim().split(/\s+/).filter(Boolean);
      const lineSpans: TextSpan[] = [];

      words.forEach((word, wordIndex) => {
        const id = `w-${lineIndex}-${wordIndex}`;
        const override = wordOverrides[id] || {};
        lineSpans.push({
          id,
          text: word + (wordIndex < words.length - 1 ? ' ' : ''),
          fontFamily: override.fontFamily || globalFont,
          fontSize: override.fontSize || globalFontSize,
          fontWeight: override.fontWeight || globalFontWeight,
          color: override.color || globalColor
        });
      });

      if (lineSpans.length > 0) {
        result.push(lineSpans);
      }
    });

    return result;
  }, [rawText, globalFont, globalFontSize, globalFontWeight, globalColor, wordOverrides]);

  // Re-render Canvas whenever settings change
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;

    const renderOptions: StickerRenderOptions = {
      lines: structuredLines,
      bgTheme,
      customBgColor,
      strokeWidth,
      strokeColor,
      shadowBlur,
      shadowColor,
      shadowOffsetX: 0,
      shadowOffsetY: Math.round(shadowBlur * 0.25),
      padding: bgTheme === 'transparent' ? 32 : 56,
      align,
      scale: 1, // Render at 1x in live preview for maximum 60fps performance
      aspectRatio
    };

    renderSticker(canvas, renderOptions);
  }, [
    structuredLines,
    bgTheme,
    customBgColor,
    strokeWidth,
    strokeColor,
    shadowBlur,
    shadowColor,
    align,
    aspectRatio
  ]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Phonetic Typing Handler ---
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);

    if (!isPhoneticActive) {
      setCandidates([]);
      setActivePhoneticToken('');
      return;
    }

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z\^]+)$/);

    if (match) {
      const token = match[1];
      setActivePhoneticToken(token);
      const candList = getPhoneticCandidates(token);
      setCandidates(candList);
      setSelectedCandidateIndex(0);
    } else {
      setCandidates([]);
      setActivePhoneticToken('');
    }
  };

  const handleSelectCandidate = (candidate: string) => {
    if (!activePhoneticToken || !textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const textBefore = rawText.slice(0, cursorPos - activePhoneticToken.length);
    const textAfter = rawText.slice(cursorPos);
    const updated = textBefore + candidate + ' ' + textAfter;
    setRawText(updated);
    setCandidates([]);
    setActivePhoneticToken('');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (candidates.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCandidateIndex(prev => (prev + 1) % candidates.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCandidateIndex(prev => (prev - 1 + candidates.length) % candidates.length);
        return;
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && activePhoneticToken)) {
        e.preventDefault();
        handleSelectCandidate(candidates[selectedCandidateIndex]);
        return;
      }
      if (/^[1-9]$/.test(e.key) && (e.altKey || e.ctrlKey)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= candidates.length) {
          e.preventDefault();
          handleSelectCandidate(candidates[num - 1]);
          return;
        }
      }
    }
  };

  // --- Word Selection & Formatting Handlers ---
  const activeWord = useMemo(() => {
    if (!selectedWordId) return null;
    return parsedWords.find(w => w.id === selectedWordId) || null;
  }, [selectedWordId, parsedWords]);

  const updateSelectedWord = (field: keyof WordFormat, value: any) => {
    if (!selectedWordId) {
      // If no word selected, update globally
      if (field === 'fontFamily') setGlobalFont(value);
      if (field === 'fontSize') setGlobalFontSize(value);
      if (field === 'fontWeight') setGlobalFontWeight(value);
      if (field === 'color') setGlobalColor(value);
      return;
    }

    setWordOverrides(prev => ({
      ...prev,
      [selectedWordId]: {
        ...(prev[selectedWordId] || {}),
        [field]: value
      }
    }));
  };

  const resetWordFormat = (wordId: string) => {
    setWordOverrides(prev => {
      const next = { ...prev };
      delete next[wordId];
      return next;
    });
  };

  const resetAllOverrides = () => {
    setWordOverrides({});
    setSelectedWordId(null);
  };

  // --- Custom Font Upload Handler ---
  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const customFont = await loadCustomFontFile(file);
      setAvailableFonts(prev => [customFont, ...prev]);
      if (selectedWordId) {
        updateSelectedWord('fontFamily', customFont.family);
      } else {
        setGlobalFont(customFont.family);
      }
      showToast(`✨ কাস্টম ফন্ট '${customFont.name}' সফলভাবে লোড হয়েছে!`);
    } catch (err) {
      console.error(err);
      alert('ফন্ট লোড করতে সমস্যা হয়েছে। দয়া করে বৈধ .ttf বা .otf ফাইল দিন।');
    }
  };

  // --- High-Resolution Export Handler ---
  const generateExportCanvas = (targetScale: number): HTMLCanvasElement => {
    const offscreen = document.createElement('canvas');
    const options: StickerRenderOptions = {
      lines: structuredLines,
      bgTheme,
      customBgColor,
      strokeWidth,
      strokeColor,
      shadowBlur,
      shadowColor,
      shadowOffsetX: 0,
      shadowOffsetY: Math.round(shadowBlur * 0.25),
      padding: bgTheme === 'transparent' ? 36 : 64,
      align,
      scale: targetScale,
      aspectRatio
    };
    renderSticker(offscreen, options);
    return offscreen;
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const exportCanvas = generateExportCanvas(scale);
      const blob = await canvasToBlob(exportCanvas);
      const fileName = `Banglish-Sticker-${Date.now()}.png`;
      downloadBlobAsFile(blob, fileName);
      showToast('🎉 স্টিকার PNG সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('ইমেজ ডাউনলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsProcessing(true);
    try {
      const exportCanvas = generateExportCanvas(scale);
      const blob = await canvasToBlob(exportCanvas);
      await copyBlobToClipboard(blob);
      showToast('📋 ক্লিপবোর্ডে কপি হয়েছে! WhatsApp/Figma/Photoshop-এ সরাসরি পেস্ট (Ctrl+V) করুন');
    } catch (err) {
      console.error(err);
      alert('ক্লিপবোর্ডে কপি করা যায়নি। অনুগ্রহ করে ডাউনলোড বাটন ব্যবহার করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-emerald-600 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xl shadow-emerald-950/60 flex items-center gap-2 border border-emerald-400/40">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
          >
            <span className="p-1 rounded-lg bg-slate-800 border border-slate-700">←</span>
            <span>Banglish Home</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
              TextToPNGConverter
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold hidden sm:inline-block">
              Studio Beta
            </span>
          </div>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            disabled={isProcessing}
            className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
          >
            <span>📋</span>
            <span className="hidden sm:inline">কপি ইমেজ</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isProcessing}
            className="px-3.5 sm:px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-900/40 active:scale-95 flex items-center gap-1.5"
          >
            <span>⬇️</span>
            <span>ডাউনলোড PNG</span>
          </button>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Controls (Cols: 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Text Input with Phonetic Engine */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>বাংলা টেক্সট লিখুন</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  (মাল্টি-লাইন সাপোর্টেড)
                </span>
              </div>

              {/* Phonetic Toggle */}
              <button
                type="button"
                onClick={() => setIsPhoneticActive(!isPhoneticActive)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 border ${
                  isPhoneticActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPhoneticActive ? 'bg-emerald-400' : 'bg-slate-500'
                  }`}
                />
                <span>
                  {isPhoneticActive ? 'বাংলিশ ফোনেটিক চালু' : 'সরাসরি বাংলা ইনপুট'}
                </span>
              </button>
            </div>

            {/* Relative Textarea container with floating suggestion popup */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={rawText}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="এখানে বাংলা লিখুন বা বাংলিশে টাইপ করুন (যেমন: amra, cader, valobasha)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
              />

              {/* Phonetic Candidate Suggestion Popup */}
              {isPhoneticActive && candidates.length > 0 && (
                <div className="absolute left-2 bottom-full mb-1 z-50">
                  <CandidatePopup
                    candidates={candidates}
                    selectedIndex={selectedCandidateIndex}
                    onSelectIndex={setSelectedCandidateIndex}
                    onSelectCandidate={handleSelectCandidate}
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              💡 টিপস: আপনি সরাসরি বাংলা পেস্ট করতে পারেন অথবা কীবোর্ড না বদলেই সরাসরি ইংরেজি উচ্চারণে লিখতে পারেন।
            </p>
          </div>

          {/* Card 2: Interactive Word-Level Selector & Inspector */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>শব্দ সিলেক্টর ও ইনলাইন ফরম্যাটিং</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  যেকোনো নির্দিষ্ট শব্দের ফন্ট, সাইজ বা রঙ পরিবর্তন করতে সেই শব্দটিতে ক্লিক করুন:
                </p>
              </div>

              {Object.keys(wordOverrides).length > 0 && (
                <button
                  type="button"
                  onClick={resetAllOverrides}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline"
                >
                  রিসেট করুন
                </button>
              )}
            </div>

            {/* Word Chips List */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedWordId(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedWordId === null
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                সব শব্দ (All Words)
              </button>

              {parsedWords.map(w => {
                const isSelected = selectedWordId === w.id;
                const hasOverride = Boolean(wordOverrides[w.id]);
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWordId(w.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
                        : hasOverride
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <span style={{ color: w.color }}>●</span>
                    <span>{w.word}</span>
                    {hasOverride && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300">
                        কাস্টম
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Word Inspector Controls */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {activeWord ? (
                    <span>
                      সিলেক্টেড শব্দ: <strong className="text-emerald-400">"{activeWord.word}"</strong>
                    </span>
                  ) : (
                    <span className="text-slate-400">সব শব্দের জন্য গ্লোবাল ফরম্যাট</span>
                  )}
                </span>

                {activeWord && wordOverrides[activeWord.id] && (
                  <button
                    type="button"
                    onClick={() => resetWordFormat(activeWord.id)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    গ্লোবালে ফিরিয়ে নিন ↺
                  </button>
                )}
              </div>

              {/* Font Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    বাংলা ফন্ট নির্বাচন করুন
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    + কাস্টম ফন্ট আপলোড (.ttf)
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    onChange={handleFontUpload}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableFonts.map(f => {
                    const currentFamily = activeWord
                      ? activeWord.fontFamily
                      : globalFont;
                    const isCurrent = currentFamily === f.family;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => updateSelectedWord('fontFamily', f.family)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isCurrent
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">{f.bnName}</div>
                        <div
                          className="text-[13px] truncate text-slate-200 mt-0.5"
                          style={{ fontFamily: f.family }}
                        >
                          {f.preview}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size & Weight Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-medium">
                    <span>ফন্ট সাইজ (Size)</span>
                    <span className="font-mono text-emerald-400">
                      {activeWord ? activeWord.fontSize : globalFontSize}px
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const cur = activeWord ? activeWord.fontSize : globalFontSize;
                        updateSelectedWord('fontSize', Math.max(16, cur - 4));
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                    >
                      A-
                    </button>
                    <input
                      type="range"
                      min="16"
                      max="140"
                      value={activeWord ? activeWord.fontSize : globalFontSize}
                      onChange={e => updateSelectedWord('fontSize', parseInt(e.target.value, 10))}
                      className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const cur = activeWord ? activeWord.fontSize : globalFontSize;
                        updateSelectedWord('fontSize', Math.min(140, cur + 4));
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Weight Selector */}
                <div className="space-y-1">
                  <div className="text-xs text-slate-300 font-medium">ফন্ট ওয়েইট (Weight)</div>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: 'Light', weight: 300 },
                      { label: 'Regular', weight: 400 },
                      { label: 'Bold', weight: 700 },
                      { label: 'Black', weight: 800 }
                    ].map(w => {
                      const curWeight = activeWord ? activeWord.fontWeight : globalFontWeight;
                      const isSelected = curWeight === w.weight;
                      return (
                        <button
                          key={w.weight}
                          type="button"
                          onClick={() => updateSelectedWord('fontWeight', w.weight)}
                          className={`py-1 text-[11px] rounded-lg border font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                              : 'bg-slate-800/60 text-slate-400 border-slate-700/80 hover:text-slate-200'
                          }`}
                        >
                          {w.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Full RGB Color Selector for Text */}
              <RgbColorPicker
                label={
                  activeWord
                    ? `"${activeWord.word}" শব্দের রঙ (RGB Color Selector)`
                    : 'টেক্সটের রঙ (Global Text Color)'
                }
                value={activeWord ? activeWord.color : globalColor}
                onChange={newColor => updateSelectedWord('color', newColor)}
              />
            </div>
          </div>

          {/* Card 3: Background, Sticker Outline & Effects */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <span>🎨</span>
              <span>ব্যাকগ্রাউন্ড ও স্টিকার বর্ডার (Sticker Styles)</span>
            </h3>

            {/* Background Theme Presets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                ব্যাকগ্রাউন্ড থিম নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: 'transparent' as BackgroundTheme,
                    title: 'স্বচ্ছ (Transparent)',
                    desc: 'PNG স্টিকার এক্সপোর্ট',
                    badge: 'No BG'
                  },
                  {
                    id: 'dark-aurora' as BackgroundTheme,
                    title: 'ডার্ক অরোরা গ্লাস',
                    desc: 'সাইট থিম ১ (Cyber Glass)',
                    badge: 'Theme 1'
                  },
                  {
                    id: 'light-emerald' as BackgroundTheme,
                    title: 'লাইট এমারেল্ড',
                    desc: 'সাইট থিম ২ (Clean)',
                    badge: 'Theme 2'
                  },
                  {
                    id: 'custom-rgb' as BackgroundTheme,
                    title: 'কাস্টম RGB রঙ',
                    desc: 'যেকোনো সলিড রঙ',
                    badge: 'Custom'
                  }
                ].map(bg => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setBgTheme(bg.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      bgTheme === bg.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{bg.title}</span>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400">
                        {bg.badge}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{bg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Background Color Picker if custom-rgb selected */}
            {bgTheme === 'custom-rgb' && (
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <RgbColorPicker
                  label="কাস্টম ব্যাকগ্রাউন্ড রঙ (RGB Background Selector)"
                  value={customBgColor}
                  onChange={setCustomBgColor}
                />
              </div>
            )}

            {/* Sticker Die-Cut Outline Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              {/* Outline Width */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>স্টিকার বর্ডার (Die-Cut Outline)</span>
                  <span className="font-mono text-emerald-400">{strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="28"
                  value={strokeWidth}
                  onChange={e => setStrokeWidth(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Outline Color */}
              <RgbColorPicker
                label="বর্ডারের রঙ (Outline Color)"
                value={strokeColor}
                onChange={setStrokeColor}
              />
            </div>

            {/* Shadow & Glow Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>শ্যাডো / গ্লো (Drop Shadow Blur)</span>
                  <span className="font-mono text-emerald-400">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={shadowBlur}
                  onChange={e => setShadowBlur(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Text Alignment */}
              <div className="space-y-1">
                <div className="text-xs text-slate-300 font-medium">টেক্সট অ্যালাইনমেন্ট</div>
                <div className="grid grid-cols-3 gap-1">
                  {(['left', 'center', 'right'] as const).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAlign(a)}
                      className={`py-1 text-xs rounded-lg border capitalize ${
                        align === a
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {a === 'left' ? 'বাম (Left)' : a === 'center' ? 'মাঝখানে' : 'ডান (Right)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Canvas Preview & Export Options (Cols: 5) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  লাইভ প্রিভিউ (Live Preview)
                </span>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="flex items-center gap-1">
                {(['auto', '1:1', '16:9', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-0.5 text-[10px] rounded border font-mono ${
                      aspectRatio === ratio
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Canvas Area with Realistic Transparent Checkerboard */}
            <div className="w-full min-h-[300px] max-h-[460px] rounded-xl overflow-auto flex items-center justify-center p-4 relative border border-slate-800/80 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] bg-slate-950 shadow-inner">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-[420px] object-contain drop-shadow-2xl transition-transform"
              />
            </div>

            {/* Resolution Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>এক্সপোর্ট রেজোলিউশন (Export Scale)</span>
                <span className="font-mono text-emerald-400">
                  {scale === 1 ? 'স্ট্যান্ডার্ড (1x)' : scale === 2 ? 'রেটিনা HD (2x)' : 'আল্ট্রা HD 300 DPI (4x)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { s: 1, label: '1x (512px)', sub: 'দ্রুত' },
                  { s: 2, label: '2x (1024px)', sub: 'HD স্টিকার' },
                  { s: 4, label: '4x (2048px)', sub: 'প্রিন্ট কোয়ালিটি' }
                ].map(r => (
                  <button
                    key={r.s}
                    type="button"
                    onClick={() => setScale(r.s)}
                    className={`py-1.5 px-2 rounded-xl text-center border transition-all ${
                      scale === r.s
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{r.label}</div>
                    <div className="text-[10px] text-slate-500">{r.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-emerald-950/50 hover:brightness-110 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>⬇️</span>
                <span>ডাউনলোড ট্রান্সপারেন্ট PNG ({scale * 512}px)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs sm:text-sm transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <span>📋</span>
                <span>ক্লিপবোর্ডে কপি করুন (সরাসরি পেস্ট)</span>
              </button>
            </div>

            {/* Quick Helper Notes */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
              <p className="font-semibold text-emerald-400">⚡ সহজে ব্যবহারের টিপস:</p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                <li>
                  <strong>ক্লিপবোর্ডে কপি</strong> করে সরাসরি WhatsApp Web, Telegram, Photoshop বা Figma-তে <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-[10px]">Ctrl+V</kbd> চাপলেই পেস্ট হয়ে যাবে।
                </li>
                <li>
                  স্বচ্ছ ব্যাকগ্রাউন্ডে সেভ করলে লেখার চারপাশে কোনো ব্যাকগ্রাউন্ড রঙ আসবে না।
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
