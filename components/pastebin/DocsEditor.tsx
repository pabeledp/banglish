'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { TARGET_LANGUAGES } from '@/lib/translatorService';
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
  Link2
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
  
  // Floating toolbar state
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
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editorRef.current) {
      setFloatingToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      setFloatingToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setFloatingToolbar(prev => ({ ...prev, visible: false }));
      return;
    }

    const rect = range.getBoundingClientRect();

    setFloatingToolbar({
      visible: true,
      x: Math.max(10, rect.left + rect.width / 2 - 140),
      y: Math.max(10, rect.top - 50),
      selectedText: text,
    });
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  const execFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  // Translate selected text into target language
  const handleTranslateSelection = async () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    setIsTranslating(true);
    try {
      if (onTranslateSelected) {
        const translated = await onTranslateSelected(selectedText, selectedTargetLang);
        range.deleteContents();
        range.insertNode(document.createTextNode(translated));
        handleInput();
      }
    } finally {
      setIsTranslating(false);
      setFloatingToolbar(prev => ({ ...prev, visible: false }));
      setContextMenu(prev => ({ ...prev, visible: false }));
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

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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
    <div 
      className="relative flex-1 w-full min-h-[550px] sm:min-h-[620px] bg-slate-50/50 rounded-b-2xl border-x border-b border-slate-200/90 p-4 sm:p-8 pb-32 flex justify-center overflow-y-auto"
      onContextMenu={handleContextMenu}
    >
      {/* Floating Selection Toolbar */}
      {floatingToolbar.visible && (
        <div
          className="fixed z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl shadow-slate-900/15 animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${floatingToolbar.y}px`, left: `${floatingToolbar.x}px` }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            onClick={() => execFormat('bold')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('italic')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('underline')}
            className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('hiliteColor', '#fef08a')}
            className="p-1.5 hover:bg-slate-100 text-amber-500 rounded-lg"
            title="হাইলাইটার (Highlighter)"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenLinkModal?.(floatingToolbar.selectedText);
              setFloatingToolbar(prev => ({ ...prev, visible: false }));
            }}
            className="p-1.5 hover:bg-slate-100 text-blue-600 rounded-lg"
            title="হাইপারলিংক যুক্ত করুন"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-1" />

          {/* Universal Translate Selection Button */}
          <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5 border border-slate-200">
            <select
              value={selectedTargetLang}
              onChange={(e) => setSelectedTargetLang(e.target.value)}
              className="bg-transparent text-[11px] text-slate-800 outline-none cursor-pointer pr-1 font-sans"
            >
              {TARGET_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={isTranslating}
              onClick={handleTranslateSelection}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium shadow-2xs transition-all cursor-pointer"
            >
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Globe className="w-3 h-3" />
              )}
              <span>অনুবাদ</span>
            </button>
          </div>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl p-1.5 text-xs text-slate-700 space-y-0.5 animate-in fade-in duration-100 ring-1 ring-black/5"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {contextMenu.selectedText && (
            <button
              type="button"
              onClick={handleTranslateSelection}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold font-bangla text-left transition-colors"
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
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
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
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-800 text-left"
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
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-left"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>ফরম্যাটিং মুছুন (Clear Format)</span>
          </button>
        </div>
      )}

      {/* Main Document Paper Canvas */}
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-12 shadow-sm min-h-[600px] flex flex-col">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="prose max-w-none flex-1 outline-none text-slate-900 selection:bg-emerald-100 selection:text-emerald-900"
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.8',
          }}
        />
      </div>

    </div>
  );
}
