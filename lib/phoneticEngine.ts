/**
 * Banglish Phonetic Transliteration Engine
 * Based on Banglish & Avro Phonetic Rules
 * GitHub Repository: https://github.com/pabeledp/Banglish-Avro-Keyboard
 */

// Common high-frequency words dictionary for instant high-accuracy match
export const commonWordDictionary: Record<string, string> = {
  // Pronouns
  'ami': 'আমি',
  'amra': 'আমরা',
  'tumi': 'তুমি',
  'tomra': 'তোমরা',
  'apni': 'আপনি',
  'apnara': 'আপনারা',
  'se': 'সে',
  'tini': 'তিনি',
  'tara': 'তারা',
  'era': 'এরা',
  'ora': 'ওরা',
  'taha': 'তাহা',
  'amar': 'আমার',
  'amader': 'আমাদের',
  'tomar': 'তোমার',
  'tomader': 'তোমাদের',
  'apnar': 'আপনার',
  'apnader': 'আপনাদের',
  'tar': 'তার',
  'tader': 'তাদের',
  'er': 'এর',
  'or': 'ওর',
  'kake': 'কাকে',
  'ke': 'কে',
  'kara': 'কারা',
  'kakeo': 'কাকেও',
  'kauke': 'কাউকে',
  'kono': 'কোনো',
  'kon': 'কোন',
  'ki': 'কি',
  'karon': 'কারণ',

  // Common verbs
  'kori': 'করি',
  'koro': 'করো',
  'koren': 'করেন',
  'korbo': 'করবো',
  'korbe': 'করবে',
  'korche': 'করছে',
  'korechi': 'করেছি',
  'korte': 'করতে',
  'hobe': 'হবে',
  'hoye': 'হয়ে',
  'hoyeche': 'হয়েছে',
  'hoy': 'হয়',
  'holo': 'হলো',
  'hote': 'হতে',
  'chilo': 'ছিল',
  'chilam': 'ছিলাম',
  'chile': 'ছিলে',
  'chilen': 'ছিলেন',
  'achi': 'আছি',
  'acho': 'আছো',
  'achen': 'আছেন',
  'ache': 'আছে',
  'jai': 'যাই',
  'jao': 'যাও',
  'jay': 'যায়',
  'jabo': 'যাবো',
  'jabe': 'যাবে',
  'gechi': 'গেছি',
  'gelo': 'গেলো',
  'asbo': 'আসবো',
  'asbe': 'আসবে',
  'asho': 'আসো',
  'ashbo': 'আসবো',
  'ashbe': 'আসবে',
  'dekhi': 'দেখি',
  'dekho': 'দেখো',
  'dekhe': 'দেখে',
  'dekhte': 'দেখতে',
  'bolbo': 'বলবো',
  'bolo': 'বলো',
  'bole': 'বলে',
  'bolchi': 'বলছি',
  'jani': 'জানি',
  'jano': 'জানো',
  'jane': 'জনে',
  'parbo': 'পারবো',
  'parbe': 'পারবে',
  'pari': 'পারি',
  'paro': 'পারো',
  'likhi': 'লিখি',
  'likho': 'লিখো',
  'likhe': 'লিখে',
  'likhte': 'লিখতে',
  'bujhi': 'বুঝি',
  'bujhte': 'বুঝতে',
  'shuni': 'শুনি',
  'shunbo': 'শুনবো',

  // Common nouns & adjectives
  'bangla': 'বাংলা',
  'banglish': 'বাংলিশ',
  'bangladesh': 'বাংলাদেশ',
  'desh': 'দেশ',
  'dhaka': 'ঢাকা',
  'manush': 'মানুষ',
  'bondhu': 'বন্ধু',
  'bhai': 'ভাই',
  'bon': 'বোন',
  'baba': 'বাবা',
  'ma': 'মা',
  'valo': 'ভালো',
  'bhalo': 'ভালো',
  'valobasa': 'ভালোবাসা',
  'valobasha': 'ভালোবাসা',
  'bhalobasa': 'ভালোবাসা',
  'bhalobasha': 'ভালোবাসা',
  'shundor': 'সুন্দর',
  'sundor': 'সুন্দর',
  'dhonnobad': 'ধন্যবাদ',
  'shagotom': 'স্বাগতম',
  'swagotom': 'স্বাগতম',
  'onek': 'অনেক',
  'ektu': 'একটু',
  'shob': 'সব',
  'sob': 'সব',
  'shobai': 'সবাই',
  'sobai': 'সবাই',
  'shobar': 'সবার',
  'notun': 'নতুন',
  'puran': 'পুরান',
  'purono': 'পুরনো',
  'khub': 'খুব',
  'beshi': 'বেশি',
  'bishi': 'বেশি',
  'kom': 'কম',
  'aro': 'আরো',
  'shathe': 'সাথে',
  'sathe': 'সাথে',
  'jonno': 'জন্য',
  'moto': 'মতো',
  'kotha': 'কথা',
  'kaj': 'কাজ',
  'somoy': 'সময়',
  'shomoy': 'সময়',
  'din': 'দিন',
  'rat': 'রাত',
  'sokal': 'সকাল',
  'shokal': 'সকাল',
  'dupur': 'দুপুর',
  'bikol': 'বিকাল',
  'bikal': 'বিকাল',
  'shondha': 'সন্ধ্যা',
  'sondha': 'সন্ধ্যা',
  'gan': 'গান',
  'gai': 'গাই',
  'banglay': 'বাংলায়',
  'khobor': 'খবর',
  'mukhe': 'মুখে',
  'mon': 'মন',
  'sohoj': 'সহজ',
  'kothin': 'কঠিন',
  'druto': 'দ্রুত',
  'keyboard': 'কীবোর্ড',
  'pastebin': 'পেস্টবিন',
  'workspace': 'ওয়ার্কস্পেস',
  'editor': 'এডিটর',
  'note': 'নোট',
  'sheet': 'শীট',
  'doc': 'ডক'
};

