/**
 * Banglish Official Blog Data Store
 * Built on the architecture of ampabel.com
 * Synced automatically from Cloudflare D1 on 2026-10-15T11:37:30.518Z
 */

export interface BlogPost {
  id: string;
  index: string;
  slug: string;
  title: string;
  seoTitle?: string;
  subtitle?: string;
  category: string;
  date: string;
  isoDate: string;
  readTime: string;
  featured?: boolean;
  coverImage?: string;
  coverAlt?: string;
  canonical?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  tags: string[];
  content: string;
  views?: number;
  likes?: number;
  comments?: number;
  status?: 'published' | 'draft' | 'scheduled';
}

export const blogCategories = [
  "সকল আর্টিকেল",
  "সফটওয়্যার",
  "টাইপিং গাইড",
  "টিপস & ট্রিকস",
  "নতুন আপডেট"
];

export const blogPosts: BlogPost[] = [
  {
    "id": "post-003",
    "index": "001",
    "slug": "how-to-fix-mac-sonoma-sequoia-bangla-typing-lag",
    "title": "ম্যাকওএস সোনোমা ও সেকোয়াতে বাংলা টাইপিং ল্যাগ বা বাফার সমস্যা সমাধানের উপায়",
    "seoTitle": "Fix macOS Sonoma & Sequoia Bangla Typing Lag",
    "subtitle": "অ্যাপলের নতুন আপডেটে পুরানো অভ্রো বা অন্যান্য কিবোর্ডের স্পিড স্লো বা হ্যাং হওয়ার কারণ এবং চূড়ান্ত সমাধান।",
    "category": "টিপস & ট্রিকস",
    "date": "১২ অক্টোবর, ২০২৬",
    "isoDate": "2026-10-12",
    "readTime": "৪ মিনিট পড়ার সময়",
    "featured": false,
    "coverImage": "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80",
    "coverAlt": "Tech laptop with code and settings",
    "canonical": "https://banglish.bd/blog/how-to-fix-mac-sonoma-sequoia-bangla-typing-lag",
    "author": {
      "name": "A M Pabel",
      "role": "Lead Architecture, Team FramEmpire",
      "avatar": "/assets/pabel_light_avatar.webp"
    },
    "excerpt": "অ্যাপলের নতুন আপডেটে পুরানো অভ্রো বা অন্যান্য কিবোর্ডের স্পিড স্লো বা হ্যাং হওয়ার কারণ এবং চূড়ান্ত সমাধান।",
    "tags": [
      "macos lag fix",
      "sonoma bangla lag",
      "sequoia keyboard bug",
      "banglish mac fix"
    ],
    "content": "## কেন ম্যাকওএস সোনোমা ও সেকোয়াতে পুরানো কিবোর্ড ল্যাগ করে?\n\nঅ্যাপল তাদের **macOS 14 (Sonoma)** এবং **macOS 15 (Sequoia)** আপডেটে ইনপুট মেথড কিট (IMK) আর্কিটেকচারে বড় ধরনের পরিবর্তন এনেছে। পুরোনো আই-অভ্রো কিংবা থার্ড-পার্টি টুলগুলো বহু বছর আগের অবসোলেট ওপেন-সোর্স কোডের ওপর নির্মিত, যা আধুনিক ম্যাকের সিকিউরিটি স্যান্ডবক্স ও আর্কিটেকচারের সাথে কম্প্যাটিবল নয়।\n\nএর ফলে:\n- দ্রুত টাইপ করলে অক্ষর মিস হয়ে যায়\n- সাফারি বা ক্রোম ব্রাউজারে স্পেস চাপলে কার্সর পেছনে চলে যায়\n- সিস্টেম মাঝে মাঝে হ্যাং করে\n\n---\n\n## স্থায়ী সমাধান: বাংলিশ কিবোর্ডে সুইচ করুন\n\nবাংলিশ কিবোর্ড অ্যাপলের সর্বশেষ **InputMethodKit ও Swift 6** স্ট্যান্ডার্ড মেনে তৈরি করা হয়েছে।\n\n### ইন্সটলেশন করার পর কিছু সেটিংস চেক করুন:\n1. **System Settings > Keyboard > Text Input > Edit** এ যান।\n2. যদি পুরানো কোনো বাংলা কিবোর্ড থাকে, সেগুলোর ওপর ক্লিক করে **- (মাইনাস)** বাটনে চেপে রিমুভ করে দিন।\n3. শুধুমাত্র **Banglish (বাংলিশ)** সিলেক্ট রাখুন।\n4. ব্যস! এবার কোনো ল্যাগ ছাড়াই সুপার-ফাস্ট গতিতে টাইপ উপভোগ করুন।",
    "views": 0,
    "status": "published"
  },
  {
    "id": "post-002",
    "index": "002",
    "slug": "banglish-phonetic-typing-rules-and-cheatsheet",
    "title": "বাংলিশ ফনেটিক কিবোর্ডে দ্রুত বাংলা টাইপ করার নিয়ম ও শর্টকাট",
    "seoTitle": "বাংলিশ ফনেটিক কিবোর্ড টাইপিং গাইড ও চিটশিট",
    "subtitle": "সহজে ও দ্রুত ফোনেটিক নিয়মে বাংলা টাইপ করার আদ্যোপান্ত নিয়মাবলী, জটিল যুক্তবর্ণ লেখার শর্টকাট এবং প্র্যাকটিস গাইড।",
    "category": "টাইপিং গাইড",
    "date": "১৪ অক্টোবর, ২০২৬",
    "isoDate": "2026-10-14",
    "readTime": "৫ মিনিট পড়ার সময়",
    "featured": false,
    "coverImage": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
    "coverAlt": "Keyboard typing workstation with Bangla script",
    "canonical": "https://banglish.bd/blog/banglish-phonetic-typing-rules-and-cheatsheet",
    "author": {
      "name": "A M Pabel",
      "role": "Lead Architecture, Team FramEmpire",
      "avatar": "/assets/pabel_light_avatar.webp"
    },
    "excerpt": "সহজে ও দ্রুত ফোনেটিক নিয়মে বাংলা টাইপ করার আদ্যোপান্ত নিয়মাবলী, জটিল যুক্তবর্ণ লেখার শর্টকাট এবং প্র্যাকটিস গাইড।",
    "tags": [
      "banglish typing rules",
      "bangla phonetic cheatsheet",
      "juktakkhor typing",
      "avro bangla layout"
    ],
    "content": "## ফোনেটিক টাইপিং কী এবং কেন এটি জনপ্রিয়?\n\nফোনেটিক টাইপিং হলো ইংরেজি অক্ষরের উচ্চারণ অনুযায়ী বাংলা বর্ণমালা লেখার আধুনিক পদ্ধতি। অর্থাৎ আমরা মেসেঞ্জারে যেভাবে বাংলিশ লিখি (যেমন: `kemon acho`), ঠিক সেভাবেই টাইপ করলে স্ক্রিনে নিখুঁত বাংলা হরফে ফুটে উঠবে (`কেমন আছো`)।\n\n---\n\n## মৌলিক স্বরবর্ণ ও ব্যঞ্জনবর্ণের নিয়ম\n\n| ইংরেজি টাইপ | বাংলা আউটপুট | উদাহরণ |\n| :--- | :--- | :--- |\n| **a** | অ / া | `onno` $\\rightarrow$ অন্য |\n| **aa / A** | আ / া | `amar` $\\rightarrow$ আমার |\n| **i** | ই / ি | `ami` $\\rightarrow$ আমি |\n| **ee / I** | ঈ / ী | `dheer` $\\rightarrow$ ধীর |\n| **u** | উ / ু | `tumi` $\\rightarrow$ তুমি |\n| **kkh** | ক্ষ | `porikkha` $\\rightarrow$ পরীক্ষা |\n| **jny** | জ্ঞ | `gyan` / `jnyan` $\\rightarrow$ জ্ঞান |\n| **ng / NG** | ং / ঙ | `bangla` $\\rightarrow$ বাংলা |\n\n---\n\n## জটিল যুক্তবর্ণ লেখার সহজ ট্রিকস\n\nবাংলায় এমন কিছু যুক্তবর্ণ রয়েছে যা সাধারণ কিবোর্ডে লেখা বেশ কঠিন। বাংলিশ কিবোর্ডে এগুলো কীভাবে লিখবেন:\n\n1. **হ-ফলা ও য-ফলা:**\n   - `bujhlam` $\\rightarrow$ বুঝলাম\n   - `sotyo` বা `shotti` $\\rightarrow$ সত্যি\n2. **রেফ ও র-ফলা:**\n   - রেফ লিখতে অক্ষরের আগে `r` লিখুন: `kormo` $\\rightarrow$ কর্ম, `dhorno` $\\rightarrow$ ধর্ম।\n   - র-ফলা লিখতে ব্যঞ্জনের পর `r` লিখুন: `gram` $\\rightarrow$ গ্রাম, `protidin` $\\rightarrow$ প্রতিদিন।\n3. **চন্দ্রবিন্দু (ঁ):**\n   - অক্ষরের পর `^` ব্যবহার করুন অথবা বাংলিশ ডিকশনারির অটো-সাজেশন নিন: `cha^d` বা `chad` $\\rightarrow$ চাঁদ।\n\n> **টিপস:** টাইপিং প্র্যাকটিস করার জন্য আমাদের হোমপেজের **লাইভ সিমুলেটর** ব্যবহার করুন। সেখানে টাইপ করার সাথে সাথেই রিয়েল-টাইমে বাংলা ট্রান্সলেশন দেখতে পাবেন!",
    "views": 0,
    "status": "published"
  },
  {
    "id": "post-001",
    "index": "003",
    "slug": "best-iavro-alternative-for-macos-download-banglish",
    "title": "Best iAvro Alternative for macOS: Download Banglish by Team FramEmpire",
    "seoTitle": "Best iAvro Alternative for macOS: Download Banglish Keyboard",
    "subtitle": "Looking for the best iAvro alternative for macOS? iAvro no longer supports modern Apple Silicon. Download Banglish natively built with Swift 6.",
    "category": "সফটওয়্যার",
    "date": "১৫ অক্টোবর, ২০২৬",
    "isoDate": "2026-10-15",
    "readTime": "৬ মিনিট পড়ার সময়",
    "featured": true,
    "coverImage": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    "coverAlt": "Apple MacBook Pro running Banglish Keyboard on macOS Sequoia",
    "canonical": "https://banglish.bd/blog/best-iavro-alternative-for-macos-download-banglish",
    "author": {
      "name": "A M Pabel",
      "role": "Lead Architecture, Team FramEmpire",
      "avatar": "/assets/pabel_light_avatar.webp"
    },
    "excerpt": "Looking for the best iAvro alternative for macOS? iAvro no longer supports modern Apple Silicon. Download Banglish natively built with Swift 6.",
    "tags": [
      "banglish keyboard",
      "iavro alternative",
      "best avro for mac",
      "bangla keyboard for apple silicon",
      "macos sequoia bangla typing",
      "framempire"
    ],
    "content": "## The Modern Bengali Typing Crisis on macOS\n\nFor over a decade, **iAvro** was the beloved standard for millions of Bengalis worldwide who typed phonetic Bangla on Apple Macintosh computers. However, as Apple transitioned from Intel processors to **Apple Silicon (M1, M2, M3, M4)** and released recent operating systems like **macOS Sonoma and macOS Sequoia**, traditional iAvro broke down completely.\n\nUsers faced severe cursor freezing, missing conjunct characters (*Juktakkhor*), kernel warnings, and layout unresponsiveness. Because legacy open-source projects were abandoned, the community desperately needed a 100% native, high-performance successor.\n\n---\n\n## Enter Banglish Keyboard by Team FramEmpire\n\nSpearheaded by **A M Pabel** and the engineering team at **FramEmpire**, **Banglish Keyboard** was created from the ground up to solve modern macOS and Windows typing challenges.\n\n```text\nBanglish Native Engine Performance Benchmarks\n┌───────────────────────────────┬───────────────────────────────┐\n│ Input Architecture            │ 100% Native Swift 6.0         │\n├───────────────────────────────┼───────────────────────────────┤\n│ Apple Silicon Support         │ M1 / M2 / M3 / M4 Optimized   │\n├───────────────────────────────┼───────────────────────────────┤\n│ Keystroke Latency             │ < 0.8ms (Zero Lag)            │\n├───────────────────────────────┼───────────────────────────────┤\n│ Telemetry & Privacy           │ 100% Offline (Zero Tracking)  │\n└───────────────────────────────┴───────────────────────────────┘\n```\n\n### Key Features of Banglish Keyboard:\n\n1. **Native Apple Silicon Speed**: Compiled natively with Swift 6 for macOS 12+ without Rosetta 2 translation overhead.\n2. **Official Avro Algorithm Parity**: Familiar phonetic rules—`ami` becomes আমি, `bangla` becomes বাংলা, and `amra` auto-corrects to আমরা.\n3. **Seamless Layout Switching**: Toggle instantly between English and Bangla using **Option + Space (⌥ + Space)** or **Control + Space**.\n4. **Complete Privacy**: Banglish does not connect to any telemetry server. Your keystrokes remain strictly offline on your device.\n\n---\n\n## How to Install Banglish on macOS\n\nInstalling Banglish takes less than two minutes:\n\n1. Download the official macOS package: **[Download Banglish for macOS (PKG)](https://banglish.bd)**\n2. Double-click the installer and follow the setup wizard.\n3. Open **System Settings > Keyboard > Text Input > Input Sources > Edit**.\n4. Click **+**, search for **Bengali (বাংলা)**, and select **Banglish (বাংলিশ)**.\n5. You're ready to type Bangla effortlessly across all apps (Word, Chrome, Telegram, VS Code)!",
    "views": 0,
    "status": "published"
  }
];
