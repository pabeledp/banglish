/**
 * Banglish Dictionary & Candidate Suggester Engine
 * Ported directly from native Banglish macOS/Windows architecture (BanglishDictionary.swift & BanglishDictionary.cs)
 */

import { transliterateWord } from './phoneticEngine';
import autodictData from './autodictData.json';
import commonWordsData from './commonWords.json';
import chandrabinduWordsData from './chandrabinduWords.json';

// High-frequency seed words for immediate verification
const seedWordsList = [
  "আমি", "তুমি", "আমরা", "তোমরা", "তারা", "সে", "আপনি", "আপনারা",
  "বাংলাদেশ", "বাংলা", "বাঙলা", "বাংলিশ", "ভাষায়", "ভাষা", "ভাষার",
  "বাজিমাত", "বাজিমাৎ", "বাজীমাত", "বাজীমাৎ", "বাজিকর",
  "শান্তি", "শান্তী", "সান্তি", "আনন্দ", "আনন্দময়", "বন্ধু", "বন্ধুরা",
  "যুক্তবর্ণ", "যুক্ত", "বর্ণ", "জ্ঞান", "বিজ্ঞান", "বিজ্ঞানী", "স্বাধীনতা",
  "ইতিহাস", "পরীক্ষা", "বৃষ্টি", "সন্ধ্যা", "কঠিন", "কঠীন", "খুব", "খূব",
  "পানি", "পানী", "নদী", "নদি", "সূর্য", "সুর্য", "কারণ", "কারন",
  "মানুষ", "মানুস", "দেশ", "দেশের", "বিপদ", "বিপদ্", "হঠাৎ", "হঠাত",
  "সৃষ্টি", "সৃষ্টী", "অনুষ্ঠান", "পুষ্প", "অঙ্ক", "অংক", "সঙ্গ", "সংগ",
  "ব্যাংক", "ব্যাঙ্ক", "ইউআই", "ট্যাংক", "সফটওয়্যার", "ভালো", "ভাল", "কেমন", "আছো", "আছেন", "ধন্যবাদ", "স্বাগতম",
  "চাঁদ", "চাঁদের", "হাঁস", "হাঁসের", "বাঁধা", "বাঁধার", "খোঁজ", "ডাক্তার", "সুন্দর", "নির্ভুল", "প্রবলেম",
  "ডিভাইস", "আপডেট", "কিবোর্ড", "সাজেশন", "প্লেসমেন্ট", "করব", "করবে", "করো",
  "হবে", "সময়", "সবার", "কিছু", "সবচেয়ে", "লেখা", "শব্দ", "নতুন", "সব",
  "কাজ", "ঠিক", "আসছে", "আসছিল", "হচ্ছে", "হচ্ছিল", "কিন্তু", "কথা", "কোথায়",
  "কোথাও", "বাইরে", "ভেতরে", "ভিতরে", "এখন", "আগে", "পরে", "দূরত্ব", "নিরাপদ",
  "হওয়া", "হওয়ার", "হওয়াতে", "হওয়ায়", "খাওয়া", "খাওয়ার", "দেওয়া", "দেওয়ার",
  "যাওয়া", "যাওয়ার", "পাওয়া", "পাওয়ার", "নেওয়া", "নেওয়ার", "চাওয়া", "চাওয়ার",
  "ধোয়া", "ধোওয়া", "শোওয়া", "শোয়া",
  "এমন", "এমনি", "এমনই", "যেমন", "যেমনি", "যেমনই", "তেমন", "তেমনি", "তেমনই", "কেমন", "কেমনি", "কেমনই",
  "আস্তে", "আসতে", "তখন", "তখনই", "তখনি", "এখনই", "এখনি",
  "চোখ", "চোখে", "চোখের", "লোক", "লোকে", "লোকের", "রোগ", "রোগে", "রোগের", "রোগী",
  "বলো", "ছোট", "বড়ো", "বড়", "শোনো", "দরজা", "খবর", "পাঁচ", "পাঁচে", "পাঁচের",
  "কাঁধ", "কাঁধে", "কাঁধের", "বাঁধ", "বাঁধে", "বাঁধের", "ধাঁধা", "গাঁয়ে",
  "ঢাকা", "ভাই", "কর্ম", "রুটি", "গান", "গাই", "বাংলায়", "অনেক", "মুখে", "জন্য"
];

