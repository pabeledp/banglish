'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { transliterateText, transliterateWord } from '@/lib/phoneticEngine';

interface TextCodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  font: FontFamilyOption;
  fontSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  phoneticActive: boolean;
  onCursorChange?: (line: number, col: number) => void;
  onConvertSelection?: (convertedText: string) => void;
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

  // Update line count
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

  // Real-time Phonetic input interception
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!phoneticActive) return;

    // When space or enter or period or comma is pressed, transliterate the last typed token
    if (e.key === ' ' || e.key === 'Enter' || e.key === '.' || e.key === '?' || e.key === '!') {
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const text = el.value;
      const textBefore = text.slice(0, cursor);

      // Find the last word boundary before cursor
      const match = textBefore.match(/([a-zA-Z0-9]+)$/);
      if (match && match[1]) {
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const startPos = cursor - lastWord.length;

        const newText = text.slice(0, startPos) + converted + (e.key === '.' ? '।' : e.key) + text.slice(cursor);
        e.preventDefault();
        onChange(newText);

        setTimeout(() => {
          if (textareaRef.current) {
            const newCursor = startPos + converted.length + 1;
            textareaRef.current.selectionStart = newCursor;
            textareaRef.current.selectionEnd = newCursor;
          }
        }, 0);
      }
    }
  };

  // Determine CSS font-family
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
    <div className="relative flex-1 w-full h-full min-h-[500px] flex overflow-hidden bg-[#090d16]/70 rounded-b-2xl border-x border-b border-gray-800/80">
      
      {/* Line Numbers Gutter */}
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="select-none py-4 px-2 sm:px-3 text-right bg-[#0b0f19]/90 border-r border-gray-800/80 text-gray-600 font-mono text-xs overflow-hidden"
          style={{ fontSize: `${Math.max(fontSize - 2, 11)}px`, lineHeight: '1.65' }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="hover:text-gray-400 transition-colors">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor Textarea */}
      <div className="relative flex-1 h-full">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={updateCursorPos}
          onKeyUp={updateCursorPos}
          placeholder={
            phoneticActive
              ? "এখানে বাংলিশে টাইপ করুন (যেমন: amra banglay gan gai -> আমরা বাংলায় গান গাই)..."
              : "Type plain text or paste code here..."
          }
          spellCheck={false}
          className={`w-full h-full p-4 sm:p-6 bg-transparent text-gray-100 placeholder-gray-600 outline-none resize-none selection:bg-cyan-500/30 selection:text-cyan-100 ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.65',
          }}
        />

        {/* Phonetic Active Floating Pill Indicator */}
        {phoneticActive && (
          <div className="absolute bottom-3 right-4 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-[10px] text-cyan-300 font-mono shadow-[0_0_10px_rgba(0,242,254,0.15)] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Realtime Phonetic [BN] Active</span>
          </div>
        )}
      </div>

    </div>
  );
}
