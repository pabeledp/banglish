/**
 * Banglish Phonetic Transliteration Engine
 * Powered by official OmicronLab Avro Phonetic Algorithm & Curated Banglish Dictionary
 */

import { avroParse, avroParseWord, avroParseText } from './avroPhonetic';
import autodictData from './autodictData.json';

/**
 * Common high-frequency dictionary overrides / custom tweaks
 */
export const phoneticWordDictionary: Record<string, string> = {
  // Pronouns
  'amra': 'আমরা',
  'amader': 'আমাদের',
  'amake': 'আমাকে',
  'amar': 'আমার',
  'ami': 'আমি',
  'tumi': 'তুমি',
  'tomra': 'তোমরা',
  'tomader': 'তোমাদের',
  'tomake': 'তোমাকে',
  'tomar': 'তোমার',
  'tui': 'তুই',
  'tora': 'তোরা',
  'toder': 'তোদের',
  'toke': 'তোকে',
  'apni': 'আপনি',
  'apnara': 'আপনারা',
  'apnader': 'আপনাদের',
  'apnar': 'আপনার',
  'apnake': 'আপনাকে',
  'tara': 'তারা',
  'tader': 'তাদের',
  'take': 'তাকে',
  'she': 'সে',
  'se': 'সে',
  'tini': 'তিনি',
  'ini': 'ইনি',
  'uni': 'উনি',
  'ora': 'ওরা',
  'oder': 'ওদের',
  'oke': 'ওকে',

  // Common high-frequency Banglish words
  'valobasa': 'ভালোবাসা',
  'valobasha': 'ভালোবাসা',
  'bhalobasa': 'ভালোবাসা',
  'bhalobasha': 'ভালোবাসা',
  'valo': 'ভালো',
  'bhalo': 'ভালো',
  'bangla': 'বাংলা',
  'banglay': 'বাংলায়',
  'banglish': 'বাংলিশ',
  'bangladesh': 'বাংলাদেশ',
  'gan': 'গান',
  'gai': 'গাই',
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
  'shobar': 'সবার',
  'sobar': 'সবার',
  'shundor': 'সুন্দর',
  'sundor': 'সুন্দর',
  'desh': 'দেশ',
  'deshe': 'দেশে',
  'desher': 'দেশের',
  'kothay': 'কোথায়',
  'kotha': 'কথা',
  'kaj': 'কাজ',
  'kaje': 'কাজে',
  'notun': 'নতুন',
  'jonno': 'জন্য',
  'hobe': 'হবে',
  'hoyeche': 'হয়েছে',
  'hocche': 'হচ্ছে',
  'hoye': 'হয়ে',
  'korbo': 'করব',
  'korbe': 'করবে',
  'korche': 'করছে',
  'kori': 'করি',
  'kore': 'করে',
  'koro': 'করো',
  'korun': 'করুন',
  'kichu': 'কিছু',
  'shob': 'সব',
  'sob': 'সব',
  'shobcheye': 'সবচেয়ে',
  'sobcheye': 'সবচেয়ে',
  'bondhu': 'বন্ধু',
  'bondhura': 'বন্ধুরা',
  'bondhuder': 'বন্ধুদের',
  'shanti': 'শান্তি',
  'santi': 'শান্তি',
  'anondo': 'আনন্দ',
  'shomoy': 'সময়',
  'somoy': 'সময়',
  'din': 'দিন',
  'rat': 'রাত',
  'sokal': 'সকাল',
  'shokal': 'সকাল',
  'dupur': 'দুপুর',
  'bikal': 'বিকাল',
  'bikol': 'বিকাল',
  'shondha': 'সন্ধ্যা',
  'sondha': 'সন্ধ্যা',
  'khobor': 'খবর',
  'mukhe': 'মুখে',
  'mukh': 'মুখ',
  'ranna': 'রান্না',
  'khabar': 'খাবার',
  'khawa': 'খাওয়া',
  'pani': 'পানি',
  'boi': 'বই',
  'pori': 'পড়ি',
  'likhi': 'লিখি',
  'likhte': 'লিখতে',
  'bujhi': 'বুঝি',
  'bujhte': 'বুঝতে',
  'mon': 'মন',
  'sohoj': 'সহজ',
  'kothin': 'কঠিন',
  'druto': 'দ্রুত',
  'aro': 'আরো',
  'shathe': 'সাথে',
  'sathe': 'সাথে',
  'ekhon': 'এখন',
  'tokhon': 'তখন',
  'kobe': 'কবে',
  'jodi': 'যদি',
  'tobe': 'তবে',
  'khub': 'খুব',
  'onek': 'অনেক',
  'sotti': 'সত্যি',
  'shotti': 'সত্যি',
  'thik': 'ঠিক',
  'bhul': 'ভুল',
  'vul': 'ভুল',
  'banan': 'বানান',
  'shuru': 'শুরু',
  'suru': 'শুরু',
  'dekhun': 'দেখুন',
  'dekho': 'দেখো',
  'dekhi': 'দেখি',
  'jachai': 'যাচাই',
  'porikkha': 'পরীক্ষা',
  'shadinota': 'স্বাধীনতা',
  'swadhinota': 'স্বাধীনতা',
  'sahajjo': 'সাহায্য',
  'shahajjo': 'সাহায্য',

  // Tech & loan words
  'bank': 'ব্যাংক',
  'software': 'সফটওয়্যার',
  'hardware': 'হার্ডওয়্যার',
  'doctor': 'ডাক্তার',
  'daktar': 'ডাক্তার',
  'hospital': 'হাসপাতাল',
  'police': 'পুলিশ',
  'keyboard': 'কীবোর্ড',
  'workspace': 'ওয়ার্কস্পেস',
  'pastebin': 'পেস্টবিন',
  'editor': 'এডিটর',

  // Chandrabindu essentials
  'chad': 'চাঁদ',
  'chader': 'চাঁদের',
  'has': 'হাঁস',
  'haser': 'হাঁসের',
  'badha': 'বাঁধা',
  'badhar': 'বাঁধার',
  'badh': 'বাঁধ',
  'pach': 'পাঁচ',
  'pache': 'পাঁচে',
  'dhadha': 'ধাঁধা'
};

