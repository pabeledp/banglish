'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts as fallbackPosts, blogCategories, BlogPost } from '@/data/blogData';
import { Search, ArrowRight, Clock, Sparkles, BookOpen, Share2, MessageCircle } from 'lucide-react';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState('সকল আর্টিকেল');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch latest posts from Cloudflare D1 with fallback to local blogData
  useEffect(() => {
    async function loadLatestPosts() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/blog/posts');
        if (res.ok) {
          const data = await res.json();
          if (data?.posts && Array.isArray(data.posts) && data.posts.length > 0) {
            // Merge D1 posts with fallback posts ensuring uniqueness by slug
            const seenSlugs = new Set(data.posts.map((p: BlogPost) => p.slug));
            const merged = [...data.posts, ...fallbackPosts.filter(p => !seenSlugs.has(p.slug))];
            setPosts(merged);
          }
        }
      } catch (e) {
        console.warn('Using local fallback blog data:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLatestPosts();
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'সকল আর্টিকেল' || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const regularPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        
        {/* Header Title & Breadcrumb */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-bangla">বাংলিশ অফিসিয়াল ব্লগ ও নলেজবেইজ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-bangla leading-tight sm:leading-snug">
            সহজ বাংলা টাইপিং ও প্রযুক্তিগত অন্তর্দৃষ্টি
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-bangla leading-relaxed">
            ম্যাকওএস ও উইন্ডোজে দ্রুত বাংলা টাইপিং টিপস, সফটওয়্যার আর্কিটেকচার এবং টিম ফ্রেমএম্পায়ারের最新 আপডেট।
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="আর্টিকেল বা টপিক খুঁজুন..."
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm font-bangla transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Inspiration Image 1 Top Bar) */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {blogCategories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-105'
                    : 'bg-white hover:bg-slate-100/80 text-slate-600 border border-slate-200/80'
                } font-bangla`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Bento Grid Layout (Matching ampabel.com Architecture & Reference Image 1) */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 font-bangla">কোনো আর্টিকেল পাওয়া যায়নি</h3>
            <p className="text-slate-500 mt-2 text-sm font-bangla">ভিন্ন কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা অন্য ক্যাটাগরি বেছে নিন।</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Bento Top Row: Featured Insight (Center) & Side Cards */}
            {featuredPost && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Center Hero Bento: Featured Insight Card (Col 8) */}
                <div className="lg:col-span-8 group relative bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 rounded-3xl p-6 sm:p-10 border border-emerald-100/80 shadow-xl shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  
                  {/* Decorative 3D Glow Element */}
                  <div className="absolute -right-12 -top-12 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  
                  <div>
                    {/* Top Meta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-900 font-bangla">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Featured Insight
                      </span>
                      <span className="text-xs text-slate-500 font-bangla flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{featuredPost.category}</span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{featuredPost.readTime}</span>
                      </span>
                    </div>

                    {/* Headline */}
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-bangla leading-tight sm:leading-snug hover:text-emerald-700 transition-colors">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    {/* Subtitle / Excerpt */}
                    <p className="mt-4 text-slate-600 text-sm sm:text-base font-bangla leading-relaxed line-clamp-3">
                      {featuredPost.subtitle || featuredPost.excerpt}
                    </p>
                  </div>

                  {/* Author & Read Action */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-sm">
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e: any) => {
                            e.target.src = '/assets/banglish-logo-192.png';
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{featuredPost.author.name}</div>
                        <div className="text-[11px] text-slate-500 font-bangla">{featuredPost.author.role}</div>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer font-bangla"
                    >
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Editorial & Support Space Bento Card (Col 4) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg shadow-slate-900/5 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 font-mono uppercase tracking-wider mb-4">
                      EDITORIAL SPACE
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-bangla">
                      বাংলায় লিখি বিজয়ের সুর
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed">
                      Banglish Keyboard তৈরি করেছে <strong>Team FramEmpire</strong>। আমাদের লক্ষ্য বাংলা ভাষাভাষী সকলের জন্য দ্রুততম ও নির্ভরযোগ্য টাইপিং অভিজ্ঞতা উপহার দেওয়া।
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                    <a
                      href="https://ampabel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>Work With Pabel</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                    <Link
                      href="/support"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5 font-bangla">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ২৪/৭ সাপোর্ট এজেন্ট
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Surrounding Bento Grid Cards */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {regularPosts.map((post, idx) => (
                  <article
                    key={post.id || idx}
                    className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Thumbnail if available */}
                      {post.coverImage && (
                        <Link href={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl mb-4 h-44 bg-slate-100">
                          <img
                            src={post.coverImage}
                            alt={post.coverAlt || post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </Link>
                      )}

                      {/* Meta Pill & Read Time */}
                      <div className="flex items-center justify-between text-xs mb-3 font-bangla">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                          {post.category}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-bangla leading-snug">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="mt-2.5 text-xs sm:text-sm text-slate-600 font-bangla leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-bangla">{post.date}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors font-bangla"
                      >
                        <span>Read article</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
