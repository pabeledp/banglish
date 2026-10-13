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
import Toast from '@/components/pastebin/Toast';
import { usePastebinStorage } from '@/hooks/usePastebinStorage';
import { transliterateText } from '@/lib/phoneticEngine';
import { FontFamilyOption, WorkspaceMode } from '@/lib/pastebinTypes';
import { Clock, AlignLeft, Sparkles, Database } from 'lucide-react';

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
    setLanguageMode,
    setTabMode,
    clearActiveTabContent,
  } = usePastebinStorage();

  // Local UI state
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [activeCellCoord, setActiveCellCoord] = useState('A1');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  // Transliterate entire content of current tab from Banglish to Bangla
  const handleConvertPhonetic = useCallback(() => {
    if (!activeTab) return;

    if (activeTab.mode === 'text') {
      const converted = transliterateText(activeTab.content);
      updateActiveTab({ content: converted });
      showToast('টেক্সট সফলভাবে ইউনিকোড বাংলায় রূপান্তরিত হয়েছে!');
    } else if (activeTab.mode === 'docs') {
      if (typeof window !== 'undefined') {
        const temp = document.createElement('div');
        temp.innerHTML = activeTab.content;
        const walkAndTransliterate = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
            node.nodeValue = transliterateText(node.nodeValue);
          } else {
            node.childNodes.forEach(walkAndTransliterate);
          }
        };
        walkAndTransliterate(temp);
        updateActiveTab({ content: temp.innerHTML });
        showToast('ডকুমেন্ট সফলভাবে ইউনিকোড বাংলায় রূপান্তরিত হয়েছে!');
      }
    } else if (activeTab.mode === 'sheet' && activeTab.sheetData) {
      const newCells: Record<string, string> = {};
      Object.entries(activeTab.sheetData.cells).forEach(([k, v]) => {
        newCells[k] = v.startsWith('=') ? v : transliterateText(v);
      });
      updateActiveTab({
        sheetData: {
          ...activeTab.sheetData,
          cells: newCells,
        },
      });
      showToast('স্প্রেডশীট ডাটা সফলভাবে বাংলায় রূপান্তরিত হয়েছে!');
    }
  }, [activeTab, updateActiveTab, showToast]);

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

  const handleInsertImage = () => {
    const url = prompt('ছবির সরাসরি URL লিংক দিন:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  const handleInsertLink = () => {
    const url = prompt('হাইপারলিংক URL দিন:');
    if (url) {
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
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-gray-400 font-mono text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Banglish Workspace লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-[#f3f4f6] font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-x-hidden">
      
      {/* Ambient Neon Glow Orbs */}
      <div className="fixed -top-40 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 -left-40 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 1. Header Bar */}
      <PastebinHeader
        mode={activeTab.mode}
        onModeChange={setTabMode}
        phoneticActive={state.phoneticActive}
        onTogglePhonetic={togglePhonetic}
        language={activeTab.language}
        onLanguageChange={setLanguageMode}
        saveStatus={saveStatus}
        lastSavedAt={state.lastSavedAt}
      />

      {/* Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 flex flex-col">
        
        {/* Glass Container Card */}
        <div className="flex-1 flex flex-col rounded-2xl bg-[rgba(17,24,39,0.6)] backdrop-blur-md border border-gray-800/80 shadow-2xl overflow-hidden">
          
          {/* 2. Multi-Tab Management Bar */}
          <TabsBar
            tabs={state.tabs}
            activeTabId={state.activeTabId}
            onSelectTab={setActiveTab}
            onAddTab={addTab}
            onRemoveTab={removeTab}
            onRenameTab={renameTab}
          />

          {/* 3. Dynamic Sub-Toolbar */}
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
            onInsertLink={handleInsertLink}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
            onAddCol={handleAddCol}
            onDeleteCol={handleDeleteCol}
            onInsertFormula={handleInsertFormula}
            onSheetCellFormat={handleSheetCellFormat}
            onConvertPhonetic={handleConvertPhonetic}
          />

          {/* 4. Main Canvas Editor Area */}
          <div className="flex-1 flex flex-col min-h-[500px]">
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
              />
            )}

            {activeTab.mode === 'docs' && (
              <DocsEditor
                content={activeTab.content}
                onChange={(content: string) => updateActiveTab({ content })}
                font={activeTab.font}
                fontSize={activeTab.fontSize}
                phoneticActive={state.phoneticActive}
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

          {/* 5. Footer / Status Bar */}
          <footer className="w-full bg-[#0b0f19]/95 border-t border-gray-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 font-mono">
            
            {/* Left Stats */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-cyan-400" />
                <span>{stats.words} Words</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>{stats.chars} Characters</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>~{stats.readingTime} min read</span>
              </div>
              {activeTab.mode === 'text' && (
                <div className="text-gray-500">
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </div>
              )}
              {activeTab.mode === 'sheet' && (
                <div className="text-cyan-400 font-bold">
                  Cell: {activeCellCoord}
                </div>
              )}
            </div>

            {/* Right Status */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gray-500 font-bangla hidden md:inline">
                স্বয়ংক্রিয়ভাবে লোকাল স্টোরেজে সংরক্ষিত
              </span>
              <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Sync</span>
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
