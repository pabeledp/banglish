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
              <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-emerald-500/10 p-1.5 flex items-center justify-center border border-emerald-500/30">
                <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" width={36} height={36} className="w-full h-full object-contain block" />
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
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">আমাদের সম্পর্কে (About)</Link></li>
              <li><Link href="/#features" className="hover:text-emerald-400 transition-colors">ফিচারসমূহ</Link></li>
              <li><Link href="/#dictionary" className="hover:text-emerald-400 transition-colors">অভিধান</Link></li>
              <li><Link href="/#simulator" className="hover:text-emerald-400 transition-colors">লাইভ সিমুলেটর</Link></li>
              <li><Link href="/#installation" className="hover:text-emerald-400 transition-colors">ইনস্টলেশন গাইড</Link></li>
              <li><Link href="/#cheatsheet" className="hover:text-emerald-400 transition-colors">কী-ম্যাপ রেফারেন্স</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">যোগাযোগ (Contact Us)</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">আইনি ও রিসোর্স</h4>
            <ul className="space-y-2 text-sm font-bangla">
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors text-slate-300 font-medium">Privacy Policy (গোপনীয়তা নীতি)</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors text-slate-300 font-medium">Terms of Service (ব্যবহারের শর্তাবলি)</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us (সরাসরি যোগাযোগ)</Link></li>
              <li><Link href="/support" className="hover:text-emerald-400 transition-colors text-emerald-400">WhatsApp Help Desk</Link></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="text-sky-400 hover:underline flex items-center gap-1.5"><span>Windows Installer (.exe)</span> <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">Beta</span></a></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
              <li><a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">MIT License</a></li>
            </ul>
          </div>

        </div>

        {/* Dedicated Legal & Information Quick Bar */}
        <div className="pt-8 pb-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-300 font-sans border-b border-slate-900">
          <Link href="/about" className="hover:text-emerald-400 font-medium transition-colors">About</Link>
          <span className="text-slate-600">•</span>
          <Link href="/contact" className="hover:text-emerald-400 font-medium transition-colors">Contact Us</Link>
          <span className="text-slate-600">•</span>
          <Link href="/privacy" className="hover:text-emerald-400 font-medium transition-colors">Privacy Policy</Link>
          <span className="text-slate-600">•</span>
          <Link href="/terms" className="hover:text-emerald-400 font-medium transition-colors">Terms of Service</Link>
          <span className="text-slate-600">•</span>
          <Link href="/support" className="hover:text-emerald-400 font-medium transition-colors text-emerald-400">WhatsApp Support</Link>
        </div>

        {/* Copyright Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-bangla">
          <div>
            © 2026 Banglish. Created with passion by <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-emerald-400 font-medium underline decoration-slate-600 hover:decoration-emerald-400 transition-colors">Team FramEmpire</a>.
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-sans">
            <a href="https://www.facebook.com/banglishkeyboard/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 font-medium">Facebook</a>
            <span>•</span>
            <a href="https://www.ampabel.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 font-medium">www.ampabel.com</a>
            <span>•</span>
            <a href="https://github.com/pabeledp" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">@pabeledp</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
