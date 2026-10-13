/**
 * Banglish Phonetic Transliteration Engine
 * Powered by official OmicronLab Avro Phonetic Algorithm
 */

import { avroParse, avroParseWord, avroParseText } from './avroPhonetic';

/**
 * Common high-frequency dictionary overrides / custom tweaks
 */
export const phoneticWordDictionary: Record<string, string> = {
  'amra': 'আমরা',
  'valobasa': 'ভালোবাসা',
  'valobasha': 'ভালোবাসা',
  'bhalobasa': 'ভালোবাসা',
  'bhalobasha': 'ভালোবাসা',
  'valo': 'ভালো',
  'bhalo': 'ভালো',
  'ami': 'আমি',
  'tumi': 'তুমি',
  'apni': 'আপনি',
  'apnara': 'আপনারা',
  'tomra': 'তোমরা',
  'bangla': 'বাংলা',
  'banglish': 'বাংলিশ',
  'bangladesh': 'বাংলাদেশ',
  'kemon': 'কেমন',
  'acho': 'আছো',
  'achen': 'আছেন',
  'achi': 'আছি',
  'ache': 'আছে',
  'dhaka': 'ঢাকা',
  'dhonnobad': 'ধন্যবাদ',
  'shagotom': 'স্বাগতম',
  'swagotom': 'স্বাগতম',
  'shobai': 'সবাই',
  'sobai': 'সবাই',
  'kothay': 'কোথায়',
  'notun': 'নতুন',
  'jonno': 'জন্য',
  'hobe': 'হবে',
  'hoyeche': 'হয়েছে',
  'amar': 'আমার',
  'amader': 'আমাদের',
  'tomar': 'তোমার',
  'tomader': 'তোমাদের',
  'apnar': 'আপনার',
  'apnader': 'আপনাদের',
};

/**
 * Phonetically transliterates a single word or token
 */
export function transliterateWord(word: string): string {
  if (!word) return '';
  const lower = word.toLowerCase();
  if (phoneticWordDictionary[lower]) {
    return phoneticWordDictionary[lower];
  }
  return avroParseWord(word);
}

/**
 * Phonetically transliterates text containing multiple words, spaces & punctuation
 */
export function transliterateText(text: string): string {
  if (!text) return '';
  // Check if text is a single word in dictionary
  const trimmed = text.trim();
  if (phoneticWordDictionary[trimmed.toLowerCase()]) {
    return phoneticWordDictionary[trimmed.toLowerCase()];
  }
  return avroParseText(text);
}

export { avroParse };
