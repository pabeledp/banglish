'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { TARGET_LANGUAGES } from '@/lib/translatorService';
import { transliterateWord } from '@/lib/phoneticEngine';
import { getPhoneticCandidates } from '@/lib/banglishDictionary';
import CandidatePopup from '@/components/CandidatePopup';
import { 
  Bold, 
  Italic, 
  Underline, 
  Copy, 
  Trash2, 
  Check, 
  Globe, 
  Loader2, 
  Highlighter, 
  Link2,
  ChevronDown
} from 'lucide-react';

interface DocsEditorProps {
  content: string;
  onChange: (html: string) => void;
  font: FontFamilyOption;
  fontSize: number;
  phoneticActive: boolean;
  onStatsUpdate?: (words: number, chars: number) => void;
  onTranslateSelected?: (selectedText: string, targetLang: string) => Promise<string>;
  onOpenLinkModal?: (selectedText: string) => void;
}

export default function DocsEditor({
  content,
  onChange,
  font,
  fontSize,
  phoneticActive,
  onStatsUpdate,
  onTranslateSelected,
  onOpenLinkModal,
}: DocsEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [selectedTargetLang, setSelectedTargetLang] = useState('bn');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showFloatingLangPicker, setShowFloatingLangPicker] = useState(false);
  
  // Floating toolbar state & saved selection range
  const savedRangeRef = useRef<Range | null>(null);
  const isInteractingWithToolbarRef = useRef<boolean>(false);
  const floatingToolbarRef = useRef<HTMLDivElement | null>(null);
  const floatingLangPickerRef = useRef<HTMLDivElement | null>(null);

  const [floatingToolbar, setFloatingToolbar] = useState<{
    visible: boolean;
    x: number;
    y: number;
    selectedText: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: '',
  });

  // Custom Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    selectedText: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: '',
  });

  // Initialize and synchronize content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = content || '<p></p>';
      }
    }
  }, [content]);

  // Calculate stats on input
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const plainText = editorRef.current.innerText || '';
    
    onChange(html);

    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const chars = plainText.length;
    onStatsUpdate?.(words, chars);
  }, [onChange, onStatsUpdate]);

  // Handle selection change for floating toolbar
  const handleSelectionChange = () => {
    // If the user is currently interacting with the floating toolbar or picker, do not hide it
    if (isInteractingWithToolbarRef.current || showFloatingLangPicker) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editorRef.current) {
      if (!isInteractingWithToolbarRef.current) {
        setFloatingToolbar(prev => ({ ...prev, visible: false }));
        setShowFloatingLangPicker(false);
      }
      return;
    }

    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      if (!isInteractingWithToolbarRef.current) {
        setFloatingToolbar(prev => ({ ...prev, visible: false }));
        setShowFloatingLangPicker(false);
      }
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      if (!isInteractingWithToolbarRef.current) {
        setFloatingToolbar(prev => ({ ...prev, visible: false }));
        setShowFloatingLangPicker(false);
      }
      return;
    }

    // Save the range reference clone for safe translation replacement
    savedRangeRef.current = range.cloneRange();

    const rect = range.getBoundingClientRect();
    const toolbarWidth = 320;
    const safeLeft = Math.max(12, Math.min(window.innerWidth - toolbarWidth - 16, rect.left + rect.width / 2 - toolbarWidth / 2));
    const safeTop = Math.max(10, rect.top - 54);

    setFloatingToolbar({
      visible: true,
      x: safeLeft,
      y: safeTop,
      selectedText: text,
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [showFloatingLangPicker]);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (floatingLangPickerRef.current && !floatingLangPickerRef.current.contains(target)) {
        setShowFloatingLangPicker(false);
      }
      if (floatingToolbarRef.current && !floatingToolbarRef.current.contains(target) && !editorRef.current?.contains(target)) {
        setFloatingToolbar(prev => ({ ...prev, visible: false }));
        setShowFloatingLangPicker(false);
      }
      setContextMenu(prev => ({ ...prev, visible: false }));
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const isSelectionHighlighted = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const cmdVal = document.queryCommandValue('hiliteColor') || document.queryCommandValue('backColor');
    if (cmdVal && cmdVal !== 'transparent' && cmdVal !== 'rgba(0, 0, 0, 0)' && cmdVal !== 'rgb(255, 255, 255)') {
      return true;
    }

    let node: Node | null = selection.anchorNode;
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement) {
        const bg = window.getComputedStyle(node).backgroundColor;
        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'rgb(255, 255, 255)') {
          return true;
        }
      }
      node = node.parentNode;
    }
    return false;
  };

  const toggleHighlight = (color: string = '#fef08a') => {
    const isHigh = isSelectionHighlighted();
    if (isHigh || color === 'transparent') {
      // Unhighlight cleanly
      document.execCommand('hiliteColor', false, 'transparent');
      document.execCommand('backColor', false, 'transparent');

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editorRef.current) {
        const spans = editorRef.current.querySelectorAll('span, mark');
        spans.forEach((el) => {
          if (sel.containsNode(el, true)) {
            (el as HTMLElement).style.backgroundColor = '';
            if (el.tagName.toLowerCase() === 'mark') {
              const parent = el.parentNode;
              while (el.firstChild) parent?.insertBefore(el.firstChild, el);
              parent?.removeChild(el);
            }
          }
        });
      }
    } else {
      document.execCommand('hiliteColor', false, color);
    }
    handleInput();
  };

  const execFormat = (command: string, value: string = '') => {
    if (command === 'toggleHighlight') {
      toggleHighlight(value || '#fef08a');
    } else if (command === 'hiliteColor') {
      if (value === 'transparent') {
        toggleHighlight('transparent');
      } else {
        document.execCommand('hiliteColor', false, value);
        handleInput();
      }
    } else {
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  // Translate selected text into target language
  const handleTranslateSelection = async () => {
    const textToTranslate = floatingToolbar.selectedText;
    if (!textToTranslate) return;

    setIsTranslating(true);
    try {
      if (onTranslateSelected) {
        const translated = await onTranslateSelected(textToTranslate, selectedTargetLang);
        
        // Use the saved cloned range to replace the text accurately
        const targetRange = savedRangeRef.current;
        if (targetRange) {
          targetRange.deleteContents();
          targetRange.insertNode(document.createTextNode(translated));
          handleInput();
        } else {
          // Fallback to active selection if available
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(translated));
            handleInput();
          }
        }
      }
    } finally {
      setIsTranslating(false);
      setFloatingToolbar(prev => ({ ...prev, visible: false }));
      setShowFloatingLangPicker(false);
      setContextMenu(prev => ({ ...prev, visible: false }));
      isInteractingWithToolbarRef.current = false;
    }
  };

  // Right-click custom context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const text = selection ? selection.toString() : '';

    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      selectedText: text,
    });
  };

  // Real-time Phonetic typing inside contentEditable
  const activeDocBufferRef = useRef<string>('');
  const lastDocReplacedLenRef = useRef<number>(0);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const candidatesRef = useRef<string[]>([]);
  const selectedIndexRef = useRef(0);

  const resetDocBuffer = () => {
    activeDocBufferRef.current = '';
    lastDocReplacedLenRef.current = 0;
    candidatesRef.current = [];
    selectedIndexRef.current = 0;
    setCandidates([]);
    setSelectedCandidateIndex(0);
  };

  const applyCandidatePreview = (word: string) => {
    for (let i = 0; i < lastDocReplacedLenRef.current; i++) {
      document.execCommand('delete', false);
    }
    document.execCommand('insertText', false, word);
    lastDocReplacedLenRef.current = word.length;
    handleInput();
  };

  const commitCandidate = (word: string, sep: string = '') => {
    for (let i = 0; i < lastDocReplacedLenRef.current; i++) {
      document.execCommand('delete', false);
    }
    document.execCommand('insertText', false, word + sep);
    resetDocBuffer();
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!phoneticActive) return;

    if (e.ctrlKey || e.metaKey || e.altKey) {
      resetDocBuffer();
      return;
    }

    // 0. Active candidate navigation with Arrow keys & numeric selection 1-9
    if (candidatesRef.current.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (selectedIndexRef.current + 1) % candidatesRef.current.length;
        selectedIndexRef.current = nextIdx;
        setSelectedCandidateIndex(nextIdx);
        applyCandidatePreview(candidatesRef.current[nextIdx]);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIdx = (selectedIndexRef.current - 1 + candidatesRef.current.length) % candidatesRef.current.length;
        selectedIndexRef.current = nextIdx;
        setSelectedCandidateIndex(nextIdx);
        applyCandidatePreview(candidatesRef.current[nextIdx]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        resetDocBuffer();
        return;
      }
      if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= candidatesRef.current.length) {
          e.preventDefault();
          commitCandidate(candidatesRef.current[num - 1], '');
          return;
        }
      }
    }

    // 1. Backspace in active syllable
    if (e.key === 'Backspace' && activeDocBufferRef.current.length > 0) {
      e.preventDefault();
      const nextBuffer = activeDocBufferRef.current.slice(0, -1);
      activeDocBufferRef.current = nextBuffer;

      for (let i = 0; i < lastDocReplacedLenRef.current; i++) {
        document.execCommand('delete', false);
      }

      if (nextBuffer.length > 0) {
        const nextCands = getPhoneticCandidates(nextBuffer);
        candidatesRef.current = nextCands;
        selectedIndexRef.current = 0;
        setCandidates(nextCands);
        setSelectedCandidateIndex(0);

        const newBangla = nextCands[0] || transliterateWord(nextBuffer);
        document.execCommand('insertText', false, newBangla);
        lastDocReplacedLenRef.current = newBangla.length;
      } else {
        lastDocReplacedLenRef.current = 0;
        candidatesRef.current = [];
        selectedIndexRef.current = 0;
        setCandidates([]);
        setSelectedCandidateIndex(0);
      }
      handleInput();
      return;
    }

    // 2. Separators: Space, Enter, Punctuation
    if (
      e.key === ' ' ||
      e.key === 'Enter' ||
      e.key === '.' ||
      e.key === '?' ||
      e.key === '!' ||
      e.key === ',' ||
      e.key === ';' ||
      e.key === ':'
    ) {
      e.preventDefault();
      let sep = e.key;
      if (e.key === '.') sep = '।';
      else if (e.key === 'Enter') sep = '\n';

      if (activeDocBufferRef.current.length > 0) {
        const chosen = (candidatesRef.current.length > 0 && candidatesRef.current[selectedIndexRef.current])
          ? candidatesRef.current[selectedIndexRef.current]
          : transliterateWord(activeDocBufferRef.current);
        commitCandidate(chosen, sep);
      } else {
        document.execCommand('insertText', false, sep);
        resetDocBuffer();
        handleInput();
      }
      return;
    }

    // 3. Navigation
    if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End' || e.key === 'Escape') {
      resetDocBuffer();
      return;
    }

    // 4. Character typing (letters a-z, A-Z, 0-9, backtick `, ^, :, $, ~)
    if (e.key.length === 1 && /^[a-zA-Z0-9`^:$~]$/.test(e.key)) {
      e.preventDefault();

      const nextBuffer = activeDocBufferRef.current + e.key;
      activeDocBufferRef.current = nextBuffer;

      const nextCands = getPhoneticCandidates(nextBuffer);
      candidatesRef.current = nextCands;
      selectedIndexRef.current = 0;
      setCandidates(nextCands);
      setSelectedCandidateIndex(0);

      const newBangla = nextCands[0] || transliterateWord(nextBuffer);

      for (let i = 0; i < lastDocReplacedLenRef.current; i++) {
        document.execCommand('delete', false);
      }

      document.execCommand('insertText', false, newBangla);
      lastDocReplacedLenRef.current = newBangla.length;
      handleInput();
      return;
    }

    resetDocBuffer();
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

  const selectedLangObj = TARGET_LANGUAGES.find(l => l.code === selectedTargetLang) || TARGET_LANGUAGES[0];

  return (
    <div 
      className="relative flex-1 w-full min-h-[550px] sm:min-h-[620px] bg-slate-50/50 rounded-b-2xl border-x border-b border-slate-200/90 p-2.5 sm:p-6 lg:p-8 pb-32 flex justify-center overflow-y-auto"
      onContextMenu={handleContextMenu}
    >
      {/* Floating Selection Toolbar */}
      {floatingToolbar.visible && (
        <div
          ref={floatingToolbarRef}
          onMouseEnter={() => { isInteractingWithToolbarRef.current = true; }}
          onMouseLeave={() => { isInteractingWithToolbarRef.current = false; }}
          className="fixed z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-900/15 animate-in fade-in zoom-in-95 duration-150 max-w-[calc(100vw-24px)] overflow-x-auto"
          style={{ top: `${floatingToolbar.y}px`, left: `${floatingToolbar.x}px` }}
        >
          <button
            type="button"
            onClick={() => execFormat('bold')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('italic')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('underline')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg cursor-pointer"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleHighlight('#fef08a')}
            className="p-1.5 hover:bg-slate-100 text-amber-500 rounded-lg cursor-pointer"
            title="হাইলাইটার / আনহাইলাইটার (Toggle Highlight)"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenLinkModal?.(floatingToolbar.selectedText);
              setFloatingToolbar(prev => ({ ...prev, visible: false }));
            }}
            className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg cursor-pointer"
            title="হাইপারলিংক যুক্ত করুন"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

          {/* Interactive Floating Language Picker Dropdown */}
          <div className="relative" ref={floatingLangPickerRef}>
            <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setShowFloatingLangPicker(!showFloatingLangPicker)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] text-slate-800 hover:text-emerald-700 font-sans font-medium rounded cursor-pointer"
                title="অনুবাদ করার ভাষা নির্বাচন করুন"
              >
                <span>{selectedLangObj.flag}</span>
                <span>{selectedLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <button
                type="button"
                disabled={isTranslating}
                onClick={handleTranslateSelection}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium shadow-2xs transition-all cursor-pointer font-bangla disabled:opacity-60"
                title="নির্বাচিত টেক্সট অনুবাদ করুন"
              >
                {isTranslating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                <span>অনুবাদ</span>
              </button>
            </div>

            {/* Language Selection Popup Menu */}
            {showFloatingLangPicker && (
              <div className="absolute left-0 bottom-full mb-1.5 w-48 max-h-52 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl p-1 z-50 space-y-0.5 ring-1 ring-black/5 animate-in fade-in duration-100">
                <div className="text-[10px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider font-mono border-b border-slate-100">
                  Translate to:
                </div>
                {TARGET_LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setSelectedTargetLang(l.code);
                      setShowFloatingLangPicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                      selectedTargetLang === l.code ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{l.flag}</span>
                      <span>{l.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 text-xs text-slate-700 space-y-0.5 animate-in fade-in duration-100 ring-1 ring-black/5"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {contextMenu.selectedText && (
            <button
              type="button"
              onClick={handleTranslateSelection}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold font-bangla text-left transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>অনুবাদ করুন (Translate)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (contextMenu.selectedText) navigator.clipboard.writeText(contextMenu.selectedText);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-left cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>কপি করুন (Copy)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              execFormat('selectAll');
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-left cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-slate-500" />
            <span>সব সিলেক্ট করুন (Select All)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              execFormat('removeFormat');
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>ফরম্যাটিং মুছুন (Clear Format)</span>
          </button>
        </div>
      )}

      {/* Main Document Paper Canvas */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-8 lg:p-12 shadow-sm min-h-[600px] flex flex-col">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={phoneticActive ? "এখানে লিখুন..." : "Write here..."}
          className="prose max-w-none flex-1 outline-none text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.8',
          }}
        />
      </div>

      {/* Live Phonetic Candidate Suggestions Popup */}
      {phoneticActive && candidates.length > 0 && (
        <CandidatePopup
          candidates={candidates}
          selectedIndex={selectedCandidateIndex}
          onSelectIndex={(idx) => {
            selectedIndexRef.current = idx;
            setSelectedCandidateIndex(idx);
            applyCandidatePreview(candidates[idx]);
          }}
          onSelectCandidate={(cand) => {
            commitCandidate(cand, '');
          }}
          className="fixed bottom-6 right-6 z-40"
        />
      )}

    </div>
  );
}
