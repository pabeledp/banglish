export interface BanglaFontOption {
  id: string;
  name: string;
  bnName: string;
  family: string;
  category: 'sans' | 'serif' | 'cursive' | 'display';
  weights: number[];
  preview: string;
  description: string;
  script?: 'bangla' | 'arabic' | 'custom';
  isCustom?: boolean;
}

export const BANGLA_FONTS: BanglaFontOption[] = [
  {
    id: 'hind-siliguri',
    name: 'Hind Siliguri',
    bnName: 'হিন্দ শিলিগুড়ি',
    family: "'Hind Siliguri', sans-serif",
    category: 'sans',
    weights: [300, 400, 500, 600, 700],
    preview: 'আমাদের সোনার বাংলা',
    description: 'আধুনিক, পরিচ্ছন্ন ও অত্যন্ত স্পষ্ট সান্স-সেরিফ',
    script: 'bangla'
  },
  {
    id: 'galada',
    name: 'Galada',
    bnName: 'গালাদা ক্যালিগ্রাফি',
    family: "'Galada', cursive",
    category: 'cursive',
    weights: [400],
    preview: 'চিরদিন তোমার আকাশ',
    description: 'নান্দনিক ক্যালিগ্রাফি ও কার্সিভ শৈলী',
    script: 'bangla'
  },
  {
    id: 'anek-bangla',
    name: 'Anek Bangla',
    bnName: 'অনেক বাংলা (বোল্ড)',
    family: "'Anek Bangla', sans-serif",
    category: 'display',
    weights: [200, 400, 600, 800],
    preview: 'তোমার বাতাস আমার প্রাণে',
    description: 'ভার্সাটাইল আধুনিক বোল্ড ও পাঞ্চি ডিসপ্লে',
    script: 'bangla'
  },
  {
    id: 'noto-serif-bengali',
    name: 'Noto Serif Bengali',
    bnName: 'নোটো সেরিফ',
    family: "'Noto Serif Bengali', serif",
    category: 'serif',
    weights: [400, 600, 700],
    preview: 'বাজায় বাঁশি ও মা',
    description: 'মার্জিত, সাহিত্যিক ও ক্লাসিক সেরিফ',
    script: 'bangla'
  },
  {
    id: 'alkatra',
    name: 'Alkatra',
    bnName: 'আলকাতরা ব্রাশ',
    family: "'Alkatra', cursive",
    category: 'display',
    weights: [400, 600, 700],
    preview: 'ফাগুনে তোর আমের বনে',
    description: 'হ্যান্ড-পেইন্টেড ডিসট্রেসড ব্রাশ স্টাইল',
    script: 'bangla'
  },
  {
    id: 'mina',
    name: 'Mina',
    bnName: 'মীনা জ্যামিতিক',
    family: "'Mina', sans-serif",
    category: 'sans',
    weights: [400, 700],
    preview: 'ঘ্রাণে পাগল করে',
    description: 'সমসাময়িক জ্যামিতিক মিনিমালিস্ট',
    script: 'bangla'
  }
];

export const ARABIC_FONTS: BanglaFontOption[] = [
  {
    id: 'amiri',
    name: 'Amiri (Quranic)',
    bnName: 'আমিরী (কুরআনিক নসখ)',
    family: "'Amiri', serif",
    category: 'serif',
    weights: [400, 700],
    preview: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    description: 'ক্লাসিক কুরআনিক ক্যালিগ্রাফি ও মার্জিত নসখ ফন্ট',
    script: 'arabic'
  },
  {
    id: 'amiri-quran',
    name: 'Amiri Quran',
    bnName: 'আমিরী কুরআন (মুসহাফ)',
    family: "'Amiri Quran', serif",
    category: 'serif',
    weights: [400],
    preview: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    description: 'পরিপূর্ণ হরকত ও মুসহাফ শৈলীর কুরআনিক ফন্ট',
    script: 'arabic'
  },
  {
    id: 'aref-ruqaa',
    name: 'Aref Ruqaa',
    bnName: 'আরেফ রুক\'আ (খত্তে রুক\'আ)',
    family: "'Aref Ruqaa', cursive",
    category: 'cursive',
    weights: [400, 700],
    preview: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
    description: 'ঐতিহ্যবাহী খত্তে রুক\'আ ক্যালিগ্রাফি শৈলী',
    script: 'arabic'
  },
  {
    id: 'reem-kufi',
    name: 'Reem Kufi',
    bnName: 'রিম কুফি (স্টাইলিশ কুফিক)',
    family: "'Reem Kufi', sans-serif",
    category: 'display',
    weights: [400, 600, 700],
    preview: 'لا إله إلا الله محمد رسول الله',
    description: 'আধুনিক ও নান্দনিক কুফিক ক্যালিগ্রাফিক ডিজাইন',
    script: 'arabic'
  },
  {
    id: 'noto-naskh-arabic',
    name: 'Noto Naskh Arabic',
    bnName: 'নোটো নসখ আরবি',
    family: "'Noto Naskh Arabic', serif",
    category: 'serif',
    weights: [400, 600, 700],
    preview: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ',
    description: 'পরিচ্ছন্ন ও নিখুঁত গুগল স্ট্যান্ডার্ড আরবি ফন্ট',
    script: 'arabic'
  }
];

export const ALL_FONTS: BanglaFontOption[] = [...BANGLA_FONTS, ...ARABIC_FONTS];

export async function loadCustomFontFile(file: File): Promise<BanglaFontOption> {
  const fontName = 'CustomFont_' + Math.random().toString(36).substring(2, 8);
  const buffer = await file.arrayBuffer();
  const fontFace = new FontFace(fontName, buffer);
  await fontFace.load();
  document.fonts.add(fontFace);

  return {
    id: fontName,
    name: file.name.replace(/\.[^/.]+$/, ''),
    bnName: 'কাস্টম ফন্ট (' + file.name.slice(0, 10) + ')',
    family: `'${fontName}', sans-serif`,
    category: 'display',
    weights: [400, 700],
    preview: 'কাস্টম ফন্ট প্রিভিউ',
    description: 'আপনার আপলোড করা ফন্ট',
    isCustom: true
  };
}
