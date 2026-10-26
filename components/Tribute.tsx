import React from 'react';

export default function Tribute() {
  return (
    <section id="tribute" className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dedicated Tribute Box with Dark Green Smooth Hover */}
        <div className="tribute-box group p-6 sm:p-10 md:p-12 shadow-xl relative overflow-hidden">
          
          {/* Subtle Background Glow Element */}
          <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-200/20 group-hover:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ease-in-out"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-6 sm:mb-8 text-center sm:text-left">
            {/* Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/25 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 ease-in-out">
              <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              {/* Headline in English: Tribute to Avro Keyboard */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 group-hover:text-white font-sans tracking-tight transition-colors duration-500 ease-in-out">
                Tribute to Avro Keyboard
              </h3>
              {/* Below it in Bangla: ভাষা হোক উন্মুক্ত! */}
              <div className="text-lg sm:text-xl font-bold text-emerald-700 group-hover:text-emerald-300 font-bangla mt-1 transition-colors duration-500 ease-in-out">
                ভাষা হোক উন্মুক্ত!
              </div>
            </div>
          </div>

          {/* Tribute Quote Block */}
          <blockquote className="text-sm sm:text-base md:text-lg text-slate-700 group-hover:text-slate-100 font-bangla leading-relaxed sm:leading-loose border-l-4 border-emerald-500 pl-4 sm:pl-5 my-4 sm:my-6 bg-emerald-50/40 group-hover:bg-white/10 py-4 sm:py-5 rounded-r-2xl transition-all duration-500 ease-in-out">
            &ldquo;বাংলা কম্পিউটিংয়ের ইতিহাসে ওমিক্রনল্যাব (OmicronLab) এবং অভ্র কিবোর্ডের (Avro Keyboard) অবদান চিরভাস্বর ও অতুলনীয়। &ldquo;ভাষা হোক উন্মুক্ত&rdquo;—এই চিরন্তন মূলমন্ত্রকে ধারণ করে ডা. মেহদী হাসান খান এবং তাঁর অগ্রগামী দল বিশ্বজুড়ে কোটি কোটি মানুষের হাতে তুলে দিয়েছিলেন ফোনেটিক বাংলা টাইপিংয়ের অপার স্বাধীনতা। ওমিক্রনল্যাব এবং আইঅভ্র (iAvro) প্রজেক্টের সমস্ত আদি নির্মাতাদের প্রতি আমরা জানাই আমাদের অন্তরের গভীর শ্রদ্ধা, বিনম্র কৃতজ্ঞতা ও সাধুবাদ।&rdquo;
          </blockquote>

          {/* Motto Connection */}
          <div className="my-4 p-3.5 sm:p-4 rounded-xl bg-emerald-500/10 group-hover:bg-white/10 border border-emerald-500/20 group-hover:border-white/20 text-xs sm:text-sm text-emerald-900 group-hover:text-emerald-100 font-bangla leading-relaxed italic transition-all duration-500 ease-in-out">
            &ldquo;অভ্র শিখিয়েছিল ভাষা উন্মুক্ত করার পাঠ; সেই ভালোবাসাকে ধারণ করেই ম্যাকে প্রতিটি আঙুলের ছোঁয়ায় আমরা—বাংলায় লিখি বিজয়ের সুর।&rdquo;
          </div>

        </div>

      </div>
    </section>
  );
}
