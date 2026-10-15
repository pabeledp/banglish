import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, Heart, ShieldCheck, Cpu, Code2, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'আমাদের সম্পর্কে (About Us) • Banglish Keyboard & FramEmpire',
  description: 'Banglish Keyboard-এর গল্প, লক্ষ্য এবং ডেভেলপার টিম। জানুন কীভাবে আধুনিক macOS ও Windows-এর জন্য তৈরি হয়েছে দ্রুততম ১০০% নেটিভ বাংলা কীবোর্ড।',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="relative z-10 flex-grow py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
              Our Story & Mission
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-bangla">
              আমাদের সম্পর্কে (About Banglish)
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-bangla max-w-2xl mx-auto leading-relaxed">
              অভ্র শিখিয়েছিল ভাষা উন্মুক্ত করার পাঠ; সেই ভালোবাসাকে ধারণ করেই প্রতিটি আঙুলের ছোঁয়ায় আমরা—বাংলায় লিখি বিজয়ের সুর।
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-10 text-slate-700 leading-relaxed font-bangla">
            
            {/* Story Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  যেভাবে Banglish-এর যাত্রা শুরু
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                ডা. মেহদী হাসান খানের হাত ধরে শুরু হওয়া অভ্র কিবোর্ড বাংলা লেখার জগতকে আমূল বদলে দিয়েছিল। কিন্তু আধুনিক ম্যাকওএস (macOS Sonoma, Sequoia) এবং অ্যাপল সিলিকন (Apple Silicon M1-M4) প্রসেসরে পুরোনো আর্কিটেকচারের iAvro অনেক সময় ল্যাগ করত বা সিস্টেম ইনপুট ক্র্যাশ করত।
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                এই সমস্যাকে চিরতরে দূর করতেই <strong>Banglish Keyboard</strong>-এর জন্ম। অ্যাপলের আধুনিক <em>InputMethodKit</em> ফ্রেমওয়ার্ক এবং <strong>১০০% নেটিভ সুইফট (Swift)</strong> দিয়ে এটি গোড়া থেকে নতুন করে তৈরি করা হয়েছে—যাতে প্রতিটি অক্ষরের টাইপিং হয় শূন্য লেটেন্সি (Zero Latency) এবং নিখুঁত মসৃণতায়। পরবর্তীতে এর সম্প্রসারণ ঘটেছে Windows 10 ও 11 প্ল্যাটফর্মেও।
              </p>
            </section>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                  <Cpu className="w-5 h-5 text-emerald-500" />
                  <span>১০০% নেটিভ ও দ্রুততম</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  কোনো ইমুলেশন বা থার্ড-পার্টি ভারী রানটাইম ছাড়া অ্যাপল সিলিকন ও উইন্ডোজে সরাসরি প্রসেসর অপ্টিমাইজড টাইপিং।
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span>১০০% অফলাইন ও সম্পূর্ণ নিরাপদ</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  জিরো টেলিমেট্রি। টাইপ করা কোনো শব্দ বা কি-স্ট্রোক ইন্টারনেটে পাঠায় না। আপনার পাসওয়ার্ড ও ব্যক্তিগত ডাটা সম্পূর্ণ ডিভাইস-অফলাইনে নিরাপদ।
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                  <Code2 className="w-5 h-5 text-emerald-500" />
                  <span>উন্মুক্ত ও ওপেন সোর্স (MIT)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  বাংলা ভাষার প্রতি শ্রদ্ধা ও দায়বদ্ধতা থেকে এই সফটওয়্যারটি সবার জন্য সম্পূর্ণ ফ্রি এবং ওপেন সোর্স লাইসেন্সে উন্মুক্ত।
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-base">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  <span>৩-ভাষার অভিধান ও ওয়েব টুলস</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">
                  কীবোর্ডের পাশাপাশি বাংলা ⇄ ইংরেজি ⇄ আরবি ত্রিভাষিক ডিকশনারি, পেস্টবিন ও স্টিকার মেকার টুলস বিনামূল্যে উপলব্ধ।
                </p>
              </div>
            </div>

            {/* Creator & Team Section */}
            <section className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  ডেভেলপার ও টিম (Creator & Team)
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Banglish Keyboard ডিজাইন, ডেভেলপ ও পরিচালনা করছে <strong>Team FramEmpire</strong>।
              </p>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white space-y-3 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono">Lead Developer & Founder</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">A M Pabel</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.ampabel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-colors"
                    >
                      www.ampabel.com ↗
                    </a>
                    <a
                      href="https://www.framempire.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                    >
                      framempire.com ↗
                    </a>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-bangla leading-relaxed pt-1">
                  বাংলা ভাষাকে ডিজিটাল মাধ্যমে আরো সমৃদ্ধ, নিরাপদ ও আধুনিক রূপ দেওয়ার লক্ষ্যে নিবেদিত।
                </p>
              </div>
            </section>

            {/* Navigation CTA */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5">
                ← মূল পেজে ফিরে যান
              </Link>
              <div className="flex items-center gap-4 text-slate-600 font-sans">
                <Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link>
                <span>•</span>
                <Link href="/contact" className="hover:text-emerald-600">Contact Us</Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
