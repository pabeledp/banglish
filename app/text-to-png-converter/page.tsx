'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  TextSpan,
  BackgroundTheme,
  LogoPosition,
  StickerRenderOptions,
  renderSticker,
  canvasToBlob,
  downloadBlobAsFile,
  copyBlobToClipboard
} from '@/lib/stickerEngine';
import { BANGLA_FONTS, ALL_FONTS, BanglaFontOption, loadCustomFontFile } from '@/lib/cardFonts';
import RgbColorPicker from '@/components/RgbColorPicker';
import CandidatePopup from '@/components/CandidatePopup';
import { getPhoneticCandidates } from '@/lib/banglishDictionary';
import { transliterateWord } from '@/lib/phoneticEngine';

// Clean SVG Icons for Alignment
const AlignLeftIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="6" x2="3" y2="6"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
    <line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);

const AlignCenterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="6"/>
    <line x1="21" y1="12" x2="3" y2="12"/>
    <line x1="18" y1="18" x2="6" y2="18"/>
  </svg>
);

const AlignRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" y1="6" x2="3" y2="6"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
    <line x1="21" y1="18" x2="7" y2="18"/>
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

interface StyledSegment {
  id: string;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing?: number;
  lineGap?: number;
}

type QualityLevel = 'high' | 'medium' | 'low';

