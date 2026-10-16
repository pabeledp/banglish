'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Sparkles, Layers, Check, Copy, ArrowRight, Keyboard, ShieldAlert } from 'lucide-react';

interface RuleItem {
  key: string;
  letter: string;
  kar?: string;
  example: string;
  category: 'vowel' | 'consonant' | 'modifier' | 'conjunct' | 'rule';
  note?: string;
}

export default function Cheatsheet() {
  const [activeTab, setActiveTab] = useState<'all' | 'vowels' | 'consonants' | 'modifiers' | 'conjuncts' | 'rules'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // 1. স্বরবর্ণ ও কার রূপ (Vowels & Signs)
  const vowels: RuleItem[] = [
    { key: 'o', letter: 'অ', kar: '(উহ্য)', example: 'onek → অনেক, omor → অমর', category: 'vowel', note: 'ম এর পর উচ্চারণে অ থাকলে ইংলিশে ও (o) লিখতে হয়।' },
    { key: 'a', letter: 'আ', kar: 'া', example: 'amar → আমার', category: 'vowel' },
    { key: 'i', letter: 'ই', kar: 'ি', example: 'iti → ইতি', category: 'vowel' },
    { key: 'I / ee', letter: 'ঈ', kar: 'ী', example: 'Igol → ঈগল, kI / kee → কী', category: 'vowel', note: 'উচ্চারণে জোর থাকলে ক্যাপিটাল I বা ee ব্যবহার করুন।' },
    { key: 'u / oo', letter: 'উ', kar: 'ু', example: 'ujan / oojan → উজান, bujhi → বুঝি', category: 'vowel' },
    { key: 'U', letter: 'ঊ', kar: 'ূ', example: 'Unocollish → ঊনচল্লিশ, dUr → দূর', category: 'vowel', note: 'ক্যাপিটাল U ব্যবহার করুন।' },
    { key: 'rri', letter: 'ঋ', kar: 'ৃ', example: 'rriju → ঋজু, grriho → গৃহ', category: 'vowel', note: 'সবগুলো ছোট হাতের অক্ষর (rri)।' },
    { key: 'e', letter: 'এ', kar: 'ে', example: 'emon → এমন, keno → কেন', category: 'vowel' },
    { key: 'OI', letter: 'ঐ', kar: 'ৈ', example: 'OIrabot → ঐরাবত, kOI → কৈ', category: 'vowel', note: 'ক্যাপিটাল OI ব্যবহার করুন।' },
    { key: 'O', letter: 'ও', kar: 'ো', example: 'OtoprOto → ওতপ্রোত', category: 'vowel', note: 'ক্যাপিটাল O ব্যবহার করুন।' },
    { key: 'OU', letter: 'ঔ', kar: 'ৌ', example: 'OUpodeshik → ঔপদেশিক, bOU → বৌ', category: 'vowel', note: 'ক্যাপিটাল OU ব্যবহার করুন।' },
  ];

  // 2. ব্যঞ্জনবর্ণ (Consonants)
  const consonants: RuleItem[] = [
    { key: 'k', letter: 'ক', example: 'kaka → কাকা', category: 'consonant' },
    { key: 'kh', letter: 'খ', example: 'khata → খাতা', category: 'consonant' },
    { key: 'g', letter: 'গ', example: 'gan → গান', category: 'consonant' },
    { key: 'gh', letter: 'ঘ', example: 'ghor → ঘর', category: 'consonant' },
    { key: 'Ng', letter: 'ঙ', example: 'roNg → রঙ', category: 'consonant' },
    { key: 'c', letter: 'চ', example: 'cacatobhai → চাচাতো ভাই', category: 'consonant' },
    { key: 'ch', letter: 'ছ', example: 'chobi → ছবি', category: 'consonant' },
    { key: 'j', letter: 'জ', example: 'jol → জল', category: 'consonant' },
    { key: 'jh', letter: 'ঝ', example: 'jhor → ঝড়', category: 'consonant' },
    { key: 'NG', letter: 'ঞ', example: 'miNGa → মিঞা', category: 'consonant' },
    { key: 'T', letter: 'ট', example: 'Taka → টাকা', category: 'consonant' },
    { key: 'Th', letter: 'ঠ', example: 'Thik → ঠিক', category: 'consonant' },
    { key: 'D', letter: 'ড', example: 'Dalim → ডালিম', category: 'consonant' },
    { key: 'Dh', letter: 'ঢ', example: 'Dhaka → ঢাকা', category: 'consonant' },
    { key: 'N', letter: 'ণ', example: 'harN → হার্ণ', category: 'consonant' },
    { key: 't', letter: 'ত', example: 'tumi → তুমি', category: 'consonant' },
    { key: 'th', letter: 'থ', example: 'thamo → থামো', category: 'consonant' },
    { key: 'd', letter: 'দ', example: 'dorja → দরজা', category: 'consonant' },
    { key: 'dh', letter: 'ধ', example: 'dhan → ধান', category: 'consonant' },
    { key: 'n', letter: 'ন', example: 'nodI → নদী', category: 'consonant' },
    { key: 'p', letter: 'প', example: 'pani → পানি', category: 'consonant' },
    { key: 'ph / f', letter: 'ফ', example: 'ful / phul → ফুল', category: 'consonant' },
    { key: 'b', letter: 'ব', example: 'boi → বই', category: 'consonant' },
    { key: 'bh / v', letter: 'ভ', example: 'bhalo → ভালো', category: 'consonant' },
    { key: 'm', letter: 'ম', example: 'ma → মা', category: 'consonant' },
    { key: 'z', letter: 'য', example: 'zoto → যত', category: 'consonant' },
    { key: 'r', letter: 'র', example: 'rat → রাত', category: 'consonant' },
    { key: 'l', letter: 'ল', example: 'lal → লাল', category: 'consonant' },
    { key: 'sh / S', letter: 'শ', example: 'shanti → শান্তি', category: 'consonant' },
    { key: 'Sh', letter: 'ষ', example: 'kaShTo → কষ্ট', category: 'consonant' },
    { key: 's', letter: 'স', example: 'shadhin / sadhin → স্বাধীন', category: 'consonant' },
    { key: 'h', letter: 'হ', example: 'hat → হাত', category: 'consonant' },
    { key: 'R', letter: 'ড়', example: 'gaRi → গাড়ি', category: 'consonant' },
    { key: 'Rh', letter: 'ঢ়', example: 'aShaRh → আষাঢ়', category: 'consonant' },
    { key: 'y / Y', letter: 'য়', example: 'bhoy → ভয়, samia → সামিয়া', category: 'consonant' },
    { key: 't``', letter: 'ৎ', example: 'hot``hat → হঠাৎ', category: 'consonant', note: 't এর পর দুইবার Accent Key (`) চাপুন।' },
    { key: 'ng', letter: 'ং', example: 'bangla → বাংলা', category: 'consonant' },
    { key: ':', letter: 'ঃ', example: 'du:kho → দুঃখ', category: 'consonant', note: 'বিসর্গ (ঃ) লিখতে শুধু কোলন (:) চাপুন।' },
    { key: '^', letter: 'ঁ', example: 'cha^d → চাঁদ', category: 'consonant', note: 'চন্দ্রবিন্দু লিখতে ক্যারেট (^) চাপুন।' },
    { key: 'J', letter: 'জ়', example: 'Juta → জ়ুতা', category: 'consonant', note: 'নুক্তাযুক্ত জ।' },
  ];

  // 3. ফলা ও বিশেষ চিহ্ন (Modifiers, Fola & Punctuation)
  const modifiers: RuleItem[] = [
    { key: 'w (ব্যঞ্জনের পর)', letter: 'ব-ফলা (্ব)', example: 'bishwo → বিশ্ব, udwayI → উদ্বায়ী', category: 'modifier', note: 'কিছু ক্ষেত্রে w ছাড়াও b দিয়ে ব-ফলা লেখা যায় (যেমন: balb → বাল্ব)' },
    { key: 'y / Z (capital)', letter: 'য-ফলা (্য)', example: 'bybohar → ব্যবহার, aZDmin → অ্যাডমিন', category: 'modifier', note: 'ক্যাপিটাল Z দিয়ে যেকোনো স্থানে (এমনকি স্বরবর্ণের পরও) য-ফলা লেখা যায়।' },
    { key: 'r (ব্যঞ্জনের পর)', letter: 'র-ফলা (্র)', example: 'prosonno → প্রসন্ন, pray → প্রায়, protidin → প্রতিদিন', category: 'modifier' },
    { key: 'rr (ব্যঞ্জনের আগে)', letter: 'রেফ (র্)', example: 'orrko → অর্ক, arrtonad → আর্তনাদ, orrthohIn → অর্থহীন', category: 'modifier', note: 'ব্যঞ্জনের ঠিক আগে ডাবল r (rr) লিখলে রেফ হয়।' },
    { key: 'm (ব্যঞ্জনের পর)', letter: 'ম-ফলা (্ম)', example: 'podma → পদ্মা', category: 'modifier' },
    { key: ',, (পরপর দুটি কমা)', letter: 'হসন্ত (্)', example: 'h,, → হসন্ত', category: 'modifier', note: 'যেকোনো ব্যঞ্জনের নিচে হসন্ত দিতে দুটি কমা (,,) চাপুন।' },
    { key: '.', letter: 'দাঁড়ি (।)', example: '. → ।', category: 'modifier', note: 'ইংরেজি ফুলস্টপ দিলে স্বয়ংক্রিয়ভাবে বাংলা দাঁড়ি হবে।' },
    { key: '.`', letter: 'ইংরেজি ডট (.)', example: '.` → .', category: 'modifier', note: 'দাঁড়ির বদলে আসল ডট দিতে ফুলস্টপের পর Accent Key (`) চাপুন অথবা Numpad ব্যবহার করুন।' },
    { key: ':`', letter: 'ইংরেজি কোলন (:)', example: ':` → :', category: 'modifier', note: 'বিসর্গ এড়াতে কোলন দিয়ে Accent Key (`) চাপুন।' },
    { key: '$', letter: 'টাকা চিহ্ন (৳)', example: '$ → ৳', category: 'modifier', note: 'কীবোর্ডের ডলার ($) চাপলে বাংলা টাকা (৳) চিহ্ন তৈরি হবে।' },
  ];

  // 4. সম্পূর্ণ যুক্তাক্ষর তালিকা (Complete Conjuncts Table - 120+)
  const conjuncts: { glyph: string; keys: string; eg?: string }[] = [
    { glyph: 'ক্ক', keys: 'kk' },
    { glyph: 'ক্ট', keys: 'kT' },
    { glyph: 'ক্ত', keys: 'kt', eg: 'roktim → রক্তিম' },
    { glyph: 'ক্ত্র', keys: 'ktr' },
    { glyph: 'ক্ব', keys: 'kw' },
    { glyph: 'ক্ম', keys: 'km' },
    { glyph: 'ক্য', keys: 'ky, kZ' },
    { glyph: 'ক্র', keys: 'kr' },
    { glyph: 'ক্ল', keys: 'kl' },
    { glyph: 'ক্ষ', keys: 'kkh, kx', eg: 'okkhor → অক্ষর' },
    { glyph: 'ক্ষ্ব', keys: 'kkhw, kxw' },
    { glyph: 'ক্ষ্ণ', keys: 'kkhN, kxN' },
    { glyph: 'ক্ষ্ম', keys: 'kkhm, kxm', eg: 'lokkhmi → লক্ষ্মী' },
    { glyph: 'ক্ষ্য', keys: 'kkhy, kxy, kkhZ, kxZ' },
    { glyph: 'ক্স', keys: 'ks' },
    { glyph: 'খ্য', keys: 'khy, khZ' },
    { glyph: 'খ্র', keys: 'khr' },
    { glyph: 'গ্ন', keys: 'gn' },
    { glyph: 'গ্ন্য', keys: 'gny, gnZ' },
    { glyph: 'গ্ব', keys: 'gw' },
    { glyph: 'গ্ম', keys: 'gm' },
    { glyph: 'গ্য', keys: 'gy, gZ' },
    { glyph: 'গ্র', keys: 'gr' },
    { glyph: 'গ্ল', keys: 'gl', eg: 'glOb → গ্লোব' },
    { glyph: 'ঘ্ন', keys: 'ghn' },
    { glyph: 'ঘ্য', keys: 'ghy, ghZ' },
    { glyph: 'ঘ্র', keys: 'ghr' },
    { glyph: 'ঙ্ক', keys: 'nk, Ngk' },
    { glyph: 'ঙ্ক্য', keys: 'nky, Ngky, nkZ, NgkZ' },
    { glyph: 'ঙ্ক্ষ', keys: 'Ngkkh, Ngkx' },
    { glyph: 'ঙ্খ', keys: 'Ngkh' },
    { glyph: 'ঙ্গ', keys: 'Ngg' },
    { glyph: 'ঙ্গ্য', keys: 'Nggy, NggZ' },
    { glyph: 'ঙ্ঘ', keys: 'Nggh' },
    { glyph: 'ঙ্ঘ্য', keys: 'Ngghy, NgghZ' },
    { glyph: 'ঙ্ঘ্র', keys: 'Ngghr' },
    { glyph: 'ঙ্ম', keys: 'Ngm' },
    { glyph: 'চ্চ', keys: 'cc' },
    { glyph: 'চ্ছ', keys: 'cch' },
    { glyph: 'চ্ছ্ব', keys: 'cchw' },
    { glyph: 'চ্ছ্র', keys: 'cchr' },
    { glyph: 'চ্ঞ', keys: 'cNG' },
    { glyph: 'চ্য', keys: 'cy, cZ' },
    { glyph: 'জ্জ', keys: 'jj' },
    { glyph: 'জ্জ্ব', keys: 'jjw' },
    { glyph: 'জ্ঝ', keys: 'jjh' },
    { glyph: 'জ্ঞ', keys: 'gg, jNG', eg: 'biggo → বিজ্ঞ' },
    { glyph: 'জ্ব', keys: 'jw' },
    { glyph: 'জ্য', keys: 'jy, jZ' },
    { glyph: 'জ্র', keys: 'jr' },
    { glyph: 'ঞ্চ', keys: 'nc, NGc' },
    { glyph: 'ঞ্ছ', keys: 'nch, NGch' },
    { glyph: 'ঞ্জ', keys: 'nj, NGj' },
    { glyph: 'ঞ্ঝ', keys: 'njh, NGjh' },
    { glyph: 'ট্ট', keys: 'TT' },
    { glyph: 'ট্ব', keys: 'Tw' },
    { glyph: 'ট্ম', keys: 'Tm' },
    { glyph: 'ট্য', keys: 'Ty, TZ' },
    { glyph: 'ট্র', keys: 'Tr' },
    { glyph: 'ড্ড', keys: 'DD' },
    { glyph: 'ড্য', keys: 'Dy, DZ' },
    { glyph: 'ড্র', keys: 'Dr' },
    { glyph: 'ঢ্য', keys: 'Dhy, DhZ' },
    { glyph: 'ঢ্র', keys: 'Dhr' },
    { glyph: 'ণ্ট', keys: 'NT' },
    { glyph: 'ণ্ঠ', keys: 'NTh' },
    { glyph: 'ণ্ড', keys: 'ND' },
    { glyph: 'ণ্ড্য', keys: 'NDy, NDZ' },
    { glyph: 'ণ্ড্র', keys: 'NDr' },
    { glyph: 'ণ্ঢ', keys: 'NDh' },
    { glyph: 'ণ্ণ', keys: 'Nn' },
    { glyph: 'ণ্ব', keys: 'Nw' },
    { glyph: 'ণ্ম', keys: 'Nm' },
    { glyph: 'ণ্য', keys: 'Ny, NZ' },
    { glyph: 'ত্ত', keys: 'tt' },
    { glyph: 'ত্ত্ব', keys: 'ttw' },
    { glyph: 'ত্থ', keys: 'tth' },
    { glyph: 'ত্ন', keys: 'tn' },
    { glyph: 'ত্ব', keys: 'tw' },
    { glyph: 'ত্ম', keys: 'tm' },
    { glyph: 'ত্ম্য', keys: 'tmy, tmZ' },
    { glyph: 'ত্য', keys: 'ty, tZ' },
    { glyph: 'ত্র', keys: 'tr' },
    { glyph: 'থ্ব', keys: 'thw' },
    { glyph: 'থ্য', keys: 'thy, thZ' },
    { glyph: 'থ্র', keys: 'thr' },
    { glyph: 'দ্গ', keys: 'dg' },
    { glyph: 'দ্ঘ', keys: 'dgh' },
    { glyph: 'দ্দ', keys: 'dd' },
    { glyph: 'দ্দ্ব', keys: 'ddw' },
    { glyph: 'দ্ধ', keys: 'ddh' },
    { glyph: 'দ্ব', keys: 'dw' },
    { glyph: 'দ্ভ', keys: 'dv, dbh' },
    { glyph: 'দ্ম', keys: 'dm' },
    { glyph: 'দ্য', keys: 'dy, dZ' },
    { glyph: 'দ্র', keys: 'dr' },
    { glyph: 'ধ্ন', keys: 'dhn' },
    { glyph: 'ধ্ব', keys: 'dhw' },
    { glyph: 'ধ্ম', keys: 'dhm' },
    { glyph: 'ধ্য', keys: 'dhy, dhZ' },
    { glyph: 'ধ্র', keys: 'dhr' },
    { glyph: 'ন্ট', keys: 'nT' },
    { glyph: 'ন্ঠ', keys: 'nTh' },
    { glyph: 'ন্ড', keys: 'nD' },
    { glyph: 'ন্ত', keys: 'nt', eg: 'onto → অন্ত' },
    { glyph: 'ন্ত্ব', keys: 'ntw' },
    { glyph: 'ন্ত্য', keys: 'nty, ntZ' },
    { glyph: 'ন্ত্র', keys: 'ntr' },
    { glyph: 'ন্থ', keys: 'nth' },
    { glyph: 'ন্দ', keys: 'nd' },
    { glyph: 'ন্দ্য', keys: 'ndy, ndZ' },
    { glyph: 'ন্দ্ব', keys: 'ndw' },
    { glyph: 'ন্দ্র', keys: 'ndr' },
    { glyph: 'ন্ধ', keys: 'ndh' },
    { glyph: 'ন্ধ্য', keys: 'ndhy, ndhZ' },
    { glyph: 'ন্ধ্র', keys: 'ndhr' },
    { glyph: 'ন্ন', keys: 'nn' },
    { glyph: 'ন্ব', keys: 'nw' },
    { glyph: 'ন্ম', keys: 'nm' },
    { glyph: 'ন্য', keys: 'ny, nZ' },
    { glyph: 'ন্স', keys: 'ns' },
    { glyph: 'প্ট', keys: 'pT' },
    { glyph: 'প্ত', keys: 'pt' },
    { glyph: 'প্ন', keys: 'pn' },
    { glyph: 'প্প', keys: 'pp' },
    { glyph: 'প্য', keys: 'py, pZ' },
    { glyph: 'প্র', keys: 'pr' },
    { glyph: 'প্ল', keys: 'pl' },
    { glyph: 'প্স', keys: 'ps' },
    { glyph: 'ফ্র', keys: 'fr, phr' },
    { glyph: 'ফ্ল', keys: 'fl, phl' },
    { glyph: 'ব্দ', keys: 'bd' },
    { glyph: 'ব্ধ', keys: 'bdh' },
    { glyph: 'ব্ব', keys: 'bb' },
    { glyph: 'ব্য', keys: 'by, bZ' },
    { glyph: 'ব্র', keys: 'br' },
    { glyph: 'ব্ল', keys: 'bl' },
    { glyph: 'ভ্য', keys: 'vy, vZ, bhy, bhZ' },
    { glyph: 'ভ্র', keys: 'vr, bhr' },
    { glyph: 'ভ্ল', keys: 'vl, bhl' },
    { glyph: 'ম্ন', keys: 'mn' },
    { glyph: 'ম্প', keys: 'mp' },
    { glyph: 'ম্প্র', keys: 'mpr' },
    { glyph: 'ম্ফ', keys: 'mf, mph' },
    { glyph: 'ম্ব', keys: 'mb, mw', eg: 'sombol → সম্বল' },
    { glyph: 'ম্ভ', keys: 'mv, mbh' },
    { glyph: 'ম্ভ্র', keys: 'mvr, mbhr' },
    { glyph: 'ম্ম', keys: 'mm' },
    { glyph: 'ম্য', keys: 'my, mZ' },
    { glyph: 'ম্র', keys: 'mr' },
    { glyph: 'ম্ল', keys: 'ml' },
    { glyph: 'য্য', keys: 'zy, zZ' },
    { glyph: 'ল্ট', keys: 'lT' },
    { glyph: 'ল্ড', keys: 'lD' },
    { glyph: 'ল্ধ', keys: 'ldh' },
    { glyph: 'ল্প', keys: 'lp' },
    { glyph: 'ল্ব', keys: 'lb, lw' },
    { glyph: 'ল্ভ', keys: 'lv, lbh' },
    { glyph: 'ল্ম', keys: 'lm' },
    { glyph: 'ল্য', keys: 'ly, lZ' },
    { glyph: 'ল্ল', keys: 'll' },
    { glyph: 'ল্ক', keys: 'lk' },
    { glyph: 'ল্গ', keys: 'lg' },
    { glyph: 'শ্চ', keys: 'shc, Sc' },
    { glyph: 'শ্ছ', keys: 'shch, Sch' },
    { glyph: 'শ্ত', keys: 'sht, St' },
    { glyph: 'শ্ন', keys: 'shn, Sn' },
    { glyph: 'শ্ব', keys: 'shw, Sw' },
    { glyph: 'শ্ম', keys: 'shm, Sm' },
    { glyph: 'শ্য', keys: 'shy, shZ, Sy, SZ' },
    { glyph: 'শ্র', keys: 'shr, Sr' },
    { glyph: 'শ্ল', keys: 'shl, Sl' },
    { glyph: 'ষ্ক', keys: 'Shk' },
    { glyph: 'ষ্ক্র', keys: 'Shkr' },
    { glyph: 'ষ্ট', keys: 'ShT' },
    { glyph: 'ষ্ট্য', keys: 'ShTy, ShTZ' },
    { glyph: 'ষ্ট্র', keys: 'ShTr' },
    { glyph: 'ষ্ঠ', keys: 'ShTh' },
    { glyph: 'ষ্ঠ্য', keys: 'ShThy, ShThZ' },
    { glyph: 'ষ্ণ', keys: 'ShN' },
    { glyph: 'ষ্প', keys: 'Shp' },
    { glyph: 'ষ্প্র', keys: 'Shpr' },
    { glyph: 'ষ্ফ', keys: 'Shph, Shf' },
    { glyph: 'ষ্ব', keys: 'Shw' },
    { glyph: 'ষ্ম', keys: 'Shm' },
    { glyph: 'স্ক', keys: 'sk' },
    { glyph: 'স্ক্র', keys: 'skr' },
    { glyph: 'স্ট', keys: 'sT' },
    { glyph: 'স্ট্র', keys: 'sTr' },
    { glyph: 'স্খ', keys: 'skh' },
    { glyph: 'স্ত', keys: 'st' },
    { glyph: 'স্ত্ব', keys: 'stw' },
    { glyph: 'স্ত্য', keys: 'sty, stZ' },
    { glyph: 'স্থ', keys: 'sth' },
    { glyph: 'স্থ্য', keys: 'sthy, sthZ' },
    { glyph: 'স্ন', keys: 'sn' },
    { glyph: 'স্প', keys: 'sp' },
    { glyph: 'স্ফ', keys: 'sf, sph' },
    { glyph: 'স্ব', keys: 'sw' },
    { glyph: 'স্ম', keys: 'sm' },
    { glyph: 'স্য', keys: 'sy, sZ' },
    { glyph: 'স্র', keys: 'sr' },
    { glyph: 'স্ল', keys: 'sl' },
    { glyph: 'সক্ল', keys: 'skl' },
    { glyph: 'হ্ণ', keys: 'hN' },
    { glyph: 'হ্ন', keys: 'hn' },
    { glyph: 'হ্ব', keys: 'hw' },
    { glyph: 'হ্ম', keys: 'hm', eg: 'brahmoN → ব্রাহ্মণ' },
    { glyph: 'হ্য', keys: 'hy, hZ' },
    { glyph: 'হ্র', keys: 'hr' },
    { glyph: 'হ্ল', keys: 'hl' },
    { glyph: 'হৃ', keys: 'hrri' },
  ];

  // Search Filter
  const filteredConjuncts = useMemo(() => {
    if (!searchQuery) return conjuncts;
    const q = searchQuery.toLowerCase().trim();
    return conjuncts.filter(c => 
      c.glyph.includes(q) || 
      c.keys.toLowerCase().includes(q) ||
      (c.eg && c.eg.toLowerCase().includes(q))
    );
  }, [searchQuery, conjuncts]);

  const filteredVowels = useMemo(() => {
    if (!searchQuery) return vowels;
    const q = searchQuery.toLowerCase().trim();
    return vowels.filter(v => 
      v.letter.includes(q) || 
      v.key.toLowerCase().includes(q) || 
      v.example.toLowerCase().includes(q)
    );
  }, [searchQuery, vowels]);

  const filteredConsonants = useMemo(() => {
    if (!searchQuery) return consonants;
    const q = searchQuery.toLowerCase().trim();
    return consonants.filter(c => 
      c.letter.includes(q) || 
      c.key.toLowerCase().includes(q) || 
      c.example.toLowerCase().includes(q)
    );
  }, [searchQuery, consonants]);

  const filteredModifiers = useMemo(() => {
    if (!searchQuery) return modifiers;
    const q = searchQuery.toLowerCase().trim();
    return modifiers.filter(m => 
      m.letter.includes(q) || 
      m.key.toLowerCase().includes(q) || 
      m.example.toLowerCase().includes(q)
    );
  }, [searchQuery, modifiers]);

  return (
    <section id="cheatsheet" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50/70 via-white to-emerald-50/20 border-t border-b border-emerald-100/70 relative">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold font-mono uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>অফিসিয়াল অভ্র ফোনেটিক স্কিম নির্দেশিকা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            সম্পূর্ণ ফোনেটিক কী-চার্ট ও টাইপিং গাইড
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-bangla leading-relaxed">
            ইংরেজি অক্ষরের উচ্চারণে স্বয়ংক্রিয়ভাবে বাংলা লেখার জন্য অভ্র ফোনেটিকের পূর্ণাঙ্গ বর্ণতালিকা, কার, ফলা এবং ১২০+ যুক্তাক্ষরের নির্ভুল রেফারেন্স।
          </p>
        </div>

        {/* Global Instant Search Bar & Tab Navigation */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="সার্চ করুন (যেমন: ক্ষ, জ্ঞ, kkh, shr, ষ্ণ, ইত্যাদি)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  ক্লিয়ার
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/90 rounded-2xl">
              {[
                { id: 'all', label: 'সকল চার্ট' },
                { id: 'vowels', label: '১. স্বরবর্ণ ও কার' },
                { id: 'consonants', label: '২. ব্যঞ্জনবর্ণ' },
                { id: 'modifiers', label: '৩. ফলা ও রেফ' },
                { id: 'conjuncts', label: '৪. যুক্তাক্ষর (১২০+)' },
                { id: 'rules', label: '৫. বিশেষ নিয়ম' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer font-bangla ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* 1. স্বরবর্ণ ও কার রূপ (Vowels Table) */}
        {(activeTab === 'all' || activeTab === 'vowels') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="px-6 py-4.5 bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-teal-50/20 border-b border-slate-200/80 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>১. স্বরবর্ণ ও কার/মাত্রা লেখার নিয়ম (Vowels & Signs)</span>
              </h3>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1 rounded-full">
                ১১টি স্বরবর্ণ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bangla text-xs">
                    <th className="py-3 px-5 sm:px-6 font-bold">ইংলিশ ক্যারেক্টার</th>
                    <th className="py-3 px-5 sm:px-6 font-bold">বাংলা মূল স্বরবর্ণ</th>
                    <th className="py-3 px-5 sm:px-6 font-bold">সংক্ষিপ্ত রূপ (কার)</th>
                    <th className="py-3 px-5 sm:px-6 font-bold">টাইপিং উদাহরণ</th>
                    <th className="py-3 px-5 sm:px-6 font-bold">বিশেষ নোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bangla">
                  {filteredVowels.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 sm:px-6 font-mono font-bold text-emerald-700">
                        <span className="bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                          {v.key}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-xl font-bold text-slate-900">
                        {v.letter}
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-xl font-bold text-emerald-600">
                        {v.kar}
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-slate-700 font-mono text-xs">
                        {v.example}
                      </td>
                      <td className="py-3.5 px-5 sm:px-6 text-slate-500 text-xs">
                        {v.note || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. ব্যঞ্জনবর্ণ (Consonants Grid) */}
        {(activeTab === 'all' || activeTab === 'consonants') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>২. ব্যঞ্জনবর্ণ তালিকা (Consonants & Signs)</span>
                </h3>
                <p className="text-xs text-slate-500 font-bangla mt-0.5">
                  ক্যাপিটাল ও স্মল লেটারের পার্থক্য অনুযায়ী সঠিক ব্যঞ্জনবর্ণ টাইপ করুন।
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1 rounded-full">
                ৩৯টি বর্ণ ও চিহ্ন
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {filteredConsonants.map((c, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleCopy(c.key)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer relative"
                  title="কপি করতে ক্লিক করুন"
                >
                  <div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-800 block">
                      {c.key}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bangla block truncate max-w-[80px]">
                      {c.example.split('→')[0]}
                    </span>
                  </div>
                  <span className="font-bangla text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">
                    {c.letter}
                  </span>
                  {copiedKey === c.key && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow z-10">
                      কপি হয়েছে!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ফলা, রেফ ও বিশেষ চিহ্ন (Modifiers, Fola & Punctuation) */}
        {(activeTab === 'all' || activeTab === 'modifiers') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>৩. ফলা, রেফ ও যতিচিহ্ন লেখার নিয়ম (Modifiers & Signs)</span>
                </h3>
                <p className="text-xs text-slate-500 font-bangla mt-0.5">
                  ব-ফলা, য-ফলা, র-ফলা, রেফ, হসন্ত ও দাঁড়ি লেখার সহজ কৌশল।
                </p>
              </div>
              <span className="text-xs font-mono text-teal-700 font-bold bg-teal-100/80 px-3 py-1 rounded-full">
                ১০টি নিয়ম
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredModifiers.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {m.key}
                    </span>
                    <span className="text-lg font-bold text-slate-900 font-bangla">
                      {m.letter}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-mono bg-white p-2 rounded-xl border border-slate-200/60">
                    {m.example}
                  </div>
                  {m.note && (
                    <p className="text-[11px] text-slate-500 font-bangla leading-relaxed">
                      💡 {m.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. সম্পূর্ণ যুক্তাক্ষর তালিকা (Complete Conjuncts - 120+) */}
        {(activeTab === 'all' || activeTab === 'conjuncts') && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>৪. পূর্ণাঙ্গ বাংলা যুক্তাক্ষর ও যুক্তবর্ণের তালিকা (Complete Conjuncts)</span>
                </h3>
                <p className="text-xs text-slate-500 font-bangla mt-0.5">
                  যেসব বর্ণ পাশাপাশি লিখলে স্বয়ংক্রিয়ভাবে জটিল যুক্তবর্ণ গঠিত হয়। যেকোনোটিতে ক্লিক করে কি-কোড কপি করতে পারেন।
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
                {filteredConjuncts.length} টি যুক্তাক্ষর
              </span>
            </div>

            {/* Quick Conjuncts Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredConjuncts.map((cj, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(cj.keys)}
                  className="p-3 rounded-2xl bg-slate-50/90 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 transition-all flex flex-col items-center justify-center gap-1 group cursor-pointer relative"
                  title={`${cj.glyph} লিখতে টাইপ করুন: ${cj.keys}`}
                >
                  <span className="font-bangla text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">
                    {cj.glyph}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-center w-full truncate">
                    {cj.keys}
                  </span>
                  {cj.eg && (
                    <span className="text-[10px] text-slate-400 font-mono truncate w-full text-center">
                      {cj.eg.split('→')[0]}
                    </span>
                  )}
                  {copiedKey === cj.keys && (
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow z-10">
                      কপি হয়েছে!
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. বিশেষ নিয়ম ও অটোকরেক্ট ট্রিকস (Special Rules & Tricks) */}
        {(activeTab === 'all' || activeTab === 'rules') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Rule Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs font-mono">
                  ১
                </div>
                <h4 className="font-bold text-slate-900 font-bangla text-base">জোরপূর্বক মূল স্বরবর্ণ</h4>
              </div>
              <p className="text-xs text-slate-600 font-bangla leading-relaxed">
                ব্যঞ্জনের পর কার-চিহ্ন না হয়ে যদি মূল স্বরবর্ণ প্রয়োজন হয়, তবে মাঝে <strong>Accent Key (`)</strong> ব্যবহার করুন:
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-800">
                <div><span className="text-emerald-700 font-bold">eki</span> → একি</div>
                <div><span className="text-emerald-700 font-bold">ek`i</span> → একই</div>
                <div><span className="text-emerald-700 font-bold">`o / `a / `i</span> → অ / আ / ই</div>
              </div>
            </div>

            {/* Rule Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs font-mono">
                  ২
                </div>
                <h4 className="font-bold text-slate-900 font-bangla text-base">যুক্তাক্ষর হতে বাধা দেয়া</h4>
              </div>
              <p className="text-xs text-slate-600 font-bangla leading-relaxed">
                দুটি ব্যঞ্জনবর্ণের মাঝে <strong>Accent Key (`)</strong> দিলে তারা যুক্তবর্ণ হবে না, আলাদা থাকবে:
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-800">
                <div><span className="text-rose-600 font-bold">ekTa</span> → এক্টা (ভুল)</div>
                <div><span className="text-emerald-700 font-bold">ek`Ta</span> → একটা (সঠিক)</div>
                <div><span className="text-emerald-700 font-bold">ag`lano</span> → আগলানো</div>
              </div>
            </div>

            {/* Rule Card 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs font-mono">
                  ৩
                </div>
                <h4 className="font-bold text-slate-900 font-bangla text-base">অটোকরেক্ট ও ডিকশনারি</h4>
              </div>
              <p className="text-xs text-slate-600 font-bangla leading-relaxed">
                ব্যতিক্রমী শব্দগুলো প্রতিবার Accent Key দিয়ে না লিখে বাংলিশের স্বয়ংক্রিয় অটোকরেক্ট ফিচার ব্যবহার করুন:
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-800">
                <div><span className="text-blue-700 font-bold">amra</span> → আমরা (অটো-কারেক্ট)</div>
                <div><span className="text-blue-700 font-bold">software</span> → সফটওয়্যার</div>
                <div><span className="text-blue-700 font-bold">samia</span> → সামিয়া</div>
              </div>
            </div>

          </div>
        )}

        {/* Practice Live CTA Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-emerald-950/10">
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold font-bangla">এখনই টাইপিং প্র্যাকটিস করতে চান?</h3>
            <p className="text-xs sm:text-sm text-emerald-100 font-bangla max-w-xl">
              আমাদের হোমপেজের লাইভ সিমুলেটরে যেকোনো ইংরেজি বাক্য লিখুন এবং দেখুন কীভাবে তা নিমেষেই নিখুঁত বাংলায় রূপান্তর হয়।
            </p>
          </div>

          <a
            href="/#simulator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold font-bangla transition-all shadow-md shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>লাইভ সিমুলেটর চালু করুন</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </a>
        </div>

      </div>
    </section>
  );
}
