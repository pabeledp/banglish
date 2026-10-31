'use client';

import React, { useEffect, useState } from 'react';

interface DownloadCounts {
  mac: number;
  windows: number;
  total: number;
}

const DEFAULT_COUNTS: DownloadCounts = {
  mac: 467,
  windows: 225,
  total: 692,
};

export default function DownloadCounterBar() {
  const [counts, setCounts] = useState<DownloadCounts>(DEFAULT_COUNTS);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // 1. Load from localStorage if present for immediate display
    try {
      const saved = localStorage.getItem('banglish_dl_counts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.mac && parsed?.windows) {
          setCounts(parsed);
        }
      }
    } catch (e) {}

    // 2. Fetch fresh stats from API (with trailing slash for next.config compatibility)
    fetch('/api/download-stats/')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const fresh = {
            mac: data.mac || DEFAULT_COUNTS.mac,
            windows: data.windows || DEFAULT_COUNTS.windows,
            total: (data.mac || DEFAULT_COUNTS.mac) + (data.windows || DEFAULT_COUNTS.windows),
          };
          setCounts(fresh);
          localStorage.setItem('banglish_dl_counts', JSON.stringify(fresh));
          setHasAnimated(true);
        }
      })
      .catch(() => {});

    // 3. Listen to custom event when someone clicks download on page
    const handleDownloadEvent = (e: CustomEvent<{ os: 'mac' | 'windows' }>) => {
      const os = e.detail?.os;
      if (!os) return;
      setCounts(prev => {
        const next = {
          ...prev,
          [os]: prev[os] + 1,
          total: prev.total + 1,
        };
        localStorage.setItem('banglish_dl_counts', JSON.stringify(next));
        return next;
      });
    };

    window.addEventListener('banglish:download' as any, handleDownloadEvent);
    return () => {
      window.removeEventListener('banglish:download' as any, handleDownloadEvent);
    };
  }, []);

  return (
    <div className="pt-3.5 max-w-xl mx-auto px-2">
      <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-sm hover:border-emerald-200 transition-all text-xs text-slate-700">
        
        {/* Pulsing indicator with active user count */}
        <div className="flex items-center gap-1.5 font-bangla font-semibold text-slate-900">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            ইতিমধ্যে <strong className="font-mono text-emerald-700 font-bold text-xs sm:text-sm">{counts.total.toLocaleString()}</strong> জনেরও বেশি ব্যবহারকারী
          </span>
        </div>

        <span className="hidden sm:inline text-slate-300">|</span>

        {/* Mac Count Pill */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50/80 border border-emerald-200/60 font-sans text-[11px] font-medium text-emerald-900">
          <svg className="w-3 h-3 fill-current text-slate-800" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.87-20.02-14.33-32-3.46-11.98-5.19-23.27-5.19-33.86 0-14.58 3.7-26.68 11.1-36.29 7.4-9.61 16.65-14.53 27.75-14.75 4.35 0 9.29 1.15 14.81 3.46 5.53 2.31 9.38 3.52 11.55 3.63 1.74 0 5.86-1.32 12.38-3.95 6.52-2.63 12.06-3.72 16.62-3.27 12.63.87 22.65 5.76 30.06 14.67-10.89 6.64-16.22 15.77-16 27.42.22 9.14 3.69 16.75 10.42 22.84 6.74 6.09 14.77 9.58 24.1 10.45-2.18 6.53-4.79 13.06-7.83 19.59zM119.22 31.84c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.75-10.51 19.59-11.97.22 1.09.33 2.07.33 2.94 0 7.39-2.72 14.46-8.16 21.21-5.44 6.74-12.18 10.76-20.24 12.06-.22-1.09-.35-2.2-.35-3.37z" />
          </svg>
          <span className="font-semibold">Mac:</span>
          <span className="font-mono font-bold text-emerald-700">{counts.mac.toLocaleString()}</span>
        </div>

        {/* Windows Count Pill */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50/80 border border-sky-200/60 font-sans text-[11px] font-medium text-sky-900">
          <svg className="w-2.5 h-2.5 fill-current text-sky-600" viewBox="0 0 88 88">
            <path d="M0 12.402l35.689-4.86.016 34.423-35.67.203zm35.67 33.529l.026 34.453L0 75.481l.035-29.327zm4.326-39.027L87.914 0v41.527l-47.918.378zm47.919 38.928l-.005 41.79-47.914-6.745-.031-34.793z" />
          </svg>
          <span className="font-semibold">Win:</span>
          <span className="font-mono font-bold text-sky-700">{counts.windows.toLocaleString()}</span>
        </div>

      </div>
    </div>
  );
}

// Global helper to trigger tracking and counter increment
export function trackSoftwareDownload(os: 'mac' | 'windows') {
  try {
    // 1. Dispatch custom event for immediate UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('banglish:download', { detail: { os } }));
    }

    // 2. Call backend route
    fetch('/api/download-stats/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ os }),
    }).catch(() => {});
  } catch (e) {}
}
