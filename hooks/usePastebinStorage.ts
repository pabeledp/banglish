'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PastebinState, PastebinTab, WorkspaceMode, LanguageMode, SheetData, FontFamilyOption } from '@/lib/pastebinTypes';

const STORAGE_KEY = 'banglish_pastebin_v1';

const defaultSheetData: SheetData = {
  rows: 12,
  cols: 8,
  cells: {
    'A1': 'আইটেম (Item)',
    'B1': 'পরিমাণ (Qty)',
    'C1': 'দর (Rate ৳)',
    'D1': 'মোট (Total ৳)',
    'A2': 'অ্যাপল সিলিকন ম্যাকবুক',
    'B2': '2',
    'C2': '145000',
    'D2': '=B2*C2',
    'A3': 'উইন্ডোজ ওয়ার্কস্টেশন',
    'B3': '1',
    'C3': '95000',
    'D3': '=B3*C3',
    'A4': 'মেকানিক্যাল কীবোর্ড',
    'B4': '3',
    'C4': '4500',
    'D4': '=B4*C4',
    'A5': 'মোট খরচ (Grand Total)',
    'D5': '=SUM(D2:D4)'
  },
  styles: {
    'A1': { bold: true, align: 'center', bg: '#1e293b' },
    'B1': { bold: true, align: 'center', bg: '#1e293b' },
    'C1': { bold: true, align: 'center', bg: '#1e293b' },
    'D1': { bold: true, align: 'center', bg: '#1e293b' },
    'A5': { bold: true, color: '#00f2fe' },
    'D5': { bold: true, color: '#10b981' }
  }
};

const defaultTabs: PastebinTab[] = [
  {
    id: 'tab-welcome-text',
    title: 'নোট ১ (Quick Note)',
    mode: 'text',
    content: `স্বাগতম Banglish Smart Workspace & PasteBin-এ! 🚀
এই অল-ইন-ওয়ান ওয়ার্কস্পেসে আপনি যা যা করতে পারেন:

১. রিয়েলটাইম বাংলিশ ফোনেটিক টাইপিং:
   - উপরে 'বাংলিশ ফোনেটিক' টগল অন করুন।
   - 'amra banglay gan gai' টাইপ করলে স্বয়ংক্রিয়ভাবে 'আমরা বাংলায় গান গাই' হয়ে যাবে।
   - শর্টকাট: কীবোর্ড থেকে Ctrl+M বা Option+Space প্রেস করে ফোনেটিক অন/অফ করতে পারবেন।

২. কোড ও প্লেইন টেক্সট মোড:
   - লাইন নাম্বার, অটো-র‍্যাপ, ইন্ডেন্টেশন সাপোর্ট।
   - যেকোনো কোড বা কনটেন্ট কপি করে শেয়ার বা এক্সপোর্ট করুন।

৩. মাল্টিপল ট্যাব ও অটো-সেভ:
   - আপনার প্রতিটি পরিবর্তন ব্রাউজারের লোকাল স্টোরেজে ইনস্ট্যান্ট সেভ হয়ে থাকবে।
   - ট্যাব রিনেম বা নতুন ট্যাব খুলে কাজ চালিয়ে যান নিশ্চিন্তে!`,
    language: 'bn',
    font: 'Hind Siliguri',
    fontSize: 15,
    wordWrap: true,
    codeLanguage: 'plaintext',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'tab-demo-docs',
    title: 'ডক খসড়া (Rich Doc)',
    mode: 'docs',
    content: `<h2><strong>Banglish Docs Mode: আধুনিক রিচ টেক্সট এডিটর ✨</strong></h2>
<p>এটি একটি ফুল-ফিচার্ড নলেজ বেস ও ডকুমেন্ট ক্যানভাস। নিচের ফিচারগুলো এক্সপ্লোর করুন:</p>
<hr/>
<h3><strong>প্রধান সুবিধাসমূহ:</strong></h3>
<ul>
  <li><strong>ফরম্যাটিং কন্ট্রোল:</strong> হেডিং H1-H3, বোল্ড, ইটালিক, আন্ডারলাইন, টেক্সট কালার ও হাইলাইটার।</li>
  <li><strong>ফ্লোটিং সিলেকশন বার:</strong> যেকোনো টেক্সট সিলেক্ট করলেই সাথে সাথে কুইক ফরম্যাটিং ও ১-ক্লিক <em>"বাংলিশ ➔ বাংলা রূপান্তর"</em> অপশন পপআপ হবে!</li>
  <li><strong>চেকলিস্ট ও কোট:</strong> টু-ডু লিস্ট এবং সুন্দর কোটেশন ব্লক যুক্ত করুন।</li>
</ul>
<blockquote>💡 <em>প্রো টিপ: বাংলিশ দিয়ে লেখা প্যারাগ্রাফ সিলেক্ট করে ফ্লোটিং টুলবারের "Phonetic Convert" চাপলে সাথে সাথে বিশুদ্ধ বাংলায় কনভার্ট হয়ে যাবে!</em></blockquote>
<p></p>
<p><strong>আজকের টু-ডু লিস্ট:</strong></p>
<p>✅ Banglish Mac অ্যাপ ডাউনলোড সম্পন্ন</p>
<p>⬜️ উইন্ডোজ বেটা ভার্সন টেস্ট করা</p>
<p>⬜️ প্রিয় বন্ধুদের সাথে Banglish Pastebin শেয়ার করা</p>`,
    language: 'bn',
    font: 'Hind Siliguri',
    fontSize: 16,
    wordWrap: true,
    codeLanguage: 'html',
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000,
  },
  {
    id: 'tab-demo-sheet',
    title: 'হিসাব খাতা (Data Sheet)',
    mode: 'sheet',
    content: '',
    sheetData: defaultSheetData,
    language: 'bn',
    font: 'Hind Siliguri',
    fontSize: 14,
    wordWrap: false,
    codeLanguage: 'plaintext',
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000,
  }
];

