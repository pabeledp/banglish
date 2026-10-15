import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy (গোপনীয়তা নীতি) • Banglish Keyboard',
  description: 'Privacy Policy of Banglish Keyboard and banglish.bd website. 100% offline, zero keystroke logging, and complete user privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="relative z-10 flex-grow py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              Legal & Transparency
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy (গোপনীয়তা নীতি)
            </h1>
            <p className="text-sm text-slate-500">
              সর্বশেষ আপডেট: ১৫ অক্টোবর, ২০২৬ • Last Updated: October 15, 2026
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ১. কীবোর্ড ও ইনপুট নিরাপত্তা (100% Offline & Zero Keystroke Logging)
              </h2>
              <p>
                <strong>Banglish কীবোর্ড শতভাগ অফলাইন ও সুরক্ষিত।</strong> এটি আপনার টাইপ করা কোনো অক্ষর, পাসওয়ার্ড, বার্তা বা ব্যক্তিগত তথ্য কখনোই রেকর্ড, সেভ বা কোনো সার্ভারে পাঠায় না। আপনার টাইপিং ডিভাইসের ভেতরেই শতভাগ নিরাপদে প্রসেস হয়।
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ২. ওয়েবসাইট ও ওয়েব টুলস (Website & Web Tools)
              </h2>
              <p>
                banglish.bd ওয়েবসাইটে কোনো অপ্রয়োজনীয় ট্র্যাকার বা থার্ড-পার্টি বিজ্ঞাপন নেই। আমাদের ওয়েব টুলস (যেমন: Text to PNG Sticker Maker, Simulator) সম্পূর্ণ ক্লায়েন্ট-সাইড ব্রাউজারে কাজ করে। আপনার কোনো ইমেজ বা টেক্সট আমাদের সার্ভারে স্টোর হয় না।
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৩. হোয়াটসঅ্যাপ সাপোর্ট অ্যাসিস্ট্যান্ট (WhatsApp Support Bot)
              </h2>
              <p>
                আপনি যখন আমাদের অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইনে মেসেজ পাঠান, তা শুধুমাত্র আপনার প্রশ্নের উত্তর প্রদান ও কাস্টমার সহায়তার জন্য মেটা ক্লাউড এপিআই (Meta Cloud API) এর মাধ্যমে প্রসেস করা হয়। আপনার ফোন নম্বর বা চ্যাট কোনো তৃতীয় পক্ষের কাছে বিক্রি বা বিপণন উদ্দেশ্যে ব্যবহৃত হয় না।
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৪. কুকিজ ও এনালাইটিক্স (Cookies & Analytics)
              </h2>
              <p>
                ওয়েবসাইটের মৌলিক কার্যকারিতা বজায় রাখতে সাধারণ সেশন কুকি ব্যবহৃত হতে পারে। কোনো ধরনের ব্যক্তিগত শনাক্তকরণযোগ্য তথ্য (PII) সংগ্রহ করা হয় না।
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৫. যোগাযোগ (Contact Us)
              </h2>
              <p>
                গোপনীয়তা নীতি সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের সাথে যোগাযোগ করতে পারেন:
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm space-y-1">
                <div><strong>ওয়েবসাইট:</strong> <a href="https://banglish.bd" className="text-emerald-600 hover:underline">banglish.bd</a></div>
                <div><strong>ইমেইল:</strong> <a href="mailto:info@banglish.bd" className="text-emerald-600 hover:underline">info@banglish.bd</a></div>
                <div><strong>ডেভেলপার টিম:</strong> Team FramEmpire (<a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">framempire.com</a>)</div>
              </div>
            </section>

            <div className="pt-4 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                ← মূল পাতায় ফিরে যান (Back to Home)
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
