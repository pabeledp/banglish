'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FontFamilyOption } from '@/lib/pastebinTypes';
import { transliterateText } from '@/lib/phoneticEngine';
import { 
  Bold, 
  Italic, 
  Underline, 
  Sparkles, 
  Link2, 
  Copy, 
  Scissors, 
  Clipboard, 
  Trash2, 
  Check, 
  Palette 
} from 'lucide-react';

interface DocsEditorProps {
  content: string;
  onChange: (html: string) => void;
  font: FontFamilyOption;
  fontSize: number;
  phoneticActive: boolean;
  onStatsUpdate?: (words: number, chars: number) => void;
}

export default function DocsEditor({
  content,
  onChange,
  font,
  fontSize,
  phoneticActive,
  onStatsUpdate,
}: DocsEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  
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
      // Only set if different to prevent cursor jumps
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

    // Check if selection is inside editor
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
    const editorRect = editorRef.current.getBoundingClientRect();

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

  // Format command helper
  const execFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  // Convert selected text from Banglish to Bangla
  const handleConvertSelectionPhonetic = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    if (!selectedText) return;

    const converted = transliterateText(selectedText);
    range.deleteContents();
    range.insertNode(document.createTextNode(converted));
    
    handleInput();
    setFloatingToolbar(prev => ({ ...prev, visible: false }));
    setContextMenu(prev => ({ ...prev, visible: false }));
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

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle Drag & Drop / Pasting image placeholders
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            const dataUrl = loadEvt.target?.result as string;
            execFormat('insertImage', dataUrl);
          };
          reader.readAsDataURL(file);
        }
        return;
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
    <div 
      className="relative flex-1 w-full h-full min-h-[550px] bg-[#090d16]/70 rounded-b-2xl border-x border-b border-gray-800/80 p-4 sm:p-8 flex justify-center overflow-y-auto"
      onContextMenu={handleContextMenu}
    >
      {/* Floating Selection Toolbar (Notion Style) */}
      {floatingToolbar.visible && (
        <div
          className="fixed z-50 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_10px_25px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-150"
          style={{ top: `${floatingToolbar.y}px`, left: `${floatingToolbar.x}px` }}
          onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
        >
          <button
            type="button"
            onClick={() => execFormat('bold')}
            className="p-1.5 hover:bg-gray-800 text-gray-200 hover:text-white rounded"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('italic')}
            className="p-1.5 hover:bg-gray-800 text-gray-200 hover:text-white rounded"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => execFormat('underline')}
            className="p-1.5 hover:bg-gray-800 text-gray-200 hover:text-white rounded"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-[1px] bg-gray-700 mx-1" />

          {/* 1-Click Banglish to Bangla Conversion Button */}
          <button
            type="button"
            onClick={handleConvertSelectionPhonetic}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-[0_0_10px_rgba(0,242,254,0.3)] transition-all cursor-pointer font-bangla"
            title="সিলেক্ট করা অংশ বাংলায় রূপান্তর করুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>বাংলিশ ➔ বাংলা</span>
          </button>
        </div>
      )}

      {/* Custom Context Menu */}
      {contextMenu.visible && (
        <div
          className="fixed z-50 w-56 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-gray-700 shadow-2xl p-1.5 text-xs text-gray-300 space-y-0.5 animate-in fade-in duration-100"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {contextMenu.selectedText && (
            <button
              type="button"
              onClick={handleConvertSelectionPhonetic}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 font-semibold font-bangla text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>বাংলিশ ➔ বাংলা রূপান্তর</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (contextMenu.selectedText) navigator.clipboard.writeText(contextMenu.selectedText);
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-200 text-left"
          >
            <Copy className="w-3.5 h-3.5 text-gray-400" />
            <span>কপি করুন (Copy)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              execFormat('selectAll');
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-gray-200 text-left"
          >
            <Check className="w-3.5 h-3.5 text-gray-400" />
            <span>সব সিলেক্ট করুন (Select All)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              execFormat('removeFormat');
              setContextMenu(prev => ({ ...prev, visible: false }));
            }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 text-rose-300 text-left"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>ফরম্যাটিং মুছুন (Clear Format)</span>
          </button>
        </div>
      )}

      {/* Main Notion-Style Document Page Canvas */}
      <div className="w-full max-w-4xl bg-[#0c101c]/90 rounded-2xl border border-gray-800/80 p-6 sm:p-12 shadow-2xl shadow-black/60 min-h-[600px] flex flex-col">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          className="prose prose-invert max-w-none flex-1 outline-none text-gray-200 selection:bg-cyan-500/30 selection:text-cyan-100"
          style={{
            fontFamily: getFontFamilyStyle(),
            fontSize: `${fontSize}px`,
            lineHeight: '1.75',
          }}
        />
      </div>

    </div>
  );
}
