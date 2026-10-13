/**
 * Banglish Phonetic Transliteration Engine
 * Compatible with Banglish & Avro Keyboard Phonetics
 */

export const phoneticWordDictionary: Record<string, string> = {
  'amra': 'আমরা',
  'valobasa': 'ভালোবাসা',
  'valobasha': 'ভালোবাসা',
  'bhalobasa': 'ভালোবাসা',
  'bhalobasha': 'ভালোবাসা',
  'khalobasa': 'ভালোবাসা',
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
  'desh': 'দেশ',
  'dhaka': 'ঢাকা',
  'kormo': 'কর্ম',
  'shundor': 'সুন্দর',
  'sundor': 'সুন্দর',
  'ruti': 'রুটি',
  'dhonnobad': 'ধন্যবাদ',
  'shagotom': 'স্বাগতম',
  'swagotom': 'স্বাগতম',
  'gan': 'গান',
  'gai': 'গাই',
  'banglay': 'বাংলায়',
  'khobor': 'খবর',
  'manush': 'মানুষ',
  'sobai': 'সবাই',
  'shobai': 'সবাই',
  'bhai': 'ভাই',
  'bondhu': 'বন্ধু',
  'onek': 'অনেক',
  'shobar': 'সবার',
  'sobar': 'সবার',
  'mukhe': 'মুখে',
  'notun': 'নতুন',
  'jonno': 'জন্য',
  'hobe': 'হবে',
  'hoye': 'হয়ে',
  'hoyeche': 'হয়েছে',
  'hoy': 'হয়',
  'holo': 'হলো',
  'kori': 'করি',
  'koro': 'করো',
  'koren': 'করেন',
  'korbo': 'করবো',
  'korbe': 'করবে',
  'korechi': 'করেছি',
  'korte': 'করতে',
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
  'se': 'সে',
  'tini': 'তিনি',
  'tara': 'তারা',
  'era': 'এরা',
  'ora': 'ওরা',
  'ki': 'কি',
  'karon': 'কারণ',
  'ke': 'কে',
  'kara': 'কারা',
  'kono': 'কোনো',
  'kon': 'কোন',
  'khub': 'খুব',
  'beshi': 'বেশি',
  'kom': 'কম',
  'aro': 'আরো',
  'shathe': 'সাথে',
  'sathe': 'সাথে',
  'kaj': 'কাজ',
  'kotha': 'কথা',
  'somoy': 'সময়',
  'shomoy': 'সময়',
  'din': 'দিন',
  'rat': 'রাত',
  'sokal': 'সকাল',
  'shokal': 'সকাল',
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
  'pastebin': 'পেস্টবিন',
  'workspace': 'ওয়ার্কস্পেস'
};

/**
 * Phonetically transliterates a single word/token into Unicode Bangla
 */
export function transliterateWord(chunk: string): string {
  if (!chunk) return '';
  if (/^\s+$/.test(chunk)) return chunk;
  if (chunk === '.') return '।';
  if (chunk === '$') return '৳';

  // Numbers
  if (/^[0-9]+$/.test(chunk)) {
    const bdDigits: Record<string, string> = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return chunk.replace(/[0-9]/g, d => bdDigits[d] || d);
  }

  const lower = chunk.toLowerCase();
  if (phoneticWordDictionary[lower]) {
    return phoneticWordDictionary[lower];
  }

  // Check common suffixes (e.g. amader -> am + ader)
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
      if (phoneticWordDictionary[root]) {
        return phoneticWordDictionary[root] + suf.bn;
      }
    }
  }

  let res = lower;
  res = res.replace(/\./g, '।');
  res = res.replace(/\$/g, '৳');

  // Juktakkhor / Conjuncts
  res = res.replace(/kkhyo/g, 'ক্ষ্য');
  res = res.replace(/kkh/g, 'ক্ষ');
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
  res = res.replace(/gdh/g, 'গ্ধ');
  res = res.replace(/gn/g, 'গ্ন');
  res = res.replace(/ng/g, 'ং');
  res = res.replace(/nk/g, 'ঙ্ক');
  res = res.replace(/nkh/g, 'ঙ্খ');

  // Consonants
  res = res.replace(/kh/g, 'খ');
  res = res.replace(/gh/g, 'ঘ');
  res = res.replace(/chh/g, 'ছ');
  res = res.replace(/ch/g, 'চ');
  res = res.replace(/jh/g, 'ঝ');
  res = res.replace(/th/g, 'থ');
  res = res.replace(/dh/g, 'ধ');
  res = res.replace(/ph/g, 'ফ');
  res = res.replace(/bh/g, 'ভ');
  res = res.replace(/v/g, 'ভ');
  res = res.replace(/sh/g, 'শ');
  res = res.replace(/rh/g, 'ঢ়');
  res = res.replace(/rr/g, 'ড়');

  res = res.replace(/k/g, 'ক');
  res = res.replace(/g/g, 'গ');
  res = res.replace(/j/g, 'জ');
  res = res.replace(/t/g, 'ত');
  res = res.replace(/d/g, 'দ');
  res = res.replace(/n/g, 'ন');
  res = res.replace(/p/g, 'প');
  res = res.replace(/f/g, 'ফ');
  res = res.replace(/b/g, 'ব');
  res = res.replace(/m/g, 'ম');
  res = res.replace(/r/g, 'র');
  res = res.replace(/l/g, 'ল');
  res = res.replace(/s/g, 'স');
  res = res.replace(/h/g, 'হ');
  res = res.replace(/w/g, 'ও');
  res = res.replace(/y/g, 'য়');
  res = res.replace(/z/g, 'য');

  // Vowels
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

  // Initial vowels
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
 * Phonetically transliterates text containing multiple words & punctuation
 */
export function transliterateText(text: string): string {
  if (!text) return '';
  const chunks = text.split(/(\s+|[.,;!?৳।\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-])/);
  return chunks.map(chunk => {
    if (!chunk || /^\s+$/.test(chunk)) return chunk;
    if (/^[.,;!?\(\)\[\]\{\}\<\>\"\':\/\\@#%&*+=_-]+$/.test(chunk)) {
      if (chunk === '.') return '।';
      if (chunk === '$') return '৳';
      return chunk;
    }
    return transliterateWord(chunk);
  }).join('');
}
