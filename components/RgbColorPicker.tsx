'use client';

import React, { useState, useEffect } from 'react';

interface RgbColorPickerProps {
  label: string;
  value: string; // e.g. '#10b981' or 'rgb(16, 185, 129)'
  onChange: (color: string) => void;
  className?: string;
  showRgbBadge?: boolean;
}

// Convert any hex or rgb string to { r, g, b, hex }
export function parseColorToRgb(color: string): { r: number; g: number; b: number; hex: string } {
  if (!color) return { r: 16, g: 185, b: 129, hex: '#10b981' };

  if (color.startsWith('#')) {
    let hex = color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    if (!isNaN(num) && hex.length === 6) {
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
        hex: '#' + hex.toLowerCase()
      };
    }
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return { r, g, b, hex };
  }

  return { r: 16, g: 185, b: 129, hex: '#10b981' };
}

export default function RgbColorPicker({
  label,
  value,
  onChange,
  className = '',
  showRgbBadge = false
}: RgbColorPickerProps) {
  const [rgb, setRgb] = useState(() => parseColorToRgb(value));

  useEffect(() => {
    setRgb(parseColorToRgb(value));
  }, [value]);

  const updateRgb = (newR: number, newG: number, newB: number) => {
    const r = Math.max(0, Math.min(255, isNaN(newR) ? 0 : newR));
    const g = Math.max(0, Math.min(255, isNaN(newG) ? 0 : newG));
    const b = Math.max(0, Math.min(255, isNaN(newB) ? 0 : newB));
    const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    setRgb({ r, g, b, hex });
    onChange(hex);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
      setRgb(parseColorToRgb(val));
      onChange(val);
    } else if (!val.startsWith('#') && (val.length === 3 || val.length === 6)) {
      const withHash = '#' + val;
      setRgb(parseColorToRgb(withHash));
      onChange(withHash);
    }
  };

  return (
    <div className={`space-y-2.5 p-3 rounded-2xl bg-white border border-emerald-100/90 shadow-sm ${className}`}>
      {/* Header with Visual Preview */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rgb.hex }}></span>
          <span>{label}</span>
        </label>
        {showRgbBadge && (
          <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </span>
        )}
      </div>

      {/* Visual Color Bar + HEX Input */}
      <div className="flex items-center gap-2.5">
        {/* Clickable Color Well */}
        <div className="relative w-11 h-9 rounded-xl overflow-hidden shadow-inner border border-slate-300 shrink-0 cursor-pointer hover:scale-105 transition-transform" title="ক্লিক করে কালার পিকার ওপেন করুন">
          <input
            type="color"
            value={rgb.hex}
            onChange={(e) => {
              const parsed = parseColorToRgb(e.target.value);
              setRgb(parsed);
              onChange(parsed.hex);
            }}
            className="absolute -inset-4 w-20 h-20 cursor-pointer opacity-0"
          />
          <div className="w-full h-full" style={{ backgroundColor: rgb.hex }} />
        </div>

        {/* Hex Input */}
        <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-500">
          <span className="text-xs text-slate-400 font-mono select-none">HEX:</span>
          <input
            type="text"
            value={rgb.hex}
            onChange={handleHexInput}
            maxLength={7}
            className="w-full ml-1.5 text-xs font-mono font-bold text-slate-800 bg-transparent focus:outline-none uppercase"
            placeholder="#10B981"
          />
        </div>
      </div>

      {/* Direct R, G, B Sliders & Number Controls */}
      <div className="space-y-1.5 pt-1">
        {/* Red (R) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-rose-600 w-4">R</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => updateRgb(parseInt(e.target.value, 10), rgb.g, rgb.b)}
            className="flex-1 h-1.5 bg-rose-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => updateRgb(parseInt(e.target.value, 10), rgb.g, rgb.b)}
            className="w-12 px-1.5 py-0.5 text-[11px] font-mono text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
          />
        </div>

        {/* Green (G) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-emerald-600 w-4">G</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => updateRgb(rgb.r, parseInt(e.target.value, 10), rgb.b)}
            className="flex-1 h-1.5 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => updateRgb(rgb.r, parseInt(e.target.value, 10), rgb.b)}
            className="w-12 px-1.5 py-0.5 text-[11px] font-mono text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
          />
        </div>

        {/* Blue (B) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-blue-600 w-4">B</span>
          <input
            type="range"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => updateRgb(rgb.r, rgb.g, parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => updateRgb(rgb.r, rgb.g, parseInt(e.target.value, 10))}
            className="w-12 px-1.5 py-0.5 text-[11px] font-mono text-center bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
          />
        </div>
      </div>
    </div>
  );
}
