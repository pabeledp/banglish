import { DICTIONARY_DATABASE, DictionaryEntry } from './dictionaryData';

export type LanguageMode = 'bn' | 'en' | 'ar';

export interface SearchResult {
  entry: DictionaryEntry;
  matchScore: number;
  matchedField: 'bn' | 'en' | 'ar' | 'phonetic' | 'definition';
}

// Clean diacritics and normalize Arabic & Bengali characters for resilient search
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    // Arabic Tashkeel removal
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Arabic Alifs
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه');
}

export function searchDictionary(
  query: string,
  sourceLang: LanguageMode = 'bn',
  targetLang1: LanguageMode = 'en',
  targetLang2: LanguageMode = 'ar'
): DictionaryEntry[] {
  const q = normalizeText(query);
  if (!q) return DICTIONARY_DATABASE;

  const results: SearchResult[] = [];

  for (const entry of DICTIONARY_DATABASE) {
    const normBn = normalizeText(entry.bn);
    const normEn = normalizeText(entry.en);
    const normAr = normalizeText(entry.ar);
    const phonetics = entry.phoneticBanglish?.map(p => normalizeText(p)) || [];

    let score = 0;
    let matchedField: SearchResult['matchedField'] = 'bn';

    // Source language exact or prefix matches
    if (sourceLang === 'bn') {
      if (normBn === q) { score = 100; matchedField = 'bn'; }
      else if (normBn.startsWith(q)) { score = 80; matchedField = 'bn'; }
      else if (normBn.includes(q)) { score = 60; matchedField = 'bn'; }
      else if (phonetics.some(p => p === q || p.startsWith(q))) { score = 75; matchedField = 'phonetic'; }
      else if (normEn.includes(q)) { score = 40; matchedField = 'en'; }
      else if (normAr.includes(q)) { score = 40; matchedField = 'ar'; }
    } else if (sourceLang === 'en') {
      if (normEn === q) { score = 100; matchedField = 'en'; }
      else if (normEn.startsWith(q)) { score = 80; matchedField = 'en'; }
      else if (normEn.includes(q)) { score = 60; matchedField = 'en'; }
      else if (normBn.includes(q)) { score = 50; matchedField = 'bn'; }
      else if (normAr.includes(q)) { score = 40; matchedField = 'ar'; }
    } else if (sourceLang === 'ar') {
      if (normAr === q) { score = 100; matchedField = 'ar'; }
      else if (normAr.startsWith(q)) { score = 80; matchedField = 'ar'; }
      else if (normAr.includes(q)) { score = 60; matchedField = 'ar'; }
      else if (normEn.includes(q)) { score = 40; matchedField = 'en'; }
      else if (normBn.includes(q)) { score = 40; matchedField = 'bn'; }
    }

    if (score > 0) {
      results.push({ entry, matchScore: score, matchedField });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore).map(r => r.entry);
}
