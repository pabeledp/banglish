'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AudioPlayer() {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const LOW_DB_VOLUME = 0.16;

  // Do not render or play song on pastebin or text-to-png-converter workspace pages
  const isExcluded = 
    pathname?.startsWith('/pastebin') || 
    pathname?.startsWith('/paste-bin') ||
    pathname?.toLowerCase().includes('text-to-png-converter') ||
    pathname?.toLowerCase().includes('texttopngconverter');

  useEffect(() => {
    if (isExcluded && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isExcluded]);

  useEffect(() => {
    if (isExcluded) return;

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
  }, [isPlaying, isExcluded]);

  const togglePlay = () => {
    if (!audioRef.current || isExcluded) return;
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

  if (isExcluded) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} preload="auto" loop src="/assets/ami-banglay-gan-gai.m4a" />

      <aside id="floating-actions-container" aria-label="Quick Support & Audio" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 select-none">
        {/* Floating WhatsApp Support Agent Button */}
        <a 
          id="whatsapp-assistant-btn"
          href="/support"
          target="_blank" 
          rel="noopener noreferrer"
          className="hover-card group flex items-center justify-center w-12 h-12 sm:w-auto sm:h-auto p-0 sm:px-3.5 sm:py-2.5 rounded-full sm:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-950/20 hover:from-emerald-400 hover:to-teal-500 hover:shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none cursor-pointer border border-emerald-300/40"
          title="WhatsApp এ আমাদের সাপোর্ট এজেন্টের সাথে কথা বলুন (+880 1795-020192)"
          aria-label="Chat with Banglish Support Agent on WhatsApp"
        >
          {/* WhatsApp Official SVG Icon */}
          <div className="flex items-center justify-center flex-shrink-0 text-white">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.589 1.771.913 2.796.913h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.467-4.444 9.912-9.969 9.912-1.744 0-3.376-.454-4.802-1.246l-5.229 1.396 1.42-5.093c-.886-1.488-1.389-3.228-1.389-5.069 0-5.467 4.444-9.912 9.969-9.912 5.467 0 9.969 4.445 9.969 9.912zm-5.727 3.421c-.139-.232-.511-.371-1.069-.649-.557-.279-3.295-1.625-3.806-1.81-.511-.186-.882-.279-1.254.279-.371.557-1.439 1.81-1.764 2.181-.325.371-.65.418-1.208.139-.557-.279-2.353-.868-4.482-2.766-1.657-1.478-2.775-3.303-3.1-3.861-.325-.557-.035-.858.244-1.136.251-.25.557-.65.836-.975.279-.325.371-.557.557-.929.186-.371.093-.697-.046-.975-.139-.279-1.254-3.018-1.718-4.132-.452-1.085-.911-.938-1.254-.955-.325-.016-.697-.02-.1069-.02-.371 0-.975.139-1.486.697-.511.557-1.95 1.904-1.95 4.644 0 2.74 1.996 5.387 2.275 5.758.279.371 3.928 6.001 9.516 8.414 1.329.574 2.367.917 3.176 1.173 1.335.424 2.55.364 3.511.221 1.072-.16 3.295-1.347 3.76-2.647.464-1.301.464-2.415.325-2.647z"/>
            </svg>
          </div>

          {/* Desktop Only: Badge and Text */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 pr-0.5 text-left">
            <span className="text-xs font-bold font-sans tracking-wide leading-none">
              Support Agent
            </span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          </div>
        </a>

        {/* Background Music Player */}
        <button 
          id="audio-master-btn" 
          type="button" 
          onClick={togglePlay}
          className="hidden sm:flex hover-card group items-center justify-center p-0 sm:px-3.5 sm:py-2.5 rounded-full sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-lg shadow-emerald-950/10 hover:border-emerald-400 focus:outline-none transition-all active:scale-95 cursor-pointer text-slate-800"
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
          <div className="flex items-center gap-2 pl-2 text-left">
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