const initialState: PastebinState = {
  tabs: defaultTabs,
  activeTabId: defaultTabs[0].id,
  phoneticActive: true,
  theme: 'dark',
  lastSavedAt: Date.now(),
};

export function usePastebinStorage() {
  const [state, setState] = useState<PastebinState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
          setState({
            ...parsed,
            lastSavedAt: parsed.lastSavedAt || Date.now(),
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load pastebin state from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;

    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        const stateToSave = {
          ...state,
          lastSavedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        setSaveStatus('saved');
      } catch (e) {
        console.error('Failed to auto-save pastebin state:', e);
        setSaveStatus('dirty');
      }
    }, 350);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state, isLoaded]);

  // Get active tab
  const activeTab = state.tabs.find(t => t.id === state.activeTabId) || state.tabs[0];

  // Update active tab data
  const updateActiveTab = useCallback((partial: Partial<PastebinTab>) => {
    setState(prev => {
      const activeIdx = prev.tabs.findIndex(t => t.id === prev.activeTabId);
      if (activeIdx === -1) return prev;

      const updatedTab: PastebinTab = {
        ...prev.tabs[activeIdx],
        ...partial,
        updatedAt: Date.now(),
      };

      const newTabs = [...prev.tabs];
      newTabs[activeIdx] = updatedTab;

      return {
        ...prev,
        tabs: newTabs,
      };
    });
  }, []);

  // Set active tab ID
  const setActiveTab = useCallback((tabId: string) => {
    setState(prev => ({ ...prev, activeTabId: tabId }));
  }, []);

  // Add a new tab
  const addTab = useCallback((mode: WorkspaceMode = 'text', customTitle?: string) => {
    const newId = `tab-${Date.now()}`;
    const defaultTitle = customTitle || (
      mode === 'text' ? `নোট ${state.tabs.length + 1}` :
      mode === 'docs' ? `ডক ${state.tabs.length + 1}` :
      `শীট ${state.tabs.length + 1}`
    );

    const newTab: PastebinTab = {
      id: newId,
      title: defaultTitle,
      mode,
      content: mode === 'docs' ? '<p></p>' : '',
      sheetData: mode === 'sheet' ? {
        rows: 15,
        cols: 10,
        cells: {},
        styles: {}
      } : undefined,
      language: state.phoneticActive ? 'bn' : 'en',
      font: state.phoneticActive ? 'Hind Siliguri' : 'Poppins',
      fontSize: mode === 'docs' ? 16 : 15,
      wordWrap: true,
      codeLanguage: 'plaintext',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setState(prev => ({
      ...prev,
      tabs: [...prev.tabs, newTab],
      activeTabId: newId,
    }));

    return newId;
  }, [state.tabs.length, state.phoneticActive]);

  // Remove a tab
  const removeTab = useCallback((tabId: string) => {
    setState(prev => {
      if (prev.tabs.length <= 1) return prev; // Keep at least one tab
      const newTabs = prev.tabs.filter(t => t.id !== tabId);
      const newActiveId = prev.activeTabId === tabId ? newTabs[0].id : prev.activeTabId;
      return {
        ...prev,
        tabs: newTabs,
        activeTabId: newActiveId,
      };
    });
  }, []);

  // Rename a tab
  const renameTab = useCallback((tabId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setState(prev => ({
      ...prev,
      tabs: prev.tabs.map(t => t.id === tabId ? { ...t, title: newTitle.trim(), updatedAt: Date.now() } : t)
    }));
  }, []);

  // Toggle phonetic status globally and update active tab font
  const togglePhonetic = useCallback(() => {
    setState(prev => {
      const nextPhonetic = !prev.phoneticActive;
      const nextLang: LanguageMode = nextPhonetic ? 'bn' : 'en';
      const nextFont: FontFamilyOption = nextPhonetic ? 'Hind Siliguri' : 'Poppins';

      // Also update the active tab's font and language dynamically!
      const updatedTabs: PastebinTab[] = prev.tabs.map(tab => {
        if (tab.id === prev.activeTabId) {
          return {
            ...tab,
            language: nextLang,
            font: nextFont,
            updatedAt: Date.now(),
          };
        }
        return tab;
      });

      return {
        ...prev,
        phoneticActive: nextPhonetic,
        tabs: updatedTabs,
      };
    });
  }, []);

  // Set explicit language mode
  const setLanguageMode = useCallback((lang: LanguageMode) => {
    const isPhonetic = lang === 'bn';
    const font: FontFamilyOption = isPhonetic ? 'Hind Siliguri' : 'Poppins';

    setState(prev => ({
      ...prev,
      phoneticActive: isPhonetic,
      tabs: prev.tabs.map((t): PastebinTab => t.id === prev.activeTabId ? {
        ...t,
        language: lang,
        font: font,
        updatedAt: Date.now()
      } : t)
    }));
  }, []);

  // Switch workspace mode for active tab
  const setTabMode = useCallback((mode: WorkspaceMode) => {
    updateActiveTab({
      mode,
      sheetData: mode === 'sheet' && !activeTab?.sheetData ? {
        rows: 15,
        cols: 10,
        cells: {},
        styles: {}
      } : activeTab?.sheetData
    });
  }, [updateActiveTab, activeTab]);

  // Clear current tab canvas content
  const clearActiveTabContent = useCallback(() => {
    if (!activeTab) return;
    if (activeTab.mode === 'sheet') {
      updateActiveTab({
        sheetData: {
          rows: 15,
          cols: 10,
          cells: {},
          styles: {}
        }
      });
    } else if (activeTab.mode === 'docs') {
      updateActiveTab({ content: '<p></p>' });
    } else {
      updateActiveTab({ content: '' });
    }
  }, [activeTab, updateActiveTab]);

  return {
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
  };
}
