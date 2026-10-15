'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { BlogPost, blogPosts as allStaticPosts } from '@/data/blogData';
import { 
  Clock, ArrowLeft, Share2, 
  MessageCircle, Copy, Check, ChevronRight, Eye, BookOpen 
} from 'lucide-react';

interface Props {
  slug: string;
  initialPost: BlogPost | null;
}

export default function BlogPostClient({ slug, initialPost }: Props) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  // If initialPost is null or we want real-time view counts/content from D1
  useEffect(() => {
    async function fetchLivePost() {
      try {
        const res = await fetch(`/api/blog/posts/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.post) {
            setPost(data.post);
          }
        }
      } catch (err) {
        console.warn('Using pre-rendered static post data:', err);
      }
    }
    fetchLivePost();
  }, [slug]);

  // Extract H2 headings for Table of Contents
  useEffect(() => {
    if (!post?.content) return;
    const matches: { id: string; text: string }[] = [];
    const lines = post.content.split('\n');
    for (const line of lines) {
      const match = line.match(/^##\s+(.*)$/);
      if (match) {
        const text = match[1].replace(/[*_`]/g, '');
        const id = text.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, '-');
        matches.push({ id, text });
      }
    }
    setHeadings(matches);
  }, [post?.content]);

  // Reading progress scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-4xl mx-auto px-4 py-24 text-center">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4 animate-bounce" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 font-bangla">আর্টিকেলটি লোড হচ্ছে...</h1>
          <p className="text-slate-500 mt-2 font-bangla text-sm">অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।</p>
          <div className="mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>ব্লগ তালিকায় ফিরে যান</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related posts from same category
  const relatedPosts = allStaticPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://banglish.bd/blog/${post.slug}`;
  const shareTitle = encodeURIComponent(post.title);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-slate-200">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-bangla mb-6">
          <Link href="/" className="hover:text-emerald-700 transition-colors">হোম</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/blog" className="hover:text-emerald-700 transition-colors">ব্লগ</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{post.category}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-bangla">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-bangla">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
            {Boolean(post.views) && (
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5" />
                {post.views} views
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug font-bangla">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="mt-4 text-base sm:text-xl text-slate-600 font-bangla leading-relaxed">
              {post.subtitle}
            </p>
          )}

          {/* Author & Publication Info */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shadow-sm">
                <img
                  src={post.author?.avatar || '/assets/pabel_light_avatar.webp'}
                  alt={post.author?.name || 'A M Pabel'}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e: any) => { e.target.src = '/assets/banglish-logo-192.png'; }}
                />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">{post.author?.name || 'A M Pabel'}</div>
                <div className="text-xs text-slate-500 font-bangla">{post.author?.role || 'Founder, FramEmpire'}</div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-500 font-bangla">
              প্রকাশিত: <span className="font-semibold text-slate-700">{post.date}</span>
            </div>
          </div>
        </header>

        {/* Featured Cover Banner */}
        {post.coverImage && (
          <div className="my-8 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 max-h-[440px]">
            <img
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              className="w-full h-full object-cover"
              onError={(e: any) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Table of Contents (TOC) if multiple headings exist */}
        {headings.length > 2 && (
          <div className="my-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="text-sm font-bold text-slate-900 font-bangla mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>এই আর্টিকেলে যা যা থাকছে:</span>
            </div>
            <ul className="space-y-2 text-sm font-bangla text-slate-600">
              {headings.map((h, idx) => (
                <li key={idx}>
                  <a href={`#${h.id}`} className="hover:text-emerald-700 hover:underline transition-colors flex items-center gap-1.5">
                    <span className="text-emerald-500 font-mono text-xs">#{idx + 1}</span>
                    <span>{h.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Google AdSense Responsive Banner Slot (Pre-configured) */}
        <div className="my-8 p-4 rounded-2xl bg-slate-50/60 border border-dashed border-slate-200 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Advertisement</span>
          <div className="min-h-[90px] flex items-center justify-center text-xs text-slate-400 font-bangla">
            {/* Google AdSense Responsive Unit */}
            <span>Google AdSense Slot</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <span className="text-xs font-semibold text-slate-500 font-bangla mr-2">ট্যাগসমূহ:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-2">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Share Bar */}
        <div className="my-10 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-bangla">
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>বন্ধুদের সাথে শেয়ার করুন:</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 shadow-sm transition-all"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 shadow-sm transition-all flex items-center justify-center"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 shadow-sm transition-all flex items-center justify-center"
              title="Share on X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm text-xs font-medium cursor-pointer transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-14 pt-8 border-t border-slate-200">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-bangla mb-6">
              সম্পর্কিত অন্যান্য আর্টিকেল
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map(rel => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
                >
                  <span className="text-[11px] font-semibold text-emerald-700 font-bangla block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-2 font-bangla">
                    {rel.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-bangla mt-2 block">
                    {rel.readTime}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
