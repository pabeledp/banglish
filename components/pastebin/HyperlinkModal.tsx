'use client';

import React, { useState, useEffect } from 'react';
import { Link2, X, ExternalLink } from 'lucide-react';

interface HyperlinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text?: string) => void;
  initialText?: string;
}

export default function HyperlinkModal({
  isOpen,
  onClose,
  onInsert,
  initialText = '',
}: HyperlinkModalProps) {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setLinkText(initialText || '');
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedUrl = url.trim();
    if (!formattedUrl) return;

    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/') && !formattedUrl.startsWith('#')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onInsert(formattedUrl, linkText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl shadow-slate-900/15 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">হাইপারলিংক যুক্ত করুন</h3>
              <p className="text-xs text-slate-500 font-bangla">ওয়েব এড্রেস বা লিঙ্ক পেস্ট করুন</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
              Link URL (ওয়েব লিংক) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com বা banglish.bd"
                autoFocus
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none transition-all font-sans"
              />
              <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
              Display Text (প্রদর্শিত টেক্সট - ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={linkText}
              onChange={e => setLinkText(e.target.value)}
              placeholder="যেমন: বিস্তারিত দেখুন"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white text-slate-900 text-xs sm:text-sm outline-none transition-all font-bangla"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors font-bangla cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all font-bangla cursor-pointer"
            >
              লিঙ্ক যুক্ত করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
