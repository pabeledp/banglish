'use client';

import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, ChevronDown } from 'lucide-react';

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 text-emerald-400 font-bold uppercase">{language || 'text'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function parseInlineMarkdown(text: string): string {
  if (!text) return '';

  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-mono text-[0.88em] font-semibold">$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-slate-700">$1</em>');

  // Links & CTA Download Buttons
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, href) => {
    const isDownload = href.endsWith('.pkg') || href.endsWith('.exe') || href.endsWith('.dmg') || linkText.toLowerCase().includes('download');
    if (isDownload) {
      return `<a href="${href}" class="inline-flex items-center gap-2 px-4 py-2 my-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer no-underline"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg><span>${linkText}</span></a>`;
    }
    const isExternal = href.startsWith('http');
    return `<a href="${href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="text-emerald-700 hover:text-emerald-800 font-semibold underline decoration-emerald-300 underline-offset-4 transition-colors">${linkText}</a>`;
  });

  return html;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];
  let isOrderedList = false;
  let inBlockquote = false;
  let quoteBuffer: string[] = [];

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      elements.push(
        <CodeBlock
          key={`code-${elements.length}`}
          code={codeBuffer.join('\n')}
          language={codeLang}
        />
      );
      codeBuffer = [];
      inCodeBlock = false;
      codeLang = '';
    }
  };

  const flushTable = () => {
    if (inTable) {
      elements.push(
        <div key={`table-${elements.length}`} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left text-sm font-bangla border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                {tableHeader.map((th, idx) => (
                  <th
                    key={idx}
                    className="p-3.5 font-bold text-slate-900 font-sans"
                    dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(th.trim()) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-emerald-50/30 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="p-3.5 text-slate-700"
                      dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell.trim()) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  const flushList = () => {
    if (inList) {
      if (isOrderedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="my-4 space-y-2 list-decimal list-inside pl-2 text-slate-700 font-bangla leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="my-4 space-y-2 list-disc list-inside pl-2 text-slate-700 font-bangla leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(item) }} />
            ))}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      elements.push(
        <div key={`quote-${elements.length}`} className="my-6 p-4 sm:p-5 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/60 text-slate-800 font-bangla shadow-sm">
          {quoteBuffer.map((line, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }} />
          ))}
        </div>
      );
      quoteBuffer = [];
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Block delimiter
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
      } else {
        flushTable();
        flushList();
        flushBlockquote();
        inCodeBlock = true;
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Markdown Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      flushBlockquote();
      const parts = line.split('|').slice(1, -1);
      // Skip delimiter row e.g. |---|---|
      if (parts.every(p => /^[\s\-:]+$/.test(p))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = parts;
      } else {
        tableRows.push(parts);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      flushList();
      inBlockquote = true;
      quoteBuffer.push(line.trim().replace(/^>\s*/, ''));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Lists
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);

    if (ulMatch || olMatch) {
      const isOl = Boolean(olMatch);
      const text = ulMatch ? ulMatch[2] : olMatch![2];

      if (!inList) {
        inList = true;
        isOrderedList = isOl;
        listItems = [text];
      } else {
        listItems.push(text);
      }
      continue;
    } else if (inList) {
      flushList();
    }

    // Empty lines
    if (!line.trim()) {
      continue;
    }

    // Horizontal Rule
    if (/^(\*\*\*|---|___)$/.test(line.trim())) {
      elements.push(<hr key={`hr-${elements.length}`} className="my-8 border-slate-200" />);
      continue;
    }

    // Headings
    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      const headingText = h2Match[1];
      const headingId = headingText.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-');
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          id={headingId}
          className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-10 mb-4 font-bangla scroll-mt-24 border-b border-slate-100 pb-2"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(headingText) }}
        />
      );
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) {
      const headingText = h3Match[1];
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-xl sm:text-2xl font-bold text-slate-900 mt-6 mb-3 font-bangla"
          dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(headingText) }}
        />
      );
      continue;
    }

    // Standard Paragraph
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-4 text-base sm:text-lg text-slate-700 leading-relaxed font-bangla"
        dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(line) }}
      />
    );
  }

  flushCodeBlock();
  flushTable();
  flushList();
  flushBlockquote();

  return <div className="blog-content font-bangla">{elements}</div>;
}
