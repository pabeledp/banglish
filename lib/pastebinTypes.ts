/**
 * All-in-One Smart Workspace & Pastebin Type Definitions
 */

export type WorkspaceMode = 'text' | 'docs' | 'sheet';

export type LanguageMode = 'bn' | 'en';

export type FontFamilyOption =
  | 'Hind Siliguri'
  | 'Poppins'
  | 'Inter'
  | 'JetBrains Mono'
  | 'Fira Code'
  | 'SolaimanLipi';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  color?: string;
  bg?: string;
}

export interface SheetData {
  rows: number;
  cols: number;
  cells: Record<string, string>; // e.g. { 'A1': '=SUM(A2:A5)', 'B1': 'Total' }
  styles: Record<string, CellStyle>;
}

export interface PastebinTab {
  id: string;
  title: string;
  mode: WorkspaceMode;
  content: string; // Plain text or HTML for docs
  sheetData?: SheetData;
  language: LanguageMode;
  font: FontFamilyOption;
  fontSize: number;
  wordWrap: boolean;
  codeLanguage: string;
  createdAt: number;
  updatedAt: number;
}

export interface PastebinState {
  tabs: PastebinTab[];
  activeTabId: string;
  phoneticActive: boolean;
  theme: 'dark'; // strictly sleek dark glassmorphism
  lastSavedAt: number | null;
}

export interface TextStats {
  words: number;
  chars: number;
  lines: number;
  readingTimeMin: number;
}

export const SUPPORTED_FONTS: { id: FontFamilyOption; name: string; category: 'bangla' | 'english' | 'code' | 'general' }[] = [
  { id: 'Hind Siliguri', name: 'Hind Siliguri (ডিফল্ট বাংলা)', category: 'bangla' },
  { id: 'Poppins', name: 'Poppins (Default English)', category: 'english' },
  { id: 'Inter', name: 'Inter (Modern UI)', category: 'general' },
  { id: 'JetBrains Mono', name: 'JetBrains Mono (Developer)', category: 'code' },
  { id: 'Fira Code', name: 'Fira Code (Code Ligatures)', category: 'code' },
  { id: 'SolaimanLipi', name: 'SolaimanLipi (Classic Bangla)', category: 'bangla' },
];

export const CODE_LANGUAGES = [
  { id: 'plaintext', name: 'Plain Text' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'html', name: 'HTML / XML' },
  { id: 'css', name: 'CSS / Tailwind' },
  { id: 'json', name: 'JSON' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'sql', name: 'SQL Query' },
  { id: 'swift', name: 'Swift' },
];
