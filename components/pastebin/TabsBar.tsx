'use client';

import React, { useState } from 'react';
import { PastebinTab, WorkspaceMode } from '@/lib/pastebinTypes';
import { 
  Plus, 
  X, 
  FileText, 
  FileEdit, 
  Table2, 
  Edit3, 
  Check, 
  Sparkles 
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
        return <FileText className="w-3.5 h-3.5 text-[#00f2fe]" />;
      case 'docs':
        return <FileEdit className="w-3.5 h-3.5 text-[#10b981]" />;
      case 'sheet':
        return <Table2 className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="w-full bg-[#0b0f19]/90 border-b border-gray-800/80 px-2 sm:px-6 pt-2 pb-1.5 flex items-center justify-between gap-2 overflow-x-auto select-none scrollbar-none">
      
      {/* Tabs list */}
      <div className="flex items-center gap-1.5 min-w-0">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          const isEditing = tab.id === editingTabId;

          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onDoubleClick={(e) => startRename(tab, e)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-gray-900/90 text-white border-gray-700/80 border-b-transparent shadow-[0_-2px_10px_rgba(0,0,0,0.4)]'
                  : 'bg-gray-950/40 text-gray-400 hover:text-gray-200 hover:bg-gray-900/40 border-transparent'
              }`}
            >
              {/* Active neon indicator strip */}
              {isActive && (
                <div className="absolute -top-[1px] left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-[#00f2fe] via-[#00d2ff] to-[#10b981] shadow-[0_0_8px_rgba(0,242,254,0.8)]" />
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
                    className="w-24 sm:w-32 px-1.5 py-0.5 rounded bg-gray-950 border border-cyan-500 text-white text-xs outline-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => handleRenameSubmit(tab.id)}
                    className="p-1 hover:text-emerald-400 text-gray-400"
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
                    className="p-0.5 hover:text-cyan-400 text-gray-500 rounded"
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
                    className="p-0.5 hover:text-rose-400 text-gray-500 rounded"
                    title="ট্যাব বন্ধ করুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Tab Button with Mode Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-gray-900/50 hover:bg-gray-800/80 border border-gray-800/80 transition-all cursor-pointer"
            title="নতুন ট্যাব খুলুন"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">নতুন ট্যাব</span>
          </button>

          {showAddMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowAddMenu(false)} 
              />
              <div className="absolute left-0 top-full mt-1.5 w-48 rounded-xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/80 shadow-2xl p-1.5 z-30 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onAddTab('text');
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800/90 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-[#00f2fe]" />
                  <div>
                    <div className="font-semibold text-white">টেক্সট & কোড নোট</div>
                    <div className="text-[10px] text-gray-400">Classic Plain Editor</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAddTab('docs');
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800/90 transition-colors text-left"
                >
                  <FileEdit className="w-4 h-4 text-[#10b981]" />
                  <div>
                    <div className="font-semibold text-white">রিচ ডক ক্যানভাস</div>
                    <div className="text-[10px] text-gray-400">Google Docs / Notion Style</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAddTab('sheet');
                    setShowAddMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-800/90 transition-colors text-left"
                >
                  <Table2 className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-white">স্প্রেডশীট টেবিল</div>
                    <div className="text-[10px] text-gray-400">Formula & Excel Support</div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right helper text */}
      <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
        <Sparkles className="w-3 h-3 text-cyan-500" />
        <span>ডাবল ক্লিক করে ট্যাব রিনেম করুন</span>
      </div>

    </div>
  );
}
