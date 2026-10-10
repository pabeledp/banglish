'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:info@banglish.bd?subject=${encodeURIComponent(subject || 'Banglish Feedback')}&body=${encodeURIComponent(`নাম: ${name}\n\nবার্তা:\n${message}`)}`;
    window.location.href = mailto;
    setStatus('success');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="relative z-10 flex-grow py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold font-bangla uppercase tracking-wider">
              যোগাযোগ ও সাপোর্ট • Contact Us
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 font-bangla tracking-tight leading-snug">
              আমাদের সাথে যোগাযোগ করুন
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-bangla leading-relaxed">
              Banglish কীবোর্ড ও ৩-ভাষার অভিধান সংক্রান্ত যেকোনো প্রশ্ন, টেকনিক্যাল সহায়তা, বাগ রিপোর্ট বা পরামর্শ জানাতে আমরা পাশে আছি।
            </p>
          </div>

          {/* Contact Info Cards Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* Agency Card */}
            <div className="hover-card md:col-span-1 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 p-2.5 flex items-center justify-center border border-emerald-500/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono">Developed & Maintained By</span>
                  <h2 className="text-2xl font-bold text-white font-sans mt-1">
                    <a href="https://www.framempire.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5 group">
                      <span>Team FramEmpire</span>
                      <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                  </h2>
                  <p className="text-slate-300 text-xs mt-2 font-bangla leading-relaxed">
                    উন্নত সফটওয়্যার ও ডিজিটাল এক্সপেরিয়েন্স তৈরিতে নিবেদিত ক্রিয়েটিভ টেকনোলজি টিম।
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/60 text-xs text-slate-400 font-sans">
                Lead Developer: <a href="https://www.ampabel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-white font-semibold underline decoration-emerald-400/50 hover:decoration-white transition-colors inline-flex items-center gap-1 group">
                  <span>A M Pabel</span>
                  <svg className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Email Card */}
              <a href="mailto:info@banglish.bd" className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
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
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </a>

              {/* GitHub Card */}
              <a href="https://github.com/pabeledp/Banglish-Avro-Keyboard/issues" target="_blank" rel="noopener noreferrer" className="hover-card p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all group flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase font-mono">Bug Report & Feedback</span>
                    <div className="text-sm sm:text-base font-bold text-slate-900 font-sans group-hover:text-emerald-700 transition-colors mt-0.5">
                      GitHub Issues
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-emerald-600 font-bangla flex items-center gap-1">
                  <span>ইস্যু তৈরি করুন</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </div>
              </a>

            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 font-bangla mb-4">সরাসরি বার্তা পাঠান</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase font-mono mb-1">আপনার নাম</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="আপনার শুভনাম"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase font-mono mb-1">বিষয় (Subject)</label>
                <input 
                  type="text" 
                  required 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" 
                  placeholder="কী বিষয়ে জানতে চান?"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase font-mono mb-1">আপনার বার্তা</label>
                <textarea 
                  required 
                  rows={4} 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-sans" 
                  placeholder="আপনার বার্তা বা ফিডব্যাক বিস্তারিত লিখুন..."
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold font-bangla transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                বার্তা পাঠান (Send Message)
              </button>
              {status === 'success' && (
                <p className="text-xs text-emerald-700 font-bangla text-center pt-2">
                  ✓ আপনার ইমেইল ক্লায়েন্ট ওপেন হয়েছে!
                </p>
              )}
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
