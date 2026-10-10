import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-850">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 p-1.5 flex items-center justify-center border border-emerald-500/30">
                <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white font-sans leading-none">Banglish</span>
                <span className="text-xs text-emerald-400 font-bangla mt-1">বাংলায় লিখি বিজয়ের সুর</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 font-bangla max-w-sm leading-relaxed">
              অভ্র শিখিয়েছিল ভাষা উন্মুক্ত করার পাঠ; সেই ভালোবাসাকে ধারণ করেই প্রতিটি আঙুলের ছোঁয়ায় আমরা—বাংলায় লিখি বিজয়ের সুর।
            </p>
            <div className="pt-2 text-xs text-slate-500 font-mono">
              Designed for macOS & Windows Ecosystems.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">নেভিগেশন</h4>
            <ul className="space-y-2 text-sm font-bangla">
              <li><Link href="/#features" className="hover:text-emerald-400 transition-colors">ফিচারসমূহ</Link></li>
              <li><Link href="/dictionary" className="text-emerald-400 hover:underline flex items-center gap-1.5"><span>৩-ভাষার অভিধান</span> <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-mono">New</span></Link></li>
              <li><Link href="/#simulator" className="hover:text-emerald-400 transition-colors">লাইভ সিমুলেটর</Link></li>
              <li><Link href="/#installation" className="hover:text-emerald-400 transition-colors">ইনস্টলেশন গাইড</Link></li>
              <li><Link href="/#cheatsheet" className="hover:text-emerald-400 transition-colors">কী-ম্যাপ রেফারেন্স</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">যোগাযোগ পৃষ্ঠা</Link></li>
            </ul>
          </div>

          {/* Legal & Download */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">রিসোর্স ও লাইসেন্স</h4>
            <ul className="space-y-2 text-sm font-bangla">
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/releases/latest/download/Banglish.dmg" className="text-emerald-400 hover:underline">Download macOS (.dmg)</a></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="text-sky-400 hover:underline">Download Windows (.exe)</a></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">MIT Open Source License</a></li>
              <li><a href="mailto:info@banglish.bd" className="hover:text-emerald-400 transition-colors">সরাসরি ইমেইল সাপোর্ট</a></li>
            </ul>
          </div>

        </div>

        {/* Copyright Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bangla">
          <div>
            © 2026 Banglish. Created with passion by <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 font-medium underline decoration-slate-600 hover:decoration-emerald-400 transition-colors">Team FramEmpire</a>.
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-sans">
            <a href="https://www.ampabel.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-medium">www.ampabel.com</a>
            <span>•</span>
            <a href="https://github.com/pabeledp" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">@pabeledp</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
