'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PastebinTab, WorkspaceMode } from '@/lib/pastebinTypes';
import { 
  Plus, 
  X, 
  FileText, 
  FileEdit, 
  Table2, 
  Edit3, 
  Check, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface TabsBarProps {
  tabs: PastebinTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onAddTab: (mode: WorkspaceMode, title?: string) => void;
  onRemoveTab: (tabId: string) => void;
  onRenameTab: (tabId: string, newTitle: string) => void;
}

export default function TabsBar({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onRemoveTab,
  onRenameTab,
}: TabsBarProps) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click anywhere on the page
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };
    if (showAddMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showAddMenu]);

  const startRename = (tab: PastebinTab, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTabId(tab.id);
    setEditingTitle(tab.title);
  };

  const handleRenameSubmit = (tabId: string) => {
    if (editingTitle.trim()) {
      onRenameTab(tabId, editingTitle.trim());
    }
    setEditingTabId(null);
  };

  const getModeIcon = (mode: WorkspaceMode) => {
    switch (mode) {
      case 'text':
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case 'docs':
        return <FileEdit className="w-3.5 h-3.5 text-teal-600" />;
      case 'sheet':
        return <Table2 className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="w-full bg-slate-100/80 border-b border-slate-200/90 px-2 sm:px-6 pt-2 pb-1.5 flex items-center justify-between gap-2 select-none relative z-30">
      
      {/* Scrollable Tabs list strip */}
      <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto scrollbar-none py-0.5">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const isEditing = tab.id === editingTabId;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onDoubleClick={(e) => startRename(tab, e)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 border-slate-200/90 border-b-transparent shadow-xs font-semibold'
                  : 'bg-slate-200/50 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border-transparent'
              }`}
            >
              {/* Active emerald indicator strip */}
              {isActive && (
                <div className="absolute -top-[1px] left-2 right-2 h-[2.5px] rounded-full bg-emerald-500 shadow-xs" />
              )}

              {/* Mode icon */}
              <span className="flex-shrink-0">{getModeIcon(tab.mode)}</span>

              {/* Title / Inline rename input */}
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRenameSubmit(tab.id);
                      if (e.key === 'Escape') setEditingTabId(null);
                    }}
                    autoFocus
                    className="w-24 sm:w-32 px-1.5 py-0.5 rounded bg-white border border-emerald-500 text-slate-900 text-xs outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleRenameSubmit(tab.id)}
                    className="p-1 hover:text-emerald-600 text-slate-500"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <span className="truncate max-w-[120px] sm:max-w-[160px] font-sans">
                  {tab.title}
                </span>
              )}

              {/* Tab Actions (Rename & Close) */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                {!isEditing && (
                  <button
                    type="button"
                    onClick={(e) => startRename(tab, e)}
                    className="p-0.5 hover:text-emerald-600 text-slate-400 rounded"
                    title="রিনেম করুন"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}

                {tabs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveTab(tab.id);
                    }}
                    className="p-0.5 hover:text-rose-500 text-slate-400 rounded"
                    title="ট্যাব বন্ধ করুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right controls: Add Tab Button with Safe Non-Clipped Dropdown */}
      <div className="relative shrink-0 flex items-center" ref={addMenuRef}>
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-300 shadow-2xs transition-all cursor-pointer font-bangla"
          title="নতুন ট্যাব খুলুন (Text, Docs, বা Sheet)"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>নতুন ট্যাব</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {showAddMenu && (
          <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2 z-50 space-y-1.5 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100">
              নতুন ট্যাবের ধরণ বেছে নিন:
            </div>

            <button
              type="button"
              onClick={() => {
                onAddTab('text');
                setShowAddMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-emerald-50 transition-colors text-left group"
            >
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 font-sans">টেক্সট & কোড নোট</div>
                <div className="text-[10px] text-slate-500 font-bangla">Classic Editor with Line Numbers</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddTab('docs');
                setShowAddMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-teal-50 transition-colors text-left group"
            >
              <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 group-hover:bg-teal-200">
                <FileEdit className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 font-sans">রিচ ডক ক্যানভাস</div>
                <div className="text-[10px] text-slate-500 font-bangla">Notion / Google Docs Style Editor</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onAddTab('sheet');
                setShowAddMenu(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-amber-50 transition-colors text-left group"
            >
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200">
                <Table2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 font-sans">স্প্রেডশীট টেবিল</div>
                <div className="text-[10px] text-slate-500 font-bangla">Excel Grid, Formulas & CSV Export</div>
              </div>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
