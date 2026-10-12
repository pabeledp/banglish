import React from 'react';

export default function Cheatsheet() {
  const vowels = [
    { key: 'o / a', letter: 'অ', kar: '(উহ্য)', example: 'onek → অনেক' },
    { key: 'a / A / aa', letter: 'আ', kar: 'া', example: 'aakash → আকাশ, baba → বাবা' },
    { key: 'i', letter: 'ই', kar: 'ি', example: 'iti → ইতি, kintu → কিন্তু' },
    { key: 'I / ee', letter: 'ঈ', kar: 'ী', example: 'Ishwar → ঈশ্বর, nodI → নদী' },
    { key: 'u', letter: 'উ', kar: 'ু', example: 'upor → উপর, tumi → তুমি' },
    { key: 'U / oo', letter: 'ঊ', kar: 'ূ', example: 'Usha → ঊষা, mUlo → মূলো' },
    { key: 'rri', letter: 'ঋ', kar: 'ৃ', example: 'rritu → ঋতু, kripa → কৃপা' },
    { key: 'e', letter: 'এ', kar: 'ে', example: 'ekhon → এখন, desh → দেশ' },
    { key: 'OI / oi', letter: 'ঐ', kar: 'ৈ', example: 'Oikyo → ঐক্য, toiri → তৈরি' },
    { key: 'O / o', letter: 'ও', kar: 'ো', example: 'olpo → অল্প, kothao → কোথাও' },
    { key: 'OU / ou', letter: 'ঔ', kar: 'ৌ', example: 'OUshodh → ঔষধ, pOUsh → পৌষ' },
  ];

  const consonants = [
    { key: 'k', letter: 'ক' },
    { key: 'kh', letter: 'খ' },
    { key: 'g', letter: 'গ' },
    { key: 'gh', letter: 'ঘ' },
    { key: 'Ng', letter: 'ঙ' },
    { key: 'c / ch', letter: 'চ' },
    { key: 'Ch', letter: 'ছ' },
    { key: 'j', letter: 'জ' },
    { key: 'jh', letter: 'ঝ' },
    { key: 'NG', letter: 'ঞ' },
    { key: 'T', letter: 'ট' },
    { key: 'Th', letter: 'ঠ' },
    { key: 'D', letter: 'ড' },
    { key: 'Dh', letter: 'ঢ' },
    { key: 'N', letter: 'ণ' },
    { key: 't', letter: 'ত' },
    { key: 'th', letter: 'থ' },
    { key: 'd', letter: 'দ' },
    { key: 'dh', letter: 'ধ' },
    { key: 'n', letter: 'ন' },
    { key: 'p', letter: 'প' },
    { key: 'f / ph', letter: 'ফ' },
    { key: 'b', letter: 'ব' },
    { key: 'bh / v', letter: 'ভ' },
    { key: 'm', letter: 'ম' },
    { key: 'z / y', letter: 'য' },
    { key: 'r', letter: 'র' },
    { key: 'l', letter: 'ল' },
    { key: 'sh / S', letter: 'শ' },
    { key: 'Sh', letter: 'ষ' },
    { key: 's', letter: 'স' },
    { key: 'h', letter: 'হ' },
    { key: 'R', letter: 'ড়' },
    { key: 'Rh', letter: 'ঢ়' },
    { key: 'y / Y', letter: 'য়' },
  ];

  const specialSigns = [
    { key: '`t', letter: 'ৎ' },
    { key: 'ng', letter: 'ং' },
    { key: '`:', letter: 'ঃ' },
    { key: '^ / **', letter: 'ঁ' },
    { key: '. (Dot)', letter: '।' },
  ];

  return (
    <section id="cheatsheet" className="py-16 sm:py-20 bg-slate-50/70 border-t border-b border-emerald-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold font-mono uppercase tracking-wider">
            Avro Phonetic Scheme Reference
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Phonetic Typing Guide & Key Chart <span className="block text-xl sm:text-2xl text-emerald-700 font-bangla font-bold mt-1">(টাইপিং গাইড ও বর্ণ চার্ট)</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Banglish implements the standard Avro Phonetic scheme. Here is the complete, clean reference guide for vowels, consonants, modifiers (ফলা), and complex conjuncts (যুক্তাক্ষর).
          </p>
        </div>

        {/* 1. Vowels & Signs Table */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="px-5 py-4 sm:px-6 sm:py-4.5 bg-gradient-to-r from-emerald-50/90 to-teal-50/50 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ১. স্বরবর্ণ ও কার চিহ্ন (Vowels & Signs)
            </h3>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-100/70 px-2.5 py-0.5 rounded-full">11 Vowels</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-600 font-mono text-[11px] sm:text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6 font-semibold">English Key</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">বাংলা স্বরবর্ণ</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">কার রূপ</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">উদাহরণ (Example)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {vowels.map((v, idx) => {
                  const parts = v.example.split(/→|,/);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-mono font-bold text-emerald-700">{v.key}</td>
                      <td className="py-3 px-4 sm:px-6 font-bangla text-base sm:text-lg font-bold text-slate-900">{v.letter}</td>
                      <td className={`py-3 px-4 sm:px-6 font-bangla ${v.kar.startsWith('(') ? 'text-slate-500 italic' : 'text-base sm:text-lg font-bold text-emerald-600'}`}>
                        {v.kar}
                      </td>
                      <td className="py-3 px-4 sm:px-6 font-bangla text-slate-700">
                        {v.example.includes(',') ? (
                          <>
                            <span className="font-mono text-slate-500">{parts[0]?.trim()}</span> → <strong className="text-slate-900 font-bold">{parts[1]?.trim()}</strong>,{' '}
                            <span className="font-mono text-slate-500">{parts[2]?.trim()}</span> → <strong className="text-slate-900">{parts[3]?.trim()}</strong>
                          </>
                        ) : (
                          <>
                            <span className="font-mono text-slate-500">{parts[0]?.trim()}</span> → <strong className="text-slate-900 font-bold">{parts[1]?.trim()}</strong>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Consonants & Special Signs Grid */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ২. ব্যঞ্জনবর্ণ ও চিহ্ন (Consonants & Signs)
            </h3>
            <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-100/70 px-2.5 py-0.5 rounded-full">39 Consonants & Marks</span>
          </div>

          {/* Responsive 5-column Consonants Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            {consonants.map((c, idx) => (
              <div key={idx} className="hover-card p-3 rounded-xl bg-slate-50/80 hover:bg-emerald-50/50 border border-slate-200/80 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-semibold text-emerald-700">{c.key}</span>
                <span className="font-bangla text-xl sm:text-2xl font-bold text-slate-900">{c.letter}</span>
              </div>
            ))}

            {/* Special Signs & Diacritics */}
            {specialSigns.map((s, idx) => (
              <div key={idx} className="hover-card p-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-200/90 flex items-center justify-between">
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-800">{s.key}</span>
                <span className="font-bangla text-xl sm:text-2xl font-bold text-slate-900">{s.letter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Modifiers (ফলা), Conjuncts (যুক্তাক্ষর) & Shortcut Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="hover-card bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs font-mono">1</div>
              <h3 className="font-bold text-slate-900 font-bangla text-base">যুক্তাক্ষর তৈরি (Conjuncts)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed">
              দুটি ব্যঞ্জনবর্ণের মাঝে স্বরবর্ণ না দিয়ে পরপর লিখলেই স্বয়ংক্রিয়ভাবে যুক্তবর্ণ গঠিত হয়।
            </p>
            <div className="pt-1 space-y-1 font-mono text-xs text-slate-700">
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-semibold">k + t</span> → <span className="font-bangla font-bold text-slate-900 text-sm">ক্ত</span> <span className="text-slate-400 font-bangla">(rokti → রক্ত)</span></div>
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-semibold">s + t</span> → <span className="font-bangla font-bold text-slate-900 text-sm">স্ত</span> <span className="text-slate-400 font-bangla">(rasta → রাস্তা)</span></div>
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-semibold">b + d</span> → <span className="font-bangla font-bold text-slate-900 text-sm">ব্দ</span> <span className="text-slate-400 font-bangla">(shobdo → শব্দ)</span></div>
            </div>
          </div>

          <div className="hover-card bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs font-mono">2</div>
              <h3 className="font-bold text-slate-900 font-bangla text-base">ফলা ও বিশেষ রূপ (Modifiers)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed">
              য-ফলা, র-ফলা, রেফ ও ব-ফলা লেখার সহজ নিয়ম:
            </p>
            <div className="pt-1 space-y-1 font-mono text-xs text-slate-700">
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-semibold">y / Z</span> → <span className="font-bangla font-bold text-slate-900 text-sm">্য</span> <span className="text-slate-400 font-bangla">(bakya → বাক্য)</span></div>
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-semibold">r / rr</span> → <span className="font-bangla font-bold text-slate-900 text-sm">্র / র্</span> <span className="text-slate-400 font-bangla">(gram → গ্রাম, kormo → কর্ম)</span></div>
              <div><span className="bg-slate-100 px-1.5 py-0.5 rounded text-teal-700 font-semibold">w / b</span> → <span className="font-bangla font-bold text-slate-900 text-sm">্ব</span> <span className="text-slate-400 font-bangla">(shwadhin → স্বাধীন)</span></div>
            </div>
          </div>

          <div className="hover-card bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs font-mono">3</div>
              <h3 className="font-bold text-slate-900 font-bangla text-base">টগল শর্টকাট (Toggle Shortcut)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed">
              ম্যাকের যেকোনো অ্যাপে টাইপ করার সময় বাংলা ও ইংরেজির মধ্যে দ্রুত অদলবদল করুন:
            </p>
            <div className="pt-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs sm:text-sm font-bold shadow-2xs">
                <kbd className="px-2 py-1 rounded bg-white border border-emerald-300 shadow-2xs">⌥ Option</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 rounded bg-white border border-emerald-300 shadow-2xs">Space</kbd>
              </div>
              <p className="text-[11px] text-slate-500 font-bangla mt-2">
                অথবা সিস্টেম ডিফল্ট <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">Ctrl + Space</code> ব্যবহার করুন।
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
