'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-xs text-white animate-in slide-in-from-bottom-5 fade-in duration-200">
      {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
      {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
      {type === 'info' && <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />}
      
      <span className="font-sans font-medium pr-1">{message}</span>
      
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
