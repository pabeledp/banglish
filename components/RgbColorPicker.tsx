'use client';

import React, { useState, useEffect } from 'react';

interface RgbColorPickerProps {
  label: string;
  value: string; // e.g. '#10b981' or 'rgb(16, 185, 129)'
  onChange: (color: string) => void;
  className?: string;
}

// Convert any hex or rgb string to { r, g, b }
function parseColorToRgb(color: string): { r: number; g: number; b: number; hex: string } {
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

  // Fallback default
  return { r: 16, g: 185, b: 129, hex: '#10b981' };
}

const PRESET_SWATCHES = [
  '#ffffff', // White
  '#000000', // Black
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber/Gold
  '#ef4444', // Red
  '#f97316', // Orange
  '#64748b', // Slate
  '#22c55e', // Green
];

export default function RgbColorPicker({
  label,
  value,
  onChange,
  className = ''
}: RgbColorPickerProps) {
  const [rgb, setRgb] = useState(() => parseColorToRgb(value));
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setRgb(parseColorToRgb(value));
  }, [value]);

  const updateFromRgb = (r: number, g: number, b: number) => {
    const clampedR = Math.max(0, Math.min(255, r));
    const clampedG = Math.max(0, Math.min(255, g));
    const clampedB = Math.max(0, Math.min(255, b));
    const hex = '#' + ((1 << 24) + (clampedR << 16) + (clampedG << 8) + clampedB).toString(16).slice(1);
    setRgb({ r: clampedR, g: clampedG, b: clampedB, hex });
    onChange(hex);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
      setRgb(parseColorToRgb(val));
      onChange(val);
    } else {
      onChange(val);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header with Color Preview & Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-mono text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 transition-colors"
        >
          <span>{rgb.hex.toUpperCase()}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
            {isExpanded ? 'লুকান ▲' : 'RGB স্লাইডার ▼'}
          </span>
        </button>
      </div>

      {/* Quick Visual Bar */}
      <div className="flex items-center gap-2.5">
        {/* Native Browser Visual Color Input */}
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border-2 border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer hover:scale-105 transition-transform">
          <input
            type="color"
            value={rgb.hex}
            onChange={(e) => {
              const parsed = parseColorToRgb(e.target.value);
              setRgb(parsed);
              onChange(parsed.hex);
            }}
            className="absolute -inset-2 w-14 h-14 cursor-pointer opacity-0"
          />
          <div
            className="w-full h-full"
            style={{ backgroundColor: rgb.hex }}
          />
        </div>

        {/* Quick Swatches */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {PRESET_SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => {
                const parsed = parseColorToRgb(swatch);
                setRgb(parsed);
                onChange(swatch);
              }}
              style={{ backgroundColor: swatch }}
              title={swatch}
              className={`w-6 h-6 rounded-lg border transition-all ${
                rgb.hex.toLowerCase() === swatch.toLowerCase()
                  ? 'ring-2 ring-emerald-500 scale-110 shadow-sm border-white'
                  : 'border-slate-300/80 dark:border-slate-700 hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Expanded Detailed RGB Sliders & Hex Input */}
      {isExpanded && (
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in duration-150">
          {/* Hex Input */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-slate-500">HEX Code:</span>
            <input
              type="text"
              value={rgb.hex}
              onChange={handleHexChange}
              placeholder="#10b981"
              maxLength={7}
              className="w-28 px-2 py-1 text-xs font-mono uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Red Slider */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span className="text-red-500 font-semibold">Red (R)</span>
              <span>{rgb.r}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.r}
              onChange={(e) => updateFromRgb(parseInt(e.target.value, 10), rgb.g, rgb.b)}
              className="w-full h-1.5 bg-red-100 dark:bg-red-950/40 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

          {/* Green Slider */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span className="text-emerald-500 font-semibold">Green (G)</span>
              <span>{rgb.g}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.g}
              onChange={(e) => updateFromRgb(rgb.r, parseInt(e.target.value, 10), rgb.b)}
              className="w-full h-1.5 bg-emerald-100 dark:bg-emerald-950/40 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Blue Slider */}
          <div className="space-y-0.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span className="text-blue-500 font-semibold">Blue (B)</span>
              <span>{rgb.b}</span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              value={rgb.b}
              onChange={(e) => updateFromRgb(rgb.r, rgb.g, parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-blue-100 dark:bg-blue-950/40 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
