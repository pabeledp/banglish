import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, BookOpen, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decor & Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-60" aria-hidden="true" />
      <div className="fixed -top-40 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 -left-32 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating Bengali Glyphs */}
      <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden font-bangla" aria-hidden="true">
        <span className="absolute top-[18%] left-[8%] text-6xl sm:text-8xl font-bold text-emerald-800/10 blur-[2px]">ক</span>
        <span className="absolute top-[60%] right-[10%] text-6xl sm:text-8xl font-bold text-teal-800/10 blur-[3px]">খ</span>
        <span className="absolute bottom-[20%] left-[15%] text-7xl sm:text-9xl font-bold text-emerald-900/10 blur-[2.5px]">ব</span>
        <span className="absolute bottom-[15%] right-[20%] text-7xl sm:text-9xl font-bold text-teal-900/10 blur-[3px]">শ</span>
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-16 sm:py-24 relative z-10">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-xl shadow-emerald-950/5 border border-emerald-100 text-center">
          
          {/* 404 Badge */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 font-extrabold text-3xl font-mono mb-6 border border-emerald-200/60 shadow-inner">
            404
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-bangla mb-3">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-slate-600 font-bangla text-sm sm:text-base leading-relaxed mb-8">
            আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি হয়তো স্থানান্তরিত হয়েছে অথবা এর ইউআরএল ঠিকানা ভুল রয়েছে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-bangla">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <Home className="w-4 h-4" />
              <span>হোমপেজে ফিরে যান</span>
            </Link>

            <Link
              href="/blog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-200/80 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>ব্লগ পড়ুন</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
