'use client';

import React, { useState, useMemo, useCallback } from 'react';
import PastebinHeader from '@/components/pastebin/PastebinHeader';
import TabsBar from '@/components/pastebin/TabsBar';
import PastebinToolbar from '@/components/pastebin/PastebinToolbar';
import TextCodeEditor from '@/components/pastebin/TextCodeEditor';
import DocsEditor from '@/components/pastebin/DocsEditor';
import SheetEditor from '@/components/pastebin/SheetEditor';
import FloatingActions from '@/components/pastebin/FloatingActions';
import ExportModal from '@/components/pastebin/ExportModal';
import ClearConfirmModal from '@/components/pastebin/ClearConfirmModal';
import HyperlinkModal from '@/components/pastebin/HyperlinkModal';
import Toast from '@/components/pastebin/Toast';
import { usePastebinStorage } from '@/hooks/usePastebinStorage';
import { translateContent } from '@/lib/translatorService';
import { transliterateText } from '@/lib/phoneticEngine';
import { FontFamilyOption, WorkspaceMode } from '@/lib/pastebinTypes';
import { Clock, AlignLeft, ShieldCheck } from 'lucide-react';

export default function PastebinPage() {
  const {
    state,
    activeTab,
    isLoaded,
    saveStatus,
    updateActiveTab,
    setActiveTab,
    addTab,
    removeTab,
    renameTab,
    togglePhonetic,
    clearActiveTabContent,
  } = usePastebinStorage();

  // Local UI state
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [activeCellCoord, setActiveCellCoord] = useState('A1');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [initialLinkText, setInitialLinkText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Compute live word and character counts
  const stats = useMemo(() => {
    if (!activeTab) return { words: 0, chars: 0, readingTime: 0 };

    let textToAnalyze = '';
    if (activeTab.mode === 'docs') {
      if (typeof window !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = activeTab.content || '';
        textToAnalyze = temp.innerText || '';
      }
    } else if (activeTab.mode === 'sheet') {
      if (activeTab.sheetData) {
        textToAnalyze = Object.values(activeTab.sheetData.cells).join(' ');
      }
    } else {
      textToAnalyze = activeTab.content || '';
    }

    const words = textToAnalyze.trim() ? textToAnalyze.trim().split(/\s+/).length : 0;
    const chars = textToAnalyze.length;
    const readingTime = Math.max(1, Math.ceil(words / 180));

    return { words, chars, readingTime };
  }, [activeTab]);

  // Universal Translation (Auto-detects source, translates to target language)
  const handleTranslate = useCallback(async (targetLangCode: string) => {
    if (!activeTab || isTranslating) return;

    setIsTranslating(true);
    showToast('অনুবাদ হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...');

    try {
      if (activeTab.mode === 'text') {
        const translated = await translateContent(activeTab.content, targetLangCode);
        updateActiveTab({ content: translated });
        showToast('সফলভাবে অনুবাদ সম্পন্ন হয়েছে!');
      } else if (activeTab.mode === 'docs') {
        if (typeof window !== 'undefined') {
          const temp = document.createElement('div');
          temp.innerHTML = activeTab.content;
          const textNodes: Text[] = [];
          const collectText = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim()) {
              textNodes.push(node as Text);
            } else {
              node.childNodes.forEach(collectText);
            }
          };
          collectText(temp);

          for (const tNode of textNodes) {
            if (tNode.nodeValue) {
              tNode.nodeValue = await translateContent(tNode.nodeValue, targetLangCode);
            }
          }

          updateActiveTab({ content: temp.innerHTML });
          showToast('ডকুমেন্ট সফলভাবে অনুবাদ সম্পন্ন হয়েছে!');
        }
      } else if (activeTab.mode === 'sheet' && activeTab.sheetData) {
        const newCells: Record<string, string> = {};
        for (const [k, v] of Object.entries(activeTab.sheetData.cells)) {
          if (v.startsWith('=')) {
            newCells[k] = v;
          } else {
            newCells[k] = await translateContent(v, targetLangCode);
          }
        }
        updateActiveTab({
          sheetData: {
            ...activeTab.sheetData,
            cells: newCells,
          },
        });
        showToast('শীট ডাটা সফলভাবে অনুবাদ সম্পন্ন হয়েছে!');
      }
    } catch {
      showToast('অনুবাদে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন।');
    } finally {
      setIsTranslating(false);
    }
  }, [activeTab, isTranslating, updateActiveTab, showToast]);

  // 1-Click Banglish to Bangla Conversion using Avro Engine
  const handleConvertPhonetic = useCallback(() => {
    if (!activeTab) return;

    if (activeTab.mode === 'text') {
      const converted = transliterateText(activeTab.content);
      updateActiveTab({ content: converted });
      showToast('বাংলিশ টেক্সট সফলভাবে বাংলায় রূপান্তর হয়েছে!');
    } else if (activeTab.mode === 'docs') {
      if (typeof window !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = activeTab.content;
        const textNodes: Text[] = [];
        const collectText = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim()) {
            textNodes.push(node as Text);
          } else {
            node.childNodes.forEach(collectText);
          }
        };
        collectText(temp);

        for (const tNode of textNodes) {
          if (tNode.nodeValue) {
            tNode.nodeValue = transliterateText(tNode.nodeValue);
          }
        }

        updateActiveTab({ content: temp.innerHTML });
        showToast('ডকুমেন্ট সফলভাবে বাংলায় রূপান্তর হয়েছে!');
      }
    } else if (activeTab.mode === 'sheet' && activeTab.sheetData) {
      const newCells: Record<string, string> = {};
      for (const [k, v] of Object.entries(activeTab.sheetData.cells)) {
        if (v.startsWith('=')) {
          newCells[k] = v;
        } else {
          newCells[k] = transliterateText(v);
        }
      }
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          cells: newCells,
        },
      });
      showToast('শীট ডাটা সফলভাবে বাংলায় রূপান্তর হয়েছে!');
    }
  }, [activeTab, updateActiveTab, showToast]);

  // Translate specific selected text (for DocsEditor)
  const handleTranslateSelectedText = useCallback(async (selectedText: string, targetLang: string) => {
    return await translateContent(selectedText, targetLang);
  }, []);

  // Copy full content to clipboard
  const handleCopyContent = useCallback(async () => {
    if (!activeTab) return;

    let textToCopy = '';
    if (activeTab.mode === 'docs') {
      const temp = document.createElement('div');
      temp.innerHTML = activeTab.content;
      textToCopy = temp.innerText || activeTab.content;
    } else if (activeTab.mode === 'sheet' && activeTab.sheetData) {
      const rows: string[] = [];
      const cells = activeTab.sheetData.cells;
      for (let r = 1; r <= activeTab.sheetData.rows; r++) {
        const rowVals: string[] = [];
        for (let c = 0; c < activeTab.sheetData.cols; c++) {
          const colLetter = String.fromCharCode(65 + c);
          rowVals.push(cells[`${colLetter}${r}`] || '');
        }
        rows.push(rowVals.join('\t'));
      }
      textToCopy = rows.join('\n');
    } else {
      textToCopy = activeTab.content;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast('সম্পূর্ণ কনটেন্ট ক্লিপবোর্ডে কপি করা হয়েছে!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('কপি করতে ব্যর্থ হয়েছে');
    }
  }, [activeTab, showToast]);

  // Clean whitespace in text mode
  const handleCleanWhitespace = () => {
    if (!activeTab || activeTab.mode !== 'text') return;
    const cleaned = activeTab.content
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    updateActiveTab({ content: cleaned });
    showToast('অতিরিক্ত স্পেস ও খালি লাইন সরানো হয়েছে!');
  };

  // Transform text case
  const handleTransformCase = (type: 'upper' | 'lower' | 'title') => {
    if (!activeTab || activeTab.mode !== 'text') return;
    let transformed = activeTab.content;
    if (type === 'upper') transformed = transformed.toUpperCase();
    if (type === 'lower') transformed = transformed.toLowerCase();
    if (type === 'title') {
      transformed = transformed.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );
    }
    updateActiveTab({ content: transformed });
    showToast(`টেক্সট ${type} কেসে কনভার্ট করা হয়েছে!`);
  };

  // Docs command handler
  const handleDocFormat = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  // Insert image placeholder
  const handleInsertImage = () => {
    const url = prompt('ছবির সরাসরি ইমেজ লিঙ্ক (URL) দিন:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  // Open custom Hyperlink modal
  const handleOpenLinkModal = (selectedText?: string) => {
    setInitialLinkText(selectedText || '');
    setIsLinkModalOpen(true);
  };

  // Insert link from custom Hyperlink modal
  const handleInsertLink = (url: string, text?: string) => {
    if (text) {
      document.execCommand('insertHTML', false, `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline font-semibold">${text}</a>`);
    } else {
      document.execCommand('createLink', false, url);
    }
  };

  // Sheet operations
  const handleAddRow = () => {
    if (activeTab?.sheetData) {
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          rows: activeTab.sheetData.rows + 1,
        },
      });
    }
  };

  const handleDeleteRow = () => {
    if (activeTab?.sheetData && activeTab.sheetData.rows > 2) {
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          rows: activeTab.sheetData.rows - 1,
        },
      });
    }
  };

  const handleAddCol = () => {
    if (activeTab?.sheetData) {
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          cols: activeTab.sheetData.cols + 1,
        },
      });
    }
  };

  const handleDeleteCol = () => {
    if (activeTab?.sheetData && activeTab.sheetData.cols > 2) {
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          cols: activeTab.sheetData.cols - 1,
        },
      });
    }
  };

  const handleInsertFormula = (formula: string) => {
    if (activeTab?.sheetData) {
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          cells: {
            ...activeTab.sheetData.cells,
            [activeCellCoord]: formula,
          },
        },
      });
    }
  };

  const handleSheetCellFormat = (
    prop: 'bold' | 'italic' | 'align' | 'color' | 'bg',
    val?: string
  ) => {
    if (!activeTab?.sheetData) return;
    const currentStyle = activeTab.sheetData.styles[activeCellCoord] || {};
    let newStyle = { ...currentStyle };

    if (prop === 'bold') newStyle.bold = !currentStyle.bold;
    if (prop === 'italic') newStyle.italic = !currentStyle.italic;
    if (prop === 'align' && (val === 'left' || val === 'center' || val === 'right')) {
      newStyle.align = val;
    }

    updateActiveTab({
      sheetData: {
        ...activeTab.sheetData,
        styles: {
          ...activeTab.sheetData.styles,
          [activeCellCoord]: newStyle,
        },
      },
    });
  };

  if (!isLoaded || !activeTab) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-mono text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Banglish Workspace লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 relative overflow-x-hidden pb-36 sm:pb-40">
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" aria-hidden="true" />

      {/* Ambient Floating Bangla Typography Glyphs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
        <span className="absolute top-28 left-[5%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/5 blur-[2.5px] float-glyph-1">অ</span>
        <span className="absolute top-[48%] left-[2%] text-6xl sm:text-8xl font-bangla font-bold text-teal-900/5 blur-[3px] float-glyph-2">আ</span>
        <span className="absolute top-20 right-[12%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/5 blur-[3px] float-glyph-3">ক</span>
        <span className="absolute bottom-28 left-[15%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/5 blur-[3px] float-glyph-2">ব</span>
        <span className="absolute bottom-16 right-[20%] text-7xl sm:text-9xl font-bangla font-bold text-teal-900/5 blur-[3px] float-glyph-3">শ</span>
      </div>

      {/* 1. Light-Themed Header Bar */}
      <PastebinHeader
        phoneticActive={state.phoneticActive}
        onTogglePhonetic={togglePhonetic}
        saveStatus={saveStatus}
        lastSavedAt={state.lastSavedAt}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onAddNewNote={() => addTab('text')}
      />

      {/* Workspace Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7 flex flex-col">
        
        {/* White Glass Container Card (Mac Simulator Style) */}
        <div className="flex-1 flex flex-col rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 overflow-hidden">
          
          {/* Simulator Top Dots Bar */}
          <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-2xs"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-2xs"></span>
              <span className="text-xs font-semibold text-slate-600 font-mono ml-2 hidden sm:inline">Banglish Smart Editor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bangla text-slate-500 hidden sm:inline">
                {activeTab.mode === 'text' ? 'টেক্সট ও কোড খাতা' : activeTab.mode === 'docs' ? 'রিচ ডক ক্যানভাস' : 'স্প্রেডশীট টেবিল'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% Offline Save
              </span>
            </div>
          </div>

          {/* 2. Multi-Tab Management Bar (Internal Modes) */}
          <TabsBar
            tabs={state.tabs}
            activeTabId={state.activeTabId}
            onSelectTab={setActiveTab}
            onAddTab={addTab}
            onRemoveTab={removeTab}
            onRenameTab={renameTab}
          />

          {/* 3. Sub-Toolbar with Universal Translate & Highlighter */}
          <PastebinToolbar
            mode={activeTab.mode}
            font={activeTab.font}
            onFontChange={(font: FontFamilyOption) => updateActiveTab({ font })}
            fontSize={activeTab.fontSize}
            onFontSizeChange={(fontSize: number) => updateActiveTab({ fontSize })}
            showLineNumbers={showLineNumbers}
            onToggleLineNumbers={() => setShowLineNumbers(!showLineNumbers)}
            wordWrap={activeTab.wordWrap}
            onToggleWordWrap={() => updateActiveTab({ wordWrap: !activeTab.wordWrap })}
            codeLanguage={activeTab.codeLanguage}
            onCodeLanguageChange={(codeLanguage: string) => updateActiveTab({ codeLanguage })}
            onCleanWhitespace={handleCleanWhitespace}
            onTransformCase={handleTransformCase}
            onDocFormat={handleDocFormat}
            onInsertImage={handleInsertImage}
            onInsertLink={() => handleOpenLinkModal()}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
            onAddCol={handleAddCol}
            onDeleteCol={handleDeleteCol}
            onInsertFormula={handleInsertFormula}
            onSheetCellFormat={handleSheetCellFormat}
            onConvertPhonetic={handleConvertPhonetic}
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
          />

          {/* 4. Main Canvas Editor Area (Unrestricted Height & Smooth Scroll) */}
          <div className="flex-1 flex flex-col min-h-[550px] sm:min-h-[620px]">
            {activeTab.mode === 'text' && (
              <TextCodeEditor
                content={activeTab.content}
                onChange={(content: string) => updateActiveTab({ content })}
                font={activeTab.font}
                fontSize={activeTab.fontSize}
                wordWrap={activeTab.wordWrap}
                showLineNumbers={showLineNumbers}
                phoneticActive={state.phoneticActive}
                onCursorChange={(line, col) => setCursorPos({ line, col })}
                onTogglePhonetic={togglePhonetic}
              />
            )}

            {activeTab.mode === 'docs' && (
              <DocsEditor
                content={activeTab.content}
                onChange={(content: string) => updateActiveTab({ content })}
                font={activeTab.font}
                fontSize={activeTab.fontSize}
                phoneticActive={state.phoneticActive}
                onTranslateSelected={handleTranslateSelectedText}
                onOpenLinkModal={handleOpenLinkModal}
              />
            )}

            {activeTab.mode === 'sheet' && activeTab.sheetData && (
              <SheetEditor
                sheetData={activeTab.sheetData}
                onChange={(sheetData) => updateActiveTab({ sheetData })}
                font={activeTab.font}
                fontSize={activeTab.fontSize}
                phoneticActive={state.phoneticActive}
                onActiveCellChange={(coord) => setActiveCellCoord(coord)}
              />
            )}
          </div>

          {/* 5. Light-Themed Footer / Status Bar */}
          <footer className="w-full bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-mono">
            
            {/* Left Stats */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>{stats.words} Words</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{stats.chars} Characters</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>~{stats.readingTime} min read</span>
              </div>
              {activeTab.mode === 'text' && (
                <div className="text-slate-500 font-medium">
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </div>
              )}
              {activeTab.mode === 'sheet' && (
                <div className="text-emerald-700 font-bold">
                  Cell: {activeCellCoord}
                </div>
              )}
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 font-bangla hidden md:inline">
                স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজে সংরক্ষিত
              </span>
              <div className="flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Active Auto-Sync</span>
              </div>
            </div>

          </footer>

        </div>

      </main>

      {/* Floating Bottom Utility Action Bar */}
      <FloatingActions
        phoneticActive={state.phoneticActive}
        onTogglePhonetic={togglePhonetic}
        onConvertPhonetic={handleConvertPhonetic}
        onTranslate={handleTranslate}
        isTranslating={isTranslating}
        onCopyContent={handleCopyContent}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenClearModal={() => setIsClearModalOpen(true)}
        copied={copied}
      />

      {/* Modals & Toast */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeTab={activeTab}
        onNotify={showToast}
      />

      <ClearConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={clearActiveTabContent}
      />

      <HyperlinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onInsert={handleInsertLink}
        initialText={initialLinkText}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

    </div>
  );
}
