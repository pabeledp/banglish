'use client';

import React, { useState } from 'react';
import { PastebinTab } from '@/lib/pastebinTypes';
import { 
  X, 
  Download, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  Printer, 
  Share2, 
  Check, 
  Copy 
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: PastebinTab;
  onNotify: (msg: string) => void;
}

export default function ExportModal({
  isOpen,
  onClose,
  activeTab,
  onNotify,
}: ExportModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Extract clean text representation
  const getRawContent = () => {
    if (activeTab.mode === 'docs') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = activeTab.content;
      return tempDiv.innerText || activeTab.content;
    }
    if (activeTab.mode === 'sheet') {
      if (!activeTab.sheetData) return '';
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
      return rows.join('\n');
    }
    return activeTab.content;
  };

  // Download generic file
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify(`'${filename}' ডাউনলোড সম্পন্ন হয়েছে!`);
    onClose();
  };

  // 1. Download as TXT
  const handleDownloadTxt = () => {
    const raw = getRawContent();
    downloadFile(raw, `${activeTab.title || 'pastebin'}.txt`, 'text/plain;charset=utf-8');
  };

  // 2. Download as Markdown
  const handleDownloadMd = () => {
    let md = `# ${activeTab.title}\n\n`;
    if (activeTab.mode === 'docs') {
      // Basic html to md conversion
      let html = activeTab.content;
      html = html.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n');
      html = html.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n');
      html = html.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n');
      html = html.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
      html = html.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
      html = html.replace(/<em>(.*?)<\/em>/gi, '*$1*');
      html = html.replace(/<blockquote>(.*?)<\/blockquote>/gi, '> $1\n\n');
      html = html.replace(/<hr\s*\/?>/gi, '\n---\n\n');
      const temp = document.createElement('div');
      temp.innerHTML = html;
      md += temp.innerText || html;
    } else {
      md += activeTab.content;
    }
    downloadFile(md, `${activeTab.title || 'pastebin'}.md`, 'text/markdown;charset=utf-8');
  };

  // 3. Download CSV
  const handleDownloadCsv = () => {
    if (activeTab.mode === 'sheet' && activeTab.sheetData) {
      const rows: string[] = [];
      const cells = activeTab.sheetData.cells;
      for (let r = 1; r <= activeTab.sheetData.rows; r++) {
        const rowVals: string[] = [];
        for (let c = 0; c < activeTab.sheetData.cols; c++) {
          const colLetter = String.fromCharCode(65 + c);
          const val = cells[`${colLetter}${r}`] || '';
          rowVals.push(`"${val.replace(/"/g, '""')}"`);
        }
        rows.push(rowVals.join(','));
      }
      downloadFile('\uFEFF' + rows.join('\n'), `${activeTab.title || 'banglish-data'}.csv`, 'text/csv;charset=utf-8');
    } else {
      handleDownloadTxt();
    }
  };

  // 4. Print / PDF Export
  const handlePrintPdf = () => {
    window.print();
    onClose();
  };

  // 5. Copy Raw Snippet
  const handleCopySnippet = () => {
    const raw = getRawContent();
    navigator.clipboard.writeText(raw);
    setCopiedLink(true);
    onNotify('ক্লিপবোর্ডে কপি করা হয়েছে!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-gray-900/95 border border-gray-700/80 p-6 shadow-2xl shadow-black/80 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">এক্সপোর্ট ও ডাউনলোড অপশন</h3>
              <p className="text-xs text-gray-400 font-bangla">আপনার পছন্দমতো ফরম্যাটে ফাইল সেভ করুন</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Plain Text (.txt) */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-950/70 hover:bg-gray-800/80 border border-gray-800 hover:border-cyan-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-gray-900 text-cyan-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans">Plain Text (.txt)</div>
              <div className="text-[11px] text-gray-400">স্ট্যান্ডার্ড টেক্সট ফাইল</div>
            </div>
          </button>

          {/* Markdown (.md) */}
          <button
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-950/70 hover:bg-gray-800/80 border border-gray-800 hover:border-emerald-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-gray-900 text-emerald-400 group-hover:scale-110 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans">Markdown (.md)</div>
              <div className="text-[11px] text-gray-400">হেডিং ও লিস্ট ফরম্যাট</div>
            </div>
          </button>

          {/* CSV Spreadsheet (.csv) */}
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-950/70 hover:bg-gray-800/80 border border-gray-800 hover:border-amber-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-gray-900 text-amber-400 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans">Excel / CSV (.csv)</div>
              <div className="text-[11px] text-gray-400">টেবুলার ডাটা ও স্প্রেডশীট</div>
            </div>
          </button>

          {/* Print / PDF Document */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-950/70 hover:bg-gray-800/80 border border-gray-800 hover:border-purple-500/50 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-gray-900 text-purple-400 group-hover:scale-110 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white font-sans">Print / Save PDF</div>
              <div className="text-[11px] text-gray-400">ব্রাউজার প্রিন্ট ও পিডিএফ</div>
            </div>
          </button>

        </div>

        {/* Quick Copy Snippet */}
        <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-bangla">সরাসরি ক্লিপবোর্ডে কপি করতে চান?</span>
          <button
            type="button"
            onClick={handleCopySnippet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLink ? 'কপিকৃত!' : 'কপি টেক্সট'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
