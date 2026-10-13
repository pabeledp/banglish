'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { transliterateWord, transliterateText } from '@/lib/phoneticEngine';

interface TextCodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  font: FontFamilyOption;
  fontSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  phoneticActive: boolean;
  onCursorChange?: (line: number, col: number) => void;
}

export default function TextCodeEditor({
  content,
  onChange,
  font,
  fontSize,
  wordWrap,
  showLineNumbers,
  phoneticActive,
  onCursorChange,
}: TextCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [lineCount, setLineCount] = useState(1);

  // Synchronize line count
  useEffect(() => {
    const lines = content.split('\n').length;
    setLineCount(Math.max(lines, 1));
  }, [content]);

  // Synchronize scrolling between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Cursor position tracking
  const updateCursorPos = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = content.substring(0, pos);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    onCursorChange?.(line, col);
  };

  // Handle KeyDown for Space / Enter / Punctuation instant transliteration
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!phoneticActive) return;

    if (e.key === ' ' || e.key === 'Enter' || e.key === '.' || e.key === '?' || e.key === '!' || e.key === ',') {
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const text = el.value;
      const textBefore = text.slice(0, cursor);

      // Find the last word token before cursor
      const match = textBefore.match(/([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        e.preventDefault();
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const startPos = cursor - lastWord.length;
        const separatorChar = e.key === '.' ? '।' : (e.key === 'Enter' ? '\n' : e.key);

        const newText = text.slice(0, startPos) + converted + separatorChar + text.slice(cursor);
        onChange(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            const newCursor = startPos + converted.length + 1;
            textareaRef.current.selectionStart = newCursor;
            textareaRef.current.selectionEnd = newCursor;
            updateCursorPos();
          }
        }, 0);
      }
    }
  };

  // Handle onChange fallback (handles mobile browsers, soft keyboards, or pasted text)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRaw = e.target.value;
    const cursor = e.target.selectionStart;

    if (!phoneticActive) {
      onChange(newRaw);
      return;
    }

    // Check if the character just inserted is a space, newline, or punctuation
    const lastChar = newRaw[cursor - 1];
    if (lastChar && /[\s.,;!?।\n]/.test(lastChar)) {
      const textBefore = newRaw.slice(0, cursor - 1);
      const match = textBefore.match(/([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const startPos = (cursor - 1) - lastWord.length;
        const sep = lastChar === '.' ? '।' : lastChar;

        const transformed = newRaw.slice(0, startPos) + converted + sep + newRaw.slice(cursor);
        onChange(transformed);

        setTimeout(() => {
          if (textareaRef.current) {
            const nextCursor = startPos + converted.length + 1;
            textareaRef.current.selectionStart = nextCursor;
            textareaRef.current.selectionEnd = nextCursor;
            updateCursorPos();
          }
        }, 0);
        return;
      }
    }

    onChange(newRaw);
  };

  // Handle Paste when phonetic mode is active
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!phoneticActive) return;
    const pastedText = e.clipboardData.getData('text/plain');
    if (!pastedText) return;

    // Check if pasted text contains english words that should be transliterated
    if (/[a-zA-Z]/.test(pastedText)) {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const end = el.selectionEnd;
      const converted = transliterateText(pastedText);
      const newText = el.value.slice(0, cursor) + converted + el.value.slice(end);
      
      onChange(newText);

      setTimeout(() => {
        if (textareaRef.current) {
          const nextCursor = cursor + converted.length;
          textareaRef.current.selectionStart = nextCursor;
          textareaRef.current.selectionEnd = nextCursor;
          updateCursorPos();
        }
      }, 0);
    }
  };

  const getFontFamilyStyle = () => {
    switch (font) {
      case 'Hind Siliguri':
        return '"Hind Siliguri", sans-serif';
      case 'Poppins':
        return '"Poppins", sans-serif';
      case 'Inter':
        return '"Inter", sans-serif';
      case 'JetBrains Mono':
        return '"JetBrains Mono", monospace';
      case 'Fira Code':
        return '"Fira Code", monospace';
      case 'SolaimanLipi':
        return '"SolaimanLipi", "Hind Siliguri", sans-serif';
      default:
        return '"Hind Siliguri", sans-serif';
    }
  };

  return (
    <div className="relative w-full flex flex-1 min-h-[550px] sm:min-h-[620px] bg-white rounded-b-2xl border-x border-b border-slate-200/90 overflow-hidden">
      
      {/* Line Numbers Gutter */}
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-4 px-2.5 sm:px-3 text-right bg-slate-50 border-r border-slate-200 text-slate-400 font-mono text-xs overflow-hidden shrink-0"
          style={{ 
            fontSize: `${Math.max(fontSize - 2, 11)}px`, 
            lineHeight: '1.75',
            minWidth: '42px',
          }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="hover:text-slate-600 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor Textarea */}
      <div className="relative flex-1 h-full min-h-[550px] sm:min-h-[620px] flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onScroll={handleScroll}
          onClick={updateCursorPos}
          onKeyUp={updateCursorPos}
          placeholder={
            phoneticActive
              ? "এখানে বাংলিশে লিখুন (যেমন: amra banglay gan gai -> আমরা বাংলায় গান গাই)..."
              : "Type text, notes, or code here..."
          }
          spellCheck={false}
          className={`w-full flex-1 min-h-[550px] sm:min-h-[620px] p-4 sm:p-6 pb-28 sm:pb-32 bg-white text-slate-900 placeholder-slate-400 outline-none resize-none selection:bg-emerald-100 selection:text-emerald-900 ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.75',
          }}
        />

        {/* Phonetic Status Tag */}
        {phoneticActive && (
          <div className="absolute bottom-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bangla shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>বাংলিশ ফোনেটিক সক্রিয় [BN]</span>
          </div>
        )}
      </div>

    </div>
  );
}
