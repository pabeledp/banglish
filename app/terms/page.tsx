import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service (ব্যবহারের শর্তাবলি) • Banglish Keyboard',
  description: 'Terms of Service and legal usage conditions for Banglish Keyboard software and banglish.bd website.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="relative z-10 flex-grow py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider font-mono">
              Legal Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-bangla">
              Terms of Service (ব্যবহারের শর্তাবলি)
            </h1>
            <p className="text-sm text-slate-500 font-bangla">
              সর্বশেষ সংস্করণ: ১৫ অক্টোবর, ২০২৬ • Effective Date: October 15, 2026
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base font-bangla">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ১. শর্তাবলি গ্রহণ (Acceptance of Terms)
              </h2>
              <p>
                <strong>banglish.bd</strong> ওয়েবসাইট ভিজিট করার মাধ্যমে কিংবা <strong>Banglish Keyboard</strong> সফটওয়্যারটি ডাউনলোড বা ব্যবহারের মাধ্যমে আপনি এই ব্যবহারের শর্তাবলি এবং আমাদের <Link href="/privacy" className="text-emerald-600 hover:underline font-semibold">Privacy Policy</Link> মেনে নিতে সম্মত হচ্ছেন। আপনি যদি এই শর্তগুলোর সাথে সম্মত না হন, তবে অনুগ্রহ করে সফটওয়্যার বা ওয়েবসাইট ব্যবহার থেকে বিরত থাকুন।
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ২. ওপেন সোর্স ও লাইসেন্স (Open Source & License)
              </h2>
              <p>
                Banglish Keyboard একটি উন্মুক্ত ও বিনামূল্যের সফটওয়্যার যা <strong>MIT License</strong>-এর অধীনে প্রকাশিত। আপনি সফটওয়্যারটি ব্যক্তিগত বা পেশাগত যেকোনো উদ্দেশ্যে ফ্রিতে ডাউনলোড, ব্যবহার এবং মডিফাই করতে পারবেন, যদি লাইসেন্স শর্তাবলি বজায় রাখা হয়।
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৩. গ্রহণযোগ্য ব্যবহার (Acceptable Use)
              </h2>
              <p>
                ব্যবহারকারী হিসেবে আপনি সম্মত হচ্ছেন যে:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                <li>ওয়েবসাইট বা সার্ভিসে ব্যাঘাত ঘটে এমন কোনো ক্ষতিকর কোড বা স্ক্রিপ্ট চালাবেন না।</li>
                <li>আমাদের ট্রেডমার্ক, ব্র্যান্ড পরিচয় বা কনটেন্ট বিভ্রান্তিকরভাবে অননুমোদিত কাজে ব্যবহার করবেন না।</li>
                <li>প্রযোজ্য রাষ্ট্রীয় ও আন্তর্জাতিক আইন মেনে সফটওয়্যার ও ওয়েব টুলস ব্যবহার করবেন।</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৪. দায়মুক্তি ও ওয়ারেন্টি (Disclaimer & Limitation of Liability)
              </h2>
              <p>
                Banglish Keyboard "যেমন আছে" (AS IS) এবং "যেমন পাওয়া যায়" (AS AVAILABLE) ভিত্তিতে প্রদান করা হয়। কোনো প্রকার প্রত্যক্ষ বা পরোক্ষ ওয়ারেন্টি ছাড়াই এটি উন্মুক্ত করা হয়েছে। ব্যবহারকারীর অপারেটিং সিস্টেমের কোনো অসঙ্গতি বা ডাটা সংক্রান্ত যেকোনো বিষয়ের জন্য টিম FramEmpire কোনো আর্থিক বা পরোক্ষ ক্ষতির দায় বহন করবে না।
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৫. শর্তাবলির পরিবর্তন (Changes to Terms)
              </h2>
              <p>
                আমরা যেকোনো সময় এই শর্তাবলি হালনাগাদ করার অধিকার সংরক্ষণ করি। সংশোধিত শর্তাবলি ওয়েবসাইটে প্রকাশের সাথে সাথে তা কার্যকর হবে। নিয়মিত ওয়েবসাইট ভিজিট করে শর্তাবলি দেখে নেওয়া ব্যবহারকারীর দায়িত্ব।
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                ৬. যোগাযোগ (Contact Us)
              </h2>
              <p>
                ব্যবহারের শর্তাবলি সংক্রান্ত যেকোনো প্রশ্ন বা ব্যাখ্যার জন্য আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm space-y-1 font-sans">
                <div><strong>Website:</strong> <a href="https://banglish.bd" className="text-emerald-600 hover:underline">banglish.bd</a></div>
                <div><strong>Email:</strong> <a href="mailto:info@banglish.bd" className="text-emerald-600 hover:underline">info@banglish.bd</a></div>
                <div><strong>Support:</strong> <Link href="/contact" className="text-emerald-600 hover:underline">banglish.bd/contact</Link> (WhatsApp: <Link href="/support" className="text-emerald-600 hover:underline">banglish.bd/support</Link>)</div>
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