const autodictTyped = autodictData as Record<string, string>;

/**
 * Phonetically transliterates a single word or token
 */
export function transliterateWord(chunk: string): string {
  if (!chunk) return '';
  if (/^\s+$/.test(chunk)) return chunk;
  if (chunk === '.') return '।';
  if (chunk === '$') return '৳';

  // Numbers conversion
  if (/^[0-9]+$/.test(chunk)) {
    const bdDigits: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return chunk.replace(/[0-9]/g, d => bdDigits[d] || d);
  }

  // If word has no Latin alphabetic characters, return as is
  if (!/[a-zA-Z]/.test(chunk)) {
    return chunk;
  }

  const lower = chunk.toLowerCase();

  // 1. Direct dictionary match
  if (phoneticWordDictionary[lower]) {
    return phoneticWordDictionary[lower];
  }

  // 2. Direct autodict match
  if (autodictTyped[lower]) {
    return autodictTyped[lower];
  }

  // 3. Suffix decomposition rules
  const suffixes: [string, string][] = [
    ['gulo', 'গুলো'],
    ['gula', 'গুলা'],
    ['der', 'দের'],
    ['take', 'টাকে'],
    ['tai', 'টাই'],
    ['ta', 'টা'],
    ['te', 'তে'],
    ['ke', 'কে'],
    ['re', 'রে'],
    ['er', 'ের'],
    ['ra', 'রা'],
    ['y', 'য়']
  ];

  for (const [sufEn, sufBn] of suffixes) {
    if (lower.length > sufEn.length + 2 && lower.endsWith(sufEn)) {
      const root = lower.slice(0, -sufEn.length);
      const rootBn = phoneticWordDictionary[root] || autodictTyped[root];
      if (rootBn) {
        if (sufBn === 'ের') {
          const lastChar = rootBn.slice(-1);
          if (['া', 'ি', 'ী', 'ু', 'ূ', 'ে', 'ৈ', 'ো', 'ৌ'].includes(lastChar)) {
            return rootBn + 'র';
          }
        }
        return rootBn + sufBn;
      }
    }
  }

  // 4. Fallback to Avro rule engine
  return avroParseWord(chunk);
}

/**
 * Phonetically transliterates text containing multiple words, spaces & punctuation
 */
export function transliterateText(text: string): string {
  if (!text) return '';

  // Split by whitespace and punctuation delimiters while keeping delimiters intact
  const tokens = text.split(/(\s+|[.,;!?৳।\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-]+)/);

  return tokens.map(token => {
    if (!token) return '';
    // If token is whitespace, preserve
    if (/^\s+$/.test(token)) return token;
    // Common punctuation
    if (/^[.,;!?৳।\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-]+$/.test(token)) {
      if (token === '.') return '।';
      if (token === '$') return '৳';
      return token;
    }
    return transliterateWord(token);
  }).join('');
}

export { avroParse, avroParseWord, avroParseText };