// Comprehensive Chandrabindu Lookup Set
const chandrabinduWordsSet = new Set<string>(chandrabinduWordsData as string[]);

// Combine seed words, autodict values, and all verified Chandrabindu words into dictionaryWordsSet
const dictionaryWordsSet = new Set<string>([
  ...seedWordsList,
  ...(commonWordsData as string[]),
  ...(chandrabinduWordsData as string[]),
  ...Object.values(autodictData as Record<string, string>)
]);

const autodictMap: Record<string, string> = {
  ...(autodictData as Record<string, string>),
  chad: "চাঁদ",
  cad: "চাঁদ",
  chader: "চাঁদের",
  cader: "চাঁদের",
  has: "হাঁস",
  haser: "হাঁসের",
  badha: "বাঁধা",
  badhar: "বাঁধার",
  badh: "বাঁধ",
  badhe: "বাঁধে",
  badher: "বাঁধের",
  kadh: "কাঁধ",
  kadhe: "কাঁধে",
  kadher: "কাঁধের",
  pach: "পাঁচ",
  pache: "পাঁচে",
  pacher: "পাঁচের",
  dhadha: "ধাঁধা",
  dhadhay: "ধাঁধায়",
  gaye: "গাঁয়ে",
  khuj: "খোঁজ",
  khoj: "খোঁজ",
  bank: "ব্যাংক",
  banking: "ব্যাংকিং",
  iuai: "ইউআই",
  ui: "ইউআই",
  ux: "ইউএক্স",
  ai: "এআই",
  tank: "ট্যাংক",
  rank: "র‍্যাংক",
  ranking: "র‍্যাংকিং",
  link: "লিংক",
  pink: "পিংক",
  sink: "সিংক",
  thanks: "থ্যাংকস",
  software: "সফটওয়্যার",
  hardware: "হার্ডওয়্যার",
  doctor: "ডাক্তার",
  daktar: "ডাক্তার",
  hospital: "হাসপাতাল",
  police: "পুলিশ",
  card: "কার্ড",
  mobile: "মোবাইল",
  phone: "ফোন",
  office: "অফিস",
  college: "কলেজ",
  account: "অ্যাকাউন্ট",
  credit: "ক্রেডিট",
  debit: "ডেবিট",
  laptop: "ল্যাপটপ",
  computer: "কম্পিউটার",
  internet: "ইন্টারনেট",
  online: "অনলাইন",
  shundor: "সুন্দর",
  sundor: "সুন্দর",
  dhonnobad: "ধন্যবাদ",
  nirvul: "নির্ভুল",
  problem: "প্রবলেম",
  device: "ডিভাইস",
  update: "আপডেট",
  keyboard: "কিবোর্ড",
  suggestion: "সাজেশন",
  placement: "প্লেসমেন্ট",
  bhalo: "ভালো",
  valo: "ভালো",
  kemon: "কেমন",
  achen: "আছেন",
  korbo: "করব",
  korbe: "করবে",
  koro: "করো",
  hobe: "হবে",
  somoy: "সময়",
  sobar: "সবার",
  kichu: "কিছু",
  shobcheye: "সবচেয়ে",
  sobcheye: "সবচেয়ে",
  nirapod: "নিরাপদ",
  durotto: "দূরত্ব"
};

const BENGALI_CONSONANTS = [
  "ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ", "ঝ", "ঞ", "ট", "ঠ", "ড", "ঢ", "ণ",
  "ত", "থ", "দ", "ধ", "ন", "প", "ফ", "ব", "ভ", "ম", "য", "ল", "শ", "ষ", "স",
  "হ", "ড়", "ঢ়", "য়"
];

const NASAL_REPLACEMENTS: [string, string][] = [
  ["ন্দ", "ঁদ"],
  ["ন্ত", "ঁত"],
  ["ঞ্চ", "ঁচ"],
  ["ম্প", "ঁপ"],
  ["ঙ্ক", "ঁক"],
  ["ন্স", "ঁস"],
  ["ঞ্জ", "ঁজ"],
  ["ন্ঠ", "ঁঠ"],
  ["ন্ড", "ঁড"]
];

/**
 * Checks if a Bengali word is verified in the dictionary
 */
