'use client';

import React from 'react';

interface CandidatePopupProps {
  candidates: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onSelectCandidate: (candidate: string) => void;
  position?: { top?: number; left?: number; bottom?: number; right?: number } | null;
  className?: string;
  showShortcutsHint?: boolean;
}

export default function CandidatePopup({
  candidates,
  selectedIndex,
  onSelectIndex,
  onSelectCandidate,
  position,
  className = '',
  showShortcutsHint = true,
}: CandidatePopupProps) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div
      className={`z-50 select-none animate-in fade-in zoom-in-95 duration-100 ${className}`}
      style={
        position
          ? {
              position: 'absolute',
              top: position.top !== undefined ? `${position.top}px` : undefined,
              left: position.left !== undefined ? `${position.left}px` : undefined,
              bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
              right: position.right !== undefined ? `${position.right}px` : undefined,
            }
          : undefined
      }
      onMouseDown={e => {
        // Prevent losing focus from the input/textarea
        e.preventDefault();
      }}
    >
      <div className="bg-[#0B2217]/95 backdrop-blur-xl border border-[#2D6A4F]/80 rounded-xl sm:rounded-2xl shadow-2xl shadow-emerald-950/40 p-1.5 sm:p-2 min-w-[160px] sm:min-w-[190px] max-w-[280px] text-white">
        {/* Candidate List Header / Count */}
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-emerald-900/50 text-[10px] sm:text-xs text-emerald-300/80 font-mono">
          <span className="font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            সাজেশন (Suggestions)
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200">
            {selectedIndex + 1}/{candidates.length}
          </span>
        </div>

        {/* Candidate rows */}
        <div className="flex flex-col gap-0.5">
          {candidates.map((cand, idx) => {
            const isSelected = idx === selectedIndex;
            const isLastRaw = idx === candidates.length - 1 && /^[a-zA-Z0-9`^:$~]+$/.test(cand);
            const shortcutNum = idx < 9 ? idx + 1 : null;

            return (
              <button
                key={`${cand}-${idx}`}
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectIndex(idx);
                  onSelectCandidate(cand);
                }}
                onMouseEnter={() => {
                  onSelectIndex(idx);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/40 scale-[1.01]'
                    : isLastRaw
                    ? 'text-emerald-300 font-mono hover:bg-emerald-900/40 text-xs'
                    : 'text-slate-100 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {shortcutNum && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1 py-0.2 rounded ${
                        isSelected
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-emerald-950/70 text-emerald-400'
                      }`}
                    >
                      {shortcutNum}
                    </span>
                  )}
                  <span
                    className={`truncate ${
                      isLastRaw ? 'font-mono' : 'font-bangla tracking-wide text-[15px]'
                    }`}
                  >
                    {cand}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono text-emerald-200/90 ml-2">↵</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom shortcut instructions */}
        {showShortcutsHint && (
          <div className="mt-1.5 pt-1.5 border-t border-emerald-900/40 flex items-center justify-between text-[10px] text-emerald-300/70 font-mono px-1">
            <span>[Space/↵] সিলেক্ট</span>
            <span>[↑↓] পরিবর্তন</span>
          </div>
        )}
      </div>
    </div>
  );
}
