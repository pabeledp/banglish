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

  // Real-time Phonetic Engine Buffers
  const activeBufferRef = useRef<string>('');
  const lastReplacedLenRef = useRef<number>(0);
  const [liveCandidate, setLiveCandidate] = useState<{ raw: string; converted: string } | null>(null);

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

  // Reset active phonetic syllable buffer on click / navigation
  const resetBuffer = () => {
    activeBufferRef.current = '';
    lastReplacedLenRef.current = 0;
    setLiveCandidate(null);
  };

  // Real-time KeyDown Interceptor for 100% In-Browser Phonetic Typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Universal Avro Shortcut Ctrl+M or Cmd+M to toggle phonetic mode
    if (e.key === 'm' && (e.ctrlKey || e.metaKey) && !e.altKey) {
      e.preventDefault();
      resetBuffer();
      onTogglePhonetic?.();
      return;
    }

    if (!phoneticActive) return;

    // Ignore commands with Ctrl / Meta (Cmd) / Alt (like Cmd+C, Cmd+V, Cmd+Z, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      resetBuffer();
      return;
    }

    const el = textareaRef.current;
    if (!el) return;

    // 1. Backspace handling within active syllable
    if (e.key === 'Backspace') {
      if (activeBufferRef.current.length > 0) {
        e.preventDefault();
        const nextBuffer = activeBufferRef.current.slice(0, -1);
        activeBufferRef.current = nextBuffer;

        const cursorPos = el.selectionStart;
        const replaceLen = lastReplacedLenRef.current;
        const startPos = Math.max(0, cursorPos - replaceLen);
        const endPos = cursorPos;
        const currentText = el.value;

        if (nextBuffer.length > 0) {
          const newBangla = transliterateWord(nextBuffer);
          lastReplacedLenRef.current = newBangla.length;
          const nextText = currentText.slice(0, startPos) + newBangla + currentText.slice(endPos);
          onChange(nextText);
          setLiveCandidate({ raw: nextBuffer, converted: newBangla });

          requestAnimationFrame(() => {
            if (textareaRef.current) {
              const newPos = startPos + newBangla.length;
              textareaRef.current.selectionStart = newPos;
              textareaRef.current.selectionEnd = newPos;
              updateCursorPos();
            }
          });
        } else {
          lastReplacedLenRef.current = 0;
          setLiveCandidate(null);
          const nextText = currentText.slice(0, startPos) + currentText.slice(endPos);
          onChange(nextText);

          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = startPos;
              textareaRef.current.selectionEnd = startPos;
              updateCursorPos();
            }
          });
        }
        return;
      } else {
        // Normal backspace, reset buffer
        resetBuffer();
        return;
      }
    }

    // 2. Delimiter keys: Space, Enter, Tab, Punctuation
    if (
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === 'Tab' ||
      e.key === '.' ||
      e.key === '?' ||
      e.key === '!' ||
      e.key === ',' ||
      e.key === ';' ||
      e.key === ':' ||
      e.key === '/' ||
      e.key === '\\' ||
      e.key === '(' ||
      e.key === ')' ||
      e.key === '[' ||
      e.key === ']' ||
      e.key === '{' ||
      e.key === '}' ||
      e.key === '"' ||
      e.key === "'"
    ) {
      e.preventDefault();

      let sep = e.key;
      if (e.key === '.') sep = '।';
      else if (e.key === 'Enter') sep = '\n';
      else if (e.key === 'Tab') sep = '  ';

      const cursorPos = el.selectionStart;
      const currentText = el.value;

      // If there is an active buffer, commit the final word before separator
      if (activeBufferRef.current.length > 0) {
        const finalBangla = transliterateWord(activeBufferRef.current);
        const replaceLen = lastReplacedLenRef.current;
        const startPos = Math.max(0, cursorPos - replaceLen);
        const endPos = cursorPos;

        const nextText = currentText.slice(0, startPos) + finalBangla + sep + currentText.slice(endPos);
        onChange(nextText);
        resetBuffer();

        const newPos = startPos + finalBangla.length + sep.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
            updateCursorPos();
          }
        });
      } else {
        // Plain separator insertion
        const nextText = currentText.slice(0, cursorPos) + sep + currentText.slice(cursorPos);
        onChange(nextText);
        resetBuffer();

        const newPos = cursorPos + sep.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
            updateCursorPos();
          }
        });
      }
      return;
    }

    // 3. Navigation / Arrow keys: reset active buffer
    if (
      e.key.startsWith('Arrow') ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.key === 'PageUp' ||
      e.key === 'PageDown' ||
      e.key === 'Escape'
    ) {
      resetBuffer();
      return;
    }

    // 4. Character typing (letters a-z, A-Z, 0-9, backtick `, ^, :, $, ~)
    if (e.key.length === 1 && /^[a-zA-Z0-9`^:$~]$/.test(e.key)) {
      e.preventDefault();

      const nextBuffer = activeBufferRef.current + e.key;
      activeBufferRef.current = nextBuffer;

      const newBangla = transliterateWord(nextBuffer);
      const cursorPos = el.selectionStart;
      const replaceLen = lastReplacedLenRef.current;
      const startPos = Math.max(0, cursorPos - replaceLen);
      const endPos = cursorPos;
      const currentText = el.value;

      const nextText = currentText.slice(0, startPos) + newBangla + currentText.slice(endPos);
      lastReplacedLenRef.current = newBangla.length;
      onChange(nextText);
      setLiveCandidate({ raw: nextBuffer, converted: newBangla });

      const newPos = startPos + newBangla.length;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          updateCursorPos();
        }
      });
      return;
    }

    // For any unhandled key, reset buffer
    resetBuffer();
  };

  // Handle onChange fallback (handles mobile browsers, soft keyboards, composition)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // If active buffer is already managing keydown, skip duplicate updates
    if (activeBufferRef.current.length > 0) return;
    onChange(e.target.value);
    setTimeout(updateCursorPos, 0);
  };

  // Handle Paste when phonetic mode is active
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    resetBuffer();
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
          updateCursorPos();
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
          onClick={() => {
            resetBuffer();
            updateCursorPos();
          }}
          onKeyUp={updateCursorPos}
          onScroll={handleScroll}
          placeholder={phoneticActive ? "এখানে লিখুন..." : "Write here..."}
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

        {/* Live Active Syllable Indicator Pill */}
        {phoneticActive && liveCandidate && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs shadow-xl backdrop-blur-md animate-in fade-in duration-100 ring-1 ring-emerald-600">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="font-mono text-emerald-200 font-medium">{liveCandidate.raw}</span>
            <span className="text-white/60">➔</span>
            <span className="font-bangla font-bold text-white text-sm">{liveCandidate.converted}</span>
          </div>
        )}
      </div>

    </div>
  );
}