// Vowel signs mapping (Kar forms)
const karMap: Record<string, string> = {
  'a': 'া',
  'aa': 'া',
  'i': 'ি',
  'ee': 'ী',
  'u': 'ু',
  'oo': 'ূ',
  'e': 'ে',
  'oi': 'ৈ',
  'o': 'ো',
  'ou': 'ৌ',
  'ri': 'ৃ'
};

// Initial vowels mapping (Shoroborno)
const initialVowels: Record<string, string> = {
  'a': 'অ',
  'aa': 'আ',
  'i': 'ই',
  'ee': 'ঈ',
  'u': 'উ',
  'oo': 'ঊ',
  'e': 'এ',
  'oi': 'ঐ',
  'o': 'ও',
  'ou': 'ঔ',
  'ri': 'ঋ'
};

/**
 * Phonetic transliteration for a single token
 */
export function transliterateWord(inputWord: string): string {
  if (!inputWord) return '';

  // Preserve casing for symbols & numbers
  if (/^[0-9]+$/.test(inputWord)) {
    // Convert to Bangla digits if needed, or keep
    const bnDigits: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return inputWord.replace(/[0-9]/g, d => bnDigits[d] || d);
  }

  const lower = inputWord.toLowerCase();

  // 1. Direct dictionary match
  if (commonWordDictionary[lower]) {
    return commonWordDictionary[lower];
  }

  // 2. Exact match with trailing common suffixes
  const suffixes = [
    { en: 'er', bn: 'ের' },
    { en: 'ke', bn: 'কে' },
    { en: 'te', bn: 'তে' },
    { en: 're', bn: 'রে' },
    { en: 'gulo', bn: 'গুলো' },
    { en: 'gulor', bn: 'গুলোর' },
    { en: 'ti', bn: 'টি' },
    { en: 'ta', bn: 'টা' }
  ];

  for (const suf of suffixes) {
    if (lower.length > suf.en.length + 2 && lower.endsWith(suf.en)) {
      const root = lower.slice(0, -suf.en.length);
      if (commonWordDictionary[root]) {
        return commonWordDictionary[root] + suf.bn;
      }
    }
  }

  // 3. Rule-based transliteration engine
  let res = lower;

  // Custom punctuation & symbols
  res = res.replace(/\./g, '।');
  res = res.replace(/\$/g, '৳');

  // Complex conjuncts (Juktakkhor)
  res = res.replace(/kkh/g, 'ক্ষ');
  res = res.replace(/kkhyo/g, 'ক্ষ্য');
  res = res.replace(/shch/g, 'শ্চ');
  res = res.replace(/shth/g, 'ষ্ঠ');
  res = res.replace(/sht/g, 'ষ্ট');
  res = res.replace(/nch/g, 'ঞ্চ');
  res = res.replace(/nj/g, 'ঞ্জ');
  res = res.replace(/ndh/g, 'ন্ধ');
  res = res.replace(/ntr/g, 'ন্ত্ৰ');
  res = res.replace(/nth/g, 'ন্থ');
  res = res.replace(/nd/g, 'ন্দ');
  res = res.replace(/nt/g, 'ন্ত');
  res = res.replace(/mps/g, 'ম্প');
  res = res.replace(/mph/g, 'ম্ফ');
  res = res.replace(/mb/g, 'ম্ব');
  res = res.replace(/mbh/g, 'ম্ভ');
  res = res.replace(/kt/g, 'ক্ত');
  res = res.replace(/bd/g, 'ব্দ');
  res = res.replace(/bjo/g, 'ব্জ');
  res = res.replace(/gdh/g, 'গ্ধ');
  res = res.replace(/gn/g, 'গ্ন');
  res = res.replace(/ng/g, 'ং');
  res = res.replace(/nk/g, 'ঙ্ক');
  res = res.replace(/nkh/g, 'ঙ্খ');

  // Aspirated / multi-char consonants
  res = res.replace(/kh/g, 'খ');
  res = res.replace(/gh/g, 'ঘ');
  res = res.replace(/chh/g, 'ছ');
  res = res.replace(/ch/g, 'চ');
  res = res.replace(/jh/g, 'ঝ');
  res = res.replace(/th/g, 'থ');
  res = res.replace(/dh/g, 'ধ');
  res = res.replace(/ph/g, 'ফ');
  res = res.replace(/bh/g, 'ভ');
  res = res.replace(/sh/g, 'শ');
  res = res.replace(/rh/g, 'ঢ়');
  res = res.replace(/rr/g, 'ড়');

  // Single consonants
  res = res.replace(/k/g, 'ক');
  res = res.replace(/g/g, 'গ');
  res = res.replace(/j/g, 'জ');
  res = res.replace(/t/g, 'ত');
  res = res.replace(/d/g, 'দ');
  res = res.replace(/n/g, 'ন');
  res = res.replace(/p/g, 'প');
  res = res.replace(/f/g, 'ফ');
  res = res.replace(/b/g, 'ব');
  res = res.replace(/v/g, 'ভ');
  res = res.replace(/m/g, 'ম');
  res = res.replace(/r/g, 'র');
  res = res.replace(/l/g, 'ল');
  res = res.replace(/s/g, 'স');
  res = res.replace(/h/g, 'হ');
  res = res.replace(/w/g, 'ও');
  res = res.replace(/y/g, 'য়');
  res = res.replace(/z/g, 'য');

  // Vowels - Kar forms
  res = res.replace(/aa/g, 'া');
  res = res.replace(/a/g, 'া');
  res = res.replace(/ee/g, 'ী');
  res = res.replace(/oi/g, 'ৈ');
  res = res.replace(/oo/g, 'ূ');
  res = res.replace(/ou/g, 'ৌ');
  res = res.replace(/i/g, 'ি');
  res = res.replace(/u/g, 'ু');
  res = res.replace(/e/g, 'ে');
  res = res.replace(/o/g, 'ো');

  // Fix initial standalone Kar into initial Shoroborno
  if (res.startsWith('া')) res = 'আ' + res.slice(1);
  else if (res.startsWith('ি')) res = 'ই' + res.slice(1);
  else if (res.startsWith('ী')) res = 'ঈ' + res.slice(1);
  else if (res.startsWith('ু')) res = 'উ' + res.slice(1);
  else if (res.startsWith('ূ')) res = 'ঊ' + res.slice(1);
  else if (res.startsWith('ে')) res = 'এ' + res.slice(1);
  else if (res.startsWith('ৈ')) res = 'ঐ' + res.slice(1);
  else if (res.startsWith('ো')) res = 'ও' + res.slice(1);
  else if (res.startsWith('ৌ')) res = 'ঔ' + res.slice(1);

  return res;
}

/**
 * Transliterates an entire block of text (preserving whitespace, linebreaks, punctuation)
 */
export function transliterateText(text: string): string {
  if (!text) return '';

  // Split by whitespace and punctuation delimiters while keeping delimiters intact
  const tokens = text.split(/(\s+|[.,;!?৳।\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-])/);

  return tokens.map(token => {
    if (!token) return '';
    // If token is whitespace, preserve
    if (/^\s+$/.test(token)) return token;
    // Common punctuation
    if (token === '.') return '।';
    if (token === '$') return '৳';
    if (/^[.,;!?\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-]+$/.test(token)) {
      return token;
    }
    return transliterateWord(token);
  }).join('');
}

/**
 * Checks if a string likely contains Banglish / Latin characters
 */
export function containsLatinChars(str: string): boolean {
  return /[a-zA-Z]/.test(str);
}
