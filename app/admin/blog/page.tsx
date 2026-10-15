'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  PenSquare, Mail, Image as ImageIcon, BarChart3, Database, Calendar, 
  Settings, LogOut, Search, Bell, Plus, Edit3, Trash2, Eye, 
  Check, X, Sparkles, BookOpen, Layers, ExternalLink, ArrowUpRight,
  TrendingUp, MessageSquare, Heart, Clock, CheckCircle2, AlertCircle,
  Copy, RefreshCw, ChevronDown, Filter, FileText, ChevronRight
} from 'lucide-react';
import { transliterateWord } from '@/lib/phoneticEngine';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { blogCategories, BlogPost, blogPosts as fallbackStaticPosts } from '@/data/blogData';

export default function AdminBlogPage() {
  const [token, setToken] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Sidebar Nav
  const [activeNav, setActiveNav] = useState<'editor' | 'messages' | 'media' | 'analytics' | 'backup' | 'calendar' | 'settings'>('editor');
  
  // Chart timeframe filter: Day, Month, Year
  const [chartTimeframe, setChartTimeframe] = useState<'D' | 'M' | 'Y'>('M');

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorSlug, setEditorSlug] = useState('');
  const [editorSubtitle, setEditorSubtitle] = useState('');
  const [editorCategory, setEditorCategory] = useState('সফটওয়্যার');
  const [editorReadTime, setEditorReadTime] = useState('৫ মিনিট পড়ার সময়');
  const [editorCoverImage, setEditorCoverImage] = useState('');
  const [editorCoverAlt, setEditorCoverAlt] = useState('');
  const [editorTags, setEditorTags] = useState('banglish keyboard, bangla typing');
  const [editorContent, setEditorContent] = useState('');
  const [editorStatus, setEditorStatus] = useState<'published' | 'draft'>('published');
  const [editorFeatured, setEditorFeatured] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  // Phonetic Auto-Conversion toggle in Editor
  const [enablePhoneticTyping, setEnablePhoneticTyping] = useState(true);

  // Backup Export State
  const [backupCode, setBackupCode] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Check stored auth token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('banglish_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchAdminPosts(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/blog/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setToken(data.token);
        sessionStorage.setItem('banglish_admin_token', data.token);
        fetchAdminPosts(data.token);
      } else {
        setLoginError(data.error || 'ভুল ইউজারনেম বা পাসওয়ার্ড');
      }
    } catch (err: any) {
      setLoginError('সার্ভারে যোগাযোগ করতে সমস্যা হচ্ছে');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    sessionStorage.removeItem('banglish_admin_token');
  };

  const fetchAdminPosts = async (authToken: string) => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch('/api/blog/admin/posts', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
          return;
        }
      }
      if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.warn('Fallback to local posts:', err);
      setPosts(fallbackStaticPosts);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Open Editor for New Post
  const openNewPostEditor = () => {
    setEditingPostId(null);
    setEditorTitle('');
    setEditorSlug('');
    setEditorSubtitle('');
    setEditorCategory('সফটওয়্যার');
    setEditorReadTime('৫ মিনিট পড়ার সময়');
    setEditorCoverImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80');
    setEditorCoverAlt('');
    setEditorTags('banglish keyboard, bangla typing');
    setEditorContent(`## ভূমিকা

বাংলিশ কিবোর্ডের এই নতুন আর্টিকেলে স্বাগতম। এখানে আপনি কীভাবে সহজে এবং দ্রুত বাংলা টাইপ করবেন তা বিস্তারিত আলোচনা করা হয়েছে।

### প্রধান ফিচারসমূহ
- **১০০% অফলাইন ও নিরাপদ**: কোনো ইন্টারনেট কানেকশন প্রয়োজন নেই।
- **নেটিভ অ্যাপল সিলিকন সাপোর্ট**: M1 থেকে M4 সব ম্যাকবুক এবং আইম্যাকে দ্রুত কাজ করে।
- **স্বয়ংক্রিয় ফোনেটিক ইঞ্জিন**: যেমন লিখবেন 'ami bangla gai', পেয়ে যাবেন 'আমি বাংলা গাই'।

[Try Banglish for Free](https://banglish.bd/#download)

> আপনি যদি উইন্ডোজ বা ম্যাকওএস ব্যবহারকারী হন, তবে এই নির্দেশিকাটি আপনাকে সর্বোচ্চ গতি পেতে সাহায্য করবে।`);
    setEditorStatus('published');
    setEditorFeatured(false);
    setEditorPreviewMode(false);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    setIsEditorOpen(true);
  };

  // Open Editor for Existing Post
  const openEditPostEditor = (post: any) => {
    setEditingPostId(post.id || null);
    setEditorTitle(post.title || '');
    setEditorSlug(post.slug || '');
    setEditorSubtitle(post.subtitle || '');
    setEditorCategory(post.category || 'সফটওয়্যার');
    setEditorReadTime(post.readTime || post.read_time || '৫ মিনিট পড়ার সময়');
    setEditorCoverImage(post.coverImage || post.cover_image || '');
    setEditorCoverAlt(post.coverAlt || post.cover_alt || post.title || '');
    setEditorTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
    setEditorContent(post.content || '');
    setEditorStatus(post.status === 'draft' ? 'draft' : 'published');
    setEditorFeatured(Boolean(post.featured));
    setEditorPreviewMode(false);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    setIsEditorOpen(true);
  };

  // Auto-generate clean slug from title
  const handleTitleChange = (val: string) => {
    setEditorTitle(val);
    if (!editingPostId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setEditorSlug(generatedSlug || `post-${Date.now()}`);
    }
  };

  // Phonetic Auto-Transliterate on Space in Content
  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enablePhoneticTyping) return;
    if (e.key === ' ') {
      const target = e.currentTarget;
      const cursor = target.selectionStart;
      const textBeforeCursor = target.value.slice(0, cursor);
      const textAfterCursor = target.value.slice(cursor);

      const words = textBeforeCursor.split(/(\s+)/);
      const lastWord = words[words.length - 1];

      if (lastWord && /^[a-zA-Z0-9\/\\]+$/.test(lastWord)) {
        const converted = transliterateWord(lastWord);
        if (converted && converted !== lastWord) {
          e.preventDefault();
          words[words.length - 1] = converted;
          const newTextBefore = words.join('') + ' ';
          const updatedValue = newTextBefore + textAfterCursor;
          setEditorContent(updatedValue);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = newTextBefore.length;
          }, 0);
        }
      }
    }
  };

  // Save / Update Post
  const handleSavePost = async () => {
    if (!editorTitle.trim()) {
      setSaveErrorMsg('অনুগ্রহ করে আর্টিকেলের শিরোনাম লিখুন');
      return;
    }
    if (!editorContent.trim()) {
      setSaveErrorMsg('অনুগ্রহ করে আর্টিকেলের বিষয়বস্তু (content) লিখুন');
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');

    const payload = {
      title: editorTitle.trim(),
      slug: editorSlug.trim() || `post-${Date.now()}`,
      subtitle: editorSubtitle.trim(),
      category: editorCategory,
      readTime: editorReadTime,
      coverImage: editorCoverImage.trim(),
      coverAlt: editorCoverAlt.trim() || editorTitle.trim(),
      tags: editorTags.split(',').map(t => t.trim()).filter(Boolean),
      content: editorContent,
      status: editorStatus,
      featured: editorFeatured,
      author: {
        name: 'A M Pabel',
        role: 'Founder, FramEmpire',
        avatar: '/assets/pabel_light_avatar.webp',
      },
    };

    try {
      const url = editingPostId ? `/api/blog/posts/${editingPostId}` : '/api/blog/posts';
      const method = editingPostId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccessMsg(editingPostId ? 'পোস্ট সফলভাবে আপডেট হয়েছে! 🎉' : 'পোস্ট সফলভাবে পাবলিশ হয়েছে! 🚀');
        setTimeout(() => {
          setIsEditorOpen(false);
          if (token) fetchAdminPosts(token);
        }, 1200);
      } else {
        setSaveErrorMsg(data.error || 'সংরক্ষণে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      setSaveErrorMsg('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: number, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${title}" পোস্টটি মুছে ফেলতে চান?`)) return;
    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (token) fetchAdminPosts(token);
      } else {
        alert('মুছে ফেলতে সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('সার্ভার এরর');
    }
  };

  // Generate Git Backup Code
  const generateGitBackupCode = () => {
    const code = `/**
 * Banglish Official Blog Data Store (Git Sync Backup)
 * Generated from Cloudflare D1 Database on ${new Date().toLocaleString()}
 */

export interface BlogPost {
  id: string;
  index: string;
  slug: string;
  title: string;
  seoTitle?: string;
  subtitle?: string;
  category: string;
  date: string;
  isoDate: string;
  readTime: string;
  featured?: boolean;
  coverImage?: string;
  coverAlt?: string;
  canonical?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  tags: string[];
  content: string;
  views?: number;
  status?: 'published' | 'draft';
}

export const blogCategories = ${JSON.stringify(blogCategories, null, 2)};

export const blogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};
`;
    setBackupCode(code);
  };

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  }, []);

  // Filtered posts
  const filteredPosts = posts.filter(p =>
    !searchQuery ||
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const displayPosts = filteredPosts.length > 0 ? filteredPosts : fallbackStaticPosts;

  // 1. Light Luxury Emerald Login Screen (Matching banglish.bd identity)
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
        
        {/* Signature Banglish Grid Background Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-70" aria-hidden="true" />
        
        {/* Soft Glowing Ambient Orbs */}
        <div className="fixed -top-40 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-0 -left-32 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/10 border border-emerald-100/90 relative z-10">
          
          {/* Logo Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 p-2 mx-auto flex items-center justify-center mb-6 shadow-sm border border-emerald-200/60">
            <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" className="w-full h-full object-contain" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              Banglish Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-bangla mt-1.5">
              ব্লগ ও কনটেন্ট ম্যানেজমেন্ট পোর্টাল
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-bangla flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 font-bangla">
                ইউজারনেম (Username)
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 font-bangla">
                পাসওয়ার্ড (Password)
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2 font-bangla cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <span>লগইন করুন</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-emerald-700 font-bangla font-semibold transition-colors"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Dashboard (Exact Match to User Reference Screenshot with Banglish Emerald Theme)
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Left Vertical Icon Sidebar (Matching Screenshot) */}
      <aside className="w-16 sm:w-20 bg-white border-r border-slate-200/80 flex flex-col items-center py-6 justify-between shrink-0 shadow-xs z-30">
        <div className="flex flex-col items-center gap-7 w-full">
          {/* Logo Glyph */}
          <Link href="/admin/blog" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border border-emerald-200/60 p-1 flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
            <img src="/assets/banglish-logo-192.png" alt="Logo" className="w-full h-full object-contain" />
          </Link>

          {/* Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-2.5 w-full px-2">
            
            {/* 1. Edit / Editor (Active state with left accent bar) */}
            <button
              onClick={() => setActiveNav('editor')}
              title="Dashboard & Editor"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'editor'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'editor' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <PenSquare className="w-5 h-5" />
            </button>

            {/* 2. Messages / Mail */}
            <button
              onClick={() => setActiveNav('messages')}
              title="Customer Support & Feedback"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'messages'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'messages' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <Mail className="w-5 h-5" />
            </button>

            {/* 3. Media / Gallery */}
            <button
              onClick={() => setActiveNav('media')}
              title="Media & Banners"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'media'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'media' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* 4. Analytics */}
            <button
              onClick={() => setActiveNav('analytics')}
              title="Visitor Analytics"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'analytics'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'analytics' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* 5. Database / Backup */}
            <button
              onClick={() => { setActiveNav('backup'); generateGitBackupCode(); }}
              title="Git Backup & Sync"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'backup'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'backup' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <Database className="w-5 h-5" />
            </button>

            {/* 6. Calendar */}
            <button
              onClick={() => setActiveNav('calendar')}
              title="Schedule & Calendar"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'calendar'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'calendar' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <Calendar className="w-5 h-5" />
            </button>

            {/* 7. Settings */}
            <button
              onClick={() => setActiveNav('settings')}
              title="Settings"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'settings'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'settings' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <Settings className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Bottom Actions: Log out */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            title="View Live Blog"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar (Matching Screenshot) */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          
          {/* Search Input */}
          <div className="relative max-w-sm sm:max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for anything..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Right Section: Date, Notifications, Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Date Pill: "Today October 15 ⌵" */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-full border border-slate-200/80">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Today <strong className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </div>

            {/* Notification Bell with Badge */}
            <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <img
                  src="/assets/pabel_light_avatar.webp"
                  alt="A M Pabel"
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                Welcome Back! <span className="animate-wiggle">👋</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {greeting}
              </p>
            </div>

            <button
              onClick={openNewPostEditor}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all font-bangla cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন আর্টিকেল লিখুন</span>
            </button>
          </div>

          {/* Top Row Metrics Cards (Matching Reference Screenshot Exactly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Card 1: Author Profile Card (Span 4) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
              <div className="flex flex-col justify-between h-full z-10">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-sans">A M Pabel</h3>
                  <p className="text-xs text-slate-400 font-medium">Lead Dev / Author</p>
                </div>
                <div className="flex items-center gap-4 mt-6">
                  <div>
                    <span className="text-xl font-bold text-slate-900 font-sans">{posts.length || fallbackStaticPosts.length}</span>
                    <span className="text-xs text-slate-400 ml-1.5 font-medium">Total Post</span>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <div>
                    <span className="text-xl font-bold text-slate-900 font-sans">23K</span>
                    <span className="text-xs text-slate-400 ml-1.5 font-medium">Subscriber</span>
                  </div>
                </div>
              </div>

              {/* 3D Character Illustration (MacBook/Author SVG vector) */}
              <div className="w-32 h-32 relative shrink-0 -mr-2">
                <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
                  <circle cx="60" cy="60" r="50" fill="#f0f9ff" />
                  {/* Sitting character styled after modern 3D clay aesthetic */}
                  <circle cx="60" cy="40" r="16" fill="#38bdf8" />
                  <path d="M42 70 C42 55, 78 55, 78 70 L78 95 L42 95 Z" fill="#0284c7" />
                  {/* Laptop / Book */}
                  <rect x="46" y="65" width="28" height="18" rx="3" fill="#ffffff" stroke="#0369a1" strokeWidth="2" />
                  <line x1="50" y1="74" x2="70" y2="74" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                  {/* Accent stars */}
                  <circle cx="28" cy="35" r="3" fill="#fbbf24" />
                  <circle cx="92" cy="45" r="2.5" fill="#10b981" />
                </svg>
              </div>
            </div>

            {/* Card 2: Total Post (Span 2) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* 3D Blue Book Icon */}
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium">Total Post</p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-sans mt-0.5">
                  {posts.length || fallbackStaticPosts.length}
                </h4>
              </div>
            </div>

            {/* Card 3: Total Pages / Categories (Span 2) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* Document Icon */}
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium">Total Pages</p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-sans mt-0.5">
                  {blogCategories.length}
                </h4>
              </div>
            </div>

            {/* Card 4: Comments / Views (Span 2) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* Chat bubbles Icon */}
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium">Comments</p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans mt-0.5">
                  {totalViews ? totalViews.toLocaleString() : '34,267'}
                </h4>
              </div>
            </div>

            {/* Card 5: Total Likes (Span 2, with Floating Heart Badge) */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
              {/* Floating Heart Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 self-start shadow-xs">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>1K</span>
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-medium">Total Likes</p>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-rose-500 font-sans mt-0.5">
                  65.26K
                </h4>
              </div>
            </div>

          </div>

          {/* Bottom Section: Two Columns (Visitors Chart & Recent Blogs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Visitors Analytics (Span 8) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Header Row: Title, Stats, and Timeframe Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-sans">Visitors</h3>
                </div>

                <div className="flex items-center gap-8">
                  <div>
                    <span className="text-2xl font-black text-slate-900 font-sans">250K</span>
                    <p className="text-xs text-slate-400 font-medium">New Visitors</p>
                  </div>

                  <div>
                    <span className="text-2xl font-black text-emerald-600 font-sans flex items-center gap-1">
                      2.5% <span className="text-base">↑</span>
                    </span>
                    <p className="text-xs text-slate-400 font-medium">Visitors Increase</p>
                  </div>

                  {/* Day, Month, Year Filter Buttons */}
                  <div className="flex items-center bg-slate-100 rounded-full p-1 text-xs font-bold">
                    {(['D', 'M', 'Y'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setChartTimeframe(f)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          chartTimeframe === f
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Subtitle & Legend */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">Old vs New Visitors</span>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>This year</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Previous year</span>
                  </div>
                </div>
              </div>

              {/* Smooth Dual Wave Area Chart (Responsive SVG) */}
              <div className="w-full h-64 sm:h-72 relative">
                <svg viewBox="0 0 800 280" className="w-full h-full overflow-visible">
                  <defs>
                    {/* Blue Gradient for This Year */}
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Green Gradient for Previous Year */}
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Guide Lines */}
                  {[40, 90, 140, 190, 240].map((y, idx) => (
                    <line
                      key={idx}
                      x1="40"
                      y1={y}
                      x2="780"
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Previous Year Green Area & Spline */}
                  <path
                    d="M 50 210 Q 110 200, 170 190 T 290 195 T 410 130 T 530 180 T 650 200 T 770 170 L 770 250 L 50 250 Z"
                    fill="url(#greenGradient)"
                  />
                  <path
                    d="M 50 210 Q 110 200, 170 190 T 290 195 T 410 130 T 530 180 T 650 200 T 770 170"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* This Year Blue Area & Spline */}
                  <path
                    d="M 50 190 Q 110 185, 170 160 T 290 85 T 410 165 T 530 175 T 650 180 T 770 175 L 770 250 L 50 250 Z"
                    fill="url(#blueGradient)"
                  />
                  <path
                    d="M 50 190 Q 110 185, 170 160 T 290 85 T 410 165 T 530 175 T 650 180 T 770 175"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Data Point Markers */}
                  <circle cx="290" cy="85" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="410" cy="130" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="530" cy="175" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="650" cy="200" r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

                  {/* X Axis Months */}
                  {[
                    { m: 'Jan', x: 50 },
                    { m: 'Feb', x: 115 },
                    { m: 'Mar', x: 180 },
                    { m: 'Apr', x: 245 },
                    { m: 'May', x: 310 },
                    { m: 'Jun', x: 375 },
                    { m: 'Jul', x: 440 },
                    { m: 'Aug', x: 505 },
                    { m: 'Sep', x: 570 },
                    { m: 'Oct', x: 635 },
                    { m: 'Nov', x: 700 },
                    { m: 'Dec', x: 765 },
                  ].map(item => (
                    <text
                      key={item.m}
                      x={item.x}
                      y="270"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="system-ui"
                    >
                      {item.m}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Right Column: Recent Blogs Card (Span 4, Matching Screenshot) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              
              {/* Header with Title and '+ Add New' Pill Button */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900 font-sans">Recent Blogs</h3>
                <button
                  onClick={openNewPostEditor}
                  className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {/* List of Recent Blogs */}
              <div className="divide-y divide-slate-100 space-y-4">
                {displayPosts.slice(0, 6).map((post: any) => (
                  <div key={post.slug || post.id} className="pt-4 first:pt-0 flex items-center gap-3.5 group">
                    
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 relative">
                      {post.coverImage || post.cover_image ? (
                        <img
                          src={post.coverImage || post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-700">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 transition-colors line-clamp-1 font-bangla block"
                      >
                        {post.title}
                      </Link>

                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>{post.comments || '25'} Comments</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{post.views || '9546'} Views</span>
                        </span>
                        <button
                          onClick={() => openEditPostEditor(post)}
                          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer ml-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="pt-2 text-center border-t border-slate-100">
                <Link
                  href="/blog"
                  target="_blank"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
                >
                  <span>View all public blogs</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

          {/* Subview Content when clicking other Navigation Icons */}
          {activeNav === 'backup' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-bangla">গিট ব্যাকআপ ও সিঙ্ক (Git Sync)</h3>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    ক্লাউডফ্লেয়ার D1 ডাটাবেজের সমস্ত আর্টিকেল `src/data/blogData.js` ফাইলের ফরম্যাটে রূপান্তর করে নিন।
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(backupCode);
                    setCopiedBackup(true);
                    setTimeout(() => setCopiedBackup(false), 2000);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold font-bangla cursor-pointer"
                >
                  {copiedBackup ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedBackup ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                </button>
              </div>

              <textarea
                value={backupCode}
                readOnly
                rows={12}
                className="w-full p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs focus:outline-none border border-slate-800"
              />
            </div>
          )}

        </main>
      </div>

      {/* 3. Full Modern Post Editor Modal / Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg font-bangla">
                  {editingPostId ? 'আর্টিকেল এডিট করুন' : 'নতুন আর্টিকেল তৈরি করুন'}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Bengali Phonetic Switch */}
                <button
                  type="button"
                  onClick={() => setEnablePhoneticTyping(!enablePhoneticTyping)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all font-bangla flex items-center gap-1.5 cursor-pointer ${
                    enablePhoneticTyping 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-slate-200 text-slate-600'
                  }`}
                  title="স্পেস চাপলে ইংরেজি অক্ষর স্বয়ংক্রিয় বাংলা হয়ে যাবে"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ফোনেটিক টাইপিং: {enablePhoneticTyping ? 'চালু' : 'বন্ধ'}</span>
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {saveSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bangla flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {saveErrorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bangla flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{saveErrorMsg}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    আর্টিকেলের শিরোনাম (Title)
                  </label>
                  <input
                    type="text"
                    value={editorTitle}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="ম্যাকওএস-এ সহজে বাংলা টাইপিং গাইড"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    ইউআরএল স্লাগ (URL Slug)
                  </label>
                  <input
                    type="text"
                    value={editorSlug}
                    onChange={e => setEditorSlug(e.target.value)}
                    placeholder="easy-bangla-typing-macos"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Subtitle / Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                  সাবটাইটেল / সংক্ষিপ্ত বিবরণ (Excerpt)
                </label>
                <input
                  type="text"
                  value={editorSubtitle}
                  onChange={e => setEditorSubtitle(e.target.value)}
                  placeholder="কীভাবে অ্যাপল সিলিকনে কোনোরকম ল্যাগ ছাড়া দ্রুত বাংলা টাইপ করবেন তার সহজ ধাপ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Category, Read Time, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editorCategory}
                    onChange={e => setEditorCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {blogCategories.filter(c => c !== 'সকল আর্টিকেল').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    পড়ার সময় (Read Time)
                  </label>
                  <input
                    type="text"
                    value={editorReadTime}
                    onChange={e => setEditorReadTime(e.target.value)}
                    placeholder="৫ মিনিট পড়ার সময়"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    স্ট্যাটাস
                  </label>
                  <select
                    value={editorStatus}
                    onChange={e => setEditorStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="published">পাবলিশড (Published)</option>
                    <option value="draft">ড্রাফট (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                  কভার ইমেজ ইউআরএল (Cover Image URL)
                </label>
                <input
                  type="text"
                  value={editorCoverImage}
                  onChange={e => setEditorCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Markdown Content & Live Preview Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 font-bangla">
                    আর্টিকেলের বিষয়বস্তু (Markdown Content)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        !editorPreviewMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      এডিটর
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        editorPreviewMode ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      লাইভ প্রিভিউ
                    </button>
                  </div>
                </div>

                {!editorPreviewMode ? (
                  <textarea
                    value={editorContent}
                    onChange={e => setEditorContent(e.target.value)}
                    onKeyDown={handleContentKeyDown}
                    rows={14}
                    placeholder="## আপনার হেডলাইন এখানে লিখুন..."
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                  />
                ) : (
                  <div className="p-6 rounded-2xl border border-slate-200 bg-[#fafbfc] min-h-[320px]">
                    <MarkdownRenderer content={editorContent} />
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                বাতিল
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSavePost}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 font-bangla"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingPostId ? 'আপডেট করুন' : 'পাবলিশ করুন'}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
