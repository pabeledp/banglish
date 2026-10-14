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
import RgbColorPicker, { parseColorToRgb } from '@/components/RgbColorPicker';
import CandidatePopup from '@/components/CandidatePopup';
import { getPhoneticCandidates } from '@/lib/banglishDictionary';

interface StyledSegment {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
}

export default function TextToPNGConverterPage() {
  // Global defaults
  const [globalFont, setGlobalFont] = useState<string>(BANGLA_FONTS[0].family);
  const [globalFontSize, setGlobalFontSize] = useState<number>(56);
  const [globalFontWeight, setGlobalFontWeight] = useState<number>(600);
  const [globalColor, setGlobalColor] = useState<string>('#0f172a'); // Slate 900 for light card

  // Styled segments (the source of truth for the entire text)
  const [segments, setSegments] = useState<StyledSegment[]>([
    {
      id: 'seg-1',
      text: 'আমাদের সোনার বাংলা\nআমি তোমায় ভালোবাসি',
      fontFamily: BANGLA_FONTS[0].family,
      fontSize: 56,
      fontWeight: 600,
      color: '#0f172a'
    }
  ]);

  // Drag selection state & floating popup
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number; text: string } | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Active formatting inside popup
  const [activeFont, setActiveFont] = useState(BANGLA_FONTS[0].family);
  const [activeSize, setActiveSize] = useState(56);
  const [activeWeight, setActiveWeight] = useState(600);
  const [activeColor, setActiveColor] = useState('#059669');

  // Background Theme: Only Transparent, Banglish Theme Card (uploaded image), and Dark Aurora Glass
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('banglish-theme');

  // Outline / Die-cut styling
  const [strokeWidth, setStrokeWidth] = useState(0); // Default 0 for cards, can be increased for stickers
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.25)');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [scale, setScale] = useState(2); // 2x HD export by default

  // Custom Font upload
  const [availableFonts, setAvailableFonts] = useState<BanglaFontOption[]>(BANGLA_FONTS);

  // Phonetic typing state
  const [isPhoneticActive, setIsPhoneticActive] = useState(true);
  const [activePhoneticToken, setActivePhoneticToken] = useState('');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  // Toast & processing
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute full plain text from segments
  const plainText = useMemo(() => {
    return segments.map(s => s.text).join('');
  }, [segments]);

  // Construct structured lines for the Canvas Sticker Engine
  const structuredLines = useMemo(() => {
    const rawLines = plainText.split('\n');
    const result: TextSpan[][] = [];
    let cumulativeCharIndex = 0;

    for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
      const lineStr = rawLines[lineIdx];
      const lineStart = cumulativeCharIndex;
      const lineEnd = lineStart + lineStr.length;
      cumulativeCharIndex = lineEnd + 1; // +1 for the \n

      if (lineStr.length === 0) {
        continue;
      }

      // Map segments overlapping with this line
      const lineSpans: TextSpan[] = [];
      let segOffset = 0;

      for (const seg of segments) {
        const segStart = segOffset;
        const segEnd = segStart + seg.text.length;
        segOffset = segEnd;

        // Check overlap with current line
        const overlapStart = Math.max(lineStart, segStart);
        const overlapEnd = Math.min(lineEnd, segEnd);

        if (overlapStart < overlapEnd) {
          const sliceInSeg = seg.text.slice(overlapStart - segStart, overlapEnd - segStart);
          lineSpans.push({
            id: `${seg.id}-${lineIdx}`,
            text: sliceInSeg,
            fontFamily: seg.fontFamily,
            fontSize: seg.fontSize,
            fontWeight: seg.fontWeight,
            color: seg.color
          });
        }
      }

      if (lineSpans.length > 0) {
        result.push(lineSpans);
      }
    }

    return result;
  }, [plainText, segments]);

  // Render canvas whenever state changes
  useEffect(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;

    const options: StickerRenderOptions = {
      lines: structuredLines,
      bgTheme,
      strokeWidth,
      strokeColor,
      shadowBlur,
      shadowColor,
      shadowOffsetX: 0,
      shadowOffsetY: Math.round(shadowBlur * 0.25),
      padding: bgTheme === 'transparent' ? 36 : 60,
      align,
      scale: 1 // 1x in live preview for smooth 60fps
    };

    renderSticker(canvas, options);
  }, [structuredLines, bgTheme, strokeWidth, strokeColor, shadowBlur, shadowColor, align]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- Drag Selection & Floating Popup Handler ---
  const handleSelection = () => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start !== end && start >= 0 && end <= el.value.length) {
      const selectedStr = el.value.slice(start, end).trim();
      if (selectedStr.length > 0) {
        setSelectedRange({ start, end, text: selectedStr });

        // Calculate position relative to container
        const rect = el.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

        // Position popup centered above selection area
        const top = rect.top - containerRect.top - 12;
        const left = Math.min(Math.max(20, rect.left - containerRect.left + 40), rect.width - 200);

        setPopupPos({ top: Math.max(10, top), left });
        setIsPopupOpen(true);

        // Preload formatting of selected text
        // Find first overlapping segment
        let offset = 0;
        for (const seg of segments) {
          const sEnd = offset + seg.text.length;
          if (start >= offset && start < sEnd) {
            setActiveFont(seg.fontFamily);
            setActiveSize(seg.fontSize);
            setActiveWeight(seg.fontWeight);
            setActiveColor(seg.color);
            break;
          }
          offset = sEnd;
        }
        return;
      }
    }

    // If selection collapsed, do not close immediately if user is clicking inside popup
  };

  // Apply formatting to selected range by splitting segments
  const applyFormattingToRange = (
    newFont?: string,
    newSize?: number,
    newWeight?: number,
    newColor?: string
  ) => {
    if (!selectedRange) return;
    const { start, end } = selectedRange;

    const nextFont = newFont ?? activeFont;
    const nextSize = newSize ?? activeSize;
    const nextWeight = newWeight ?? activeWeight;
    const nextColor = newColor ?? activeColor;

    if (newFont) setActiveFont(newFont);
    if (newSize) setActiveSize(newSize);
    if (newWeight) setActiveWeight(newWeight);
    if (newColor) setActiveColor(newColor);

    const newSegments: StyledSegment[] = [];
    let curOffset = 0;

    for (const seg of segments) {
      const segStart = curOffset;
      const segEnd = segStart + seg.text.length;
      curOffset = segEnd;

      // Case 1: No overlap
      if (end <= segStart || start >= segEnd) {
        newSegments.push(seg);
        continue;
      }

      // Case 2: Overlap exists - slice segment into up to 3 parts
      const beforeLength = Math.max(0, start - segStart);
      const afterStart = Math.min(seg.text.length, end - segStart);

      // Part A: Before selection
      if (beforeLength > 0) {
        newSegments.push({
          ...seg,
          id: `seg-${Math.random().toString(36).substr(2, 6)}`,
          text: seg.text.slice(0, beforeLength)
        });
      }

      // Part B: The selected slice with new styling
      const selectedSlice = seg.text.slice(beforeLength, afterStart);
      if (selectedSlice.length > 0) {
        newSegments.push({
          id: `seg-${Math.random().toString(36).substr(2, 6)}`,
          text: selectedSlice,
          fontFamily: nextFont,
          fontSize: nextSize,
          fontWeight: nextWeight,
          color: nextColor
        });
      }

      // Part C: After selection
      if (afterStart < seg.text.length) {
        newSegments.push({
          ...seg,
          id: `seg-${Math.random().toString(36).substr(2, 6)}`,
          text: seg.text.slice(afterStart)
        });
      }
    }

    setSegments(newSegments);
  };

  // --- Phonetic Input Change Handler ---
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    // Direct replacement of plain text: single segment if plain edited, or preserve active formatting
    setSegments([
      {
        id: 'seg-root',
        text: val,
        fontFamily: globalFont,
        fontSize: globalFontSize,
        fontWeight: globalFontWeight,
        color: globalColor
      }
    ]);
    setIsPopupOpen(false);

    if (!isPhoneticActive) {
      setCandidates([]);
      setActivePhoneticToken('');
      return;
    }

    const cursorPos = e.target.selectionStart;
    const textBefore = val.slice(0, cursorPos);
    const match = textBefore.match(/([a-zA-Z\^]+)$/);

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
    const textBefore = plainText.slice(0, cursorPos - activePhoneticToken.length);
    const textAfter = plainText.slice(cursorPos);
    const updated = textBefore + candidate + ' ' + textAfter;

    setSegments([
      {
        id: 'seg-root',
        text: updated,
        fontFamily: globalFont,
        fontSize: globalFontSize,
        fontWeight: globalFontWeight,
        color: globalColor
      }
    ]);
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

  // --- Custom Font Upload ---
  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const customFont = await loadCustomFontFile(file);
      setAvailableFonts(prev => [customFont, ...prev]);
      if (isPopupOpen && selectedRange) {
        applyFormattingToRange(customFont.family);
      } else {
        setGlobalFont(customFont.family);
        setSegments(prev => prev.map(s => ({ ...s, fontFamily: customFont.family })));
      }
      showToast(`✨ ফন্ট '${customFont.name}' লোড হয়েছে!`);
    } catch (err) {
      console.error(err);
      alert('ফন্ট লোড করা যায়নি। বৈধ .ttf বা .otf ফাইল দিন।');
    }
  };

  // --- Export Handlers ---
  const generateExportCanvas = (targetScale: number): HTMLCanvasElement => {
    const offscreen = document.createElement('canvas');
    const options: StickerRenderOptions = {
      lines: structuredLines,
      bgTheme,
      strokeWidth,
      strokeColor,
      shadowBlur,
      shadowColor,
      shadowOffsetX: 0,
      shadowOffsetY: Math.round(shadowBlur * 0.25),
      padding: bgTheme === 'transparent' ? 36 : 60,
      align,
      scale: targetScale
    };
    renderSticker(offscreen, options);
    return offscreen;
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const exportCanvas = generateExportCanvas(scale);
      const blob = await canvasToBlob(exportCanvas);
      const fileName = `Banglish-${bgTheme === 'transparent' ? 'Sticker' : 'Card'}-${Date.now()}.png`;
      downloadBlobAsFile(blob, fileName);
      showToast('🎉 PNG সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('ডাউনলোড করতে সমস্যা হয়েছে।');
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
      showToast('📋 ক্লিপবোর্ডে কপি হয়েছে! সরাসরি WhatsApp/Figma/Photoshop-এ পেস্ট (Ctrl+V) করুন');
    } catch (err) {
      console.error(err);
      alert('ক্লিপবোর্ডে কপি করা যায়নি। ডাউনলোড বাটন ব্যবহার করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-emerald-700 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xl shadow-emerald-950/20 flex items-center gap-2 border border-emerald-500/40">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Site Header matching banglish.bd */}
      <header className="border-b border-emerald-100/80 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 transition-colors text-xs font-semibold"
          >
            <span className="p-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800">←</span>
            <span>হোমে ফিরুন</span>
          </Link>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></span>
              TextToPNGConverter
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold hidden sm:inline-block">
              স্টিকার ও কার্ড মেকার
            </span>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyToClipboard}
            disabled={isProcessing}
            className="px-3 sm:px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
          >
            <span>📋</span>
            <span className="hidden sm:inline">কপি ইমেজ</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isProcessing}
            className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-1.5"
          >
            <span>⬇️</span>
            <span>ডাউনলোড PNG</span>
          </button>
        </div>
      </header>

      {/* Main Content Studio Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor & Controls (7 Cols) */}
        <div ref={containerRef} className="lg:col-span-7 space-y-6 relative">
          {/* Card 1: Main Text Box with Drag-Selection Notice & Phonetic Support */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>বাংলা টেক্সট লিখুন</span>
                </span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  মাউস দিয়ে ড্র্যাগ করে শব্দ সিলেক্ট করুন
                </span>
              </div>

              {/* Phonetic Toggle */}
              <button
                type="button"
                onClick={() => setIsPhoneticActive(!isPhoneticActive)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 border ${
                  isPhoneticActive
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isPhoneticActive ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}
                />
                <span>
                  {isPhoneticActive ? 'বাংলিশ ফোনেটিক চালু' : 'সরাসরি ইনপুট'}
                </span>
              </button>
            </div>

            {/* Interactive Textarea with selection trigger */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={plainText}
                onChange={handleTextareaChange}
                onSelect={handleSelection}
                onMouseUp={handleSelection}
                onTouchEnd={handleSelection}
                onKeyUp={handleSelection}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="এখানে বাংলা লিখুন বা বাংলিশে টাইপ করুন (যেমন: amra, cader, valobasha)..."
                className="w-full bg-slate-50/70 border border-emerald-200/80 rounded-2xl p-4 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-y shadow-inner"
              />

              {/* Floating Phonetic Suggestions Popup */}
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

            {/* Helper Guidance */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>💡 লেখার যেকোনো শব্দ বা লাইন মাউস দিয়ে টেনে (drag করে) সিলেক্ট করলেই স্টাইল পপআপ আসবে।</span>
              {segments.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setSegments([
                      {
                        id: 'seg-reset',
                        text: plainText,
                        fontFamily: globalFont,
                        fontSize: globalFontSize,
                        fontWeight: globalFontWeight,
                        color: globalColor
                      }
                    ]);
                    setIsPopupOpen(false);
                    showToast('সকল শব্দ ডিফল্ট স্টাইলে রিসেট হয়েছে!');
                  }}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  স্টাইল রিসেট ↺
                </button>
              )}
            </div>

            {/* --- FLOATING SELECTION POPUP TOOLBAR (Appears when text is highlighted/dragged) --- */}
            {isPopupOpen && selectedRange && (
              <div
                className="absolute z-50 bg-white/95 backdrop-blur-2xl border-2 border-emerald-500 rounded-2xl shadow-2xl shadow-emerald-950/20 p-4 w-[310px] sm:w-[360px] animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-slate-800"
                style={{
                  top: `${(popupPos?.top || 40) + 70}px`,
                  left: '16px'
                }}
              >
                {/* Popup Header with selected text preview */}
                <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                  <div className="flex items-center gap-1.5 truncate max-w-[240px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span className="text-xs font-bold text-slate-700">সিলেক্টেড:</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 truncate">
                      "{selectedRange.text}"
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* 1. Font Selection Dropdown (As requested by user: "font select er drop down thakbe") */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>ফন্ট নির্বাচন করুন (Font)</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] text-emerald-700 font-semibold hover:underline"
                    >
                      + কাস্টম TTF
                    </button>
                  </label>
                  <select
                    value={activeFont}
                    onChange={(e) => applyFormattingToRange(e.target.value)}
                    className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {availableFonts.map((f) => (
                      <option key={f.id} value={f.family}>
                        {f.bnName} ({f.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Font Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>ফন্ট সাইজ (Size)</span>
                    <span className="font-mono text-emerald-700">{activeSize}px</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyFormattingToRange(undefined, Math.max(16, activeSize - 4))}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 text-xs font-bold"
                    >
                      A-
                    </button>
                    <input
                      type="range"
                      min="16"
                      max="140"
                      value={activeSize}
                      onChange={(e) => applyFormattingToRange(undefined, parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => applyFormattingToRange(undefined, Math.min(140, activeSize + 4))}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 text-xs font-bold"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* 3. Weight Options (Light / Regular / Bold) */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-700">ফন্ট ওয়েইট (Weight)</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: 'হালকা (Light)', weight: 300 },
                      { label: 'সাধারণ (Regular)', weight: 400 },
                      { label: 'বোল্ড (Bold)', weight: 700 }
                    ].map((w) => (
                      <button
                        key={w.weight}
                        type="button"
                        onClick={() => applyFormattingToRange(undefined, undefined, w.weight)}
                        className={`py-1.5 text-xs rounded-xl border font-semibold transition-all ${
                          activeWeight === w.weight
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Full RGB Color Selector for Selected Word */}
                <RgbColorPicker
                  label="সিলেক্টেড লেখার রঙ (RGB Color)"
                  value={activeColor}
                  onChange={(color) => applyFormattingToRange(undefined, undefined, undefined, color)}
                />
              </div>
            )}
          </div>

          {/* Hidden File Input for Custom Font Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf,.woff,.woff2"
            onChange={handleFontUpload}
            className="hidden"
          />

          {/* Card 2: Global Styling & Background Theme Settings */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🖼️</span>
              <span>ব্যাকগ্রাউন্ড থিম নির্বাচন করুন (Background)</span>
            </h3>

            {/* Background Theme Selector: ONLY Transparent, Banglish Theme Card, and Dark Aurora */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Transparent PNG */}
              <button
                type="button"
                onClick={() => {
                  setBgTheme('transparent');
                  if (strokeWidth === 0) setStrokeWidth(10); // Auto outline for stickers
                  setGlobalColor('#10b981');
                }}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  bgTheme === 'transparent'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">স্বচ্ছ স্টিকার</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">PNG</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    কোনো ব্যাকগ্রাউন্ড থাকবে না (WhatsApp/Telegram স্টিকারের জন্য)
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg bg-[linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] bg-[size:10px_10px] border border-slate-300/80"></div>
              </button>

              {/* Option 2: Banglish Theme Card (The user's uploaded image) */}
              <button
                type="button"
                onClick={() => {
                  setBgTheme('banglish-theme');
                  setStrokeWidth(0);
                  setGlobalColor('#0f172a');
                }}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  bgTheme === 'banglish-theme'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">ব্যাংলিশ থিম কার্ড</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">New</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    গ্রিড ও ওয়াটার ড্রপলেট সহ আমাদের সাইটের সিগনেচার থিম
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg overflow-hidden border border-emerald-200 relative">
                  <img src="/assets/banglish-card-bg.jpg" alt="Theme Card" className="w-full h-full object-cover" />
                </div>
              </button>

              {/* Option 3: Dark Aurora Glass */}
              <button
                type="button"
                onClick={() => {
                  setBgTheme('dark-aurora');
                  setStrokeWidth(0);
                  setGlobalColor('#ffffff');
                }}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  bgTheme === 'dark-aurora'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">ডার্ক অরোরা গ্লাস</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-mono">Dark</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    গ্রাফাইট ব্যাকগ্রাউন্ড ও নিয়ন এমারেল্ড গ্লাস ফ্রেম
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg bg-gradient-to-br from-[#060a12] via-[#0b1120] to-[#050811] border border-emerald-500/30"></div>
              </button>
            </div>

            {/* Global Typography & RGB Color Controls */}
            <div className="pt-3 border-t border-emerald-100/80 space-y-4">
              <div className="text-xs font-bold text-slate-800">
                সকল শব্দের ডিফল্ট সেটিংস (Global Defaults):
              </div>

              {/* Font Dropdown for all text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ডিফল্ট ফন্ট (Default Font)</label>
                  <select
                    value={globalFont}
                    onChange={(e) => {
                      setGlobalFont(e.target.value);
                      setSegments(prev => prev.map(s => ({ ...s, fontFamily: e.target.value })));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {availableFonts.map((f) => (
                      <option key={f.id} value={f.family}>
                        {f.bnName} ({f.name})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Text Alignment */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">অ্যালাইনমেন্ট</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['left', 'center', 'right'] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAlign(a)}
                        className={`py-2 text-xs rounded-xl border font-semibold ${
                          align === a
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50'
                        }`}
                      >
                        {a === 'left' ? 'বাম' : a === 'center' ? 'মাঝখানে' : 'ডান'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Global RGB Color Picker */}
              <RgbColorPicker
                label="ডিফল্ট লেখার রঙ (Global Text RGB Color)"
                value={globalColor}
                onChange={(c) => {
                  setGlobalColor(c);
                  setSegments(prev => prev.map(s => ({ ...s, color: c })));
                }}
              />

              {/* Die-Cut Sticker Outline (Border) if user wants a sticker die-cut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>স্টিকার বর্ডার (Die-Cut Outline)</span>
                    <span className="font-mono text-emerald-700">{strokeWidth}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {strokeWidth > 0 && (
                  <RgbColorPicker
                    label="বর্ডারের রঙ (Outline Color)"
                    value={strokeColor}
                    onChange={setStrokeColor}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Canvas Preview & Export (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  লাইভ প্রিভিউ (Live Card Preview)
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {bgTheme === 'transparent' ? 'স্বচ্ছ PNG' : bgTheme === 'banglish-theme' ? 'ব্যাংলিশ থিম' : 'ডার্ক অরোরা'}
              </span>
            </div>

            {/* Canvas Container with Theme Background */}
            <div className="w-full min-h-[320px] max-h-[460px] rounded-2xl overflow-hidden flex items-center justify-center p-3 relative border border-emerald-200/80 shadow-inner bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:16px_16px]">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-[420px] object-contain drop-shadow-lg transition-transform rounded-xl"
              />
            </div>

            {/* Resolution Selector */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>এক্সপোর্ট সাইজ (Export Quality)</span>
                <span className="font-mono text-emerald-700">
                  {scale === 1 ? '512px (Standard)' : scale === 2 ? '1024px (HD)' : '2048px (Ultra HD 300 DPI)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { s: 1, label: '512px', sub: 'স্ট্যান্ডার্ড' },
                  { s: 2, label: '1024px', sub: 'রেটিনা HD' },
                  { s: 4, label: '2048px', sub: 'আল্ট্রা প্রিন্ট' }
                ].map((r) => (
                  <button
                    key={r.s}
                    type="button"
                    onClick={() => setScale(r.s)}
                    className={`py-2 px-2 rounded-xl text-center border transition-all ${
                      scale === r.s
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="text-xs">{r.label}</div>
                    <div className={`text-[10px] ${scale === r.s ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {r.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-600/25 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>⬇️</span>
                <span>ডাউনলোড হাই-কোয়ালিটি PNG ({scale * 512}px)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-300 text-slate-800 font-bold text-xs sm:text-sm transition-all active:scale-98 flex items-center justify-center gap-2 shadow-xs"
              >
                <span>📋</span>
                <span>সরাসরি ক্লিপবোর্ডে কপি করুন (Paste to WhatsApp/Figma)</span>
              </button>
            </div>

            {/* Pro Tip */}
            <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 space-y-1">
              <p className="font-bold text-emerald-800">💡 ব্যবহারবিধি:</p>
              <p>১. টেক্সটের যে অংশটি বদলাতে চান, মাউস দিয়ে শুধু সেই অংশটুকু ড্র্যাগ করে সিলেক্ট করুন।</p>
              <p>২. সাথে সাথেই ভেসে ওঠা পপআপ থেকে ফন্ট ড্রপডাউন, সাইজ স্লাইডার ও RGB কালার দিয়ে স্টাইল করুন।</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
