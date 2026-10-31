import React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WhatsApp Support • Banglish Keyboard (বাংলা কিবোর্ড)',
  description: 'Banglish Keyboard অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইন। সরাসরি হোয়াটসঅ্যাপ চ্যাটে যুক্ত হতে ক্লিক করুন।',
  openGraph: {
    title: 'Banglish Keyboard — Official WhatsApp Support',
    description: 'Banglish Keyboard অফিশিয়াল হোয়াটসঅ্যাপ হেল্পলাইন। সরাসরি মেসেজ পাঠাতে ক্লিক করুন।',
    url: 'https://banglish.bd/support',
    siteName: 'Banglish Keyboard',
    images: [
      {
        url: 'https://banglish.bd/assets/banglish-og-preview.png',
        width: 1024,
        height: 390,
        type: 'image/png',
        alt: 'Banglish Keyboard WhatsApp Support',
      },
    ],
  },
};

export default function SupportRedirectPage() {
  const whatsappUrl = 'https://wa.me/8801795020192';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Instant Redirection Head Meta */}
      <head>
        <meta httpEquiv="refresh" content={`0; url=${whatsappUrl}`} />
      </head>

      {/* Immediate Client-Side JavaScript Redirect */}
      <Script id="whatsapp-redirect" strategy="afterInteractive">
        {`window.location.replace("${whatsappUrl}");`}
      </Script>

      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-500/10 animate-pulse">
          <MessageCircle className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-white mb-2">
          WhatsApp-এ রিডাইরেক্ট করা হচ্ছে...
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          আপনাকে সরাসরি <strong>Banglish Keyboard</strong> অফিশিয়াল হোয়াটসঅ্যাপ সাপোর্টে নিয়ে যাওয়া হচ্ছে।
        </p>

        <a
          href={whatsappUrl}
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>সরাসরি হোয়াটসঅ্যাপে যান</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <p className="text-xs text-slate-500 mt-4">
          অটোমেটিক ওপেন না হলে উপরের বাটনে ক্লিক করুন
        </p>
      </div>
    </div>
  );
}
