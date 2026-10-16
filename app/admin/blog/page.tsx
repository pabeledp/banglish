'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  PenSquare, Mail, Image as ImageIcon, BarChart3, Database, 
  CalendarDays, Settings, LogOut, Search, Bell, Plus, Edit3, Trash2, Eye, 
  Check, X, Sparkles, BookOpen, Layers, ExternalLink, ArrowUpRight,
  TrendingUp, MessageSquare, Heart, Clock, CheckCircle2, AlertCircle,
  Copy, RefreshCw, ChevronDown, Filter, FileText, ChevronRight,
  Send, Reply, User, Lock, Key, ShieldCheck, Link2, Bold, Italic,
  Heading1, Heading2, Heading3, AlignCenter, Quote, Code, List,
  Calendar as CalendarIcon, CheckSquare, Camera, Upload
} from 'lucide-react';
import { transliterateWord } from '@/lib/phoneticEngine';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { blogCategories, BlogPost, blogPosts as fallbackStaticPosts } from '@/data/blogData';

interface AdminComment {
  id: number;
  post_slug: string;
  post_title?: string;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
  status: string;
  is_read: number;
  admin_reply?: string;
  admin_replied_at?: string;
}

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  monthly: { month: string; count: number }[];
  daily?: { day: string; count: number }[];
  topPosts: { title: string; slug: string; views: number; likes: number; comments: number }[];
}

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthorProfile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export default function AdminBlogPage() {
  const [token, setToken] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Sidebar Nav Tab
  const [activeNav, setActiveNav] = useState<'editor' | 'messages' | 'media' | 'analytics' | 'backup' | 'calendar' | 'settings'>('editor');
  
  // Timeframe filter for Visitor Insight Chart: D, M, Y
  const [chartTimeframe, setChartTimeframe] = useState<'D' | 'M' | 'Y'>('M');

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Comments State
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState<number>(0);
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // Real Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 120,
    todayVisits: 8,
    monthly: [],
    topPosts: [],
  });

  // Settings State: Admin Profile, Author Profile, Password Change
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'A M Pabel',
    email: 'ampabel.edp@gmail.com',
    role: 'Lead Architect & Founder',
    avatar: '/assets/pabel_light_avatar.webp',
  });
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile>({
    name: 'A M Pabel',
    role: 'Founder, FramEmpire',
    bio: 'Creator of Banglish Keyboard & Lead Architect at Team FramEmpire.',
    avatar: '/assets/pabel_light_avatar.webp',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ success: '', error: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

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
  const [editorStatus, setEditorStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [editorFeatured, setEditorFeatured] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  // Phonetic Auto-Conversion in Editor toggle
  const [enablePhoneticTyping, setEnablePhoneticTyping] = useState(true);

  // Editor Textarea Ref & Selection Context Menu
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  // Image Upload File Input Refs & Optimizer
  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const authorFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const processImageFile = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number,
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে সঠিক ইমেজ ফাইল সিলেক্ট করুন (PNG, JPG, WEBP)');
      return;
    }
    setIsProcessingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', quality);
          onSuccess(dataUrl);
        } else {
          onSuccess(e.target?.result as string);
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        alert('ইমেজ প্রসেস করতে সমস্যা হয়েছে');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Backup Export State
  const [backupCode, setBackupCode] = useState('');
  const [copiedBackup, setCopiedBackup] = useState(false);

  // Content Planner status filter
  const [plannerFilter, setPlannerFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');

  // Check stored auth token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('banglish_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchAdminPosts(savedToken);
      fetchAdminComments(savedToken);
      fetchAnalytics(savedToken);
      fetchAdminSettings(savedToken);
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
        fetchAdminComments(data.token);
        fetchAnalytics(data.token);
        fetchAdminSettings(data.token);
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

  // Fetch Posts from D1
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
      if (res.status === 401) handleLogout();
    } catch (err) {
      console.warn('Fallback to local posts:', err);
      setPosts(fallbackStaticPosts);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  // Fetch Comments from D1
  const fetchAdminComments = async (authToken: string) => {
    try {
      const res = await fetch('/api/blog/admin/comments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          setComments(data.comments);
          setUnreadCommentsCount(data.unreadCount || 0);
        }
      }
    } catch (e) {
      console.warn('Failed to load comments:', e);
    }
  };

  // Fetch Real Analytics from D1
  const fetchAnalytics = async (authToken: string) => {
    try {
      const res = await fetch('/api/blog/admin/analytics', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      }
    } catch (e) {
      console.warn('Failed to load analytics:', e);
    }
  };

  // Fetch Admin & Author Settings from D1
  const fetchAdminSettings = async (authToken: string) => {
    try {
      const res = await fetch('/api/blog/admin/settings', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.adminProfile) setAdminProfile(data.settings.adminProfile);
          if (data.settings.authorProfile) setAuthorProfile(data.settings.authorProfile);
        }
      }
    } catch (e) {}
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsSuccessMsg('');
    try {
      const res = await fetch('/api/blog/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminProfile, authorProfile }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSuccessMsg('প্রোফাইল সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => setSettingsSuccessMsg(''), 3000);
      }
    } catch (e) {
      alert('সেটিংস সংরক্ষণে সমস্যা হয়েছে');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ success: '', error: '' });
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ success: '', error: 'নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি' });
      return;
    }
    try {
      const res = await fetch('/api/blog/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg({ success: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!', error: '' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ success: '', error: data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে' });
      }
    } catch (e) {
      setPasswordMsg({ success: '', error: 'সার্ভার যোগাযোগে সমস্যা হয়েছে' });
    }
  };

  // Admin Reply to Comment
  const handleSendAdminReply = async (commentId: number) => {
    if (!adminReplyText.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/blog/admin/comments/${commentId}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminReply: adminReplyText.trim() }),
      });
      if (res.ok) {
        setReplyingCommentId(null);
        setAdminReplyText('');
        if (token) fetchAdminComments(token);
      }
    } catch (e) {
      alert('রিপ্লাই পাঠাতে সমস্যা হয়েছে');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই মন্তব্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/blog/admin/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok && token) fetchAdminComments(token);
    } catch (e) {}
  };

  // Mark Comment as Read
  const handleMarkAsRead = async (commentId: number) => {
    try {
      await fetch(`/api/blog/admin/comments/${commentId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (token) fetchAdminComments(token);
    } catch (e) {}
  };

  // Format selected text in the Article Editor
  const applyTextFormatting = (type: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const before = editorContent.substring(0, start);
    const after = editorContent.substring(end);

    let replacement = selectedText;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'বোল্ড টেক্সট'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'ইটালিক টেক্সট'}*`;
        break;
      case 'h1':
        replacement = `\n# ${selectedText || 'শিরোনাম ১'}\n`;
        break;
      case 'h2':
        replacement = `\n## ${selectedText || 'শিরোনাম ২'}\n`;
        break;
      case 'h3':
        replacement = `\n### ${selectedText || 'শিরোনাম ৩'}\n`;
        break;
      case 'h4':
        replacement = `\n#### ${selectedText || 'শিরোনাম ৪'}\n`;
        break;
      case 'h5':
        replacement = `\n##### ${selectedText || 'শিরোনাম ৫'}\n`;
        break;
      case 'link':
        const url = prompt('হাইপারলিংক ইউআরএল লিখুন (e.g. https://banglish.bd):', 'https://');
        if (url) replacement = `[${selectedText || 'লিংক টাইটেল'}](${url})`;
        break;
      case 'center':
        replacement = `<div align="center">\n${selectedText || 'সেন্টার টেক্সট'}\n</div>`;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'উদ্ধৃতি'}\n`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'লিস্ট আইটেম'}\n`;
        break;
      default:
        break;
    }

    setEditorContent(before + replacement + after);
    setContextMenuPos(null);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + replacement.length;
      textarea.selectionEnd = start + replacement.length;
    }, 0);
  };

  // Handle right-click on textarea
  const handleTextareaContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleCloseMenu = () => setContextMenuPos(null);
    window.addEventListener('click', handleCloseMenu);
    return () => window.removeEventListener('click', handleCloseMenu);
  }, []);

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
    setEditorStatus(post.status === 'draft' ? 'draft' : post.status === 'scheduled' ? 'scheduled' : 'published');
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
      setSaveErrorMsg('অনুগ্রহ করে আর্টিকেলের বিষয়বস্তু লিখুন');
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
        name: authorProfile.name || 'A M Pabel',
        role: authorProfile.role || 'Founder, FramEmpire',
        avatar: authorProfile.avatar || '/assets/pabel_light_avatar.webp',
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
        setSaveSuccessMsg(editingPostId ? 'পোস্ট সফলভাবে আপডেট হয়েছে! 🎉' : 'পোস্ট সফলভাবে সংরক্ষিত হয়েছে! 🚀');
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
      if (res.ok && token) fetchAdminPosts(token);
    } catch (err) {}
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
  likes?: number;
  status?: 'published' | 'draft' | 'scheduled';
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

  const displayPosts = filteredPosts.length > 0 ? filteredPosts : fallbackStaticPosts;
  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalLikes = posts.reduce((acc, p) => acc + (p.likes || 0), 0);

  // Content Planner filtered list
  const plannerPosts = posts.filter(p => {
    if (plannerFilter === 'all') return true;
    return p.status === plannerFilter;
  });

  // Dynamic Chart Items based on Timeframe ('M' or 'D')
  const chartItems = useMemo(() => {
    if (chartTimeframe === 'D') {
      const days = [];
      const dailyMap = new Map((analytics.daily || []).map(d => [d.day, d.count]));
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        const count = dailyMap.get(dayKey) || 0;
        const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        days.push({ key: dayKey, label, count });
      }
      return days;
    }

    const months = [
      { key: '01', label: 'Jan' },
      { key: '02', label: 'Feb' },
      { key: '03', label: 'Mar' },
      { key: '04', label: 'Apr' },
      { key: '05', label: 'May' },
      { key: '06', label: 'Jun' },
      { key: '07', label: 'Jul' },
      { key: '08', label: 'Aug' },
      { key: '09', label: 'Sep' },
      { key: '10', label: 'Oct' },
      { key: '11', label: 'Nov' },
      { key: '12', label: 'Dec' },
    ];
    const monthMap = new Map((analytics.monthly || []).map(m => [String(m.month).padStart(2, '0'), m.count]));
    return months.map(m => ({
      ...m,
      count: monthMap.get(m.key) || 0,
    }));
  }, [chartTimeframe, analytics]);

  const maxChartCount = useMemo(() => {
    const counts = chartItems.map(i => i.count);
    return Math.max(...counts, 10);
  }, [chartItems]);

  // 1. Light Luxury Emerald Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 flex items-center justify-center p-4 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-70" aria-hidden="true" />
        <div className="fixed -top-40 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-0 -left-32 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-950/10 border border-emerald-100/90 relative z-10">
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
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm font-bangla flex items-center gap-2.5">
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
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 font-bangla cursor-pointer"
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

  // 2. Main Dashboard Layout
  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Left Vertical Icon Sidebar */}
      <aside className="w-16 sm:w-20 bg-white border-r border-slate-200/80 flex flex-col items-center py-6 justify-between shrink-0 shadow-xs z-30">
        <div className="flex flex-col items-center gap-7 w-full">
          {/* Logo Glyph */}
          <Link href="/admin/blog" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border border-emerald-200/60 p-1 flex items-center justify-center shadow-xs hover:scale-105 transition-transform">
            <img src="/assets/banglish-logo-192.png" alt="Logo" className="w-full h-full object-contain" />
          </Link>

          {/* Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-2.5 w-full px-2">
            
            {/* 1. Dashboard & Editor */}
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

            {/* 2. Messages / Comments Inbox */}
            <button
              onClick={() => { setActiveNav('messages'); if (token) fetchAdminComments(token); }}
              title="Comments & Messages Inbox"
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
              {unreadCommentsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
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
              onClick={() => { setActiveNav('analytics'); if (token) fetchAnalytics(token); }}
              title="Visitor Analytics & Insights"
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

            {/* 5. Database / Git Backup */}
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

            {/* 6. Content Planner (User requested content icon for calendar) */}
            <button
              onClick={() => setActiveNav('calendar')}
              title="Content Planner & Scheduled Articles"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'calendar'
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeNav === 'calendar' && (
                <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
              )}
              <CalendarDays className="w-5 h-5" />
            </button>

            {/* 7. Settings (Profiles, Passwords) */}
            <button
              onClick={() => { setActiveNav('settings'); if (token) fetchAdminSettings(token); }}
              title="Admin & Author Profile Settings"
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

        {/* Bottom Actions */}
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

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 sm:h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
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

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3.5 py-2 rounded-full border border-slate-200/80">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Today <strong className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </div>

            {/* Notification Bell (Shows Comments Count) */}
            <button 
              onClick={() => setActiveNav('messages')}
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCommentsCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Profile Avatar */}
            <div 
              onClick={() => setActiveNav('settings')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={adminProfile.avatar || '/assets/pabel_light_avatar.webp'}
                  alt={adminProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Dynamic Views based on activeNav */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* VIEW 1: Main Dashboard & Editor */}
          {activeNav === 'editor' && (
            <>
              {/* Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 font-sans">
                    Welcome Back! <span className="animate-wiggle">👋</span>
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-1">{greeting}</p>
                </div>

                <button
                  onClick={openNewPostEditor}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all font-bangla cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন আর্টিকেল লিখুন</span>
                </button>
              </div>

              {/* Top 5 Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* Author Card (Span 4) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full z-10">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 font-sans">{authorProfile.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{authorProfile.role}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                      <div>
                        <span className="text-xl font-bold text-slate-900 font-sans">{posts.length}</span>
                        <span className="text-xs text-slate-400 ml-1.5 font-medium">Total Posts</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div>
                        <span className="text-xl font-bold text-slate-900 font-sans">{totalViews}</span>
                        <span className="text-xs text-slate-400 ml-1.5 font-medium">Total Views</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                    <img 
                      src={authorProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                      alt="Author" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>

                {/* Total Post (Span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-medium">Total Articles</p>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-sans mt-0.5">
                      {posts.length}
                    </h4>
                  </div>
                </div>

                {/* Total Views (Span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-medium">Total Views</p>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-purple-600 font-sans mt-0.5">
                      {totalViews.toLocaleString()}
                    </h4>
                  </div>
                </div>

                {/* Comments (Span 2) */}
                <div 
                  onClick={() => setActiveNav('messages')}
                  className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between cursor-pointer hover:border-emerald-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-medium">Comments</p>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-sans mt-0.5">
                      {comments.length}
                    </h4>
                  </div>
                </div>

                {/* Total Likes (Span 2) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between relative">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 self-start shadow-xs">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{totalLikes > 0 ? `+${totalLikes}` : '0'}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 font-medium">Total Likes</p>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-rose-500 font-sans mt-0.5">
                      {totalLikes.toLocaleString()}
                    </h4>
                  </div>
                </div>

              </div>

              {/* Two Column Bottom Grid: Visitors Chart & Recent Blogs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Visitors Analytics (Live Tracked from D1 site_visits) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900 font-sans flex items-center gap-2">
                          <span>Visitors</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Real-time Tracking" />
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">Real-time Traffic (Cloudflare D1)</p>
                      </div>
                      <button
                        onClick={() => { if (token) fetchAnalytics(token); }}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        title="রিফ্রেশ অ্যানালিটিক্স"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-2xl font-black text-slate-900 font-sans">
                          {analytics.totalVisits.toLocaleString()}
                        </span>
                        <p className="text-xs text-slate-400 font-medium">Total Visitors</p>
                      </div>

                      <div>
                        <span className="text-2xl font-black text-emerald-600 font-sans flex items-center gap-1">
                          +{analytics.todayVisits} <span className="text-base">↑</span>
                        </span>
                        <p className="text-xs text-slate-400 font-medium">Today Visits</p>
                      </div>

                      <div className="flex items-center bg-slate-100 rounded-full p-1 text-xs font-bold">
                        {(['D', 'M'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setChartTimeframe(f)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              chartTimeframe === f
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-400 hover:text-slate-700'
                            }`}
                            title={f === 'D' ? 'দৈনিক ট্রাফিক (Last 7 Days)' : 'মাসিক ট্রাফিক (All Months)'}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-500">
                      {chartTimeframe === 'D' ? 'বিগত ৭ দিনের লাইভ ভিজিটর সংখ্যা (Daily)' : 'চলতি বছরের প্রতি মাসের লাইভ ভিজিটর সংখ্যা (Monthly)'}
                    </span>
                    
                    <div className="flex items-center gap-2 font-medium text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>{chartTimeframe === 'D' ? 'দিন অনুযায়ী ভিজিট' : 'মাস অনুযায়ী ভিজিট'}</span>
                    </div>
                  </div>

                  {/* Real-time Dynamic Interactive Bar Chart */}
                  <div className="w-full pt-6 pb-2">
                    <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-slate-200">
                      {chartItems.map((item, idx) => {
                        const heightPct = Math.max(6, Math.round((item.count / maxChartCount) * 100));
                        const hasVisits = item.count > 0;
                        return (
                          <div key={item.key || idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                            
                            {/* Hover Tooltip */}
                            <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap">
                              {item.label}: {item.count} visitors
                            </div>

                            {/* Badge count on top of bar if visits > 0 */}
                            {hasVisits && (
                              <span className="text-[10px] font-bold text-blue-600 mb-1 font-mono">
                                {item.count}
                              </span>
                            )}

                            {/* Dynamic Bar */}
                            <div 
                              style={{ height: `${heightPct}%` }}
                              className={`w-full max-w-[36px] rounded-t-xl transition-all duration-500 ${
                                hasVisits
                                  ? 'bg-gradient-to-t from-blue-600 to-sky-400 shadow-md shadow-blue-500/20 group-hover:from-blue-700 group-hover:to-sky-300'
                                  : 'bg-slate-100 group-hover:bg-slate-200'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Chart X-Axis Labels */}
                    <div className="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-2.5">
                      {chartItems.map((item, idx) => (
                        <div key={item.key || idx} className="flex-1 text-center">
                          <span className={`text-[11px] font-medium block truncate ${
                            item.count > 0 ? 'text-blue-700 font-bold' : 'text-slate-400'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Recent Blogs Card */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
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

                  <div className="divide-y divide-slate-100 space-y-4">
                    {displayPosts.slice(0, 6).map((post: any) => (
                      <div key={post.slug || post.id} className="pt-4 first:pt-0 flex items-center gap-3.5 group">
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

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 transition-colors line-clamp-1 font-bangla block"
                          >
                            {post.title}
                          </Link>

                          <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-medium">
                            <span className="flex items-center gap-1 font-mono">
                              <Heart className="w-3 h-3 text-rose-400" />
                              <span>{post.likes || 0}</span>
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Eye className="w-3 h-3 text-slate-400" />
                              <span>{post.views || 0}</span>
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
            </>
          )}

          {/* VIEW 2: Messages / Comments Inbox */}
          {activeNav === 'messages' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>পাঠকদের মন্তব্য ও মেসেজ ইনবক্স</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                      {comments.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    ব্লগ আর্টিকেলে আসা সকল মন্তব্য দেখুন, উত্তর দিন অথবা মুছে ফেলুন।
                  </p>
                </div>

                <button
                  onClick={() => { if (token) fetchAdminComments(token); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-bangla transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>রিফ্রেশ</span>
                </button>
              </div>

              {comments.length === 0 ? (
                <div className="py-16 text-center text-slate-400 font-bangla">
                  <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm">এখনও কোনো নতুন মন্তব্য আসেনি।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(c => (
                    <div 
                      key={c.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        c.is_read ? 'bg-white border-slate-200/80' : 'bg-blue-50/40 border-blue-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase font-sans">
                            {(c.author_name || 'U')[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm font-bangla">{c.author_name}</h4>
                            {c.author_email && (
                              <p className="text-xs text-slate-400 font-sans">{c.author_email}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bangla">
                          <Link 
                            href={`/blog/${c.post_slug}`}
                            target="_blank"
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {c.post_title || c.post_slug}
                          </Link>
                          <span>•</span>
                          <span>{new Date(c.created_at).toLocaleString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 font-bangla leading-relaxed pl-10 my-3">
                        {c.content}
                      </p>

                      {/* Existing Admin Reply */}
                      {c.admin_reply && (
                        <div className="ml-10 p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-slate-800 font-bangla mb-3">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>আপনার দেওয়া রিপ্লাই:</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">{c.admin_reply}</p>
                        </div>
                      )}

                      {/* Reply Box if Active */}
                      {replyingCommentId === c.id ? (
                        <div className="ml-10 mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <label className="block text-xs font-bold text-slate-700 font-bangla">
                            অ্যাডমিন হিসেবে উত্তর লিখুন:
                          </label>
                          <textarea
                            value={adminReplyText}
                            onChange={e => setAdminReplyText(e.target.value)}
                            rows={2}
                            placeholder="ধন্যবাদ আপনার মন্তব্যের জন্য..."
                            className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setReplyingCommentId(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer font-bangla"
                            >
                              বাতিল
                            </button>
                            <button
                              disabled={isSendingReply}
                              onClick={() => handleSendAdminReply(c.id)}
                              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-bangla flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                            >
                              <Send className="w-3 h-3" />
                              <span>রিপ্লাই পোস্ট করুন</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                          {!c.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(c.id)}
                              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer font-bangla"
                            >
                              পড়া হয়েছে মার্ক করুন
                            </button>
                          )}
                          <button
                            onClick={() => { setReplyingCommentId(c.id); setAdminReplyText(c.admin_reply || ''); }}
                            className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold font-bangla flex items-center gap-1 cursor-pointer"
                          >
                            <Reply className="w-3 h-3" />
                            <span>রিপ্লাই দিন</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: Analytics & Traffic Insights */}
          {activeNav === 'analytics' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>অ্যানালিটিক্স ও ট্রাফিক ইনসাইটস (Traffic Analytics)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    ক্লাউডফ্লেয়ার D1-এর রিয়েলটাইম ডাটা ট্র্যাকিং এবং সার্চ ইঞ্জিন পারফরম্যান্স।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { if (token) fetchAnalytics(token); }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-bangla transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>
              </div>

              {/* Top Performing Articles Table */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-bangla">সর্বাধিক পঠিত আর্টিকেলসমূহ (Top Articles)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-bangla">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[11px]">
                        <th className="py-3 px-4">শিরোনাম</th>
                        <th className="py-3 px-4 text-center">ভিউ সংখ্যা</th>
                        <th className="py-3 px-4 text-center">লাভ রিয়্যাক্ট</th>
                        <th className="py-3 px-4 text-center">মন্তব্য</th>
                        <th className="py-3 px-4 text-right">ভিউ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(analytics.topPosts && analytics.topPosts.length > 0 ? analytics.topPosts : posts).map((p: any) => (
                        <tr key={p.slug || p.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-800 text-sm max-w-sm truncate">
                            <Link href={`/blog/${p.slug}`} target="_blank" className="hover:text-blue-600 transition-colors">
                              {p.title}
                            </Link>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                            {p.views || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-500">
                            {p.likes || 0}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                            {p.comments || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              className="p-1 rounded-lg text-slate-400 hover:text-blue-600 inline-block"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Google Search Console & Analytics Integration Hub */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Search Console Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                        G
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm font-sans">Google Search Console</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bangla leading-relaxed">
                      গুগল সার্চে আপনার ব্লগের ইমপ্রেশন, ক্লিক, কিওয়ার্ড র‍্যাঙ্কিং এবং ইনডেক্সিং স্ট্যাটাস দেখুন।
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold font-bangla transition-all shadow-xs cursor-pointer"
                    >
                      <span>Search Console খুলুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Google Analytics Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        GA
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm font-sans">Google Analytics 4 (GA4)</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-bangla leading-relaxed">
                      লাইভ রিয়েলটাইম ইউজার, বাউন্স রেট, ডিভাইস (মোবাইল/পিসি) ও দেশভিত্তিক বিস্তারিত অ্যানালিটিক্স রিপোর্ট।
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://analytics.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-bangla transition-all shadow-xs cursor-pointer"
                    >
                      <span>Google Analytics খুলুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

              </div>

            </div>
          )}
          {activeNav === 'calendar' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    <span>কন্টেন্ট প্ল্যানার ও শিডিউলার (Content Planner)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    সকল আর্টিকেলের তালিকা, পাবলিশিং স্ট্যাটাস ও শিডিউল তারিখ পরিচালনা করুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-slate-100 rounded-full p-1 text-xs font-semibold font-bangla">
                    {(['all', 'published', 'scheduled', 'draft'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setPlannerFilter(status)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer capitalize ${
                          plannerFilter === status ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-500'
                        }`}
                      >
                        {status === 'all' ? 'সব' : status === 'published' ? 'পাবলিশড' : status === 'scheduled' ? 'শিডিউলড' : 'ড্রাফট'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={openNewPostEditor}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-bangla flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন আর্টিকেল</span>
                  </button>
                </div>
              </div>

              {/* Table of Content Planner Posts */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bangla">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">আর্টিকেল</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">তারিখ / শিডিউল</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plannerPosts.map((post: any) => (
                      <tr key={post.slug || post.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="py-3.5 px-4 font-bold text-slate-800 text-sm max-w-xs truncate">
                          <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-blue-600 transition-colors">
                            {post.title}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                            {post.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono">
                          {post.isoDate || post.date}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : post.status === 'scheduled'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {post.status || 'published'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditPostEditor(post)}
                              className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold cursor-pointer"
                            >
                              এডিট
                            </button>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors"
                              title="ভিউ"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: Settings (Admin Profile, Authors Profile, Password Change) */}
          {activeNav === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Card 1: Admin Profile & Authors Profile Settings */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>প্রোফাইল ও লেখক সেটিংস (Profile & Authors)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    অ্যাডমিন ও আর্টিকেলের লেখকের ছবি এবং বিবরণ পরিবর্তন করুন।
                  </p>
                </div>

                {settingsSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bangla flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{settingsSuccessMsg}</span>
                  </div>
                )}

                {/* Admin Profile Form */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm font-bangla">অ্যাডমিন প্রোফাইল</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div 
                      className="relative group w-16 h-16 shrink-0 cursor-pointer" 
                      onClick={() => adminFileInputRef.current?.click()}
                      title="ছবি আপলোড করতে ক্লিক করুন"
                    >
                      <img 
                        src={adminProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={adminFileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, 300, 300, 0.85, (dataUrl) => {
                            setAdminProfile({ ...adminProfile, avatar: dataUrl });
                          });
                        }
                      }}
                    />

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 font-bangla">
                          প্রোফাইল পিকচার
                        </label>
                        <button
                          type="button"
                          onClick={() => adminFileInputRef.current?.click()}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 font-bangla flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="অথবা সরাসরি ইমেজ লিংক (URL) দিন"
                        value={adminProfile.avatar.startsWith('data:image') ? '(সরাসরি ডিভাইস থেকে ছবি আপলোড করা হয়েছে)' : adminProfile.avatar}
                        onChange={e => setAdminProfile({ ...adminProfile, avatar: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1">নাম</label>
                      <input
                        type="text"
                        value={adminProfile.name}
                        onChange={e => setAdminProfile({ ...adminProfile, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bangla"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1">ইমেইল</label>
                      <input
                        type="email"
                        value={adminProfile.email}
                        onChange={e => setAdminProfile({ ...adminProfile, email: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Author Profile Form */}
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm font-bangla">আর্টিকেল অথর (Author Profile)</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div 
                      className="relative group w-16 h-16 shrink-0 cursor-pointer" 
                      onClick={() => authorFileInputRef.current?.click()}
                      title="ছবি আপলোড করতে ক্লিক করুন"
                    >
                      <img 
                        src={authorProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                        alt="Author" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <input 
                      type="file" 
                      ref={authorFileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          processImageFile(file, 300, 300, 0.85, (dataUrl) => {
                            setAuthorProfile({ ...authorProfile, avatar: dataUrl });
                          });
                        }
                      }}
                    />

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 font-bangla">
                          অথর প্রোফাইল ছবি
                        </label>
                        <button
                          type="button"
                          onClick={() => authorFileInputRef.current?.click()}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 font-bangla flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300 shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="অথবা সরাসরি ইমেজ লিংক (URL) দিন"
                        value={authorProfile.avatar.startsWith('data:image') ? '(সরাসরি ডিভাইস থেকে ছবি আপলোড করা হয়েছে)' : authorProfile.avatar}
                        onChange={e => setAuthorProfile({ ...authorProfile, avatar: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1">অথর নাম</label>
                      <input
                        type="text"
                        value={authorProfile.name}
                        onChange={e => setAuthorProfile({ ...authorProfile, name: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bangla"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 font-bangla mb-1">পদবী (Role)</label>
                      <input
                        type="text"
                        value={authorProfile.role}
                        onChange={e => setAuthorProfile({ ...authorProfile, role: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bangla"
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={isSavingSettings}
                  onClick={handleSaveSettings}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-bangla transition-all cursor-pointer shadow-sm"
                >
                  {isSavingSettings ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন'}
                </button>
              </div>

              {/* Card 2: Password Change Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-bangla flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <span>পাসওয়ার্ড পরিবর্তন (Change Password)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-bangla mt-1">
                    অ্যাডমিন প্যানেলে লগইন করার জন্য নতুন পাসওয়ার্ড সেট করুন।
                  </p>
                </div>

                {passwordMsg.success && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bangla flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{passwordMsg.success}</span>
                  </div>
                )}

                {passwordMsg.error && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bangla flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{passwordMsg.error}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      বর্তমান পাসওয়ার্ড (Current Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      নতুন পাসওয়ার্ড (New Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                      নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-bangla transition-all cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    পাসওয়ার্ড আপডেট করুন
                  </button>
                </form>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-900 font-bangla leading-relaxed space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানোর সুবিধা:</span>
                  </div>
                  <p className="text-slate-600">
                    ভবিষ্যতে পাসওয়ার্ড ভুলে গেলে আপনার নিবন্ধিত ইমেইলে (`{adminProfile.email}`) সিকিউর ওয়ান-টাইম রিসেট লিংক পাঠানোর সেটআপের জন্য বিস্তারিত গাইড দেখতে পারবেন।
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 5: Git Backup */}
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

      {/* 3. Full Modern Post Editor Modal with Floating Rich-Text Context Menu */}
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

              {/* Subtitle */}
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
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">ক্যাটাগরি</label>
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
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">পড়ার সময় (Read Time)</label>
                  <input
                    type="text"
                    value={editorReadTime}
                    onChange={e => setEditorReadTime(e.target.value)}
                    placeholder="৫ মিনিট পড়ার সময়"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">স্ট্যাটাস</label>
                  <select
                    value={editorStatus}
                    onChange={e => setEditorStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bangla bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="published">পাবলিশড (Published)</option>
                    <option value="scheduled">শিডিউলড (Scheduled)</option>
                    <option value="draft">ড্রাফট (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 font-bangla">
                    কভার ইমেজ (Cover Image)
                  </label>
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 font-bangla flex items-center gap-1 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-300"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>ডিভাইস থেকে কভার ফটো আপলোড করুন</span>
                  </button>
                </div>

                <input 
                  type="file" 
                  ref={coverFileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      processImageFile(file, 1200, 675, 0.85, (dataUrl) => {
                        setEditorCoverImage(dataUrl);
                      });
                    }
                  }}
                />

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editorCoverImage.startsWith('data:image') ? '(সরাসরি ডিভাইস থেকে কভার ফটো আপলোড করা হয়েছে)' : editorCoverImage}
                    onChange={e => setEditorCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... অথবা উপরের বাটন দিয়ে আপলোড করুন"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {editorCoverImage && (
                    <img 
                      src={editorCoverImage} 
                      alt="Cover Preview" 
                      className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs" 
                    />
                  )}
                </div>
              </div>

              {/* Formatting Toolbar (User requested rich-text formatting buttons) */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-1 text-slate-600">
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('bold')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Bold (**text**)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('italic')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Italic (*text*)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <span className="w-px h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('h1')}
                      className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('h2')}
                      className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('h3')}
                      className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('h4')}
                      className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      title="Heading 4"
                    >
                      H4
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('h5')}
                      className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      title="Heading 5"
                    >
                      H5
                    </button>
                    <span className="w-px h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('link')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Hyperlink [text](url)"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('center')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Center Alignment"
                    >
                      <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('quote')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Quote (> text)"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('code')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Inline Code (`text`)"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTextFormatting('list')}
                      className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Bullet List (- item)"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        !editorPreviewMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      এডিটর
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                        editorPreviewMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      লাইভ প্রিভিউ
                    </button>
                  </div>
                </div>

                {!editorPreviewMode ? (
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={editorContent}
                      onChange={e => setEditorContent(e.target.value)}
                      onKeyDown={handleContentKeyDown}
                      onContextMenu={handleTextareaContextMenu}
                      rows={14}
                      placeholder="## আপনার হেডলাইন এখানে লিখুন... (টেক্সট সিলেক্ট করে রাইট ক্লিক করলে ফরম্যাটিং অপশন আসবে)"
                      className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                    />

                    {/* Right-click Floating Context Menu */}
                    {contextMenuPos && (
                      <div
                        style={{ top: contextMenuPos.y - 120, left: Math.min(contextMenuPos.x - 200, window.innerWidth - 220) }}
                        className="fixed z-50 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2 flex flex-col gap-1 w-48 text-xs font-bangla text-slate-700 animate-in fade-in zoom-in-95"
                      >
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 py-1">Formatting</span>
                        <button
                          type="button"
                          onClick={() => applyTextFormatting('bold')}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 font-bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                          <span>বোল্ড (Bold)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTextFormatting('italic')}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                          <span>ইটালিক (Italic)</span>
                        </button>
                        <div className="grid grid-cols-5 gap-1 px-1 my-1">
                          {(['h1', 'h2', 'h3', 'h4', 'h5'] as const).map(h => (
                            <button
                              key={h}
                              type="button"
                              onClick={() => applyTextFormatting(h)}
                              className="p-1 rounded bg-slate-100 hover:bg-blue-600 hover:text-white font-mono text-center font-bold text-[10px] uppercase"
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => applyTextFormatting('link')}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>হাইপারলিংক (Link)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTextFormatting('center')}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <AlignCenter className="w-3.5 h-3.5" />
                          <span>সেন্টার এলাইনমেন্ট</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => applyTextFormatting('quote')}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                          <Quote className="w-3.5 h-3.5" />
                          <span>কোটেশন (Quote)</span>
                        </button>
                      </div>
                    )}
                  </div>
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
