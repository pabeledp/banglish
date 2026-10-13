'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  WorkspaceMode, 
  FontFamilyOption, 
  SUPPORTED_FONTS, 
  CODE_LANGUAGES 
} from '@/lib/pastebinTypes';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Minus, 
  Link2, 
  Image as ImageIcon, 
  Type, 
  WrapText, 
  Eraser, 
  Plus, 
  Trash2, 
  CaseSensitive, 
  Hash, 
  Highlighter,
  PaintBucket,
  Baseline,
  ChevronDown
} from 'lucide-react';

interface PastebinToolbarProps {
  mode: WorkspaceMode;
  font: FontFamilyOption;
  onFontChange: (font: FontFamilyOption) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  
  // Text mode props
  showLineNumbers?: boolean;
  onToggleLineNumbers?: () => void;
  wordWrap?: boolean;
  onToggleWordWrap?: () => void;
  codeLanguage?: string;
  onCodeLanguageChange?: (lang: string) => void;
  onCleanWhitespace?: () => void;
  onTransformCase?: (type: 'upper' | 'lower' | 'title') => void;

  // Docs mode props
  onDocFormat?: (command: string, value?: string) => void;
  onInsertImage?: () => void;
  onInsertLink?: () => void;

  // Sheet mode props
  onAddRow?: () => void;
  onDeleteRow?: () => void;
  onAddCol?: () => void;
  onDeleteCol?: () => void;
  onInsertFormula?: (formula: string) => void;
  onSheetCellFormat?: (property: 'bold' | 'italic' | 'align' | 'color' | 'bg', value?: string) => void;
}

