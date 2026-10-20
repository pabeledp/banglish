import React from 'react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-20 relative bg-white/80 border-t border-emerald-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold font-bangla uppercase tracking-wider">
            ডেভেলপার ও এজেন্সি পরিচিতি
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-bangla tracking-tight leading-snug">
            সবার জন্য প্রযুক্তির উন্মুক্ত বিস্তার
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-bangla leading-relaxed">
            প্রকল্পটি গর্বের সাথে ডেভেলপ ও পরিচালনা করছে{' '}
            <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-semibold underline decoration-emerald-300 hover:decoration-emerald-700 transition-colors">
              Team FramEmpire
            </a>
            । যেকোনো প্রশ্ন, মতামত বা সাজেশনের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Agency Card / Credit */}
          <div className="hover-card md:col-span-1 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 p-2.5 flex items-center justify-center border border-emerald-500/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono">Developed & Maintained By</span>
                <h3 className="text-2xl font-bold text-white font-sans mt-1">
                  <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 group">
                    <span>Team FramEmpire</span>
                    <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </h3>
                <p className="text-slate-300 text-xs mt-2 font-bangla leading-relaxed">
                  উন্নত সফটওয়্যার ও ডিজিটাল এক্সপেরিয়েন্স তৈরিতে নিবেদিত ক্রিয়েটিভ টেকনোলজি টিম।
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700/60 text-xs text-slate-400 font-sans">
              Lead Developer:{' '}
              <a href="https://www.ampabel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-white font-semibold underline decoration-emerald-400/50 hover:decoration-white transition-colors inline-flex items-center gap-1 group">
                <span>A M Pabel</span>
                <svg className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Methods (2 Columns) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email Card */}
            <a href="mailto:info@banglish.bd" className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Contact Email</span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans group-hover:text-emerald-700 transition-colors mt-0.5 break-all">
                    info@banglish.bd
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-emerald-600 font-bangla flex items-center gap-1">
                <span>ইমেইল পাঠান</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Facebook Page Card */}
            <a href="https://www.facebook.com/banglishkeyboard/" target="_blank" rel="noopener noreferrer" className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Facebook Page</span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans group-hover:text-blue-600 transition-colors mt-0.5">
                    /banglishkeyboard
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-blue-600 font-bangla flex items-center gap-1">
                <span>ফেসবুক পেজে যুক্ত হোন</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Phone Card */}
            <a href="tel:+8801615288259" className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all group flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Phone Number</span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-sans group-hover:text-teal-700 transition-colors mt-0.5">
                    +880 1615-288259
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-teal-600 font-bangla flex items-center gap-1">
                <span>কল করুন বা WhatsApp</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>

            {/* Location Card */}
            <div className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Office Location</span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 font-bangla mt-0.5">
                    Uttara Model Town, Dhaka
                  </div>
                  <div className="text-xs text-slate-500 font-bangla mt-1">
                    উত্তরা মডেল টাউন, ঢাকা, বাংলাদেশ
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-400 font-bangla">
                প্রধান কার্যালয়
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
