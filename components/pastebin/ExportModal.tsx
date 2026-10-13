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

  const handleDownloadTxt = () => {
    const raw = getRawContent();
    downloadFile(raw, `${activeTab.title || 'pastebin'}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadMd = () => {
    let md = `# ${activeTab.title}\n\n`;
    if (activeTab.mode === 'docs') {
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

  const handlePrintPdf = () => {
    window.print();
    onClose();
  };

  const handleCopySnippet = () => {
    const raw = getRawContent();
    navigator.clipboard.writeText(raw);
    setCopiedLink(true);
    onNotify('ক্লিপবোর্ডে কপি করা হয়েছে!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl shadow-slate-900/15 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">এক্সপোর্ট ও ডাউনলোড অপশন</h3>
              <p className="text-xs text-slate-500 font-bangla">আপনার পছন্দমতো ফরম্যাটে ফাইল সেভ করুন</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 group-hover:text-emerald-700 transition-colors shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Plain Text (.txt)</div>
              <div className="text-[11px] text-slate-500 font-bangla">স্ট্যান্ডার্ড টেক্সট ফাইল</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-emerald-600 transition-colors shadow-2xs">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Markdown (.md)</div>
              <div className="text-[11px] text-slate-500 font-bangla">হেডিং ও লিস্ট ফরম্যাট</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-amber-600 transition-colors shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Excel / CSV (.csv)</div>
              <div className="text-[11px] text-slate-500 font-bangla">টেবুলার ডাটা ও স্প্রেডশীট</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-300 transition-all text-left group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-teal-600 transition-colors shadow-2xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 font-sans">Print / Save PDF</div>
              <div className="text-[11px] text-slate-500 font-bangla">প্রিন্ট ও পিডিএফ কপি</div>
            </div>
          </button>

        </div>

        {/* Quick Copy Snippet */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bangla">ক্লিপবোর্ডে কপি করতে চান?</span>
          <button
            type="button"
            onClick={handleCopySnippet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span className="font-bangla">{copiedLink ? 'কপিকৃত!' : 'কপি টেক্সট'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