export default function TextToPNGConverterPage() {
  // Global / Default Typography
  const [globalFont, setGlobalFont] = useState<string>(BANGLA_FONTS[0].family);
  const [globalFontSize, setGlobalFontSize] = useState<number>(56);
  const [globalFontWeight, setGlobalFontWeight] = useState<number>(600);
  const [globalColor, setGlobalColor] = useState<string>('#0f172a');
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center');
  const [lineGap, setLineGap] = useState<number>(0);
  const [lineGaps, setLineGaps] = useState<Record<number, number>>({});
  const [globalLetterSpacing, setGlobalLetterSpacing] = useState<number>(0);

  // Styled segments (Source of truth)
  const [segments, setSegments] = useState<StyledSegment[]>([
    {
      id: 'seg-1',
      text: 'আমাদের সোনার বাংলা\nআমি তোমায় ভালোবাসি',
      fontFamily: BANGLA_FONTS[0].family,
      fontSize: 56,
      fontWeight: 600,
      color: '#0f172a',
      letterSpacing: 0
    }
  ]);

  // True Floating Popup State (position coordinates + lineIndex)
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
    text: string;
    lineIndex: number;
  } | null>(null);
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number }>({ x: 80, y: 120 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Active formatting of selected text
  const [activeFont, setActiveFont] = useState(BANGLA_FONTS[0].family);
  const [activeSize, setActiveSize] = useState(56);
  const [activeWeight, setActiveWeight] = useState(600);
  const [activeColor, setActiveColor] = useState('#059669');
  const [activeSpacing, setActiveSpacing] = useState(0);

  // Background Theme: Only Transparent, Banglish Theme Card (1:1 procedural), and Dark Aurora Glass
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('banglish-theme');

  // Sticker Die-cut Outline
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.25)');

  // Download Quality Dropdown state
  const [downloadQuality, setDownloadQuality] = useState<QualityLevel>('medium');
  const [isQualityDropdownOpen, setIsQualityDropdownOpen] = useState(false);
  const qualityDropdownRef = useRef<HTMLDivElement | null>(null);

  // Custom & Standard Fonts (Bangla + Arabic Calligraphy & Quranic)
  const [availableFonts, setAvailableFonts] = useState<BanglaFontOption[]>(ALL_FONTS);

  // Text Canvas Drag Position State
  const [textOffset, setTextOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingText, setIsDraggingText] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; initialOffsetX: number; initialOffsetY: number } | null>(null);

  // Phonetic typing state
  const [isPhoneticActive, setIsPhoneticActive] = useState(true);
  const [activePhoneticToken, setActivePhoneticToken] = useState('');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  // Toast & processing
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Logo & Device Cache State (100% stored in local browser cache)
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoImageEl, setLogoImageEl] = useState<HTMLImageElement | null>(null);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('top-left');
  const [logoSize, setLogoSize] = useState<number>(44);
  const [logoOpacity, setLogoOpacity] = useState<number>(100);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Load cached logo from device storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedLogo = localStorage.getItem('banglish_sticker_logo');
        const cachedPos = localStorage.getItem('banglish_sticker_logo_pos') as LogoPosition;
        const cachedSize = localStorage.getItem('banglish_sticker_logo_size');
        const cachedOp = localStorage.getItem('banglish_sticker_logo_op');
        if (cachedLogo) {
          setLogoDataUrl(cachedLogo);
          const img = new Image();
          img.src = cachedLogo;
          img.onload = () => setLogoImageEl(img);
        }
        if (cachedPos) setLogoPosition(cachedPos);
        if (cachedSize) setLogoSize(parseInt(cachedSize, 10));
        if (cachedOp) setLogoOpacity(parseInt(cachedOp, 10));
      } catch (e) {
        console.error('Error loading logo from device cache', e);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('লোগো ফাইলের সাইজ সর্বোচ্চ 5MB হতে পারবে।');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoDataUrl(result);
      try {
        localStorage.setItem('banglish_sticker_logo', result);
      } catch (err) {
        console.warn('Could not cache full logo to localStorage', err);
      }
      const img = new Image();
      img.src = result;
      img.onload = () => setLogoImageEl(img);
      showToast('🎉 লোগো যুক্ত হয়েছে ও ডিভাইসে সংরক্ষিত হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl(null);
    setLogoImageEl(null);
    try {
      localStorage.removeItem('banglish_sticker_logo');
    } catch {}
    showToast('লোগো সরানো হয়েছে');
  };

  const updateLogoPos = (pos: LogoPosition) => {
    setLogoPosition(pos);
    try {
      localStorage.setItem('banglish_sticker_logo_pos', pos);
    } catch {}
  };

  const updateLogoSize = (size: number) => {
    setLogoSize(size);
    try {
      localStorage.setItem('banglish_sticker_logo_size', size.toString());
    } catch {}
  };

  const updateLogoOpacity = (op: number) => {
    setLogoOpacity(op);
    try {
      localStorage.setItem('banglish_sticker_logo_op', op.toString());
    } catch {}
  };

  // --- Text Dragging Logic on Canvas Preview ---
  const handleStartDrag = (clientX: number, clientY: number) => {
    dragStartRef.current = {
      clientX,
      clientY,
      initialOffsetX: textOffset.x,
      initialOffsetY: textOffset.y
    };
    setIsDraggingText(true);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragStartRef.current || !previewCanvasRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = previewCanvasRef.current.getBoundingClientRect();
      const canvas = previewCanvasRef.current;
      const scaleFactor = rect.width > 0 ? (canvas.width / rect.width) : 1;

      const deltaX = (clientX - dragStartRef.current.clientX) * scaleFactor;
      const deltaY = (clientY - dragStartRef.current.clientY) * scaleFactor;

      setTextOffset({
        x: Math.round(dragStartRef.current.initialOffsetX + deltaX),
        y: Math.round(dragStartRef.current.initialOffsetY + deltaY)
      });
    };

    const handleEnd = () => {
      if (dragStartRef.current) {
        dragStartRef.current = null;
        setIsDraggingText(false);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [textOffset]);

  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const floatingPopupRef = useRef<HTMLDivElement | null>(null);

  // Plain text representation
  const plainText = useMemo(() => {
    return segments.map(s => s.text).join('');
  }, [segments]);

  // Close quality dropdown & floating popup when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (qualityDropdownRef.current && !qualityDropdownRef.current.contains(target)) {
        setIsQualityDropdownOpen(false);
      }
      if (
        isPopupOpen &&
        floatingPopupRef.current &&
        !floatingPopupRef.current.contains(target)
      ) {
        if (textareaRef.current && textareaRef.current.contains(target)) {
          // If clicked inside textarea on a blank spot (no range selection), auto-close
          setTimeout(() => {
            if (
              textareaRef.current &&
              textareaRef.current.selectionStart === textareaRef.current.selectionEnd
            ) {
              setIsPopupOpen(false);
              setSelectedRange(null);
            }
          }, 0);
        } else {
          setIsPopupOpen(false);
          setSelectedRange(null);
        }
      }
    };

    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQualityDropdownOpen(false);
        setIsPopupOpen(false);
        setSelectedRange(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, [isPopupOpen]);

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

      if (lineStr.length === 0) continue;

      const lineSpans: TextSpan[] = [];
      let segOffset = 0;

      for (const seg of segments) {
        const segStart = segOffset;
        const segEnd = segStart + seg.text.length;
        segOffset = segEnd;

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
            color: seg.color,
            letterSpacing: seg.letterSpacing,
            lineGap: lineGaps[lineIdx] ?? lineGap
          });
        }
      }

      if (lineSpans.length > 0) {
        result.push(lineSpans);
      }
    }

    return result;
  }, [plainText, segments, lineGaps, lineGap]);

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
      scale: 1, // 1x preview for fast 60fps
      lineGap,
      lineGaps,
      letterSpacing: globalLetterSpacing,
      textOffsetX: textOffset.x,
      textOffsetY: textOffset.y,
      logo: logoImageEl ? {
        image: logoImageEl,
        position: logoPosition,
        size: logoSize,
        opacity: logoOpacity / 100
      } : undefined
    };

    renderSticker(canvas, options);
  }, [
    structuredLines,
    bgTheme,
    strokeWidth,
    strokeColor,
    shadowBlur,
    shadowColor,
    align,
    lineGap,
    lineGaps,
    globalLetterSpacing,
    textOffset,
    logoImageEl,
    logoPosition,
    logoSize,
    logoOpacity
  ]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- True Floating Popup Trigger on Mouse/Touch Drag Selection ---
  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (start !== end && start >= 0 && end <= el.value.length) {
      const selectedStr = el.value.slice(start, end).trim();
      if (selectedStr.length > 0) {
        // Line-wise line index detection
        const textBeforeSelection = el.value.slice(0, start);
        const selectedLineIndex = textBeforeSelection.split('\n').length - 1;

        setSelectedRange({ start, end, text: selectedStr, lineIndex: selectedLineIndex });

        // Calculate floating position directly near cursor, clamped to viewport
        const popupW = 340;
        const popupH = 430;
        const clientX = e.clientX || window.innerWidth / 2;
        const clientY = e.clientY || 200;

        const x = Math.min(Math.max(16, clientX - popupW / 2), window.innerWidth - popupW - 16);
        // Position above the cursor if space permits, else below
        const y = clientY - popupH - 15 > 20 ? clientY - popupH - 15 : clientY + 25;

        setFloatingPos({ x, y });
        setIsPopupOpen(true);

        // Preload formatting of selected text
        let offset = 0;
        for (const seg of segments) {
          const sEnd = offset + seg.text.length;
          if (start >= offset && start < sEnd) {
            setActiveFont(seg.fontFamily);
            setActiveSize(seg.fontSize);
            setActiveWeight(seg.fontWeight);
            setActiveColor(seg.color);
            setActiveSpacing(seg.letterSpacing ?? globalLetterSpacing);
            break;
          }
          offset = sEnd;
        }
        return;
      }
    }

    // Auto-close if clicked on empty space / collapsed selection
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedRange(null);
    }
  };

  const handleTextareaClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (el.selectionStart === el.selectionEnd && isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedRange(null);
    }
  };

  const handleTextareaKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    if (el.selectionStart === el.selectionEnd && isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedRange(null);
    }
  };

  // Apply formatting to selected range by splitting segments
  const applyFormattingToRange = (
    newFont?: string,
    newSize?: number,
    newWeight?: number,
    newColor?: string,
    newAlign?: 'left' | 'center' | 'right',
    newSpacing?: number
  ) => {
    if (newAlign) {
      setAlign(newAlign);
    }

    if (!selectedRange) return;
    const { start, end } = selectedRange;

    const nextFont = newFont ?? activeFont;
    const nextSize = newSize ?? activeSize;
    const nextWeight = newWeight ?? activeWeight;
    const nextColor = newColor ?? activeColor;
    const nextSpacing = newSpacing ?? activeSpacing;

    if (newFont) setActiveFont(newFont);
    if (newSize) setActiveSize(newSize);
    if (newWeight) setActiveWeight(newWeight);
    if (newColor) setActiveColor(newColor);
    if (newSpacing !== undefined) setActiveSpacing(nextSpacing);

    const newSegments: StyledSegment[] = [];
    let curOffset = 0;

    for (const seg of segments) {
      const segStart = curOffset;
      const segEnd = segStart + seg.text.length;
      curOffset = segEnd;

      if (end <= segStart || start >= segEnd) {
        newSegments.push(seg);
        continue;
      }

      const beforeLength = Math.max(0, start - segStart);
      const afterStart = Math.min(seg.text.length, end - segStart);

      if (beforeLength > 0) {
        newSegments.push({
          ...seg,
          id: `seg-${Math.random().toString(36).substr(2, 6)}`,
          text: seg.text.slice(0, beforeLength)
        });
      }

      const selectedSlice = seg.text.slice(beforeLength, afterStart);
      if (selectedSlice.length > 0) {
        newSegments.push({
          id: `seg-${Math.random().toString(36).substr(2, 6)}`,
          text: selectedSlice,
          fontFamily: nextFont,
          fontSize: nextSize,
          fontWeight: nextWeight,
          color: nextColor,
          letterSpacing: nextSpacing
        });
      }

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

  // --- Phonetic Input with Spacebar Auto-Transliteration ---
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;

    // Update plain text in segments
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

    // Auto-close popup when text changes or word is removed
    if (isPopupOpen) {
      setIsPopupOpen(false);
      setSelectedRange(null);
    }

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

  const handleSelectCandidate = (candidate: string, appendChar: string = ' ') => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;
    const tokenLen = activePhoneticToken.length;
    const textBefore = plainText.slice(0, cursorPos - tokenLen);
    const textAfter = plainText.slice(cursorPos);
    const updated = textBefore + candidate + appendChar + textAfter;

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
      if (textareaRef.current) {
        const nextPos = textBefore.length + candidate.length + appendChar.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 10);
  };

  // Auto-transliterate on Spacebar, Enter, or Tab without switching OS language
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPhoneticActive && activePhoneticToken) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const chosen = candidates[selectedCandidateIndex] || transliterateWord(activePhoneticToken);
        handleSelectCandidate(chosen, ' ');
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const chosen = candidates[selectedCandidateIndex] || transliterateWord(activePhoneticToken);
        handleSelectCandidate(chosen, '\n');
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const chosen = candidates[selectedCandidateIndex] || transliterateWord(activePhoneticToken);
        handleSelectCandidate(chosen, ' ');
        return;
      }

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

      if (/^[1-9]$/.test(e.key) && (e.altKey || e.ctrlKey)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= candidates.length) {
          e.preventDefault();
          handleSelectCandidate(candidates[num - 1], ' ');
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
  const getScaleMultiplier = (quality: QualityLevel): number => {
    if (quality === 'high') return 4; // 2048px (Ultra HD)
    if (quality === 'low') return 1;  // 512px (Standard)
    return 2;                         // 1024px (Medium Default)
  };

  const handleDownload = async (chosenQuality: QualityLevel = downloadQuality) => {
    setIsProcessing(true);
    setIsQualityDropdownOpen(false);
    try {
      const scaleMultiplier = getScaleMultiplier(chosenQuality);
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
        scale: scaleMultiplier,
        lineGap,
        lineGaps,
        letterSpacing: globalLetterSpacing,
        textOffsetX: textOffset.x,
        textOffsetY: textOffset.y,
        logo: logoImageEl ? {
          image: logoImageEl,
          position: logoPosition,
          size: logoSize,
          opacity: logoOpacity / 100
        } : undefined
      };
      renderSticker(offscreen, options);

      const blob = await canvasToBlob(offscreen);
      const qualityName = chosenQuality.toUpperCase();
      const fileName = `Banglish-${bgTheme === 'transparent' ? 'Sticker' : 'Card'}-${qualityName}-${Date.now()}.png`;
      downloadBlobAsFile(blob, fileName);
      showToast(`🎉 PNG ডাউনলোড হয়েছে (${qualityName} - ${scaleMultiplier * 512}px)!`);
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
        scale: 2, // 1024px HD for clipboard
        lineGap,
        lineGaps,
        letterSpacing: globalLetterSpacing,
        textOffsetX: textOffset.x,
        textOffsetY: textOffset.y,
        logo: logoImageEl ? {
          image: logoImageEl,
          position: logoPosition,
          size: logoSize,
          opacity: logoOpacity / 100
        } : undefined
      };
      renderSticker(offscreen, options);

      const blob = await canvasToBlob(offscreen);
      await copyBlobToClipboard(blob);
      showToast('📋 ক্লিপবোর্ডে কপি হয়েছে! WhatsApp/Figma/Photoshop-এ পেস্ট (Ctrl+V) করুন');
    } catch (err) {
      console.error(err);
      alert('ক্লিপবোর্ডে কপি করা যায়নি। Download বাটন ব্যবহার করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-emerald-800 text-white font-medium text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xl shadow-emerald-950/20 flex items-center gap-2 border border-emerald-500/40">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* --- TRUE FLOATING POPUP TOOLBAR (Floats freely above selected words) --- */}
      {isPopupOpen && selectedRange && (
        <div
          ref={floatingPopupRef}
          className="fixed z-[100] bg-white/95 backdrop-blur-2xl border-2 border-emerald-500/90 rounded-2xl shadow-2xl shadow-emerald-950/25 p-4 w-[330px] sm:w-[350px] animate-in fade-in zoom-in-95 duration-150 space-y-3.5 text-slate-800"
          style={{
            left: `${floatingPos.x}px`,
            top: `${floatingPos.y}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
            <div className="flex items-center gap-2 truncate max-w-[260px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-xs font-bold text-slate-700">সিলেক্টেড:</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 truncate">
                "{selectedRange.text}"
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-emerald-100/50 text-xs font-bold"
              title="বন্ধ করুন"
            >
              ✕
            </button>
          </div>

          {/* 1. Font Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>ফন্ট (Font)</span>
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
              <optgroup label="বাংলা ফন্ট (Bangla Fonts)">
                {availableFonts.filter(f => f.script === 'bangla').map((f) => (
                  <option key={f.id} value={f.family}>
                    {f.bnName} ({f.name})
                  </option>
                ))}
              </optgroup>
              <optgroup label="আরবি ও কুরআনিক ফন্ট (Arabic & Quranic)">
                {availableFonts.filter(f => f.script === 'arabic').map((f) => (
                  <option key={f.id} value={f.family}>
                    {f.bnName} ({f.name})
                  </option>
                ))}
              </optgroup>
              {availableFonts.some(f => f.isCustom) && (
                <optgroup label="কাস্টম ফন্ট (Custom Uploaded)">
                  {availableFonts.filter(f => f.isCustom).map((f) => (
                    <option key={f.id} value={f.family}>
                      {f.bnName} ({f.name})
                    </option>
                  ))}
                </optgroup>
              )}
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
                className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold"
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
                className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold"
              >
                A+
              </button>
            </div>
          </div>

          {/* 3. Font Weight Dropdown (As requested: "font weight ekhaneo dropdown system hobe") */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">ফন্ট ওয়েইট (Weight)</label>
              <select
                value={activeWeight}
                onChange={(e) => applyFormattingToRange(undefined, undefined, parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value={300}>হালকা (Light 300)</option>
                <option value={400}>সাধারণ (Regular 400)</option>
                <option value={600}>সেমি-বোল্ড (SemiBold 600)</option>
                <option value={700}>বোল্ড (Bold 700)</option>
                <option value={800}>অতিরিক্ত বোল্ড (Black 800)</option>
              </select>
            </div>

            {/* 4. Alignment with Clean Universal SVG Icons */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">অ্যালাইনমেন্ট</label>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-emerald-200">
                <button
                  type="button"
                  onClick={() => applyFormattingToRange(undefined, undefined, undefined, undefined, 'left')}
                  className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all ${
                    align === 'left' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Align Left"
                >
                  <AlignLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormattingToRange(undefined, undefined, undefined, undefined, 'center')}
                  className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all ${
                    align === 'center' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Align Center"
                >
                  <AlignCenterIcon />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormattingToRange(undefined, undefined, undefined, undefined, 'right')}
                  className={`flex-1 py-1 flex items-center justify-center rounded-lg transition-all ${
                    align === 'right' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                  title="Align Right"
                >
                  <AlignRightIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Character Gap & Line Gap (Side by Side: 2 পাশে ২ টা) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Character Gap */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>ক্যারেক্টার গ্যাপ</span>
                <span className="font-mono text-[11px] text-emerald-700">{activeSpacing}px</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(-6, activeSpacing - 1);
                    setActiveSpacing(next);
                    applyFormattingToRange(undefined, undefined, undefined, undefined, undefined, next);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                  title="ক্যারেক্টার গ্যাপ কমান"
                >
                  -
                </button>
                <input
                  type="range"
                  min="-6"
                  max="20"
                  step="1"
                  value={activeSpacing}
                  onChange={(e) => {
                    const next = parseInt(e.target.value, 10);
                    setActiveSpacing(next);
                    applyFormattingToRange(undefined, undefined, undefined, undefined, undefined, next);
                  }}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(20, activeSpacing + 1);
                    setActiveSpacing(next);
                    applyFormattingToRange(undefined, undefined, undefined, undefined, undefined, next);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                  title="ক্যারেক্টার গ্যাপ বাড়ান"
                >
                  +
                </button>
              </div>
            </div>

            {/* Line Gap - strictly for THIS selected line */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>লাইন গ্যাপ {selectedRange.lineIndex !== undefined ? `(লাইন ${selectedRange.lineIndex + 1})` : ''}</span>
                <span className="font-mono text-[11px] text-emerald-700">
                  {selectedRange.lineIndex !== undefined ? (lineGaps[selectedRange.lineIndex] ?? 0) : lineGap}px
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const lIdx = selectedRange.lineIndex ?? 0;
                    const cur = lineGaps[lIdx] ?? 0;
                    const next = Math.max(-30, cur - 2);
                    setLineGaps(prev => ({ ...prev, [lIdx]: next }));
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                  title="এই লাইনের গ্যাপ কমান"
                >
                  -
                </button>
                <input
                  type="range"
                  min="-30"
                  max="40"
                  step="1"
                  value={selectedRange.lineIndex !== undefined ? (lineGaps[selectedRange.lineIndex] ?? 0) : lineGap}
                  onChange={(e) => {
                    const lIdx = selectedRange.lineIndex ?? 0;
                    const next = parseInt(e.target.value, 10);
                    setLineGaps(prev => ({ ...prev, [lIdx]: next }));
                  }}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const lIdx = selectedRange.lineIndex ?? 0;
                    const cur = lineGaps[lIdx] ?? 0;
                    const next = Math.min(40, cur + 2);
                    setLineGaps(prev => ({ ...prev, [lIdx]: next }));
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                  title="এই লাইনের গ্যাপ বাড়ান"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 5. Color Selector - Just Choose Color */}
          <RgbColorPicker
            label="Choose Color"
            showRgbBadge={false}
            value={activeColor}
            onChange={(color) => applyFormattingToRange(undefined, undefined, undefined, color)}
          />
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-emerald-100/70 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl p-1"
                title="Banglish হোমপেজে যান"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/80 p-1.5 flex items-center justify-center border border-emerald-200/60 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">Banglish</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 tracking-wider font-bangla -mt-1">বাংলায় লিখি বিজয়ের সুর</span>
                </div>
              </Link>

              <span className="text-slate-300 hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                TextToPNGConverter
              </div>
            </div>

            {/* Top Action Buttons (Download Split Button + Copy Image) */}
            <div className="flex items-center gap-2.5">
              {/* Copy Image Button */}
              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={isProcessing}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-xs"
              >
                <CopyIcon className="w-4 h-4 text-emerald-700" />
                <span>Copy Image</span>
              </button>

              {/* Split Download Button with Dropdown (High, Medium, Low) */}
              <div ref={qualityDropdownRef} className="relative inline-flex rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => handleDownload(downloadQuality)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-l-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <DownloadIcon className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
                  className="px-2.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs border-l border-emerald-500/40 rounded-r-xl transition-all flex items-center justify-center"
                  title="কোয়ালিটি অপশন"
                >
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </button>

                {/* Quality Dropdown Menu */}
                {isQualityDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      রেজোলিউশন নির্বাচন
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadQuality('high');
                        handleDownload('high');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors ${
                        downloadQuality === 'high' ? 'font-bold text-emerald-800 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>High Quality</span>
                      <span className="text-[10px] text-slate-400 font-mono">2048px (Ultra)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadQuality('medium');
                        handleDownload('medium');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors ${
                        downloadQuality === 'medium' ? 'font-bold text-emerald-800 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Medium Quality</span>
                        <span className="text-[9px] px-1 rounded bg-emerald-100 text-emerald-800 font-semibold">ডিফল্ট</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">1024px</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDownloadQuality('low');
                        handleDownload('low');
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between transition-colors ${
                        downloadQuality === 'low' ? 'font-bold text-emerald-800 bg-emerald-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>Low Quality</span>
                      <span className="text-[10px] text-slate-400 font-mono">512px</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Text Input & Options (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Text Box with Drag-Selection Notice & Phonetic Support */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-3.5 relative z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span>✍️</span>
                  <span>বাংলা টেক্সট লিখুন</span>
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

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={plainText}
                onChange={handleTextareaChange}
                onMouseUp={handleMouseUp}
                onClick={handleTextareaClick}
                onKeyUp={handleTextareaKeyUp}
                onTouchEnd={(e) => {
                  const touch = e.changedTouches[0];
                  if (touch) {
                    handleMouseUp({ clientX: touch.clientX, clientY: touch.clientY, currentTarget: textareaRef.current } as any);
                  }
                }}
                onKeyDown={handleKeyDown}
                rows={4}
                placeholder="এখানে লিখুন বা বাংলিশে টাইপ করুন (যেমন: amra, cader, valobasha লিখে স্পেস চাপুন)..."
                className="w-full bg-slate-50/70 border border-emerald-200/80 rounded-2xl p-4 text-base sm:text-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-y shadow-inner"
              />

              {/* Floating Phonetic Suggestions Popup (Pops downwards underneath the textarea) */}
              {isPhoneticActive && candidates.length > 0 && (
                <div className="absolute left-2 top-full mt-1.5 z-[100]">
                  <CandidatePopup
                    candidates={candidates}
                    selectedIndex={selectedCandidateIndex}
                    onSelectIndex={setSelectedCandidateIndex}
                    onSelectCandidate={(cand) => handleSelectCandidate(cand, ' ')}
                  />
                </div>
              )}
            </div>

            {/* Style Reset button if multi-segment */}
            {segments.length > 1 && (
              <div className="flex items-center justify-end text-xs text-slate-500 pt-0.5">
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
                        color: globalColor,
                        letterSpacing: globalLetterSpacing
                      }
                    ]);
                    setIsPopupOpen(false);
                    showToast('সকল শব্দ ডিফল্ট স্টাইলে রিসেট হয়েছে!');
                  }}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  স্টাইল রিসেট ↺
                </button>
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

          {/* Card 2: Background Selector (Strictly 3 options: Transparent, Banglish Theme Card 1:1, Dark Aurora Glass) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-5 relative z-10">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🖼️</span>
              <span>ব্যাকগ্রাউন্ড থিম নির্বাচন করুন (Background)</span>
            </h3>

            {/* The 4 Background Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option 1: Transparent */}
              <button
                type="button"
                onClick={() => {
                  setBgTheme('transparent');
                  if (strokeWidth === 0) setStrokeWidth(10);
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
                    <span className="text-sm font-bold text-slate-900">ট্রান্সপারেন্ট</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">Transparent</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    কোনো ব্যাকগ্রাউন্ড থাকবে না (WhatsApp/Telegram স্টিকারের জন্য)
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg bg-[linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] bg-[size:10px_10px] border border-slate-300/80"></div>
              </button>

              {/* Option 2: Banglish Theme Card (1:1 Procedural Grid, Droplets & Watermark Letters) */}
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
                    <span className="text-sm font-bold text-slate-900">ব্যাংলিশ থিম</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">1:1 Square</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    লো-ট্রান্সপারেন্সি গ্রিড ও বাংলা অক্ষরের ওয়াটারমার্ক সিগনেচার
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg bg-gradient-to-br from-[#f9fdfa] via-white to-[#f2faf5] border border-emerald-200 relative overflow-hidden flex items-center justify-center">
                  <span className="text-[11px] text-slate-400 font-bangla font-semibold">অ আ ক খ গ</span>
                </div>
              </button>

              {/* Option 3: Islamic Quote (1:1 Mosque & Minaret) */}
              <button
                type="button"
                onClick={() => {
                  setBgTheme('islamic-quote');
                  setStrokeWidth(0);
                  setGlobalColor('#1e293b');
                }}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                  bgTheme === 'islamic-quote'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-emerald-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">ইসলামিক কোট</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">1:1 Quote</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    মসজিদের মিনার ও গম্বুজ ব্যাকগ্রাউন্ড (কুরআনিক আয়াত ও বাণী)
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg border border-amber-200 relative overflow-hidden flex items-center justify-center bg-[#faf7f2]">
                  <img src="/assets/islamic-quote-bg.webp" alt="Islamic BG" className="w-full h-full object-cover object-bottom" />
                </div>
              </button>

              {/* Option 4: Dark Aurora Glass */}
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
                    <span className="text-sm font-bold text-slate-900">ডার্ক অরোরা</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900 text-emerald-400 font-mono">1:1 Dark</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    গ্রাফাইট ব্যাকগ্রাউন্ড ও নিয়ন এমারেল্ড গ্লাস ফ্রেম
                  </p>
                </div>
                <div className="mt-3 w-full h-8 rounded-lg bg-gradient-to-br from-[#060a12] via-[#0b1120] to-[#050811] border border-emerald-500/30"></div>
              </button>
            </div>

            {/* Global Typography & Default Alignment Controls */}
            <div className="pt-3 border-t border-emerald-100/80 space-y-4">
              <div className="text-xs font-bold text-slate-800">
                সকল শব্দের ডিফল্ট সেটিংস (Global Defaults):
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Default Font Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ডিফল্ট ফন্ট</label>
                  <select
                    value={globalFont}
                    onChange={(e) => {
                      setGlobalFont(e.target.value);
                      setSegments(prev => prev.map(s => ({ ...s, fontFamily: e.target.value })));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <optgroup label="বাংলা ফন্ট (Bangla Fonts)">
                      {availableFonts.filter(f => f.script === 'bangla').map((f) => (
                        <option key={f.id} value={f.family}>
                          {f.bnName} ({f.name})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="আরবি ও কুরআনিক ফন্ট (Arabic & Quranic)">
                      {availableFonts.filter(f => f.script === 'arabic').map((f) => (
                        <option key={f.id} value={f.family}>
                          {f.bnName} ({f.name})
                        </option>
                      ))}
                    </optgroup>
                    {availableFonts.some(f => f.isCustom) && (
                      <optgroup label="কাস্টম ফন্ট (Custom Uploaded)">
                        {availableFonts.filter(f => f.isCustom).map((f) => (
                          <option key={f.id} value={f.family}>
                            {f.bnName} ({f.name})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Default Font Weight Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ডিফল্ট ওয়েইট</label>
                  <select
                    value={globalFontWeight}
                    onChange={(e) => {
                      const w = parseInt(e.target.value, 10);
                      setGlobalFontWeight(w);
                      setSegments(prev => prev.map(s => ({ ...s, fontWeight: w })));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value={300}>হালকা (Light 300)</option>
                    <option value={400}>সাধারণ (Regular 400)</option>
                    <option value={600}>সেমি-বোল্ড (SemiBold 600)</option>
                    <option value={700}>বোল্ড (Bold 700)</option>
                    <option value={800}>অতিরিক্ত বোল্ড (Black 800)</option>
                  </select>
                </div>

                {/* Default Alignment with Universal SVG Icons */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">অ্যালাইনমেন্ট</label>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setAlign('left')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                        align === 'left' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Align Left"
                    >
                      <AlignLeftIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlign('center')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                        align === 'center' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Align Center"
                    >
                      <AlignCenterIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAlign('right')}
                      className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${
                        align === 'right' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Align Right"
                    >
                      <AlignRightIcon />
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Character Gap & Line Gap (Side by Side: 2 পাশে ২ টা) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Global Character Gap */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>ডিফল্ট ক্যারেক্টার গ্যাপ</span>
                    <span className="font-mono text-emerald-700">{globalLetterSpacing}px</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGlobalLetterSpacing(prev => Math.max(-6, prev - 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                      title="ক্যারেক্টার গ্যাপ কমান"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="-6"
                      max="20"
                      step="1"
                      value={globalLetterSpacing}
                      onChange={(e) => setGlobalLetterSpacing(parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setGlobalLetterSpacing(prev => Math.min(20, prev + 1))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                      title="ক্যারেক্টার গ্যাপ বাড়ান"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Global Line Gap */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span>ডিফল্ট লাইন গ্যাপ</span>
                    <span className="font-mono text-emerald-700">{lineGap}px</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLineGap(prev => Math.max(-30, prev - 2))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                      title="লাইন গ্যাপ কমান"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="-30"
                      max="40"
                      step="1"
                      value={lineGap}
                      onChange={(e) => setLineGap(parseInt(e.target.value, 10))}
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setLineGap(prev => Math.min(40, prev + 2))}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-50 text-slate-700 text-xs font-bold shrink-0"
                      title="লাইন গ্যাপ বাড়ান"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Full Global Color Picker - Just Choose Color */}
              <RgbColorPicker
                label="Choose Color"
                showRgbBadge={false}
                value={globalColor}
                onChange={(c) => {
                  setGlobalColor(c);
                  setSegments(prev => prev.map(s => ({ ...s, color: c })));
                }}
              />

              {/* Die-Cut Sticker Outline if enabled */}
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
                    label="Choose Color"
                    showRgbBadge={false}
                    value={strokeColor}
                    onChange={setStrokeColor}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Card 3: Brand Logo (Custom Logo in Safe Area, Device Cached) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <h3 className="text-sm font-bold text-slate-800">
                  ব্র্যান্ড লোগো যোগ করুন (Custom Logo)
                </h3>
              </div>
            </div>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {!logoDataUrl ? (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-emerald-50/30 hover:bg-emerald-50/60 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  এখানে ক্লিক করে লোগো আপলোড করুন (PNG / SVG / JPG)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Uploaded Logo Info & Actions */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-sm">
                      <img
                        src={logoDataUrl}
                        alt="Logo Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">লোগো সক্রিয় আছে</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition"
                    >
                      পরিবর্তন
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-1.5 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>

                {/* Corner Position Selectors - Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">লোগোর পজিশন (Safe Area Corner)</label>
                  <div className="relative">
                    <select
                      value={logoPosition}
                      onChange={(e) => updateLogoPos(e.target.value as LogoPosition)}
                      className="w-full py-2.5 pl-3 pr-8 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                    >
                      <option value="top-left">টপ লেফট (Top Left)</option>
                      <option value="top-center">টপ সেন্টার (Top Center)</option>
                      <option value="top-right">টপ রাইট (Top Right)</option>
                      <option value="bottom-left">বটম লেফট (Bottom Left)</option>
                      <option value="bottom-right">বটম রাইট (Bottom Right)</option>
                    </select>
                    <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Sliders for Size & Opacity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>লোগোর আকার (Size)</span>
                      <span className="font-mono text-emerald-700">{logoSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="140"
                      value={logoSize}
                      onChange={(e) => updateLogoSize(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>স্বচ্ছতা (Opacity)</span>
                      <span className="font-mono text-emerald-700">{logoOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={logoOpacity}
                      onChange={(e) => updateLogoOpacity(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Live Preview & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-emerald-100/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/5 space-y-4">
            {/* Preview Header - Just "Preview" */}
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Preview
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                {bgTheme === 'transparent'
                  ? 'ট্রান্সপারেন্ট'
                  : bgTheme === 'banglish-theme'
                  ? 'ব্যাংলিশ থিম (1:1)'
                  : bgTheme === 'islamic-quote'
                  ? 'ইসলামিক কোট (1:1)'
                  : 'ডার্ক অরোরা (1:1)'}
              </span>
            </div>

            {/* Canvas Container with Direct Mouse/Touch Dragging */}
            <div className="w-full min-h-[320px] max-h-[460px] rounded-2xl overflow-hidden flex items-center justify-center p-3 relative border border-emerald-200/80 shadow-inner bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:16px_16px]">
              <canvas
                ref={previewCanvasRef}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleStartDrag(e.clientX, e.clientY);
                }}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
                  }
                }}
                className={`max-w-full max-h-[420px] object-contain drop-shadow-lg rounded-xl select-none transition-shadow ${
                  isDraggingText ? 'cursor-grabbing shadow-2xl scale-[1.01]' : 'cursor-grab hover:shadow-xl'
                }`}
                title="মাউস দিয়ে ড্র্যাগ করে টেক্সট যেকোনো পজিশনে বসান"
              />
            </div>

            {/* Drag Position Indicator & Reset */}
            {(textOffset.x !== 0 || textOffset.y !== 0) && (
              <div className="flex items-center justify-between text-[11px] px-1 text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  পজিশন: ({textOffset.x > 0 ? `+${textOffset.x}` : textOffset.x}px, {textOffset.y > 0 ? `+${textOffset.y}` : textOffset.y}px)
                </span>
                <button
                  type="button"
                  onClick={() => setTextOffset({ x: 0, y: 0 })}
                  className="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md font-semibold transition"
                >
                  পজিশন রিসেট ↺
                </button>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2">
                {/* Download Split Button with Quality Dropdown */}
                <div className="flex-1 relative inline-flex rounded-2xl shadow-md shadow-emerald-600/20">
                  <button
                    type="button"
                    onClick={() => handleDownload(downloadQuality)}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-l-2xl transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    <span>Download</span>
                    <span className="text-[10px] font-normal opacity-80 font-mono">
                      ({downloadQuality === 'high' ? '2048px' : downloadQuality === 'low' ? '512px' : '1024px'})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
                    className="px-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs border-l border-emerald-500/40 rounded-r-2xl transition-all flex items-center justify-center"
                    title="কোয়ালিটি অপশন"
                  >
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Quality Dropdown Menu */}
                  {isQualityDropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-2 w-52 bg-white rounded-2xl shadow-2xl border border-emerald-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        রেজোলিউশন নির্বাচন
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDownloadQuality('high');
                          handleDownload('high');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">High Quality</span>
                        <span className="text-[10px] text-slate-400 font-mono">2048px (Ultra)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDownloadQuality('medium');
                          handleDownload('medium');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between font-bold text-emerald-800 bg-emerald-50/70"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Medium Quality</span>
                          <span className="text-[9px] px-1 rounded bg-emerald-200/80 text-emerald-900 font-semibold">ডিফল্ট</span>
                        </div>
                        <span className="text-[10px] font-mono">1024px</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDownloadQuality('low');
                          handleDownload('low');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-800">Low Quality</span>
                        <span className="text-[10px] text-slate-400 font-mono">512px</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Copy Image Button */}
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  disabled={isProcessing}
                  className="py-3 px-4 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-800 font-bold text-xs sm:text-sm transition-all active:scale-98 flex items-center justify-center gap-1.5 shadow-xs shrink-0"
                >
                  <CopyIcon className="w-4 h-4 text-emerald-700" />
                  <span>Copy Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
