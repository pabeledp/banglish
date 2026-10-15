'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, FileText, PenSquare, Database, Globe, LogOut, 
  Search, Calendar, Plus, Edit3, Trash2, Eye, CheckCircle2, 
  AlertCircle, Sparkles, X, Image as ImageIcon, Save, RefreshCw, 
  Download, ExternalLink, ArrowRight, BookOpen, Layers
} from 'lucide-react';
import { transliterateWord } from '@/lib/phoneticEngine';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { blogCategories, BlogPost, blogPosts as initialStaticPosts } from '@/data/blogData';

export default function AdminBlogPage() {
  const [token, setToken] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard Data State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'new' | 'backup'>('dashboard');

  // Editor Modal / State
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

  // Phonetic Auto-Conversion in Editor toggle
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
      // If error or token expired
      if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.warn('Fallback to local posts:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const openNewPostEditor = () => {
    setEditingPostId(null);
    setEditorTitle('');
    setEditorSlug('');
    setEditorSubtitle('');
    setEditorCategory('সফটওয়্যার');
    setEditorReadTime('৫ মিনিট পড়ার সময়');
    setEditorCoverImage('');
    setEditorCoverAlt('');
    setEditorTags('banglish, macos, bangla typing');
    setEditorContent('## নতুন সেকশন টাইটেল\n\nএখানে আপনার ব্লগের মূল কথা লিখুন...\n\n- পয়েন্ট ১\n- পয়েন্ট ২\n\n> গুরুত্বপূর্ণ কোনো নোট এখানে লিখুন।');
    setEditorStatus('published');
    setEditorFeatured(false);
    setEditorPreviewMode(false);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    setIsEditorOpen(true);
  };

  const openEditPostEditor = (post: any) => {
    setEditingPostId(post.id);
    setEditorTitle(post.title || '');
    setEditorSlug(post.slug || '');
    setEditorSubtitle(post.subtitle || '');
    setEditorCategory(post.category || 'সফটওয়্যার');
    setEditorReadTime(post.readTime || post.read_time || '৫ মিনিট পড়ার সময়');
    setEditorCoverImage(post.coverImage || post.cover_image || '');
    setEditorCoverAlt(post.coverAlt || post.cover_alt || '');
    setEditorTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
    setEditorContent(post.content || '');
    setEditorStatus(post.status || 'published');
    setEditorFeatured(Boolean(post.featured));
    setEditorPreviewMode(false);
    setSaveSuccessMsg('');
    setSaveErrorMsg('');
    setIsEditorOpen(true);
  };

  // Auto-generate slug when title changes (if new post)
  const handleTitleChange = (val: string) => {
    setEditorTitle(val);
    if (!editingPostId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setEditorSlug(autoSlug);
    }
  };

  // Phonetic Auto-Conversion inside Content Textarea on space / enter
  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!enablePhoneticTyping) return;
    if (e.key === ' ' || e.key === 'Enter') {
      const target = e.currentTarget;
      const cursorPos = target.selectionStart;
      const textBefore = target.value.substring(0, cursorPos);
      const match = textBefore.match(/([a-zA-Z0-9`^:$~]+)$/);
      if (match) {
        const wordToken = match[1];
        const converted = transliterateWord(wordToken);
        if (converted && converted !== wordToken) {
          e.preventDefault();
          const start = cursorPos - wordToken.length;
          const newValue = target.value.substring(0, start) + converted + (e.key === ' ' ? ' ' : '\n') + target.value.substring(cursorPos);
          setEditorContent(newValue);
          // Restore cursor
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + converted.length + 1;
          }, 0);
        }
      }
    }
  };

  const handleSavePost = async () => {
    if (!editorTitle.trim()) {
      setSaveErrorMsg('অনুগ্রহ করে ব্লগের টাইটেল লিখুন');
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

  // If not logged in, show Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-white">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-3 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <img src="/assets/banglish-logo-192.png" alt="Banglish Logo" className="w-full h-full object-contain" />
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900 font-bangla">
            Banglish এডমিন ও ম্যানেজার পোর্টাল
          </h2>
          <p className="text-xs text-center text-slate-500 font-bangla mt-1.5">
            ব্লগ তৈরি, এডিট ও ক্লাউডফ্লেয়ার D1 ডাটাবেজ নিয়ন্ত্রণ করুন
          </p>

          {loginError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bangla flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bangla">
                ইউজারনেম
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bangla">
                পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm shadow-md transition-all cursor-pointer font-bangla mt-2 disabled:opacity-50"
            >
              {isLoggingIn ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-700 font-bangla transition-colors">
              ← মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter posts
  const filteredPosts = posts.filter(p =>
    !searchQuery ||
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalPublished = posts.filter(p => p.status === 'published').length;
  const totalDrafts = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Left Icon Sidebar (Reference Image 2) */}
      <aside className="w-16 sm:w-20 bg-white border-r border-slate-200/80 flex flex-col items-center py-6 justify-between shrink-0 shadow-sm z-30">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Logo */}
          <Link href="/admin/blog" className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 p-1 flex items-center justify-center shadow-sm hover:scale-105 transition-transform">
            <img src="/assets/banglish-logo-192.png" alt="Logo" className="w-full h-full object-contain" />
          </Link>

          {/* Nav Icons */}
          <nav className="flex flex-col items-center gap-3 w-full px-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <button
              onClick={() => { setActiveTab('posts'); }}
              title="All Posts"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'posts'
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              onClick={openNewPostEditor}
              title="Add New Post"
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              onClick={() => { setActiveTab('backup'); generateGitBackupCode(); }}
              title="Git Backup & Sync"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <Database className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/blog"
            target="_blank"
            title="View Live Blog"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-5 h-5" />
          </Link>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar (Reference Image 2) */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ব্লগ পোস্ট খুঁজুন..."
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bangla transition-all"
            />
          </div>

          {/* Right Status & Date Badges */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-bangla">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">D1 Database Connected</span>
              <span className="sm:hidden">Live</span>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AP
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Hero Welcome Banner (Reference Image 2) */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-3 font-bangla">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ম্যানেজমেন্ট পোর্টাল</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-bangla">
                স্বাগতম, এডমিন! 👋
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 font-bangla max-w-xl leading-relaxed">
                আপনার ব্লগে নতুন পোস্ট লিখুন, ড্রাফট সেভ করুন এবং এক ক্লিকে ক্লাউডফ্লেয়ার D1 ডাটাবেজে লাইভ পাবলিশ করুন।
              </p>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button
                onClick={openNewPostEditor}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer font-bangla"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন পোস্ট লিখুন</span>
              </button>

              <button
                onClick={() => { if (token) fetchAdminPosts(token); }}
                title="Refresh from D1"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingPosts ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bangla block">মোট পোস্ট</span>
                <span className="text-2xl font-extrabold text-slate-900 mt-1 block font-mono">{posts.length}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bangla block">পাবলিশড পোস্ট</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block font-mono">{totalPublished}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bangla block">ড্রাফট পোস্ট</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block font-mono">{totalDrafts}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <PenSquare className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-bangla block">মোট রিডার ভিউজ</span>
                <span className="text-2xl font-extrabold text-indigo-600 mt-1 block font-mono">{totalViews}</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Active Tab: Backup Sync */}
          {activeTab === 'backup' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>গিটহাব ব্যাকআপ ও লোকাল কোড সিঙ্ক</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    Cloudflare D1-এর সকল পোস্ট গিটহাব রিপোজিটরির <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">data/blogData.ts</code> ফাইলে ব্যাকআপ করুন।
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(backupCode);
                    setCopiedBackup(true);
                    setTimeout(() => setCopiedBackup(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer font-bangla"
                >
                  <Download className="w-4 h-4" />
                  <span>{copiedBackup ? 'কপি হয়েছে!' : 'Copy Code for blogData.ts'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-96">
                <pre>{backupCode}</pre>
              </div>
            </div>
          )}

          {/* Recent Blogs Table (Reference Image 2) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-bangla">সকল ব্লগ পোস্ট</h3>
                <span className="text-xs text-slate-400 font-bangla">মোট {filteredPosts.length} টি পোস্ট সংরক্ষিত আছে</span>
              </div>

              <button
                onClick={openNewPostEditor}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer font-bangla shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New</span>
              </button>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 font-bangla">
                কোনো ব্লগ পোস্ট পাওয়া যায়নি। "+ Add New" বাটনে ক্লিক করে প্রথম পোস্ট তৈরি করুন।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse font-bangla">
                  <thead>
                    <tr className="bg-slate-50/60 text-slate-500 text-xs border-b border-slate-100">
                      <th className="p-4 font-semibold">আর্টিকেল</th>
                      <th className="p-4 font-semibold">ক্যাটাগরি</th>
                      <th className="p-4 font-semibold">স্ট্যাটাস</th>
                      <th className="p-4 font-semibold">ভিউস</th>
                      <th className="p-4 font-semibold">তারিখ</th>
                      <th className="p-4 font-semibold text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {filteredPosts.map(post => (
                      <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80">
                              {post.coverImage ? (
                                <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-sm">
                              <span className="font-bold text-slate-900 block truncate font-bangla">
                                {post.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono block truncate">
                                /blog/{post.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            {post.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {post.status === 'published' ? 'লাইভ' : 'ড্রাফট'}
                          </span>
                        </td>

                        <td className="p-4 font-mono font-medium text-slate-700">
                          {post.views || 0}
                        </td>

                        <td className="p-4 text-slate-500 font-bangla">
                          {post.date}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              title="ভিউ করুন"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => openEditPostEditor(post)}
                              title="এডিট করুন"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeletePost(post.id as any, post.title)}
                              title="ডিলিট করুন"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Interactive Blog Editor Modal / Studio */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-bangla">
                  {editingPostId ? 'ব্লগ পোস্ট সম্পাদনা করুন' : 'নতুন ব্লগ তৈরি ও পাবলিশ'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Phonetic typing switch */}
                <label className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 cursor-pointer font-bangla">
                  <input
                    type="checkbox"
                    checked={enablePhoneticTyping}
                    onChange={e => setEnablePhoneticTyping(e.target.checked)}
                    className="accent-emerald-600"
                  />
                  <span>ফোনেটিক বাংলা টাইপিং</span>
                </label>

                {/* Split / Preview Toggle */}
                <button
                  type="button"
                  onClick={() => setEditorPreviewMode(!editorPreviewMode)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors font-bangla"
                >
                  {editorPreviewMode ? 'এডিটর দেখুন' : 'প্রিভিউ দেখুন'}
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Messages */}
            {saveSuccessMsg && (
              <div className="px-6 py-2 bg-emerald-50 text-emerald-800 text-xs font-bangla border-b border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}
            {saveErrorMsg && (
              <div className="px-6 py-2 bg-rose-50 text-rose-800 text-xs font-bangla border-b border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{saveErrorMsg}</span>
              </div>
            )}

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              
              {!editorPreviewMode ? (
                <>
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                        ব্লগ টাইটেল *
                      </label>
                      <input
                        type="text"
                        value={editorTitle}
                        onChange={e => handleTitleChange(e.target.value)}
                        placeholder="যেমন: ম্যাকওএসে দ্রুত বাংলা টাইপ করার নিয়ম"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                        URL Slug (অটো-তৈরি)
                      </label>
                      <input
                        type="text"
                        value={editorSlug}
                        onChange={e => setEditorSlug(e.target.value)}
                        placeholder="banglish-typing-rules"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                    </div>
                  </div>

                  {/* Subtitle / Excerpt */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                      সাবটাইটেল / সারাংশ (Excerpt)
                    </label>
                    <input
                      type="text"
                      value={editorSubtitle}
                      onChange={e => setEditorSubtitle(e.target.value)}
                      placeholder="এক লাইনে ব্লগের সংক্ষিপ্ত বিবরণ লিখুন..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  {/* Category, Read Time, Status, Featured */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                        ক্যাটাগরি
                      </label>
                      <select
                        value={editorCategory}
                        onChange={e => setEditorCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/30 bg-white"
                      >
                        {blogCategories.filter(c => c !== 'সকল আর্টিকেল').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                        পড়ার সময়
                      </label>
                      <input
                        type="text"
                        value={editorReadTime}
                        onChange={e => setEditorReadTime(e.target.value)}
                        placeholder="৫ মিনিট পড়ার সময়"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bangla focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                        পাবলিশ স্ট্যাটাস
                      </label>
                      <select
                        value={editorStatus}
                        onChange={e => setEditorStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bangla focus:outline-none bg-white"
                      >
                        <option value="published">লাইভ পাবলিশ</option>
                        <option value="draft">ড্রাফট (Draft)</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pb-2 cursor-pointer font-bangla">
                        <input
                          type="checkbox"
                          checked={editorFeatured}
                          onChange={e => setEditorFeatured(e.target.checked)}
                          className="accent-emerald-600 w-4 h-4"
                        />
                        <span>Featured Insight</span>
                      </label>
                    </div>
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                      কভার ছবির URL (Unsplash বা যেকোনো ইমেজ লিঙ্ক)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editorCoverImage}
                        onChange={e => setEditorCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                      />
                      {editorCoverImage && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                          <img src={editorCoverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 font-bangla">
                      ট্যাগসমূহ (কমা দিয়ে লিখুন)
                    </label>
                    <input
                      type="text"
                      value={editorTags}
                      onChange={e => setEditorTags(e.target.value)}
                      placeholder="banglish, macos, typing, guide"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none"
                    />
                  </div>

                  {/* Markdown Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 font-bangla">
                        ব্লগের কনটেন্ট (Markdown সমর্থিত)
                      </label>
                      <span className="text-[11px] text-slate-400 font-bangla">
                        {enablePhoneticTyping ? '✨ ফোনেটিক মোড সক্রিয় (যেমন: amra লিখলে আমরা হবে)' : 'স্ট্যান্ডার্ড টাইপিং'}
                      </span>
                    </div>

                    <textarea
                      rows={14}
                      value={editorContent}
                      onChange={e => setEditorContent(e.target.value)}
                      onKeyDown={handleContentKeyDown}
                      placeholder="এখানে Markdown ফরম্যাটে আপনার ব্লগের মূল কনটেন্ট লিখুন..."
                      className="w-full p-4 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </>
              ) : (
                /* Live Preview Mode */
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50">
                  <div className="max-w-3xl mx-auto">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bangla">
                      {editorCategory} • {editorReadTime}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-4 font-bangla">
                      {editorTitle || 'শিরোনাম এখানে দেখা যাবে'}
                    </h1>
                    {editorSubtitle && (
                      <p className="mt-2 text-slate-600 font-bangla">{editorSubtitle}</p>
                    )}
                    {editorCoverImage && (
                      <div className="my-6 rounded-2xl overflow-hidden max-h-72">
                        <img src={editorCoverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <MarkdownRenderer content={editorContent} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer font-bangla"
              >
                বাতিল করুন
              </button>

              <button
                type="button"
                onClick={handleSavePost}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer font-bangla disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : editingPostId ? 'আপডেট করুন' : 'পাবলিশ করুন (Publish)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
