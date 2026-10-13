'use client';

import React, { useState, useEffect, useRef } from 'react';
import { transliterateText } from '@/lib/phoneticEngine';
import { getPhoneticCandidates } from '@/lib/banglishDictionary';

export function transliteratePhonetic(text: string): string {
  if (!text) return '';
  return transliterateText(text);
}

const demoPhrases = [
  'amra banglay gan gai',
  'valobasa shobar jonno',
  'bangladesh shundor desh',
  'ami banglay gan gai'
];

export default function Simulator() {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAutoDemoRunning, setIsAutoDemoRunning] = useState(true);
  const [statusText, setStatusText] = useState('স্বয়ংক্রিয় টাইপিং ডেমো চলছে...');
  const [isUserActive, setIsUserActive] = useState(false);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const autoDemoTimer = useRef<NodeJS.Timeout | null>(null);
  const phraseIndexRef = useRef(0);

  // Compute active word token being typed
  const activeMatch = inputText.match(/[a-zA-Z0-9`^:$~]+$/);
  const activeToken = activeMatch ? activeMatch[0] : '';
  const candidates = activeToken ? getPhoneticCandidates(activeToken) : [];

  // Auto-demo typing loop
  useEffect(() => {
    if (!isAutoDemoRunning || isUserActive) return;

    let charIndex = 0;
    const targetPhrase = demoPhrases[phraseIndexRef.current % demoPhrases.length];
    setInputText('');

    const interval = setInterval(() => {
      if (charIndex <= targetPhrase.length) {
        setInputText(targetPhrase.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        autoDemoTimer.current = setTimeout(() => {
          phraseIndexRef.current++;
          // Trigger next phrase
          setInputText('');
        }, 2000);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (autoDemoTimer.current) clearTimeout(autoDemoTimer.current);
    };
  }, [isAutoDemoRunning, isUserActive, phraseIndexRef.current]);

  const userTakeOver = () => {
    setIsUserActive(true);
    setIsAutoDemoRunning(false);
    if (autoDemoTimer.current) clearTimeout(autoDemoTimer.current);
    setStatusText('✨ চমৎকার! এখন নিজের ইচ্ছেমতো শব্দ টাইপ করুন');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    userTakeOver();
    setInputText(e.target.value);
    setSelectedCandidateIndex(0);
  };

  const selectCandidate = (cand: string) => {
    userTakeOver();
    if (!activeToken) return;
    const tokenStart = inputText.length - activeToken.length;
    const nextText = inputText.slice(0, tokenStart) + cand + ' ';
    setInputText(nextText);
    setSelectedCandidateIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (candidates.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCandidateIndex(prev => (prev + 1) % candidates.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCandidateIndex(prev => (prev - 1 + candidates.length) % candidates.length);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        selectCandidate(candidates[selectedCandidateIndex]);
        return;
      }
      if (/^[1-9]$/.test(e.key) && (e.altKey || e.ctrlKey)) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= candidates.length) {
          e.preventDefault();
          selectCandidate(candidates[num - 1]);
          return;
        }
      }
    }
  };

  const handleClear = () => {
    userTakeOver();
    setInputText('');
    inputRef.current?.focus();
  };

  const handleCopy = async () => {
    const output = transliteratePhonetic(inputText);
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAutoDemo = () => {
    if (isAutoDemoRunning) {
      setIsAutoDemoRunning(false);
      setStatusText('ডেমো পজ করা হয়েছে। নিচে টাইপ করুন');
    } else {
      setIsUserActive(false);
      setIsAutoDemoRunning(true);
      setStatusText('স্বয়ংক্রিয় টাইপিং ডেমো চলছে...');
    }
  };

  const outputText = transliteratePhonetic(inputText);

  return (
    <div id="simulator" className="mt-12 sm:mt-16 max-w-4xl mx-auto">
      <div className="hover-card relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-emerald-950/10 overflow-hidden">
        
        {/* Terminal Header */}
        <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
          </div>
          <span className="text-xs font-medium text-slate-500 font-mono">Banglish Interactive Simulator</span>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Swift 6.0</span>
        </div>

        {/* Simulator Body */}
        <div className="p-4 sm:p-7 md:p-8 space-y-6">

          {/* Input & Output Dual Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            
            {/* English Phonetic Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="phonetic-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  English Phonetic (Input)
                </label>
                <button 
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors font-bangla cursor-pointer"
                >
                  পরিষ্কার করুন
                </button>
              </div>
              <div className="relative">
                <input 
                  ref={inputRef}
                  type="text" 
                  id="phonetic-input" 
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={userTakeOver}
                  placeholder="Type in English (e.g. amra)..." 
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50/90 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-mono text-sm sm:text-base text-slate-800 transition-all"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-3.5 text-xs text-slate-400 pointer-events-none font-mono">
                  abc
                </div>
              </div>

              {/* Real-time Phonetic Suggestion Pills */}
              {candidates.length > 0 && (
                <div className="pt-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 flex-wrap bg-emerald-950/5 border border-emerald-800/15 p-2 rounded-xl">
                    <span className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center gap-1 mr-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      সাজেশন:
                    </span>
                    {candidates.map((cand, idx) => {
                      const isSelected = idx === selectedCandidateIndex;
                      return (
                        <button
                          key={`${cand}-${idx}`}
                          type="button"
                          onClick={() => selectCandidate(cand)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bangla transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-700/20 ring-1 ring-emerald-500 scale-[1.02]'
                              : 'bg-white hover:bg-emerald-50 text-emerald-950 border border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <span className={`font-mono text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {idx + 1}.
                          </span>
                          <span className="text-[13px]">{cand}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Live Bangla Transliterated Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Banglish Output (বাংলা আউটপুট)
                </span>
                <button 
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex items-center gap-1 text-xs font-medium font-bangla transition-colors cursor-pointer ${copied ? 'text-emerald-700 font-bold' : 'text-emerald-600 hover:text-emerald-700'}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                </button>
              </div>
              <div className="relative min-h-[58px] px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-200/90 flex items-center">
                <div id="bangla-output" className="text-lg sm:text-2xl font-bold font-bangla text-emerald-950 tracking-wide select-all break-words pr-2 min-h-[1.75rem]">
                  {outputText}
                </div>
              </div>
            </div>

          </div>

          {/* Typewriter Simulation Controls & Live Auto-Demo */}
          <div className="pt-3 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-xs text-slate-600 bg-slate-50/90 rounded-xl p-3 sm:p-4 border border-slate-200/80 text-center">
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 w-full md:w-auto text-center">
              <button 
                type="button" 
                onClick={() => {
                  userTakeOver();
                  setInputText('');
                  inputRef.current?.focus();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-emerald-600/20 active:scale-95 transition-all font-bangla text-center cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                <span>নিজে একবার ট্রাই করুন</span>
              </button>

              <button 
                type="button" 
                onClick={toggleAutoDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium text-xs transition-all active:scale-95 font-bangla text-center cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  {isAutoDemoRunning ? (
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  )}
                </svg>
                <span>{isAutoDemoRunning ? 'অটো ডেমো পজ করুন' : 'অটো ডেমো পুনরায় চালান'}</span>
              </button>
            </div>

            <div className={`flex items-center justify-center mx-auto md:mx-0 gap-2 font-bangla text-xs px-3.5 py-1.5 rounded-lg border text-center ${isAutoDemoRunning ? 'text-emerald-800 bg-emerald-100/70 border-emerald-200' : 'text-slate-700 bg-slate-100 border-slate-200'}`}>
              {isAutoDemoRunning && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
              <span>{statusText}</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