export default function PastebinToolbar({
  mode,
  font,
  onFontChange,
  fontSize,
  onFontSizeChange,
  showLineNumbers = true,
  onToggleLineNumbers,
  wordWrap = true,
  onToggleWordWrap,
  codeLanguage = 'plaintext',
  onCodeLanguageChange,
  onCleanWhitespace,
  onTransformCase,
  onDocFormat,
  onInsertImage,
  onInsertLink,
  onAddRow,
  onDeleteRow,
  onAddCol,
  onDeleteCol,
  onInsertFormula,
  onSheetCellFormat,
}: PastebinToolbarProps) {
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showFormulaMenu, setShowFormulaMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showCellBgMenu, setShowCellBgMenu] = useState(false);
  const [showCellTextMenu, setShowCellTextMenu] = useState(false);

  const caseMenuRef = useRef<HTMLDivElement | null>(null);
  const formulaMenuRef = useRef<HTMLDivElement | null>(null);
  const highlightMenuRef = useRef<HTMLDivElement | null>(null);
  const cellBgMenuRef = useRef<HTMLDivElement | null>(null);
  const cellTextMenuRef = useRef<HTMLDivElement | null>(null);

  // Close any open dropdown on click anywhere outside on the page
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (caseMenuRef.current && !caseMenuRef.current.contains(target)) {
        setShowCaseMenu(false);
      }
      if (formulaMenuRef.current && !formulaMenuRef.current.contains(target)) {
        setShowFormulaMenu(false);
      }
      if (highlightMenuRef.current && !highlightMenuRef.current.contains(target)) {
        setShowHighlightMenu(false);
      }
      if (cellBgMenuRef.current && !cellBgMenuRef.current.contains(target)) {
        setShowCellBgMenu(false);
      }
      if (cellTextMenuRef.current && !cellTextMenuRef.current.contains(target)) {
        setShowCellTextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, []);

  const highlightColors = [
    { name: 'হলুদ (Yellow)', color: '#fef08a', bgClass: 'bg-yellow-200' },
    { name: 'সবুজ (Green)', color: '#bbf7d0', bgClass: 'bg-emerald-200' },
    { name: 'নীল (Sky)', color: '#bae6fd', bgClass: 'bg-sky-200' },
    { name: 'বেগুনি (Purple)', color: '#e9d5ff', bgClass: 'bg-purple-200' },
    { name: 'গোলাপি (Pink)', color: '#fbcfe8', bgClass: 'bg-pink-200' },
    { name: 'হাইলাইট মুছুন', color: 'transparent', bgClass: 'bg-white border border-slate-300' },
  ];

  // Sheet Cell Background Fill Colors
  const cellBgColors = [
    { name: 'ডিফল্ট (স্বচ্ছ)', color: 'transparent', previewClass: 'bg-white border border-slate-300' },
    { name: 'হালকা সবুজ', color: '#ecfdf5', previewClass: 'bg-emerald-100' },
    { name: 'হালকা নীল', color: '#f0f9ff', previewClass: 'bg-sky-100' },
    { name: 'হালকা হলুদ', color: '#fefce8', previewClass: 'bg-yellow-100' },
    { name: 'হালকা লাল', color: '#fff1f2', previewClass: 'bg-rose-100' },
    { name: 'হালকা বেগুনি', color: '#faf5ff', previewClass: 'bg-purple-100' },
    { name: 'হালকা স্লেট', color: '#f1f5f9', previewClass: 'bg-slate-200' },
    { name: 'ডার্ক হেডার', color: '#0f172a', previewClass: 'bg-slate-900' },
  ];

  // Sheet Cell Text Colors
  const cellTextColors = [
    { name: 'ডিফল্ট (কালো)', color: 'transparent', previewClass: 'bg-slate-900' },
    { name: 'সবুজ (Emerald)', color: '#059669', previewClass: 'bg-emerald-600' },
    { name: 'নীল (Blue)', color: '#2563eb', previewClass: 'bg-blue-600' },
    { name: 'লাল (Rose)', color: '#e11d48', previewClass: 'bg-rose-600' },
    { name: 'অ্যাম্বার (Amber)', color: '#d97706', previewClass: 'bg-amber-600' },
    { name: 'বেগুনি (Purple)', color: '#9333ea', previewClass: 'bg-purple-600' },
    { name: 'সাদা (White)', color: '#ffffff', previewClass: 'bg-white border border-slate-300' },
  ];

  return (
    <div className="w-full bg-slate-50/90 border-b border-slate-200/90 px-2.5 sm:px-6 py-2 flex items-center justify-between gap-2 text-slate-700 text-xs relative z-20 overflow-x-auto scrollbar-none">
      
      {/* Left Formatting Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Font Family Picker */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <Type className="w-3.5 h-3.5 text-emerald-600" />
          <select
            value={font}
            onChange={(e) => onFontChange(e.target.value as FontFamilyOption)}
            className="bg-transparent text-slate-800 text-xs outline-none cursor-pointer pr-1 font-sans"
          >
            {SUPPORTED_FONTS.map(f => (
              <option key={f.id} value={f.id} className="bg-white text-slate-800">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Picker */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-mono">Size</span>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="bg-transparent text-slate-800 text-xs outline-none cursor-pointer pr-1 font-mono"
          >
            {[12, 13, 14, 15, 16, 18, 20, 24, 28].map(sz => (
              <option key={sz} value={sz} className="bg-white text-slate-800">
                {sz}px
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-[1px] bg-slate-300 mx-0.5" />

        {/* 1. TEXT / CODE MODE CONTROLS */}
        {mode === 'text' && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Toggle Line Numbers */}
            <button
              type="button"
              onClick={onToggleLineNumbers}
              className={`p-1.5 rounded-lg border transition-all ${
                showLineNumbers 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="লাইন নাম্বার অন/অফ করুন"
            >
              <Hash className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Word Wrap */}
            <button
              type="button"
              onClick={onToggleWordWrap}
              className={`p-1.5 rounded-lg border transition-all ${
                wordWrap 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="ওয়ার্ড র‍্যাপ টগল করুন"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>

            {/* Clean Whitespace */}
            <button
              type="button"
              onClick={onCleanWhitespace}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-2xs font-bangla"
              title="অতিরিক্ত স্পেস ও খালি লাইন পরিষ্কার করুন"
            >
              <Eraser className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">ক্লিন স্পেস</span>
            </button>

            {/* Case Transformer */}
            <div className="relative" ref={caseMenuRef}>
              <button
                type="button"
                onClick={() => setShowCaseMenu(!showCaseMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all shadow-2xs"
                title="কেস কনভার্ট"
              >
                <CaseSensitive className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline font-mono">Case</span>
              </button>

              {showCaseMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-50 space-y-0.5 animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => { onTransformCase?.('upper'); setShowCaseMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-xs text-slate-800 font-sans"
                  >
                    UPPERCASE
                  </button>
                  <button
                    type="button"
                    onClick={() => { onTransformCase?.('lower'); setShowCaseMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-xs text-slate-800 font-sans"
                  >
                    lowercase
                  </button>
                  <button
                    type="button"
                    onClick={() => { onTransformCase?.('title'); setShowCaseMenu(false); }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-xs text-slate-800 font-sans"
                  >
                    Title Case
                  </button>
                </div>
              )}
            </div>

            {/* Code Language Selector */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 shadow-2xs">
              <Code className="w-3.5 h-3.5 text-teal-600" />
              <select
                value={codeLanguage}
                onChange={(e) => onCodeLanguageChange?.(e.target.value)}
                className="bg-transparent text-slate-800 text-xs outline-none cursor-pointer pr-1 font-mono"
              >
                {CODE_LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-white text-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 2. DOCS MODE CONTROLS */}
        {mode === 'docs' && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <select
              onChange={(e) => onDocFormat?.('formatBlock', e.target.value)}
              defaultValue="p"
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none cursor-pointer shadow-2xs font-sans"
            >
              <option value="p">Normal Text</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
            </select>

            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onDocFormat?.('bold')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="বোল্ড (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('italic')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="ইটালিক (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('underline')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="আন্ডারলাইন (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('strikeThrough')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="স্ট্রাইকথ্রু"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>

              {/* Text Highlighter Button with 1-Click Toggle & Dropdown */}
              <div className="relative flex items-center" ref={highlightMenuRef}>
                <button
                  type="button"
                  onClick={() => onDocFormat?.('toggleHighlight', '#fef08a')}
                  className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-l cursor-pointer"
                  title="টেক্সট হাইলাইট / আনহাইলাইট করুন (Toggle Highlight)"
                >
                  <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-r border-l border-slate-200 cursor-pointer"
                  title="হাইলাইটার রং নির্বাচন"
                >
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>

                {showHighlightMenu && (
                  <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 space-y-1 ring-1 ring-black/5 animate-in fade-in duration-100">
                    <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                      হাইলাইটার রং
                    </div>
                    {highlightColors.map((hc) => (
                      <button
                        key={hc.name}
                        type="button"
                        onClick={() => {
                          onDocFormat?.('hiliteColor', hc.color);
                          setShowHighlightMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs text-slate-700 text-left transition-colors font-bangla cursor-pointer"
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${hc.bgClass}`} />
                        <span>{hc.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyLeft')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="বামে সারিবদ্ধ"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyCenter')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="মাঝখানে সারিবদ্ধ"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyRight')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="ডানে সারিবদ্ধ"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyFull')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="উভয়পাশে সমান"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onDocFormat?.('insertUnorderedList')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="বুলেট লিস্ট"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertOrderedList')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="নাম্বার লিস্ট"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertHTML', '<blockquote>💡 Quote...</blockquote><p></p>')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="কোটেশন ব্লক"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertHorizontalRule')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="ডিভাইডার দাগ"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onInsertLink}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-2xs"
              title="লিংক যুক্ত করুন"
            >
              <Link2 className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              type="button"
              onClick={onInsertImage}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 shadow-2xs"
              title="ছবি যুক্ত করুন"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            </button>
          </div>
        )}

        {/* 3. SHEET MODE CONTROLS */}
        {mode === 'sheet' && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Add / Delete Row */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={onAddRow}
                className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 text-slate-700 rounded font-bangla"
                title="নতুন সারি যোগ করুন"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+ Row</span>
              </button>
              <button
                type="button"
                onClick={onDeleteRow}
                className="p-1 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded"
                title="শেষ সারি মুছুন"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Add / Delete Column */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={onAddCol}
                className="flex items-center gap-1 px-2 py-1 hover:bg-slate-100 text-slate-700 rounded font-bangla"
                title="নতুন কলাম যোগ করুন"
              >
                <Plus className="w-3 h-3 text-teal-600" />
                <span>+ Col</span>
              </button>
              <button
                type="button"
                onClick={onDeleteCol}
                className="p-1 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded"
                title="শেষ কলাম মুছুন"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Cell Text Styles: Bold, Italic, Alignment */}
            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('bold')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="সেল বোল্ড করুন"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('italic')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="সেল ইটালিক করুন"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'left')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="বামে এলাইন"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'center')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="মাঝখানে এলাইন"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'right')}
                className="p-1.5 hover:bg-slate-100 text-slate-700 rounded"
                title="ডানে এলাইন"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cell Text Color Picker */}
            <div className="relative" ref={cellTextMenuRef}>
              <button
                type="button"
                onClick={() => setShowCellTextMenu(!showCellTextMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs cursor-pointer"
                title="সেলের টেক্সট রং (Text Color)"
              >
                <Baseline className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline font-bangla text-[11px]">টেক্সট রং</span>
              </button>

              {showCellTextMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 space-y-1 ring-1 ring-black/5 animate-in fade-in duration-100">
                  <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                    সেলের টেক্সট রং
                  </div>
                  {cellTextColors.map((tc) => (
                    <button
                      key={tc.name}
                      type="button"
                      onClick={() => {
                        onSheetCellFormat?.('color', tc.color);
                        setShowCellTextMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs text-slate-700 text-left transition-colors font-bangla cursor-pointer"
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${tc.previewClass}`} />
                      <span>{tc.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cell Fill / Background Color Picker */}
            <div className="relative" ref={cellBgMenuRef}>
              <button
                type="button"
                onClick={() => setShowCellBgMenu(!showCellBgMenu)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-2xs cursor-pointer"
                title="সেলের ব্যাকগ্রাউন্ড রং (Cell Fill Color)"
              >
                <PaintBucket className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline font-bangla text-[11px]">সেল ব্যাকগ্রাউন্ড</span>
              </button>

              {showCellBgMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 space-y-1 ring-1 ring-black/5 animate-in fade-in duration-100">
                  <div className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                    সেল ব্যাকগ্রাউন্ড রং
                  </div>
                  {cellBgColors.map((bg) => (
                    <button
                      key={bg.name}
                      type="button"
                      onClick={() => {
                        onSheetCellFormat?.('bg', bg.color);
                        setShowCellBgMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-xs text-slate-700 text-left transition-colors font-bangla cursor-pointer"
                    >
                      <span className={`w-3.5 h-3.5 rounded-md ${bg.previewClass}`} />
                      <span>{bg.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Formula Helper */}
            <div className="relative" ref={formulaMenuRef}>
              <button
                type="button"
                onClick={() => setShowFormulaMenu(!showFormulaMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all font-mono shadow-2xs cursor-pointer"
                title="ফর্মুলা যুক্ত করুন"
              >
                <span>fx</span>
                <span className="hidden sm:inline font-bangla">ফর্মুলা</span>
              </button>

              {showFormulaMenu && (
                <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-50 space-y-0.5 animate-in fade-in duration-100">
                  <button
                    type="button"
                    onClick={() => { onInsertFormula?.('=SUM('); setShowFormulaMenu(false); }}
                    className="w-full text-left px-2.5 py-1 rounded hover:bg-emerald-50 text-xs text-emerald-700 font-mono"
                  >
                    =SUM(...) — যোগফল
                  </button>
                  <button
                    type="button"
                    onClick={() => { onInsertFormula?.('=AVERAGE('); setShowFormulaMenu(false); }}
                    className="w-full text-left px-2.5 py-1 rounded hover:bg-emerald-50 text-xs text-teal-700 font-mono"
                  >
                    =AVERAGE(...) — গড়
                  </button>
                  <button
                    type="button"
                    onClick={() => { onInsertFormula?.('=COUNT('); setShowFormulaMenu(false); }}
                    className="w-full text-left px-2.5 py-1 rounded hover:bg-emerald-50 text-xs text-amber-700 font-mono"
                  >
                    =COUNT(...) — সংখ্যা
                  </button>
                  <button
                    type="button"
                    onClick={() => { onInsertFormula?.('=MAX('); setShowFormulaMenu(false); }}
                    className="w-full text-left px-2.5 py-1 rounded hover:bg-emerald-50 text-xs text-rose-700 font-mono"
                  >
                    =MAX(...) — সর্বোচ্চ
                  </button>
                  <button
                    type="button"
                    onClick={() => { onInsertFormula?.('=MIN('); setShowFormulaMenu(false); }}
                    className="w-full text-left px-2.5 py-1 rounded hover:bg-emerald-50 text-xs text-purple-700 font-mono"
                  >
                    =MIN(...) — সর্বনিম্ন
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Right side is intentionally clean and uncrowded */}

    </div>
  );
}
