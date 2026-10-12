'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const LOW_DB_VOLUME = 0.16;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = LOW_DB_VOLUME;
    }

    // Spacebar listener (only when not typing in input/textarea/editable)
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        (activeEl as HTMLElement).isContentEditable
      );

      if ((e.code === 'Space' || e.key === ' ' || e.keyCode === 32) && !isInputActive) {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.volume = LOW_DB_VOLUME;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} preload="auto" loop src="/assets/ami-banglay-gan-gai.m4a" />

      <aside id="bg-audio-container" aria-label="Background Music Player" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
        <button 
          id="audio-master-btn" 
          type="button" 
          onClick={togglePlay}
          className="hover-card group flex items-center justify-center w-11 h-11 sm:w-auto sm:h-auto p-0 sm:px-3.5 sm:py-2.5 rounded-full sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-lg shadow-emerald-950/10 hover:border-emerald-400 focus:outline-none transition-all active:scale-95 cursor-pointer text-slate-800"
          title={isPlaying ? "পজ করুন (Space = Pause)" : "আমি বাংলায় গান গাই • Play / Pause (Space)"}
          aria-label="Play or Pause Background Music"
        >
          {/* Play & Pause Icon */}
          <div className="flex items-center justify-center text-emerald-600 group-hover:text-emerald-700 transition-colors flex-shrink-0">
            {isPlaying ? (
              <svg className="w-4 h-4 fill-current text-emerald-600" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current text-slate-700 ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>

          {/* Desktop Only: Compact Title with Animated Equalizer */}
          <div className="hidden sm:flex items-center gap-2 pl-2 text-left">
            <span className="text-xs font-semibold text-slate-800 font-bangla whitespace-nowrap leading-none">আমি বাংলায় গান গাই</span>
            
            {/* Equalizer Wave Bars */}
            <div className={`flex items-end gap-0.5 h-3.5 px-0.5 ${isPlaying ? '' : 'eq-paused'}`}>
              <span className="w-0.5 bg-emerald-500 rounded-full eq-bar-1"></span>
              <span className="w-0.5 bg-emerald-500 rounded-full eq-bar-2"></span>
              <span className="w-0.5 bg-emerald-500 rounded-full eq-bar-3"></span>
              <span className="w-0.5 bg-emerald-500 rounded-full eq-bar-4"></span>
            </div>

            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">Space</span>
          </div>
        </button>
      </aside>
    </>
  );
}
