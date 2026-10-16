'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { BlogPost, blogPosts as allStaticPosts } from '@/data/blogData';
import { 
  Clock, ArrowLeft, Share2, 
  MessageCircle, Copy, Check, ChevronRight, Eye, BookOpen,
  Heart, MessageSquare, Send, CheckCircle2, AlertCircle, RefreshCw,
  Phone
} from 'lucide-react';

interface Props {
  slug: string;
  initialPost: BlogPost | null;
}

interface CommentItem {
  id: number;
  post_slug: string;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
  admin_reply?: string;
  admin_replied_at?: string;
}

export default function BlogPostClient({ slug, initialPost }: Props) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  // Likes State
  const [likesCount, setLikesCount] = useState<number>(post?.likes || 0);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  // Comments State
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');
  const [commentErrorMsg, setCommentErrorMsg] = useState('');

  // Direct Inquiry Form State (Directly sent to Admin Portal Inbox)
  const [directName, setDirectName] = useState('');
  const [directCountryCode, setDirectCountryCode] = useState('+880');
  const [directPhone, setDirectPhone] = useState('');
  const [directMessage, setDirectMessage] = useState('');
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const [directSuccessMsg, setDirectSuccessMsg] = useState('');
  const [directErrorMsg, setDirectErrorMsg] = useState('');

  // Visitor Hash for Likes & Analytics
  const [visitorHash, setVisitorHash] = useState('');

  useEffect(() => {
    let hash = localStorage.getItem('banglish_visitor_hash');
    if (!hash) {
      hash = 'vis_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('banglish_visitor_hash', hash);
    }
    setVisitorHash(hash);

    // Track Real Visit
    fetch('/api/blog/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: `/blog/${slug}`,
        visitorHash: hash,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
      }),
    }).catch(() => {});
  }, [slug]);

  // Fetch Live Post from D1
  useEffect(() => {
    async function fetchLivePost() {
      try {
        const res = await fetch(`/api/blog/posts/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.post) {
            const p = data.post;
            setPost({
              ...p,
              coverImage: p.coverImage || p.cover_image || '',
              coverAlt: p.coverAlt || p.cover_alt || p.title || '',
              readTime: p.readTime || p.read_time || '',
              seoTitle: p.seoTitle || p.seo_title || p.title || '',
              isoDate: p.isoDate || p.iso_date || '',
            });
            if (typeof p.likes === 'number') {
              setLikesCount(p.likes);
            }
          }
        }
      } catch (err) {
        console.warn('Using pre-rendered static post data:', err);
      }
    }
    fetchLivePost();
  }, [slug]);

  // Fetch Likes status
  useEffect(() => {
    if (!visitorHash) return;
    async function checkLike() {
      try {
        const res = await fetch(`/api/blog/likes?slug=${encodeURIComponent(slug)}&visitorHash=${encodeURIComponent(visitorHash)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setLikesCount(data.likes);
            setUserLiked(data.userLiked);
          }
        }
      } catch (e) {}
    }
    checkLike();
  }, [slug, visitorHash]);

  // Fetch Comments
  useEffect(() => {
    async function fetchComments() {
      setIsLoadingComments(true);
      try {
        const res = await fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.comments)) {
            setComments(data.comments);
          }
        }
      } catch (e) {
        console.warn('Error loading comments:', e);
      } finally {
        setIsLoadingComments(false);
      }
    }
    fetchComments();
  }, [slug]);

  // Toggle Like
  const handleToggleLike = async () => {
    if (isLiking || !visitorHash) return;
    setIsLiking(true);

    // Optimistic UI update
    const nextUserLiked = !userLiked;
    const nextCount = nextUserLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setUserLiked(nextUserLiked);
    setLikesCount(nextCount);

    try {
      const res = await fetch('/api/blog/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, visitorHash }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setLikesCount(data.likes);
          setUserLiked(data.userLiked);
        }
      }
    } catch (e) {
      // Revert if error
      setUserLiked(!nextUserLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  // Submit Comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentSuccessMsg('');
    setCommentErrorMsg('');

    if (!commentName.trim()) {
      setCommentErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }
    if (!commentText.trim()) {
      setCommentErrorMsg('অনুগ্রহ করে মন্তব্যের বিবরণ লিখুন');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: slug,
          authorName: commentName.trim(),
          authorEmail: commentEmail.trim(),
          content: commentText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCommentSuccessMsg(data.message || 'আপনার মন্তব্যটি সফলভাবে প্রকাশিত হয়েছে!');
        setCommentText('');
        if (data.comment) {
          setComments(prev => [...prev, data.comment]);
        }
      } else {
        setCommentErrorMsg(data.error || 'মন্তব্য পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err) {
      setCommentErrorMsg('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Submit Direct Inquiry / Contact Message (Direct to Admin Portal Inbox)
  const handleSubmitDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setDirectSuccessMsg('');
    setDirectErrorMsg('');

    if (!directName.trim()) {
      setDirectErrorMsg('অনুগ্রহ করে আপনার নাম লিখুন');
      return;
    }

    const cleanDigits = directPhone.replace(/\D/g, '');
    let formattedPhone = directPhone.trim();

    if (directCountryCode === '+880') {
      const bdDigits = cleanDigits.replace(/^880/, '');
      const formattedBd = bdDigits.startsWith('0') ? bdDigits : '0' + bdDigits;
      if (!/^01[3-9]\d{8}$/.test(formattedBd) || /^01[3-9](\d)\1{7}$/.test(formattedBd)) {
        setDirectErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর প্রদান করুন (যেমন: 017xxxxxxxx বা 018xxxxxxxx)');
        return;
      }
      formattedPhone = `${directCountryCode} ${formattedBd}`;
    } else {
      if (cleanDigits.length < 7 || cleanDigits.length > 15 || /^(\d)\1+$/.test(cleanDigits)) {
        setDirectErrorMsg('অনুগ্রহ করে সঠিক আন্তর্জাতিক মোবাইল নম্বর প্রদান করুন');
        return;
      }
      formattedPhone = `${directCountryCode} ${cleanDigits}`;
    }

    if (!directMessage.trim()) {
      setDirectErrorMsg('অনুগ্রহ করে আপনার বার্তা / প্রশ্ন লিখুন');
      return;
    }

    setIsSubmittingDirect(true);
    try {
      const fullPhone = formattedPhone;
      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: slug,
          authorName: directName.trim(),
          phoneNumber: fullPhone,
          content: directMessage.trim(),
          isDirect: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDirectSuccessMsg(data.message || 'আপনার মেসেজটি সফলভাবে আমাদের ইনবক্সে পৌঁছেছে! আমরা শীঘ্রই আপনার নম্বরে যোগাযোগ করব।');
        setDirectName('');
        setDirectPhone('');
        setDirectMessage('');
      } else {
        setDirectErrorMsg(data.error || 'মেসেজ পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err) {
      setDirectErrorMsg('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingDirect(false);
    }
  };

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
            <Link href="/blog" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold font-bangla">
              <ArrowLeft className="w-4 h-4" />
              <span>ব্লগ তালিকায় ফিরে যান</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Related posts
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
        {(post.coverImage || (post as any).cover_image) && (
          <div className="my-8 rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 max-h-[440px]">
            <img
              src={post.coverImage || (post as any).cover_image}
              alt={post.coverAlt || (post as any).cover_alt || post.title}
              className="w-full h-full object-cover"
              onError={(e: any) => {
                e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80';
              }}
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

        {/* Interactive Like / Love React Bar */}
        <div className="my-8 p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleToggleLike}
            disabled={isLiking}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-xs cursor-pointer ${
              userLiked
                ? 'bg-rose-500 text-white shadow-rose-500/25 shadow-md scale-105'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-600'
            }`}
          >
            <Heart className={`w-5 h-5 transition-transform ${userLiked ? 'fill-white stroke-white animate-wiggle' : 'fill-none stroke-current'}`} />
            <span className="font-sans">{likesCount}</span>
            <span className="font-bangla font-semibold">লাইক</span>
          </button>

          <p className="text-xs text-slate-500 font-bangla">
            {userLiked ? 'ধন্যবাদ আপনার ভালোবাসার জন্য! ❤️' : 'আর্টিকেলটি ভালো লাগলে লাইক দিন ও আপনার মতামত জানান!'}
          </p>
        </div>

        {/* Social Share Bar */}
        <div className="my-8 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-wrap items-center justify-between gap-4">
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

        {/* Real Comments Section */}
        <section className="mt-14 pt-10 border-t border-slate-200" id="comments">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 font-bangla flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <span>মন্তব্যসমূহ</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                {comments.length}
              </span>
            </h3>
          </div>

          {/* Comments List */}
          <div className="space-y-4 mb-10">
            {isLoadingComments ? (
              <p className="text-sm text-slate-400 font-bangla">মন্তব্য লোড হচ্ছে...</p>
            ) : comments.length > 0 ? (
              comments.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase font-sans">
                        {(c.author_name || 'U')[0]}
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm font-bangla">{c.author_name}</h5>
                    </div>
                    <span className="text-[11px] text-slate-400 font-bangla">
                      {new Date(c.created_at).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 font-bangla leading-relaxed pl-10">
                    {c.content}
                  </p>

                  {/* Admin Reply Box if present */}
                  {c.admin_reply && (
                    <div className="mt-3 ml-10 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-slate-800 font-bangla">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>এডমিন রিপ্লাই (A M Pabel):</span>
                      </div>
                      <p className="leading-relaxed text-slate-700">{c.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50/80 border border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-500 font-bangla">
                  এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
                </p>
              </div>
            )}
          </div>

          {/* Side-by-Side Grid: Public Comments & Direct Admin Message */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Column 1: Public Blog Comment Submission Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 font-bangla text-base sm:text-lg">
                    একটি মন্তব্য লিখুন
                  </h4>
                </div>
                <p className="text-xs text-slate-400 font-bangla mb-4">
                  আপনার মন্তব্যটি ব্লগের নিচে সকলের জন্য প্রকাশিত হবে।
                </p>

                {commentSuccessMsg && (
                  <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bangla flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{commentSuccessMsg}</span>
                  </div>
                )}

                {commentErrorMsg && (
                  <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bangla flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{commentErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={commentName}
                        onChange={e => setCommentName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                        ইমেইল (ঐচ্ছিক)
                      </label>
                      <input
                        type="email"
                        value={commentEmail}
                        onChange={e => setCommentEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      মন্তব্যের বিবরণ *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="আর্টিকেলটি সম্পর্কে আপনার মতামত বা প্রশ্ন লিখুন..."
                      className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 font-bangla cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmittingComment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>মন্তব্য প্রকাশ করুন</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Column 2: Direct Admin Message Form with Real Mobile Validation */}
            <div className="bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 p-6 sm:p-8 rounded-3xl border border-blue-200/80 shadow-sm flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-slate-900 font-bangla text-base sm:text-lg">
                    সরাসরি আমাদের মেসেজ পাঠান
                  </h4>
                </div>
                <p className="text-xs text-slate-500 font-bangla mb-4">
                  আপনার মেসেজটি সরাসরি আমাদের অ্যাডমিন পোর্টালে যাবে। প্রয়োজনে যোগাযোগ করতে সঠিক মোবাইল নম্বর দিন।
                </p>

                {directSuccessMsg && (
                  <div className="mb-4 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-bangla flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{directSuccessMsg}</span>
                  </div>
                )}

                {directErrorMsg && (
                  <div className="mb-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bangla flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{directErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitDirectMessage} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      value={directName}
                      onChange={e => setDirectName(e.target.value)}
                      placeholder="আপনার নাম লিখুন"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      মোবাইল নম্বর (বাধ্যতামূলক) *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={directCountryCode}
                        onChange={e => setDirectCountryCode(e.target.value)}
                        className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shrink-0"
                      >
                        <option value="+880">🇧🇩 +880 (BD)</option>
                        <option value="+91">🇮🇳 +91 (IN)</option>
                        <option value="+1">🇺🇸 +1 (US/CA)</option>
                        <option value="+44">🇬🇧 +44 (UK)</option>
                        <option value="+966">🇸🇦 +966 (KSA)</option>
                        <option value="+971">🇦🇪 +971 (UAE)</option>
                        <option value="+60">🇲🇾 +60 (MY)</option>
                        <option value="+65">🇸🇬 +65 (SG)</option>
                        <option value="+61">🇦🇺 +61 (AU)</option>
                        <option value="+49">🇩🇪 +49 (DE)</option>
                      </select>

                      <input
                        type="tel"
                        required
                        value={directPhone}
                        onChange={e => setDirectPhone(e.target.value)}
                        placeholder={directCountryCode === '+880' ? '01XXXXXXXXX (১১ ডিজিট)' : 'মোবাইল নম্বর লিখুন'}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-bangla mt-1">
                      যোগাযোগের সুবিধার্থে একটি সচল ও সঠিক নম্বর প্রদান করুন।
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      আপনার বার্তা / প্রশ্ন *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={directMessage}
                      onChange={e => setDirectMessage(e.target.value)}
                      placeholder="কী বিষয়ে জানতে বা যোগাযোগ করতে চান লিখুন..."
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-white text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingDirect}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 font-bangla cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSubmittingDirect ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>মেসেজ পাঠান</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

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
