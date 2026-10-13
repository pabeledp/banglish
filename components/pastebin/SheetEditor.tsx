'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SheetData, FontFamilyOption } from '@/lib/pastebinTypes';
import { Download, Plus } from 'lucide-react';
import { transliterateText, transliterateWord } from '@/lib/phoneticEngine';

interface SheetEditorProps {
  sheetData: SheetData;
  onChange: (data: SheetData) => void;
  font: FontFamilyOption;
  fontSize: number;
  phoneticActive: boolean;
  onActiveCellChange?: (cellCoord: string, selectedRange?: string[]) => void;
}

export default function SheetEditor({
  sheetData,
  onChange,
  font,
  fontSize,
  phoneticActive,
  onActiveCellChange,
}: SheetEditorProps) {
  const [selectedCell, setSelectedCell] = useState<string>('A1');
  const [selectionRange, setSelectionRange] = useState<{ start: string; end: string }>({ start: 'A1', end: 'A1' });
  const isDraggingRef = useRef(false);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const activeSheetBufferRef = useRef<string>('');
  const lastSheetReplacedLenRef = useRef<number>(0);

  const resetSheetBuffer = () => {
    activeSheetBufferRef.current = '';
    lastSheetReplacedLenRef.current = 0;
  };

  const numCols = sheetData.cols || 8;
  const numRows = sheetData.rows || 15;

  const colHeaders = useMemo(() => {
    const headers: string[] = [];
    for (let i = 0; i < numCols; i++) {
      let label = '';
      let n = i;
      while (n >= 0) {
        label = String.fromCharCode(65 + (n % 26)) + label;
        n = Math.floor(n / 26) - 1;
      }
      headers.push(label);
    }
    return headers;
  }, [numCols]);

  const evaluateCell = (cellKey: string, rawVal: string, visited: Set<string> = new Set()): string => {
    if (!rawVal || typeof rawVal !== 'string') return '';
    if (!rawVal.startsWith('=')) return rawVal;

    if (visited.has(cellKey)) return '#CIRCULAR!';
    visited.add(cellKey);

    const expr = rawVal.slice(1).trim();

    try {
      const sumMatch = expr.match(/^SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (sumMatch) {
        const rangeCells = getRangeCells(sumMatch[1].toUpperCase(), sumMatch[2].toUpperCase());
        const sum = rangeCells.reduce((acc, c) => {
          const val = parseFloat(evaluateCell(c, sheetData.cells[c] || '', new Set(visited)));
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        return String(sum);
      }

      const avgMatch = expr.match(/^(?:AVERAGE|AVG)\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (avgMatch) {
        const rangeCells = getRangeCells(avgMatch[1].toUpperCase(), avgMatch[2].toUpperCase());
        let count = 0;
        const sum = rangeCells.reduce((acc, c) => {
          const val = parseFloat(evaluateCell(c, sheetData.cells[c] || '', new Set(visited)));
          if (!isNaN(val)) {
            count++;
            return acc + val;
          }
          return acc;
        }, 0);
        return count > 0 ? (sum / count).toFixed(2) : '0';
      }

      const countMatch = expr.match(/^COUNT\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (countMatch) {
        const rangeCells = getRangeCells(countMatch[1].toUpperCase(), countMatch[2].toUpperCase());
        const count = rangeCells.filter(c => {
          const val = parseFloat(evaluateCell(c, sheetData.cells[c] || '', new Set(visited)));
          return !isNaN(val);
        }).length;
        return String(count);
      }

      let parsedExpr = expr.replace(/([A-Z]+[0-9]+)/gi, (match) => {
        const refKey = match.toUpperCase();
        const refVal = parseFloat(evaluateCell(refKey, sheetData.cells[refKey] || '', new Set(visited)));
        return isNaN(refVal) ? '0' : String(refVal);
      });

      if (/^[0-9+\-*/().\s]+$/.test(parsedExpr)) {
        // eslint-disable-next-line no-eval
        const result = Function(`"use strict"; return (${parsedExpr})`)();
        return typeof result === 'number' ? (Number.isInteger(result) ? String(result) : result.toFixed(2)) : String(result);
      }

      return '#VALUE!';
    } catch {
      return '#ERROR!';
    }
  };

  const getRangeCells = (start: string, end: string): string[] => {
    const startColMatch = start.match(/([A-Z]+)/);
    const startRowMatch = start.match(/([0-9]+)/);
    const endColMatch = end.match(/([A-Z]+)/);
    const endRowMatch = end.match(/([0-9]+)/);

    if (!startColMatch || !startRowMatch || !endColMatch || !endRowMatch) return [];

    const startColIdx = colHeaders.indexOf(startColMatch[1]);
    const endColIdx = colHeaders.indexOf(endColMatch[1]);
    const startRow = parseInt(startRowMatch[1], 10);
    const endRow = parseInt(endRowMatch[1], 10);

    const cells: string[] = [];
    const minCol = Math.min(startColIdx, endColIdx);
    const maxCol = Math.max(startColIdx, endColIdx);
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        cells.push(`${colHeaders[c]}${r}`);
      }
    }
    return cells;
  };

  const selectedCellsSet = useMemo(() => {
    return new Set(getRangeCells(selectionRange.start, selectionRange.end));
  }, [selectionRange, colHeaders]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        if (onActiveCellChange) {
          const cells = getRangeCells(selectionRange.start, selectionRange.end);
          onActiveCellChange(selectedCell, cells);
        }
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [selectionRange, selectedCell, onActiveCellChange]);

  const handleCellMouseDown = (cellCoord: string, e: React.MouseEvent) => {
    if (editingCell) return;
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    setSelectedCell(cellCoord);
    setSelectionRange({ start: cellCoord, end: cellCoord });
    onActiveCellChange?.(cellCoord, [cellCoord]);
  };

  const handleCellMouseEnter = (cellCoord: string) => {
    if (isDraggingRef.current && !editingCell) {
      setSelectionRange(prev => ({ ...prev, end: cellCoord }));
    }
  };

  const handleCellDoubleClick = (cellCoord: string) => {
    setEditingCell(cellCoord);
    setEditValue(sheetData.cells[cellCoord] || '');
  };

  const commitCellEdit = () => {
    if (!editingCell) return;

    let finalVal = editValue;
    if (phoneticActive && !finalVal.startsWith('=')) {
      finalVal = transliterateText(finalVal);
    }

    onChange({
      ...sheetData,
      cells: {
        ...sheetData.cells,
        [editingCell]: finalVal,
      },
    });

    setEditingCell(null);
  };

  const exportToCSV = () => {
    const rows: string[] = [];
    for (let r = 1; r <= numRows; r++) {
      const rowVals: string[] = [];
      for (let c = 0; c < numCols; c++) {
        const key = `${colHeaders[c]}${r}`;
        const val = evaluateCell(key, sheetData.cells[key] || '');
        rowVals.push(`"${val.replace(/"/g, '""')}"`);
      }
      rows.push(rowVals.join(','));
    }
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `banglish-sheet-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFontFamilyStyle = () => {
    switch (font) {
      case 'Hind Siliguri':
        return '"Hind Siliguri", sans-serif';
      case 'Poppins':
        return '"Poppins", sans-serif';
      case 'Inter':
        return '"Inter", sans-serif';
      case 'JetBrains Mono':
        return '"JetBrains Mono", monospace';
      case 'Fira Code':
        return '"Fira Code", monospace';
      default:
        return '"Hind Siliguri", sans-serif';
    }
  };

  const selectedCellRaw = sheetData.cells[selectedCell] || '';

  return (
    <div className="relative flex-1 w-full min-h-[550px] sm:min-h-[620px] bg-white rounded-b-2xl border-x border-b border-slate-200/90 flex flex-col overflow-hidden">
      
      {/* Formula Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
        <div className="flex items-center justify-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-700 font-mono font-bold min-w-[50px] shadow-2xs">
          {selectedCell}
        </div>
        <div className="text-slate-400 font-mono font-semibold">fx</div>
        <input
          type="text"
          value={editingCell === selectedCell ? editValue : selectedCellRaw}
          onChange={(e) => {
            const val = e.target.value;
            if (editingCell === selectedCell) {
              setEditValue(val);
            } else {
              onChange({
                ...sheetData,
                cells: {
                  ...sheetData.cells,
                  [selectedCell]: val,
                },
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitCellEdit();
          }}
          placeholder="সেল এর মান বা ফর্মুলা লিখুন (যেমন: =SUM(A1:A5) বা =B2*C2)..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 focus:border-emerald-500 text-slate-800 outline-none font-sans text-xs shadow-2xs"
        />
        <button
          type="button"
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-medium transition-all shadow-2xs cursor-pointer font-bangla"
          title="CSV ফাইল হিসেবে ডাউনলোড করুন"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
        </button>
      </div>

      {/* Spreadsheet Grid */}
      <div className="flex-1 overflow-auto bg-white select-none">
        <table className="border-collapse w-full text-xs">
          <thead>
            <tr className="bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200">
              <th className="w-12 min-w-[48px] p-2 border-r border-slate-200 text-slate-500 font-mono text-[11px] font-semibold text-center select-none bg-slate-100">
                #
              </th>
              {colHeaders.map(col => (
                <th
                  key={col}
                  className="min-w-[120px] p-2 border-r border-slate-200 text-slate-700 font-mono text-[11px] font-semibold text-center select-none"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={rowNum} className="border-b border-slate-200/80 hover:bg-slate-50/60">
                  <td className="w-12 min-w-[48px] p-1.5 border-r border-slate-200 text-slate-500 font-mono text-[10px] text-center select-none bg-slate-50 sticky left-0 z-0">
                    {rowNum}
                  </td>
                  {colHeaders.map(col => {
                    const cellKey = `${col}${rowNum}`;
                    const rawVal = sheetData.cells[cellKey] || '';
                    const displayVal = evaluateCell(cellKey, rawVal);
                    const isAnchorSelected = selectedCell === cellKey;
                    const isInRange = selectedCellsSet.has(cellKey);
                    const isEditing = editingCell === cellKey;
                    const style = sheetData.styles[cellKey] || {};

                    return (
                      <td
                        key={cellKey}
                        onMouseDown={(e) => handleCellMouseDown(cellKey, e)}
                        onMouseEnter={() => handleCellMouseEnter(cellKey)}
                        onDoubleClick={() => handleCellDoubleClick(cellKey)}
                        className={`p-0 border-r border-slate-200 relative cursor-cell transition-colors min-w-[100px] sm:min-w-[120px] align-top select-none ${
                          isAnchorSelected
                            ? 'ring-2 ring-emerald-500 bg-emerald-50/60 z-20'
                            : isInRange
                            ? 'bg-emerald-100/50 ring-1 ring-inset ring-emerald-400/70 z-10'
                            : ''
                        }`}
                        style={{
                          backgroundColor: style.bg || undefined,
                          textAlign: style.align || 'left',
                        }}
                      >
                        {isEditing ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => {
                              if (activeSheetBufferRef.current.length > 0) return;
                              setEditValue(e.target.value);
                            }}
                            onBlur={() => {
                              resetSheetBuffer();
                              commitCellEdit();
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                resetSheetBuffer();
                                commitCellEdit();
                                return;
                              }
                              if (e.key === 'Escape') {
                                resetSheetBuffer();
                                setEditingCell(null);
                                return;
                              }

                              if (phoneticActive && !editValue.startsWith('=')) {
                                if (e.key === 'Backspace' && activeSheetBufferRef.current.length > 0) {
                                  e.preventDefault();
                                  const nextBuffer = activeSheetBufferRef.current.slice(0, -1);
                                  activeSheetBufferRef.current = nextBuffer;
                                  const target = e.currentTarget;
                                  const cursorPos = target.selectionStart;
                                  const replaceLen = lastSheetReplacedLenRef.current;
                                  const startPos = Math.max(0, cursorPos - replaceLen);

                                  if (nextBuffer.length > 0) {
                                    const newBangla = transliterateWord(nextBuffer);
                                    lastSheetReplacedLenRef.current = newBangla.length;
                                    setEditValue(prev => prev.slice(0, startPos) + newBangla + prev.slice(cursorPos));
                                  } else {
                                    lastSheetReplacedLenRef.current = 0;
                                    setEditValue(prev => prev.slice(0, startPos) + prev.slice(cursorPos));
                                  }
                                  return;
                                }

                                if (e.key === ' ' || e.key === '.' || e.key === ',' || e.key === '?' || e.key === '!') {
                                  e.preventDefault();
                                  const sep = e.key === '.' ? '।' : e.key;
                                  const target = e.currentTarget;
                                  const cursorPos = target.selectionStart;
                                  const replaceLen = lastSheetReplacedLenRef.current;
                                  const startPos = Math.max(0, cursorPos - replaceLen);

                                  if (activeSheetBufferRef.current.length > 0) {
                                    const finalBangla = transliterateWord(activeSheetBufferRef.current);
                                    setEditValue(prev => prev.slice(0, startPos) + finalBangla + sep + prev.slice(cursorPos));
                                  } else {
                                    setEditValue(prev => prev.slice(0, cursorPos) + sep + prev.slice(cursorPos));
                                  }
                                  resetSheetBuffer();
                                  return;
                                }

                                if (e.key.length === 1 && /^[a-zA-Z0-9`^:$~]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                                  e.preventDefault();
                                  const nextBuffer = activeSheetBufferRef.current + e.key;
                                  activeSheetBufferRef.current = nextBuffer;
                                  const newBangla = transliterateWord(nextBuffer);

                                  const target = e.currentTarget;
                                  const cursorPos = target.selectionStart;
                                  const replaceLen = lastSheetReplacedLenRef.current;
                                  const startPos = Math.max(0, cursorPos - replaceLen);

                                  lastSheetReplacedLenRef.current = newBangla.length;
                                  setEditValue(prev => prev.slice(0, startPos) + newBangla + prev.slice(cursorPos));
                                  return;
                                }

                                resetSheetBuffer();
                              }
                            }}
                            autoFocus
                            rows={Math.max(1, editValue.split('\n').length)}
                            className="w-full min-h-[36px] px-2 py-1.5 bg-white text-slate-900 outline-none border border-emerald-500 font-sans resize-none leading-relaxed"
                            style={{
                              fontFamily: getFontFamilyStyle(),
                              fontSize: `${fontSize}px`,
                            }}
                          />
                        ) : (
                          <div
                            className="px-2 py-1.5 min-h-[36px] break-words whitespace-pre-wrap text-slate-800 select-none leading-relaxed"
                            style={{
                              fontFamily: getFontFamilyStyle(),
                              fontSize: `${fontSize}px`,
                              fontWeight: style.bold ? 'bold' : 'normal',
                              fontStyle: style.italic ? 'italic' : 'normal',
                              color: style.color || undefined,
                            }}
                          >
                            {displayVal}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sheet Bottom Bar with "+ 50 more rows" Button */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 select-none">
        <button
          type="button"
          onClick={() => onChange({ ...sheetData, rows: (sheetData.rows || 15) + 50 })}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-300 hover:border-emerald-400 font-medium text-xs shadow-2xs transition-all cursor-pointer font-bangla"
          title="শীটে ৫০টি অতিরিক্ত সারি যুক্ত করুন"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>+ ৫০টি নতুন সারি যোগ করুন (+ 50 more rows)</span>
        </button>

        <div className="text-xs text-slate-500 font-mono">
          মোট সারি: {numRows} | মোট কলাম: {numCols}
        </div>
      </div>

    </div>
  );
}
