'use client';

import React, { useState } from 'react';
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
  CheckSquare, 
  Quote, 
  Code, 
  Minus, 
  Link2, 
  Image as ImageIcon, 
  Sparkles, 
  Type, 
  WrapText, 
  Eraser, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  CaseSensitive, 
  Hash 
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

  // Global action
  onConvertPhonetic?: () => void;
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
  onConvertPhonetic,
}: PastebinToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);
  const [showFormulaMenu, setShowFormulaMenu] = useState(false);

  const colors = [
    { label: 'Default', value: '#f3f4f6' },
    { label: 'Neon Blue', value: '#00f2fe' },
    { label: 'Neon Green', value: '#10b981' },
    { label: 'Amber', value: '#f59e0b' },
    { label: 'Rose', value: '#f43f5e' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Muted Gray', value: '#9ca3af' },
  ];

  const highlightColors = [
    { label: 'None', value: 'transparent' },
    { label: 'Dark Cyan', value: 'rgba(0, 242, 254, 0.25)' },
    { label: 'Dark Emerald', value: 'rgba(16, 185, 129, 0.25)' },
    { label: 'Dark Amber', value: 'rgba(245, 158, 11, 0.25)' },
    { label: 'Dark Rose', value: 'rgba(244, 63, 94, 0.25)' },
    { label: 'Dark Violet', value: 'rgba(168, 85, 247, 0.25)' },
  ];

  return (
    <div className="w-full bg-[#0d1322]/95 border-b border-gray-800/90 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-gray-300 text-xs">
      
      {/* Left Formatting Group */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        
        {/* Font Family Picker Dropdown */}
        <div className="flex items-center gap-1.5 bg-gray-950/70 border border-gray-800 rounded-lg px-2 py-1">
          <Type className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={font}
            onChange={(e) => onFontChange(e.target.value as FontFamilyOption)}
            className="bg-transparent text-gray-200 text-xs outline-none cursor-pointer pr-1"
          >
            {SUPPORTED_FONTS.map(f => (
              <option key={f.id} value={f.id} className="bg-gray-900 text-gray-100">
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Picker */}
        <div className="flex items-center gap-1 bg-gray-950/70 border border-gray-800 rounded-lg px-2 py-1">
          <span className="text-[10px] text-gray-500 font-mono">Size</span>
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="bg-transparent text-gray-200 text-xs outline-none cursor-pointer pr-1"
          >
            {[12, 13, 14, 15, 16, 18, 20, 24, 28].map(sz => (
              <option key={sz} value={sz} className="bg-gray-900 text-gray-100">
                {sz}px
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-[1px] bg-gray-800 mx-0.5" />

        {/* ================= Mode-Specific Controls ================= */}

        {/* 1. TEXT / CODE MODE CONTROLS */}
        {mode === 'text' && (
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Toggle Line Numbers */}
            <button
              type="button"
              onClick={onToggleLineNumbers}
              className={`p-1.5 rounded-lg border transition-all ${
                showLineNumbers 
                  ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-400' 
                  : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:text-white'
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
                  ? 'bg-cyan-950/60 border-cyan-800/80 text-cyan-400' 
                  : 'bg-gray-950/50 border-gray-800 text-gray-400 hover:text-white'
              }`}
              title="ওয়ার্ড র‍্যাপ টগল করুন"
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>

            {/* Clean Whitespace */}
            <button
              type="button"
              onClick={onCleanWhitespace}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-950/50 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white transition-all"
              title="অতিরিক্ত স্পেস ও খালি লাইন পরিষ্কার করুন"
            >
              <Eraser className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">ক্লিন স্পেস</span>
            </button>

            {/* Case Transformer */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCaseMenu(!showCaseMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-950/50 hover:bg-gray-800 border border-gray-800 text-gray-300 hover:text-white transition-all"
                title="কেস কনভার্ট"
              >
                <CaseSensitive className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Case</span>
              </button>

              {showCaseMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowCaseMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-32 rounded-lg bg-gray-900 border border-gray-700 shadow-xl p-1 z-30 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => { onTransformCase?.('upper'); setShowCaseMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-gray-200"
                    >
                      UPPERCASE
                    </button>
                    <button
                      type="button"
                      onClick={() => { onTransformCase?.('lower'); setShowCaseMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-gray-200"
                    >
                      lowercase
                    </button>
                    <button
                      type="button"
                      onClick={() => { onTransformCase?.('title'); setShowCaseMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-gray-200"
                    >
                      Title Case
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Code Language Selector */}
            <div className="flex items-center gap-1 bg-gray-950/70 border border-gray-800 rounded-lg px-2 py-1">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={codeLanguage}
                onChange={(e) => onCodeLanguageChange?.(e.target.value)}
                className="bg-transparent text-gray-200 text-xs outline-none cursor-pointer pr-1"
              >
                {CODE_LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id} className="bg-gray-900 text-gray-100">
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
            {/* Heading Level Selector */}
            <select
              onChange={(e) => onDocFormat?.('formatBlock', e.target.value)}
              defaultValue="p"
              className="bg-gray-950/70 border border-gray-800 rounded-lg px-2 py-1 text-xs text-gray-200 outline-none cursor-pointer"
            >
              <option value="p" className="bg-gray-900">Normal Text</option>
              <option value="h1" className="bg-gray-900">Heading 1</option>
              <option value="h2" className="bg-gray-900">Heading 2</option>
              <option value="h3" className="bg-gray-900">Heading 3</option>
            </select>

            {/* Basic Inline Formats */}
            <div className="flex items-center gap-0.5 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onDocFormat?.('bold')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="বোল্ড (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('italic')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="ইটালিক (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('underline')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="আন্ডারলাইন (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('strikeThrough')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="স্ট্রাইকথ্রু"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignments */}
            <div className="hidden md:flex items-center gap-0.5 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyLeft')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="বামে সারিবদ্ধ"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyCenter')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="মাঝখানে সারিবদ্ধ"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyRight')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="ডানে সারিবদ্ধ"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('justifyFull')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="উভয়পাশে সমান"
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lists & Quotes */}
            <div className="flex items-center gap-0.5 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onDocFormat?.('insertUnorderedList')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="বুলেট লিস্ট"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertOrderedList')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="নাম্বার লিস্ট"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertHTML', '<blockquote>💡 Quote block...</blockquote><p></p>')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="কোটেশন ব্লক"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDocFormat?.('insertHorizontalRule')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="ডিভাইডার দাগ"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Insert Link & Image */}
            <button
              type="button"
              onClick={onInsertLink}
              className="p-1.5 bg-gray-950/70 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-300 hover:text-white"
              title="লিংক যুক্ত করুন"
            >
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
            </button>
            <button
              type="button"
              onClick={onInsertImage}
              className="p-1.5 bg-gray-950/70 hover:bg-gray-800 border border-gray-800 rounded-lg text-gray-300 hover:text-white"
              title="ছবি যুক্ত করুন"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        )}

        {/* 3. SHEET MODE CONTROLS */}
        {mode === 'sheet' && (
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Add / Delete Row */}
            <div className="flex items-center gap-1 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={onAddRow}
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="নতুন সারি (Row) যোগ করুন"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>+ Row</span>
              </button>
              <button
                type="button"
                onClick={onDeleteRow}
                className="p-1 hover:bg-gray-800 text-gray-400 hover:text-rose-400 rounded"
                title="শেষ সারি মুছুন"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Add / Delete Column */}
            <div className="flex items-center gap-1 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={onAddCol}
                className="flex items-center gap-1 px-2 py-1 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="নতুন কলাম (Column) যোগ করুন"
              >
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>+ Col</span>
              </button>
              <button
                type="button"
                onClick={onDeleteCol}
                className="p-1 hover:bg-gray-800 text-gray-400 hover:text-rose-400 rounded"
                title="শেষ কলাম মুছুন"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            {/* Cell Styling */}
            <div className="flex items-center gap-0.5 bg-gray-950/70 border border-gray-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('bold')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="সেল বোল্ড করুন"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('italic')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="সেল ইটালিক করুন"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'left')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="বামে এলাইন"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'center')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="মাঝখানে এলাইন"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onSheetCellFormat?.('align', 'right')}
                className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
                title="ডানে এলাইন"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Formulas */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFormulaMenu(!showFormulaMenu)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 text-amber-300 transition-all font-mono"
                title="ফর্মুলা যুক্ত করুন"
              >
                <span>fx</span>
                <span className="hidden sm:inline">ফর্মুলা</span>
              </button>

              {showFormulaMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowFormulaMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-44 rounded-lg bg-gray-900 border border-gray-700 shadow-xl p-1 z-30 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => { onInsertFormula?.('=SUM('); setShowFormulaMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-emerald-400 font-mono"
                    >
                      =SUM(...) — যোগফল
                    </button>
                    <button
                      type="button"
                      onClick={() => { onInsertFormula?.('=AVERAGE('); setShowFormulaMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-cyan-400 font-mono"
                    >
                      =AVERAGE(...) — গড়
                    </button>
                    <button
                      type="button"
                      onClick={() => { onInsertFormula?.('=COUNT('); setShowFormulaMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-yellow-400 font-mono"
                    >
                      =COUNT(...) — সংখ্যা
                    </button>
                    <button
                      type="button"
                      onClick={() => { onInsertFormula?.('=MAX('); setShowFormulaMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-rose-400 font-mono"
                    >
                      =MAX(...) — সর্বোচ্চ
                    </button>
                    <button
                      type="button"
                      onClick={() => { onInsertFormula?.('=MIN('); setShowFormulaMenu(false); }}
                      className="w-full text-left px-2 py-1 rounded hover:bg-gray-800 text-xs text-purple-400 font-mono"
                    >
                      =MIN(...) — সর্বনিম্ন
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Right: 1-Click Phonetic Transliteration Action */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onConvertPhonetic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all shadow-[0_0_12px_rgba(0,242,254,0.15)] font-bangla font-semibold cursor-pointer"
          title="বাংলিশ টেক্সটকে তাত্ক্ষণিকভাবে ইউনিকোড বাংলায় রূপান্তর করুন"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>বাংলিশ ➔ বাংলা রূপান্তর</span>
        </button>
      </div>

    </div>
  );
}
