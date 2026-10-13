'use client';

import React, { useState, useMemo } from 'react';
import { SheetData, CellStyle, FontFamilyOption } from '@/lib/pastebinTypes';
import { Plus, Trash2, Download, Table2, Calculator, Sparkles } from 'lucide-react';
import { transliterateText } from '@/lib/phoneticEngine';

interface SheetEditorProps {
  sheetData: SheetData;
  onChange: (data: SheetData) => void;
  font: FontFamilyOption;
  fontSize: number;
  phoneticActive: boolean;
  onActiveCellChange?: (cellCoord: string) => void;
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
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const numCols = sheetData.cols || 8;
  const numRows = sheetData.rows || 15;

  // Generate column labels: A, B, C...
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

  // Evaluates formula or raw content
  const evaluateCell = (cellKey: string, rawVal: string, visited: Set<string> = new Set()): string => {
    if (!rawVal || typeof rawVal !== 'string') return '';
    if (!rawVal.startsWith('=')) return rawVal;

    if (visited.has(cellKey)) return '#CIRCULAR!';
    visited.add(cellKey);

    const expr = rawVal.slice(1).trim();

    try {
      // 1. =SUM(A1:A5)
      const sumMatch = expr.match(/^SUM\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (sumMatch) {
        const rangeCells = getRangeCells(sumMatch[1].toUpperCase(), sumMatch[2].toUpperCase());
        const sum = rangeCells.reduce((acc, c) => {
          const val = parseFloat(evaluateCell(c, sheetData.cells[c] || '', new Set(visited)));
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        return String(sum);
      }

      // 2. =AVERAGE(A1:A5) or =AVG(A1:A5)
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

      // 3. =COUNT(A1:A5)
      const countMatch = expr.match(/^COUNT\(([A-Z]+[0-9]+):([A-Z]+[0-9]+)\)$/i);
      if (countMatch) {
        const rangeCells = getRangeCells(countMatch[1].toUpperCase(), countMatch[2].toUpperCase());
        const count = rangeCells.filter(c => {
          const val = parseFloat(evaluateCell(c, sheetData.cells[c] || '', new Set(visited)));
          return !isNaN(val);
        }).length;
        return String(count);
      }

      // 4. Arithmetic with cell references e.g. B2*C2 or A1+B1
      let parsedExpr = expr.replace(/([A-Z]+[0-9]+)/gi, (match) => {
        const refKey = match.toUpperCase();
        const refVal = parseFloat(evaluateCell(refKey, sheetData.cells[refKey] || '', new Set(visited)));
        return isNaN(refVal) ? '0' : String(refVal);
      });

      // Safe calculation for simple math operations (+, -, *, /)
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

  // Helper to expand range like A1:A4 into ['A1', 'A2', 'A3', 'A4']
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

  // Select a cell
  const handleCellClick = (cellCoord: string) => {
    setSelectedCell(cellCoord);
    onActiveCellChange?.(cellCoord);
  };

  // Start editing cell
  const handleCellDoubleClick = (cellCoord: string) => {
    setEditingCell(cellCoord);
    setEditValue(sheetData.cells[cellCoord] || '');
  };

  // Save edited cell
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

  // Add / Delete Rows and Columns
  const handleAddRow = () => onChange({ ...sheetData, rows: numRows + 1 });
  const handleDeleteRow = () => {
    if (numRows <= 2) return;
    onChange({ ...sheetData, rows: numRows - 1 });
  };
  const handleAddCol = () => onChange({ ...sheetData, cols: numCols + 1 });
  const handleDeleteCol = () => {
    if (numCols <= 2) return;
    onChange({ ...sheetData, cols: numCols - 1 });
  };

  // Export to CSV
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

  // Paste handler for TSV/CSV from Excel or Google Sheets
  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text || !selectedCell) return;

    e.preventDefault();
    const rows = text.split(/\r?\n/).filter(r => r.length > 0);
    const startColMatch = selectedCell.match(/([A-Z]+)/);
    const startRowMatch = selectedCell.match(/([0-9]+)/);
    if (!startColMatch || !startRowMatch) return;

    const startColIdx = colHeaders.indexOf(startColMatch[1]);
    const startRow = parseInt(startRowMatch[1], 10);

    const newCells = { ...sheetData.cells };

    rows.forEach((rowStr, rIdx) => {
      const cols = rowStr.split('\t');
      cols.forEach((cellVal, cIdx) => {
        const targetColIdx = startColIdx + cIdx;
        const targetRow = startRow + rIdx;
        if (targetColIdx < colHeaders.length) {
          const targetKey = `${colHeaders[targetColIdx]}${targetRow}`;
          newCells[targetKey] = cellVal.trim();
        }
      });
    });

    onChange({
      ...sheetData,
      rows: Math.max(sheetData.rows, startRow + rows.length),
      cells: newCells,
    });
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
    <div 
      className="relative flex-1 w-full h-full min-h-[550px] bg-[#090d16]/70 rounded-b-2xl border-x border-b border-gray-800/80 flex flex-col overflow-hidden"
      onPaste={handlePaste}
    >
      {/* Formula Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0b0f19] border-b border-gray-800/90 text-xs">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-gray-950 border border-gray-800 text-cyan-400 font-mono font-bold min-w-[50px] text-center">
          {selectedCell}
        </div>
        <div className="text-gray-500 font-mono font-semibold">fx</div>
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
          className="flex-1 px-3 py-1 rounded bg-gray-950 border border-gray-800 focus:border-cyan-500 text-gray-200 outline-none font-mono text-xs"
        />
        <button
          type="button"
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-medium transition-all"
          title="CSV ফাইল হিসেবে ডাউনলোড করুন"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
        </button>
      </div>

      {/* Spreadsheet Grid Canvas */}
      <div className="flex-1 overflow-auto bg-[#0a0e1a]/80 select-none">
        <table className="border-collapse table-fixed w-full text-xs">
          <thead>
            <tr className="bg-[#0f1422] sticky top-0 z-10 border-b border-gray-800">
              <th className="w-12 p-2 border-r border-gray-800 text-gray-500 font-mono text-[11px] font-semibold text-center select-none bg-[#0f1422]">
                #
              </th>
              {colHeaders.map(col => (
                <th
                  key={col}
                  className="min-w-[110px] w-32 p-2 border-r border-gray-800 text-gray-400 font-mono text-[11px] font-semibold text-center select-none"
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
                <tr key={rowNum} className="border-b border-gray-800/60 hover:bg-gray-900/20">
                  <td className="w-12 p-1.5 border-r border-gray-800 text-gray-600 font-mono text-[10px] text-center select-none bg-[#0c101d] sticky left-0 z-0">
                    {rowNum}
                  </td>
                  {colHeaders.map(col => {
                    const cellKey = `${col}${rowNum}`;
                    const rawVal = sheetData.cells[cellKey] || '';
                    const displayVal = evaluateCell(cellKey, rawVal);
                    const isSelected = selectedCell === cellKey;
                    const isEditing = editingCell === cellKey;
                    const style = sheetData.styles[cellKey] || {};

                    return (
                      <td
                        key={cellKey}
                        onClick={() => handleCellClick(cellKey)}
                        onDoubleClick={() => handleCellDoubleClick(cellKey)}
                        className={`p-0 border-r border-gray-800/60 relative cursor-cell transition-colors ${
                          isSelected ? 'ring-2 ring-cyan-400 bg-cyan-950/20 z-10' : ''
                        }`}
                        style={{
                          backgroundColor: style.bg || undefined,
                          textAlign: style.align || 'left',
                        }}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={commitCellEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitCellEdit();
                              if (e.key === 'Escape') setEditingCell(null);
                            }}
                            autoFocus
                            className="w-full h-full px-2 py-1.5 bg-gray-950 text-white outline-none border border-cyan-400 font-sans"
                            style={{
                              fontFamily: getFontFamilyStyle(),
                              fontSize: `${fontSize}px`,
                            }}
                          />
                        ) : (
                          <div
                            className="px-2 py-1.5 truncate text-gray-200 select-text"
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

    </div>
  );
}
