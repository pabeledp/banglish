import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DictionaryApp from '@/components/DictionaryApp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'অভিধান (বাংলা ⇄ English ⇄ العربية) | Banglish Tri-Lingual Dictionary',
  description: 'বাংলা, ইংরেজি ও আরবি ভাষার নির্ভুল তিন ভাষার অভিধান। বাংলা একাডেমি ও কেমব্রিজ অনুমোদিত শব্দভাণ্ডার, অর্থ, উচ্চারণ ও বাস্তব বাক্য প্রয়োগ।',
  keywords: [
    'Bangla to English Dictionary',
    'Bangla to Arabic Dictionary',
    'English to Bengali Dictionary',
    'Arabic to Bengali Dictionary',
    'বাংলা আরবি অভিধান',
    'বাংলা ইংরেজি ডিকশনারি',
    'Banglish Dictionary'
  ]
};

export default function DictionaryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <DictionaryApp />
      </main>
      <Footer />
    </div>
  );
}
