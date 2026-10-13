'use client';

import React, { useRef, useState, useEffect } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { transliterateWord, transliterateText } from '@/lib/phoneticEngine';
import { Sparkles } from 'lucide-react';

interface TextCodeEditorProps {
  content: string;
  onChange: (value: string) => void;
  font: FontFamilyOption;
  fontSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  phoneticActive: boolean;
  onCursorChange?: (line: number, col: number) => void;
  onTogglePhonetic?: () => void;
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
  onTogglePhonetic,
}: TextCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const [lineCount, setLineCount] = useState(1);
  const [candidateWord, setCandidateWord] = useState<{ raw: string; converted: string } | null>(null);

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

  // Cursor position tracking & candidate preview
  const updateCursorAndCandidate = () => {
    if (!textareaRef.current) return;
    const pos = textareaRef.current.selectionStart || 0;
    const textBefore = content.substring(0, pos);
    const lines = textBefore.split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    onCursorChange?.(line, col);

    if (phoneticActive) {
      const match = textBefore.match(/([a-zA-Z0-9`^:$~]+)$/);
      if (match && match[1] && /[a-zA-Z]/.test(match[1])) {
        const raw = match[1];
        const converted = transliterateWord(raw);
        setCandidateWord({ raw, converted });
      } else {
        setCandidateWord(null);
      }
    } else {
      setCandidateWord(null);
    }
  };

  // Handle KeyDown for Space / Enter / Tab / Punctuation instant transliteration
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Universal Avro Shortcut Ctrl+M
    if (e.key === 'm' && (e.ctrlKey || e.metaKey) && !e.altKey) {
      e.preventDefault();
      onTogglePhonetic?.();
      return;
    }

    if (!phoneticActive) return;

    if (
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === 'Tab' ||
      e.key === '.' ||
      e.key === '?' ||
      e.key === '!' ||
      e.key === ',' ||
      e.key === ';' ||
      e.key === ':'
    ) {
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const text = el.value;
      const textBefore = text.slice(0, cursor);

      // Extract the word token before cursor
      const match = textBefore.match(/([a-zA-Z0-9`^:$~]+)$/);
      if (match && match[1] && /[a-zA-Z]/.test(match[1])) {
        e.preventDefault();
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const startPos = cursor - lastWord.length;

        let sep = e.key;
        if (e.key === '.') sep = '।';
        else if (e.key === 'Enter') sep = '\n';
        else if (e.key === 'Tab') sep = '  ';

        const newText = text.slice(0, startPos) + converted + sep + text.slice(cursor);
        onChange(newText);
        setCandidateWord(null);

        const newCursor = startPos + converted.length + sep.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newCursor;
            textareaRef.current.selectionEnd = newCursor;
            updateCursorAndCandidate();
          }
        });
      }
    }
  };

  // Handle onChange fallback (handles mobile keyboards, IME, autocomplete)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newRaw = e.target.value;
    const cursor = e.target.selectionStart;

    if (!phoneticActive) {
      onChange(newRaw);
      return;
    }

    const lastChar = newRaw[cursor - 1];
    if (lastChar && /[\s.,;!?।\n\t]/.test(lastChar)) {
      const textBefore = newRaw.slice(0, cursor - 1);
      const match = textBefore.match(/([a-zA-Z0-9`^:$~]+)$/);
      if (match && match[1] && /[a-zA-Z]/.test(match[1])) {
        const lastWord = match[1];
        const converted = transliterateWord(lastWord);
        const startPos = (cursor - 1) - lastWord.length;
        const sep = lastChar === '.' ? '।' : lastChar;

        const transformed = newRaw.slice(0, startPos) + converted + sep + newRaw.slice(cursor);
        onChange(transformed);
        setCandidateWord(null);

        const nextCursor = startPos + converted.length + sep.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = nextCursor;
            textareaRef.current.selectionEnd = nextCursor;
            updateCursorAndCandidate();
          }
        });
        return;
      }
    }

    onChange(newRaw);
    setTimeout(updateCursorAndCandidate, 0);
  };

  // Handle Paste when phonetic mode is active
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!phoneticActive) return;
    const pastedText = e.clipboardData.getData('text/plain');
    if (!pastedText) return;

    if (/[a-zA-Z]/.test(pastedText)) {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;

      const cursor = el.selectionStart;
      const end = el.selectionEnd;
      const converted = transliterateText(pastedText);
      const newText = el.value.slice(0, cursor) + converted + el.value.slice(end);
      
      onChange(newText);

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const nextCursor = cursor + converted.length;
          textareaRef.current.selectionStart = nextCursor;
          textareaRef.current.selectionEnd = nextCursor;
          updateCursorAndCandidate();
        }
      });
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

      {/* Main Textarea */}
      <div className="relative flex-1 flex flex-col h-full">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onKeyUp={updateCursorAndCandidate}
          onClick={updateCursorAndCandidate}
          onScroll={handleScroll}
          placeholder={
            phoneticActive
              ? "বাংলিশ ফোনেটিক চালু আছে... যেমন: 'amra banglay gan gai' টাইপ করে Space চাপুন..."
              : "এখানে আপনার টেক্সট বা কোড লিখুন..."
          }
          className={`flex-1 w-full h-full p-4 sm:p-5 bg-white text-slate-900 outline-none resize-none leading-relaxed transition-all placeholder:text-slate-400 ${
            wordWrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'
          }`}
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.75',
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />

        {/* Live Phonetic Candidate Helper Badge */}
        {phoneticActive && candidateWord && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700/95 text-white text-xs shadow-lg backdrop-blur-md animate-in fade-in duration-150">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="font-mono text-emerald-200">{candidateWord.raw}</span>
            <span className="text-white/60">➔</span>
            <span className="font-bangla font-semibold text-white">{candidateWord.converted}</span>
            <span className="text-[10px] text-emerald-200/80 font-bangla pl-1">(Space চাপুন)</span>
          </div>
        )}
      </div>

    </div>
  );
}
