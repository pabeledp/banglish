'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ClearConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: ClearConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl bg-gray-900/95 border border-gray-700/80 p-6 shadow-2xl shadow-black/80 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-amber-400">
            <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-800/60">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white font-sans">ক্যানভাস খালি করবেন?</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 font-bangla leading-relaxed">
          বর্তমান ট্যাবের সমস্ত কনটেন্ট মুছে যাবে। তবে আপনার অন্যান্য ট্যাবের ডাটা সম্পূর্ণ নিরাপদ থাকবে। আপনি কি নিশ্চিত?
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
          >
            বাতিল করুন
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30 transition-all"
          >
            হ্যাঁ, খালি করুন
          </button>
        </div>
      </div>
    </div>
  );
}