export function isWordInDictionary(word: string): boolean {
  return dictionaryWordsSet.has(word);
}

/**
 * Generates ranked candidate suggestions for typed phonetic raw input
 * Based directly on BanglishDictionary.swift architecture
 */
export function getPhoneticCandidates(rawInput: string): string[] {
  if (!rawInput || !rawInput.trim()) return [];

  // Ignore purely numeric input
  if (/^\d+$/.test(rawInput)) {
    return [];
  }

  // Special handling for full stop / dot (.)
  if (rawInput === '.') {
    return ['।', '.'];
  }

  const lower = rawInput.trim().toLowerCase();
  const preferred = autodictMap[lower];

  let primary = transliterateWord(rawInput);
  if (!primary) {
    if (preferred) return [preferred, rawInput];
    return [rawInput];
  }

  if (primary.includes('ওা')) {
    primary = primary.replaceAll('ওা', 'ওয়া');
  }

  const result: string[] = [];
  const seen = new Set<string>();

  function addCandidate(word: string) {
    const trimmed = word.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }

  // 1. If we have a preferred standard spelling (e.g. "bank" -> "ব্যাংক", "software" -> "সফটওয়্যার"),
  // it MUST be candidate #1!
  if (preferred) {
    addCandidate(preferred);
  }

  // 2. Generate phonetic variants based on Bengali orthographic ambiguities
  const variants = new Set<string>();

  // Rule A: Final ত <-> ৎ
  if (primary.endsWith('ত')) {
    variants.add(primary.slice(0, -1) + 'ৎ');
  } else if (primary.endsWith('ৎ')) {
    variants.add(primary.slice(0, -1) + 'ত');
  }

  // Helper for generating mutations
  const runMutation = (fn: (w: string) => void) => {
    const current = Array.from(variants);
    current.push(primary);
    for (const w of current) {
      fn(w);
    }
  };

  // Rule B: ি <-> ী (Hroshwo-I vs Deergho-I)
  runMutation(w => {
    if (w.includes('ি')) variants.add(w.replaceAll('ি', 'ী'));
    if (w.includes('ী')) variants.add(w.replaceAll('ী', 'ি'));
  });

  // Rule C: ু <-> ূ (Hroshwo-U vs Deergho-U)
  runMutation(w => {
    if (w.includes('ু')) variants.add(w.replaceAll('ু', 'ূ'));
    if (w.includes('ূ')) variants.add(w.replaceAll('ূ', 'ু'));
  });

  // Rule D: স <-> শ <-> ষ
  runMutation(w => {
    if (w.includes('স')) {
      variants.add(w.replaceAll('স', 'শ'));
      variants.add(w.replaceAll('স', 'ষ'));
    }
    if (w.includes('শ')) {
      variants.add(w.replaceAll('শ', 'স'));
      variants.add(w.replaceAll('শ', 'ষ'));
    }
    if (w.includes('ষ')) {
      variants.add(w.replaceAll('ষ', 'শ'));
      variants.add(w.replaceAll('ষ', 'স'));
    }
  });

  // Rule E: ন <-> ণ
  runMutation(w => {
    if (w.includes('ন')) variants.add(w.replaceAll('ন', 'ণ'));
    if (w.includes('ণ')) variants.add(w.replaceAll('ণ', 'ন'));
  });

  // Rule F: র <-> ড় <-> ঢ়
  runMutation(w => {
    if (w.includes('র')) variants.add(w.replaceAll('র', 'ড়'));
    if (w.includes('ড়')) {
      variants.add(w.replaceAll('ড়', 'র'));
      variants.add(w.replaceAll('ড়', 'ঢ়'));
    }
    if (w.includes('ঢ়')) variants.add(w.replaceAll('ঢ়', 'ড়'));
  });

  // Rule G: জ <-> য
  runMutation(w => {
    if (w.includes('জ')) variants.add(w.replaceAll('জ', 'য'));
    if (w.includes('য')) variants.add(w.replaceAll('য', 'জ'));
  });

  // Rule M: ছ <-> চ
  runMutation(w => {
    if (w.includes('ছ')) variants.add(w.replaceAll('ছ', 'চ'));
    if (w.includes('চ')) variants.add(w.replaceAll('চ', 'ছ'));
  });

  // Rule N: Dental vs Retroflex (ত <-> ট)
  runMutation(w => {
    if (w.includes('ত')) variants.add(w.replaceAll('ত', 'ট'));
    if (w.includes('ট')) variants.add(w.replaceAll('ট', 'ত'));
  });

  // Rule O: o-kar ambiguity (chok -> চোখ, lok -> লোক, rog -> রোগ, koro -> করো, bolo -> বলো)
  if (rawInput.includes('o')) {
    const allO = transliterateWord(rawInput.replaceAll('o', 'O'));
    if (allO) variants.add(allO);

    const lastOIdx = rawInput.lastIndexOf('o');
    if (lastOIdx !== -1) {
      const lastOStr = rawInput.slice(0, lastOIdx) + 'O' + rawInput.slice(lastOIdx + 1);
      const transLastO = transliterateWord(lastOStr);
      if (transLastO) variants.add(transLastO);
    }

    const firstOIdx = rawInput.indexOf('o');
    if (firstOIdx !== -1) {
      const firstOStr = rawInput.slice(0, firstOIdx) + 'O' + rawInput.slice(firstOIdx + 1);
      const transFirstO = transliterateWord(firstOStr);
      if (transFirstO) variants.add(transFirstO);
    }
  }

  // Rule W: wa / wya / oa -> ওয়া normalization
  runMutation(w => {
    if (w.includes('ওা')) variants.add(w.replaceAll('ওা', 'ওয়া'));
  });

  // Rule MN: Consonant shorthand expansion (emn -> এমন, kmn -> কেমন, tmn -> তেমন)
  runMutation(w => {
    if (w.includes('ম্ন')) variants.add(w.replaceAll('ম্ন', 'মন'));
  });
  if (lower.endsWith('mn')) {
    const baseStem = rawInput.slice(0, -2);
    const withO = transliterateWord(baseStem + 'on');
    if (withO) variants.add(withO);
    const withMon = transliterateWord(baseStem + 'mon');
    if (withMon) variants.add(withMon);
    if (baseStem.length === 1) {
      const withE = transliterateWord(baseStem + 'emon');
      if (withE) variants.add(withE);
    }
  }

  // Rule ST: Conjunct vs Non-conjunct (aste -> আস্তে & আসতে)
  runMutation(w => {
    if (w.includes('স্ত')) variants.add(w.replaceAll('স্ত', 'সত'));
  });
  if (rawInput.includes('ste')) {
    const modST = rawInput.replaceAll('ste', "s`te");
    const transST = transliterateWord(modST);
    if (transST) variants.add(transST);
  }

  // Rule NI: Emphatic suffix ni <-> noi (jemoni -> যেমনই & যেমনি)
  runMutation(w => {
    if (w.endsWith('নি')) variants.add(w.slice(0, -1) + 'নই');
    if (w.endsWith('নই')) variants.add(w.slice(0, -2) + 'নি');
  });

  // Rule H: ং <-> ঙ
  runMutation(w => {
    if (w.includes('ং')) variants.add(w.replaceAll('ং', 'ঙ'));
    if (w.includes('ঙ')) variants.add(w.replaceAll('ঙ', 'ং'));
  });

  // Rule I: Common Juktoborno variants
  runMutation(w => {
    if (w.includes('ন্ত')) variants.add(w.replaceAll('ন্ত', 'ণ্ট'));
    if (w.includes('ণ্ট')) variants.add(w.replaceAll('ণ্ট', 'ন্ত'));
    if (w.includes('ন্দ')) variants.add(w.replaceAll('ন্দ', 'ণ্ড'));
    if (w.includes('ণ্ড')) variants.add(w.replaceAll('ণ্ড', 'ন্দ'));
    if (w.includes('স্ত')) variants.add(w.replaceAll('স্ত', 'ষ্ট'));
    if (w.includes('ষ্ট')) variants.add(w.replaceAll('ষ্ট', 'স্ত'));
    if (w.includes('স্থ')) variants.add(w.replaceAll('স্থ', 'ষ্ঠ'));
    if (w.includes('ষ্ঠ')) variants.add(w.replaceAll('ষ্ঠ', 'স্থ'));
    if (w.includes('স্প')) variants.add(w.replaceAll('স্প', 'ষ্প'));
    if (w.includes('ষ্প')) variants.add(w.replaceAll('ষ্প', 'স্প'));
    if (w.includes('ঙ্ক')) variants.add(w.replaceAll('ঙ্ক', 'ংক'));
    if (w.includes('ংক')) variants.add(w.replaceAll('ংক', 'ঙ্ক'));
    if (w.includes('বাঙ্ক')) {
      variants.add(w.replaceAll('বাঙ্ক', 'ব্যাংক'));
      variants.add(w.replaceAll('বাঙ্ক', 'ব্যাঙ্ক'));
    }
    if (w.includes('বাংক')) {
      variants.add(w.replaceAll('বাংক', 'ব্যাংক'));
      variants.add(w.replaceAll('বাংক', 'ব্যাঙ্ক'));
    }
    if (w.includes('টাঙ্ক')) {
      variants.add(w.replaceAll('টাঙ্ক', 'ট্যাংক'));
      variants.add(w.replaceAll('টাঙ্ক', 'ট্যাঙ্ক'));
    }
    if (w.includes('টাংক')) {
      variants.add(w.replaceAll('টাংক', 'ট্যাংক'));
      variants.add(w.replaceAll('টাংক', 'ট্যাঙ্ক'));
    }
    if (w.includes('রাঙ্ক')) variants.add(w.replaceAll('রাঙ্ক', 'র‍্যাংক'));
    if (w.includes('রাংক')) variants.add(w.replaceAll('রাংক', 'র‍্যাংক'));
    if (w.includes('লাঙ্ক')) variants.add(w.replaceAll('লাঙ্ক', 'লিংক'));
    if (w.includes('লাংক')) variants.add(w.replaceAll('লাংক', 'লিংক'));
    if (w.includes('জ্ঞ')) variants.add(w.replaceAll('জ্ঞ', 'গ্য'));
    if (w.includes('ক্ষ')) variants.add(w.replaceAll('ক্ষ', 'খ'));
  });

  // Rule P: Y, Ja-fola (্য), Antostho-A (য়), Vowel (আই/ই) & W/War (ওয়্যার) variants
  runMutation(w => {
    if (w.includes('্য')) variants.add(w.replaceAll('্য', 'য়'));
    if (w.includes('য়')) variants.add(w.replaceAll('য়', '্য'));
    if (w.includes('য়াই')) variants.add(w.replaceAll('য়াই', 'আই'));
    if (w.includes('য়ি')) variants.add(w.replaceAll('য়ি', 'ই'));
    if (w.includes('ইয়া')) variants.add(w.replaceAll('ইয়া', 'িয়া'));
    if (w.includes('য়া')) variants.add(w.replaceAll('য়া', 'আ'));
    if (w.includes('তও')) variants.add(w.replaceAll('তও', 'ত্ব'));
    if (w.includes('ত্ব')) variants.add(w.replaceAll('ত্ব', 'তও'));
    if (w.includes('তওার')) variants.add(w.replaceAll('তওার', 'টওয়্যার'));
    if (w.includes('ত্বার')) variants.add(w.replaceAll('ত্বার', 'টওয়্যার'));
    if (w.includes('ত্বারে')) variants.add(w.replaceAll('ত্বারে', 'টওয়্যার'));
    if (w.includes('ওার')) variants.add(w.replaceAll('ওার', 'ওয়্যার'));
    if (w.includes('ও্যার')) variants.add(w.replaceAll('ও্যার', 'ওয়্যার'));
    if (w.includes('অ্যার')) variants.add(w.replaceAll('অ্যার', 'ওয়্যার'));
    if (w.includes('ওয়ার')) variants.add(w.replaceAll('ওয়ার', 'ওয়্যার'));
    if (w.includes('ফত')) variants.add(w.replaceAll('ফত', 'ফট'));
  });

  // Loanword / Software replacements
  if (lower.includes('software') || lower.includes('softowar') || lower.includes('softwer')) {
    variants.add('সফটওয়্যার');
  }

  // Rule Q: English loanwords with short 'a' (বা -> ব্যা, কা -> ক্যা, টা -> ট্যা)
  const prefixReplacements: [string, string, string[]][] = [
    ["বা", "ব্যা", ["বাংলাদেশ", "বাংলা", "বাঙলা", "বাগান", "বাতাস", "বাড়ি", "বাড়ি", "বাপ"]],
    ["কা", "ক্যা", ["কাজ", "কারণ", "কারন", "কালো", "কাল", "কাছে", "কাগজ"]],
    ["টা", "ট্যা", ["টাকা", "টাক"]],
    ["গা", "গ্যা", ["গান", "গাছ", "গায়ে", "গা"]],
    ["ফা", "ফ্যা", []]
  ];

  runMutation(w => {
    for (const [pfx, repl, exceptions] of prefixReplacements) {
      if (w.startsWith(pfx)) {
        const isEx = exceptions.some(ex => w.startsWith(ex));
        if (!isEx) {
          variants.add(repl + w.slice(pfx.length));
        }
      }
    }
  });

  // Rule J: Reph (র + C -> র্ + C) and Ro-fola (C + র -> C + ্র)
  runMutation(w => {
    for (const c of BENGALI_CONSONANTS) {
      const targetReph = 'র' + c;
      if (w.includes(targetReph)) {
        variants.add(w.replaceAll(targetReph, 'র্' + c));
      }
      if (c !== 'র' && c !== 'ড়' && c !== 'ঢ়' && c !== 'ৎ') {
        const targetRo = c + 'র';
        if (w.includes(targetRo)) {
          variants.add(w.replaceAll(targetRo, c + '্র'));
        }
      }
    }
  });

  // Rule L: Comprehensive Chandrabindu (চন্দ্রবিন্দু ঁ) Suggestions
  const VOWEL_SIGNS = ['া', 'ি', 'ী', 'ু', 'ূ', 'ে', 'ো', 'ৌ', 'ৈ'];
  const INDEPENDENT_VOWELS = ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ'];

  runMutation(w => {
    // 1. Nasal conjuncts to Chandrabindu (e.g. chand -> চাঁদ, has -> হাঁস, badha -> বাঁধা)
    for (const [from, to] of NASAL_REPLACEMENTS) {
      if (w.includes(from)) {
        variants.add(w.replaceAll(from, to));
      }
    }

    // 2. Vowel-attached Chandrabindu variants verified against 19,000+ words dictionary (e.g. cader -> চাঁদের, haser -> হাঁসের, pacher -> পাঁচের)
    const chars = Array.from(w);
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (VOWEL_SIGNS.includes(ch) || INDEPENDENT_VOWELS.includes(ch) || i === 0) {
        const candidate = chars.slice(0, i + 1).join('') + 'ঁ' + chars.slice(i + 1).join('');
        if (chandrabinduWordsSet.has(candidate)) {
          variants.add(candidate);
        }
      }
    }
  });

  // Prioritize dictionary confirmed variants
  const cbConfirmed: string[] = [];
  const otherConfirmed: string[] = [];
  const others: string[] = [];

  for (const v of variants) {
    const hasCB = v.includes('ঁ');
    if (dictionaryWordsSet.has(v)) {
      if (hasCB) {
        cbConfirmed.push(v);
      } else {
        otherConfirmed.push(v);
      }
    } else {
      if (!hasCB) {
        others.push(v);
      }
    }
  }

  // Sort confirmed Chandrabindu words so that root vowel placements come first (e.g. 'চাঁদের' before 'চাদেঁর')
  cbConfirmed.sort((a, b) => a.indexOf('ঁ') - b.indexOf('ঁ'));

  const primaryConfirmed = dictionaryWordsSet.has(primary);
  const userExplicitCB = rawInput.includes('^');

  // If there are confirmed Chandrabindu words, ALWAYS suggest them at the top!
  if (cbConfirmed.length > 0) {
    for (const v of cbConfirmed) {
      if (result.length >= 7) break;
      addCandidate(v);
    }
  }

  if (primaryConfirmed) {
    addCandidate(primary);
  }

  for (const v of otherConfirmed) {
    if (result.length >= 7) break;
    addCandidate(v);
  }

  if (!primaryConfirmed) {
    addCandidate(primary);
  }

  for (const v of others) {
    if (result.length >= 6) break;
    addCandidate(v);
  }

  // Always append raw Latin text as the last candidate (exactly like reference)
  addCandidate(rawInput);

  return result;
}
