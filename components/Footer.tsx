import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-850">
          
          {/* Brand Info (2 Columns) */}
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

          {/* Quick Links (নেভিগেশন - Only Features & Tools, no duplicate legal/contact links) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">নেভিগেশন</h4>
            <ul className="space-y-2 text-sm font-bangla">
              <li><Link href="/#features" className="hover:text-emerald-400 transition-colors">ফিচারসমূহ</Link></li>
              <li><Link href="/dictionary" className="hover:text-emerald-400 transition-colors">৩-ভাষার অভিধান</Link></li>
              <li><Link href="/#simulator" className="hover:text-emerald-400 transition-colors">লাইভ সিমুলেটর</Link></li>
              <li><Link href="/#installation" className="hover:text-emerald-400 transition-colors">ইনস্টলেশন গাইড</Link></li>
              <li><Link href="/#cheatsheet" className="hover:text-emerald-400 transition-colors">কী-ম্যাপ রেফারেন্স</Link></li>
              <li><Link href="/text-to-png-converter" className="hover:text-emerald-400 transition-colors">টেক্সট টু পিএনজি স্টিকার</Link></li>
              <li><Link href="/pastebin" className="hover:text-emerald-400 transition-colors">কোড ও টেক্সট পেস্টবিন</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">বাংলিশ ব্লগ ও নলেজবেইজ</Link></li>
            </ul>
          </div>

          {/* Resources & Social Icons (No duplicate text links) */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 font-mono">রিসোর্স ও সোশ্যাল</h4>
            <ul className="space-y-2 text-sm font-bangla">
              <li>
                <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/raw/main/windows/Banglish-Setup.exe" className="text-sky-400 hover:underline flex items-center gap-1.5">
                  <span>Windows Installer (.exe)</span> 
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">Beta</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  MIT Open Source License
                </a>
              </li>
            </ul>

            {/* Social Icons Row (WhatsApp, Facebook, GitHub, Website) */}
            <div className="pt-2">
              <span className="text-xs text-slate-500 font-mono block mb-2.5">কমিউনিটি ও সাপোর্ট:</span>
              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href="/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="WhatsApp Support"
                  aria-label="WhatsApp Support"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.97.589 1.771.913 2.796.913h.005c3.18 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.766-5.767-5.766zm9.969 5.766c0 5.467-4.444 9.912-9.969 9.912-1.744 0-3.376-.454-4.802-1.246l-5.229 1.396 1.42-5.093c-.886-1.488-1.389-3.228-1.389-5.069 0-5.467 4.444-9.912 9.969-9.912 5.467 0 9.969 4.445 9.969 9.912zm-5.727 3.421c-.139-.232-.511-.371-1.069-.649-.557-.279-3.295-1.625-3.806-1.81-.511-.186-.882-.279-1.254.279-.371.557-1.439 1.81-1.764 2.181-.325.371-.65.418-1.208.139-.557-.279-2.353-.868-4.482-2.766-1.657-1.478-2.775-3.303-3.1-3.861-.325-.557-.035-.858.244-1.136.251-.25.557-.65.836-.975.279-.325.371-.557.557-.929.186-.371.093-.697-.046-.975-.139-.279-1.254-3.018-1.718-4.132-.452-1.085-.911-.938-1.254-.955-.325-.016-.697-.02-.1069-.02-.371 0-.975.139-1.486.697-.511.557-1.95 1.904-1.95 4.644 0 2.74 1.996 5.387 2.275 5.758.279.371 3.928 6.001 9.516 8.414 1.329.574 2.367.917 3.176 1.173 1.335.424 2.55.364 3.511.221 1.072-.16 3.295-1.347 3.76-2.647.464-1.301.464-2.415.325-2.647z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/banglishkeyboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="Facebook Community Page"
                  aria-label="Facebook Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com/pabeledp/Banglish-Avro-Keyboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="GitHub Repository"
                  aria-label="GitHub Repository"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                </a>

                {/* Developer Website (Globe) */}
                <a
                  href="https://www.ampabel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  title="Developer Website (www.ampabel.com)"
                  aria-label="Developer Website"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </a>
              </div>
            </div>
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
          <div className="text-slate-500 font-sans text-xs">
            Lead Developer: <a href="https://www.ampabel.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 transition-colors">A M Pabel</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
