'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  PenSquare, Mail, Image as ImageIcon, BarChart3, Database, 
  CalendarDays, Settings, LogOut, Search, Bell, Plus, Edit3, Trash2, Eye, 
  Check, X, Sparkles, BookOpen, Layers, ExternalLink, ArrowUpRight,
  TrendingUp, MessageSquare, Heart, Clock, CheckCircle2, AlertCircle,
  Copy, RefreshCw, ChevronDown, Filter, FileText, ChevronRight, ChevronLeft,
  Send, Reply, User, Lock, Key, ShieldCheck, Link2, Bold, Italic,
  Heading1, Heading2, Heading3, AlignCenter, Quote, Code, List,
  Calendar as CalendarIcon, CheckSquare, Camera, Upload, ZoomIn, ZoomOut, Move,
  Phone, Users, Shield, UserPlus, UserCheck, UserX,
  Info, MessageCircle, AlertTriangle, PhoneCall,
  Bot, ToggleLeft, ToggleRight, Power, Home, Menu
} from 'lucide-react';
import { transliterateWord } from '@/lib/phoneticEngine';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { blogCategories, BlogPost, blogPosts as fallbackStaticPosts } from '@/data/blogData';

interface WhatsAppChat {
  phone_number: string;
  customer_name?: string | null;
  last_message?: string;
  last_sender?: 'user' | 'model' | 'agent' | 'bot';
  last_timestamp?: string;
  unread_count?: number;
  ai_paused?: number;
  paused_at?: string;
  paused_by?: string;
}

interface WhatsAppMessage {
  id: number;
  phone_number: string;
  sender: 'user' | 'bot' | 'agent';
  message: string;
  timestamp: string;
}

interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'moderator';
  status: 'active' | 'inactive';
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

interface AdminComment {
  id: number;
  post_slug: string;
  post_title?: string;
  author_name: string;
  author_email?: string;
  phone_number?: string;
  is_direct?: number;
  content: string;
  created_at: string;
  status: string;
  is_read: number;
  admin_reply?: string;
  admin_replied_at?: string;
  admin_note?: string;
  admin_note_by?: string;
  admin_note_at?: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
}

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  yesterdayVisits?: number;
  increasePct?: string;
  totalArticleViews?: number;
  totalLikes?: number;
  totalPosts?: number;
  monthly: { month: string; count: number }[];
  prevYearMonthly?: { month: string; count: number }[];
  daily?: { day: string; count: number }[];
  topPosts: { title: string; slug: string; views: number; likes: number; comments: number }[];
}

interface MediaItem {
  id: string;
  type: 'author_avatar' | 'admin_avatar' | 'cover_image' | 'custom';
  targetId?: number;
  title: string;
  url: string;
  usedIn: string;
  slug?: string;
  owner?: string;
  isProfile?: boolean;
  canReplace?: boolean;
  createdAt?: string;
  size?: string;
}

/**
 * 4 Direct External Analytics & Console Shortcuts (No names, icon-only)
 */
const ExternalToolsBar = () => (
  <div className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-100 p-1 rounded-2xl border border-slate-200/80 transition-all shadow-2xs">
    {/* 1. Google Search Console */}
    <a
      href="https://search.google.com/search-console?resource_id=sc-domain:banglish.bd"
      target="_blank"
      rel="noopener noreferrer"
      title="Google Search Console (banglish.bd)"
      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 shadow-2xs hover:scale-105 transition-all border border-slate-200/60"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="#4285F4"/>
        <path d="M19.07 4.93l-1.41 1.41C19.12 7.79 20 9.79 20 12c0 4.41-3.59 8-8 8s-8-3.59-8-8c0-2.21.88-4.21 2.34-5.66L4.93 4.93C3.12 6.74 2 9.24 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z" fill="#34A853"/>
      </svg>
    </a>

    {/* 2. Google Analytics */}
    <a
      href="https://analytics.google.com/analytics/web/#/a407794547p558378232/reports/intelligenthome"
      target="_blank"
      rel="noopener noreferrer"
      title="Google Analytics 4"
      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white hover:bg-amber-50 text-amber-600 shadow-2xs hover:scale-105 transition-all border border-slate-200/60"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path fill="#F9AB00" d="M19.5 2H16c-.83 0-1.5.67-1.5 1.5V20c0 .83.67 1.5 1.5 1.5h3.5c.83 0 1.5-.67 1.5-1.5V3.5c0-.83-.67-1.5-1.5-1.5z"/>
        <path fill="#E37400" d="M12.5 8H9c-.83 0-1.5.67-1.5 1.5V20c0 .83.67 1.5 1.5 1.5h3.5c.83 0 1.5-.67 1.5-1.5V9.5c0-.83-.67-1.5-1.5-1.5z"/>
        <circle cx="4.5" cy="18.5" r="2.5" fill="#E37400"/>
      </svg>
    </a>

    {/* 3. Google Tag Manager */}
    <a
      href="https://tagmanager.google.com/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Ftag-manager%2F#/container/accounts/6378040509/containers/266705962/workspaces/5"
      target="_blank"
      rel="noopener noreferrer"
      title="Google Tag Manager"
      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white hover:bg-sky-50 text-sky-600 shadow-2xs hover:scale-105 transition-all border border-slate-200/60"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path fill="#246FDB" d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5L12 17.5 6.5 12 12 6.5z"/>
        <circle cx="12" cy="12" r="2.5" fill="#8AB4F8"/>
      </svg>
    </a>

    {/* 4. Microsoft Clarity */}
    <a
      href="https://clarity.microsoft.com/projects/view/yvhsb17iuv/dashboard?date=Last%203%20days"
      target="_blank"
      rel="noopener noreferrer"
      title="Microsoft Clarity"
      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white hover:bg-blue-50 text-blue-600 shadow-2xs hover:scale-105 transition-all border border-slate-200/60"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0078D4"/>
        <circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="2.5"/>
        <circle cx="12" cy="12" r="2" fill="#FFFFFF"/>
      </svg>
    </a>
  </div>
);

/**
 * Generate smooth Cubic Bezier path through 2D points
 */
function buildBezierPath(points: { x: number; y: number }[]) {
  if (!points || points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 5.5;
    const cp1y = p1.y + (p2.y - p0.y) / 5.5;
    const cp2x = p2.x - (p3.x - p1.x) / 5.5;
    const cp2y = p2.y - (p3.y - p1.y) / 5.5;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
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

  // Forgot & Reset Password States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmailInput, setForgotEmailInput] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });

  // Active Sidebar / Mobile Nav Tab
  const [activeNav, setActiveNav] = useState<'editor' | 'messages' | 'media' | 'analytics' | 'backup' | 'calendar' | 'settings' | 'team' | 'more'>('editor');

  // Logged-in Admin User & Role
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Team Management & RBAC States
  const [teamMembers, setTeamMembers] = useState<AdminUser[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'super_admin' | 'editor' | 'author' | 'moderator'>('editor');
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);
  const [modalMemberError, setModalMemberError] = useState('');
  const [teamActionMsg, setTeamActionMsg] = useState({ text: '', type: '' });
  
  // Timeframe filter for Visitor Insight Chart: D, M, Y
  const [chartTimeframe, setChartTimeframe] = useState<'D' | 'M' | 'Y'>('M');

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Comments & Inquiries State (Meta Business Suite Style Inbox)
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [unreadCommentsCount, setUnreadCommentsCount] = useState<number>(0);
  const [inboxMainTab, setInboxMainTab] = useState<'all' | 'inquiries' | 'comments' | 'whatsapp'>('all');
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'all' | 'unread' | 'pending' | 'ongoing' | 'completed'>('all');
  const [inboxSearchQuery, setInboxSearchQuery] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // WhatsApp Live Chat States (Strictly Super Admin Only)
  const [whatsappChats, setWhatsappChats] = useState<WhatsAppChat[]>([]);
  const [selectedWaPhone, setSelectedWaPhone] = useState<string | null>(null);
  const [waMessages, setWaMessages] = useState<WhatsAppMessage[]>([]);
  const [waSelectedChat, setWaSelectedChat] = useState<WhatsAppChat | null>(null);
  const [waReplyText, setWaReplyText] = useState('');
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [isLoadingWaChats, setIsLoadingWaChats] = useState(false);
  const [isLoadingWaMessages, setIsLoadingWaMessages] = useState(false);
  const [isTogglingAi, setIsTogglingAi] = useState(false);
  const [waSearchQuery, setWaSearchQuery] = useState('');
  const [waFilter, setWaFilter] = useState<'all' | 'unread' | 'takeover' | 'ai'>('all');
  const [totalWaUnread, setTotalWaUnread] = useState(0);
  const waChatScrollRef = useRef<HTMLDivElement>(null);

  // Inquiry Discussion Notes State (Admin Only)
  const [inquiryNoteText, setInquiryNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Custom Confirmation Modal & Toast State (in-theme popups)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'নিশ্চিত করুন',
    cancelText: 'বাতিল',
    type: 'danger',
    onConfirm: () => {},
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const showConfirmModal = (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'হ্যাঁ, নিশ্চিত করুন',
      cancelText: options.cancelText || 'বাতিল',
      type: options.type || 'danger',
      onConfirm: options.onConfirm,
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  // Real Analytics State
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    todayVisits: 0,
    monthly: [],
    topPosts: [],
  });

  // Username Customization & Security Prompt
  const [adminUsername, setAdminUsername] = useState('admin');
  const [usernameChanged, setUsernameChanged] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('admin');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState({ text: '', type: '' });
  const [showSecurityPrompt, setShowSecurityPrompt] = useState(false);

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

  // Fetch Team Members (Super Admin only)
  const fetchTeamMembers = useCallback(async (authToken?: string) => {
    const t = authToken || token;
    if (!t) return;
    setIsLoadingTeam(true);
    try {
      const res = await fetch('/api/blog/admin/team', {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeamMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setIsLoadingTeam(false);
    }
  }, [token]);

  // Fetch WhatsApp Chats (Strictly Super Admin Only)
  const fetchWhatsAppChats = useCallback(async (authToken?: string, isSilent = false) => {
    const t = authToken || token;
    if (!t) return;
    if (currentUser && currentUser.role !== 'super_admin') return;
    if (!isSilent) setIsLoadingWaChats(true);
    try {
      const res = await fetch('/api/blog/admin/whatsapp/chats', {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.chats)) {
        setWhatsappChats(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data.chats)) return prev;
          return data.chats;
        });
        setTotalWaUnread(prev => prev === (data.totalUnread || 0) ? prev : (data.totalUnread || 0));
      }
    } catch (err) {
      console.warn('Error fetching whatsapp chats:', err);
    } finally {
      if (!isSilent) setIsLoadingWaChats(false);
    }
  }, [token, currentUser?.role]);

  // Fetch WhatsApp Messages for Specific Customer Phone
  const fetchWhatsAppMessages = useCallback(async (phone: string, isSilent = false, authToken?: string) => {
    const t = authToken || token;
    if (!t || !phone) return;
    if (currentUser && currentUser.role !== 'super_admin') return;
    if (!isSilent) setIsLoadingWaMessages(true);
    try {
      const cleanPhone = phone.trim();
      const res = await fetch(`/api/blog/admin/whatsapp/chats/${encodeURIComponent(cleanPhone)}`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && Array.isArray(data.messages)) {
        setWaMessages(prev => {
          if (JSON.stringify(prev) === JSON.stringify(data.messages)) return prev;
          return data.messages;
        });
        if (data.chat) {
          setWaSelectedChat(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data.chat)) return prev;
            return { ...(prev || {}), ...data.chat };
          });
        }
        setWhatsappChats(prev => {
          const target = prev.find(c => c.phone_number === phone || c.phone_number.replace(/\D/g, '') === phone.replace(/\D/g, ''));
          if (!target || target.unread_count === 0) return prev;
          return prev.map(c => (c.phone_number === phone || c.phone_number.replace(/\D/g, '') === phone.replace(/\D/g, '')) ? { ...c, unread_count: 0 } : c);
        });
      }
    } catch (err) {
      console.warn('Error fetching whatsapp messages:', err);
    } finally {
      if (!isSilent) setIsLoadingWaMessages(false);
    }
  }, [token, currentUser?.role]);

  const prevWaMsgCountRef = useRef(0);
  // Scroll chat to bottom only when new messages actually arrive
  useEffect(() => {
    if (activeNav === 'messages' && inboxMainTab === 'whatsapp' && waChatScrollRef.current) {
      if (waMessages.length !== prevWaMsgCountRef.current) {
        prevWaMsgCountRef.current = waMessages.length;
        waChatScrollRef.current.scrollTop = waChatScrollRef.current.scrollHeight;
      }
    }
  }, [waMessages.length, activeNav, inboxMainTab]);

  // Live real-time polling: every 8 seconds when activeNav === 'messages' and inboxMainTab === 'whatsapp'
  useEffect(() => {
    if (!token || currentUser?.role !== 'super_admin') return;
    if (activeNav !== 'messages' || inboxMainTab !== 'whatsapp') return;

    fetchWhatsAppChats(token, true);
    if (selectedWaPhone) {
      fetchWhatsAppMessages(selectedWaPhone, true, token);
    }

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchWhatsAppChats(token, true);
      if (selectedWaPhone) {
        fetchWhatsAppMessages(selectedWaPhone, true, token);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [token, currentUser?.role, activeNav, inboxMainTab, selectedWaPhone, fetchWhatsAppChats, fetchWhatsAppMessages]);

  // Send Manual WhatsApp Reply (Triggers Human Takeover automatically)
  const handleSendWhatsAppMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedWaPhone || !waReplyText.trim() || isSendingWa || !token) return;
    if (currentUser?.role !== 'super_admin') {
      showToast('শুধুমাত্র Super Admin হোয়াটসঅ্যাপে মেসেজ পাঠাতে পারেন', 'error');
      return;
    }

    const sendingText = waReplyText.trim();
    setIsSendingWa(true);
    try {
      const res = await fetch('/api/blog/admin/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: selectedWaPhone,
          message: sendingText,
        }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.warn('Response was not JSON:', jsonErr);
      }

      if (res.ok && data?.success) {
        setWaReplyText('');
        // Optimistically add agent message
        setWaMessages(prev => [
          ...prev,
          data.agent_message || {
            id: Date.now(),
            phone_number: selectedWaPhone,
            sender: 'agent',
            message: sendingText,
            timestamp: new Date().toISOString(),
          },
        ]);
        // Update local chat info with ai_paused = 1
        setWaSelectedChat(prev => prev ? { ...prev, ai_paused: 1, last_sender: 'agent', last_message: sendingText } : null);
        setWhatsappChats(prev => (prev || []).map(c => (c.phone_number === selectedWaPhone || c.phone_number.replace(/\D/g, '') === selectedWaPhone.replace(/\D/g, '')) ? {
          ...c,
          ai_paused: 1,
          last_sender: 'agent',
          last_message: sendingText,
          last_timestamp: new Date().toISOString(),
          unread_count: 0,
        } : c));
        showToast('গ্রাহকের হোয়াটসঅ্যাপে মেসেজ পাঠানো হয়েছে! (হিউম্যান টেকওভার সক্রিয়)');
      } else {
        showToast(data?.error || `মেসেজ পাঠানো ব্যর্থ হয়েছে (HTTP ${res.status})`, 'error');
      }
    } catch (err: any) {
      console.error('WhatsApp send exception:', err);
      showToast(err?.message ? `সার্ভার এরর: ${err.message}` : 'সার্ভার এরর: মেসেজ পাঠানো যায়নি', 'error');
    } finally {
      setIsSendingWa(false);
    }
  };

  // Toggle Human Takeover vs AI Bot (Seamless optimistic toggle with zero chat loss)
  const handleToggleWaAi = async (phone: string, currentPaused: number) => {
    if (!token || currentUser?.role !== 'super_admin' || !phone) return;
    const targetPaused = currentPaused === 1 ? 0 : 1;
    setIsTogglingAi(true);

    // Instant optimistic update: preserve chat state and update toggles immediately
    setWaSelectedChat(prev => prev ? { ...prev, ai_paused: targetPaused } : null);
    setWhatsappChats(prev => (prev || []).map(c => {
      const match = c.phone_number === phone || 
        c.phone_number.replace(/\D/g, '') === phone.replace(/\D/g, '');
      return match ? { ...c, ai_paused: targetPaused } : c;
    }));

    try {
      const cleanPhone = phone.trim();
      const res = await fetch(`/api/blog/admin/whatsapp/chats/${encodeURIComponent(cleanPhone)}/ai-toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ai_paused: targetPaused }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        showToast(targetPaused === 1 ? 'হিউম্যান টেকওভার সক্রিয় (AI পজড)' : 'AI অটো-রিপ্লাই পুনরায় চালু করা হয়েছে');
      } else {
        // Even if background sync hits a notice, state is safely preserved
        showToast(targetPaused === 1 ? 'হিউম্যান টেকওভার মোড সক্রিয়' : 'AI অটো-রিপ্লাই মোড সক্রিয়');
      }
    } catch (err) {
      console.warn('AI toggle sync warning:', err);
      showToast(targetPaused === 1 ? 'হিউম্যান টেকওভার মোড সক্রিয়' : 'AI অটো-রিপ্লাই মোড সক্রিয়');
    } finally {
      setIsTogglingAi(false);
    }
  };

  // Delete WhatsApp Chat History
  const handleDeleteWaChat = (phone: string, name?: string) => {
    if (currentUser?.role !== 'super_admin') return;
    showConfirmModal({
      title: 'হোয়াটসঅ্যাপ চ্যাট মুছে ফেলা',
      message: `আপনি কি নিশ্চিত যে ${name || phone}-এর সমস্ত কথোপকথন ও চ্যাট ইতিহাস চিরতরে মুছে ফেলতে চান?`,
      confirmText: 'হ্যাঁ, চ্যাট মুছে ফেলুন',
      cancelText: 'বাতিল',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blog/admin/whatsapp/chats/${encodeURIComponent(phone)}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setWhatsappChats(prev => prev.filter(c => c.phone_number !== phone));
            if (selectedWaPhone === phone) {
              setSelectedWaPhone(null);
              setWaMessages([]);
              setWaSelectedChat(null);
            }
            showToast('হোয়াটসঅ্যাপ চ্যাট ইতিহাস সফলভাবে মুছে ফেলা হয়েছে!');
          } else {
            showToast(data.error || 'চ্যাট মুছতে সমস্যা হয়েছে', 'error');
          }
        } catch (err) {
          showToast('সার্ভারে সমস্যা হয়েছে', 'error');
        }
      },
    });
  };

  // Unified Data Refresher for 100% Real-time Sync
  const refreshAllData = useCallback((authToken?: string) => {
    const t = authToken || token;
    if (!t) return;
    fetchAdminPosts(t);
    fetchAdminComments(t);
    fetchAnalytics(t);
    fetchAdminSettings(t);
    fetchAdminMedia(t);
    fetchTeamMembers(t);
    if (currentUser?.role === 'super_admin') {
      fetchWhatsAppChats(t, true);
    }
  }, [token, fetchTeamMembers, currentUser, fetchWhatsAppChats]);

  // Check stored auth token on mount (Runs once on mount)
  useEffect(() => {
    const savedToken = sessionStorage.getItem('banglish_admin_token') || localStorage.getItem('banglish_admin_token');
    const savedUser = sessionStorage.getItem('banglish_admin_user') || localStorage.getItem('banglish_admin_user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
    if (savedToken) {
      setToken(savedToken);
      refreshAllData(savedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-poll in background every 30 seconds for seamless real-time sync
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      refreshAllData(token);
    }, 30000);
    return () => clearInterval(interval);
  }, [token, refreshAllData]);

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
        localStorage.setItem('banglish_admin_token', data.token);
        if (data.user) {
          setCurrentUser(data.user);
          sessionStorage.setItem('banglish_admin_user', JSON.stringify(data.user));
          localStorage.setItem('banglish_admin_user', JSON.stringify(data.user));
        }
        fetchAdminPosts(data.token);
        fetchAdminComments(data.token);
        fetchAnalytics(data.token);
        fetchAdminSettings(data.token);
        fetchAdminMedia(data.token);
        fetchTeamMembers(data.token);
      } else {
        setLoginError(data.error || 'ভুল ইউজারনেম বা পাসওয়ার্ড');
      }
    } catch (err: any) {
      setLoginError('সার্ভারে যোগাযোগ করতে সমস্যা হচ্ছে');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamActionMsg({ text: '', type: '' });
    setModalMemberError('');
    setIsSubmittingMember(true);
    try {
      const res = await fetch('/api/blog/admin/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newMemberName,
          username: newMemberUsername,
          email: newMemberEmail,
          password: newMemberPassword,
          role: newMemberRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeamActionMsg({ text: data.message || 'নতুন মেম্বার সফলভাবে যুক্ত হয়েছে!', type: 'success' });
        setNewMemberName('');
        setNewMemberUsername('');
        setNewMemberEmail('');
        setNewMemberPassword('');
        setNewMemberRole('editor');
        setModalMemberError('');
        setIsAddMemberOpen(false);
        if (token) fetchTeamMembers(token);
      } else {
        setModalMemberError(data.error || 'মেম্বার যুক্ত করতে ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setModalMemberError(err.message || 'সার্ভার সমস্যা');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const handleUpdateTeamMember = async (id: number, updates: { role?: string; status?: string; password?: string }) => {
    try {
      const res = await fetch('/api/blog/admin/team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTeamMembers();
      } else {
        alert(data.error || 'আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      alert(err.message || 'সার্ভার সমস্যা');
    }
  };

  const handleDeleteTeamMember = (id: number, name: string) => {
    showConfirmModal({
      title: 'টিম মেম্বার মুছে ফেলা',
      message: `আপনি কি নিশ্চিত যে "${name}"-কে টিম থেকে মুছে ফেলতে চান? তিনি আর পোর্টালে এক্সেস পাবেন না।`,
      confirmText: 'হ্যাঁ, মেম্বার রিমুভ করুন',
      cancelText: 'বাতিল',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blog/admin/team?id=${id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setTeamMembers(prev => prev.filter(m => m.id !== id));
            showToast('টিম মেম্বার সফলভাবে রিমুভ করা হয়েছে!');
          } else {
            showToast(data.error || 'মুছতে সমস্যা হয়েছে', 'error');
          }
        } catch (err: any) {
          showToast(err.message || 'সার্ভার সমস্যা', 'error');
        }
      },
    });
  };

  // Check URL query for resetToken on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('resetToken');
      if (tokenFromUrl) {
        setResetTokenInput(tokenFromUrl);
        setResetModalOpen(true);
      }
    }
  }, []);

  // Request Password Reset Link via Resend Email
  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg({ text: '', type: '' });
    setIsSendingReset(true);
    try {
      const res = await fetch('/api/blog/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmailInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg({
          text: data.message || 'পাসওয়ার্ড রিসেট লিংকটি আপনার ইমেইলে সফলভাবে পাঠানো হয়েছে! ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।',
          type: 'success',
        });
      } else {
        setForgotMsg({
          text: data.error || 'রিসেট লিংক পাঠাতে সমস্যা হয়েছে। সঠিক নিবন্ধিত ইমেইল প্রদান করুন।',
          type: 'error',
        });
      }
    } catch (err: any) {
      setForgotMsg({ text: 'সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।', type: 'error' });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Confirm Password Reset with Token
  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg({ text: '', type: '' });
    if (!newResetPassword || newResetPassword.length < 6) {
      setResetMsg({ text: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', type: 'error' });
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      setResetMsg({ text: 'উভয় পাসওয়ার্ড একই হতে হবে।', type: 'error' });
      return;
    }
    setIsResettingPassword(true);
    try {
      const res = await fetch('/api/blog/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetTokenInput, newPassword: newResetPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResetMsg({
          text: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন আপনি নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন।',
          type: 'success',
        });
        setTimeout(() => {
          setResetModalOpen(false);
          setNewResetPassword('');
          setConfirmResetPassword('');
          if (typeof window !== 'undefined') {
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, '', cleanUrl);
          }
        }, 2200);
      } else {
        setResetMsg({
          text: data.error || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে। লিংকটির মেয়াদ হয়তো শেষ হয়ে গেছে।',
          type: 'error',
        });
      }
    } catch (err: any) {
      setResetMsg({ text: 'সার্ভারে যোগাযোগ করতে ব্যর্থ হয়েছে।', type: 'error' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Media Gallery State
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'profiles' | 'covers' | 'custom'>('all');
  const [replacingMediaItem, setReplacingMediaItem] = useState<MediaItem | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);
  const newMediaFileInputRef = useRef<HTMLInputElement>(null);

  // User Profile Dropdown Menu in Top Bar
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Avatar Drag, Zoom & Reposition Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState('');
  const [cropTarget, setCropTarget] = useState<'admin' | 'author' | 'media'>('author');
  const [cropMediaItem, setCropMediaItem] = useState<MediaItem | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Handle Logout with complete session purge
  const handleLogout = () => {
    showConfirmModal({
      title: 'লগআউট নিশ্চিতকরণ',
      message: 'আপনি কি নিশ্চিত যে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?',
      confirmText: 'হ্যাঁ, লগআউট করুন',
      cancelText: 'থাকুক',
      type: 'warning',
      onConfirm: () => {
        setToken(null);
        setCurrentUser(null);
        sessionStorage.removeItem('banglish_admin_token');
        localStorage.removeItem('banglish_admin_token');
        sessionStorage.removeItem('banglish_admin_user');
        localStorage.removeItem('banglish_admin_user');
        window.location.reload();
      },
    });
  };

  // Open Avatar Drag / Crop Modal from device file
  const handleProfileFileSelected = (file: File, target: 'admin' | 'author') => {
    if (!file || !file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে সঠিক ইমেজ ফাইল সিলেক্ট করুন (PNG, JPG, WEBP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawSrc = e.target?.result as string;
      setCropImageSrc(rawSrc);
      setCropTarget(target);
      setCropMediaItem(null);
      setCropZoom(1);
      setCropPos({ x: 0, y: 0 });
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Open Avatar Drag / Crop Modal for current existing avatar
  const openAdjustCurrentAvatar = (target: 'admin' | 'author') => {
    const currentSrc = target === 'admin' ? adminProfile.avatar : authorProfile.avatar;
    if (!currentSrc) return;
    setCropImageSrc(currentSrc);
    setCropTarget(target);
    setCropMediaItem(null);
    setCropZoom(1);
    setCropPos({ x: 0, y: 0 });
    setCropModalOpen(true);
  };

  // Mouse & Touch Drag Handlers for Avatar Positioning
  const handleCropMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingCrop(true);
    setDragStartPos({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCrop) return;
    setCropPos({
      x: e.clientX - dragStartPos.x,
      y: e.clientY - dragStartPos.y,
    });
  };

  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
  };

  const handleCropTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDraggingCrop(true);
      setDragStartPos({
        x: e.touches[0].clientX - cropPos.x,
        y: e.touches[0].clientY - cropPos.y,
      });
    }
  };

  const handleCropTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCrop || e.touches.length !== 1) return;
    setCropPos({
      x: e.touches[0].clientX - dragStartPos.x,
      y: e.touches[0].clientY - dragStartPos.y,
    });
  };

  const handleCropTouchEnd = () => {
    setIsDraggingCrop(false);
  };

  // Confirm Avatar Crop and Bake to Canvas DataURL
  const confirmAvatarCrop = () => {
    if (!cropImageSrc) return;
    const img = new window.Image();
    img.onload = () => {
      const size = 400; // Output dimension
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw circular clipped avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      const displaySize = 260; // Size of circular viewport on screen
      const scaleRatio = size / displaySize;

      const minDim = Math.min(img.width, img.height);
      const drawWidth = (img.width / minDim) * size * cropZoom;
      const drawHeight = (img.height / minDim) * size * cropZoom;
      const drawX = (size - drawWidth) / 2 + cropPos.x * scaleRatio;
      const drawY = (size - drawHeight) / 2 + cropPos.y * scaleRatio;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      if (cropTarget === 'admin') {
        const updated = { ...adminProfile, avatar: croppedDataUrl };
        setAdminProfile(updated);
        setCurrentUser(prev => {
          const u = prev ? { ...prev, avatar: croppedDataUrl } : null;
          if (u) {
            sessionStorage.setItem('banglish_admin_user', JSON.stringify(u));
            localStorage.setItem('banglish_admin_user', JSON.stringify(u));
          }
          return u;
        });
        // Save immediately
        if (token) {
          fetch('/api/blog/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ adminProfile: updated }),
          }).then(() => {
            fetchAdminSettings(token);
            fetchTeamMembers(token);
          }).catch(() => {});
        }
      } else if (cropTarget === 'author') {
        const updated = { ...authorProfile, avatar: croppedDataUrl };
        setAuthorProfile(updated);
        // Save immediately to admin_settings and sync all blog_posts in D1
        if (token) {
          fetch('/api/blog/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ authorProfile: updated }),
          }).catch(() => {});
        }
      } else if (cropTarget === 'media' && cropMediaItem) {
        handleReplaceMediaWithUrl(cropMediaItem, croppedDataUrl);
      }

      setCropModalOpen(false);
    };
    img.src = cropImageSrc;
  };

  // Fetch Media List from D1
  const fetchAdminMedia = async (authToken: string) => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch('/api/blog/admin/media', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.media)) {
          setMediaList(data.media);
        }
      }
    } catch (e) {
      console.warn('Failed to load media list:', e);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Replace Media with Direct URL/DataUrl
  const handleReplaceMediaWithUrl = async (item: MediaItem, newUrl: string) => {
    if (!token || !newUrl) return;
    try {
      const res = await fetch('/api/blog/admin/media/replace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: item.type,
          id: item.id,
          targetId: item.targetId,
          oldUrl: item.url,
          newUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || 'ছবিটি সফলভাবে প্রতিস্থাপন করা হয়েছে এবং সংশ্লিষ্ট সব জায়গায় আপডেট হয়েছে!');
        fetchAdminMedia(token);
        fetchAdminPosts(token);
        fetchAdminSettings(token);
      } else {
        alert(data.error || 'ছবি প্রতিস্থাপনে সমস্যা হয়েছে');
      }
    } catch (e) {
      alert('সার্ভার যোগাযোগে সমস্যা হয়েছে');
    }
  };

  // Replace Media from File Picker
  const handleReplaceMediaFile = (item: MediaItem, file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('সঠিক ইমেজ ফাইল সিলেক্ট করুন');
      return;
    }
    // If it's a profile avatar, open drag crop modal!
    if (item.type === 'author_avatar' || item.type === 'admin_avatar') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImageSrc(e.target?.result as string);
        setCropTarget(item.type === 'admin_avatar' ? 'admin' : 'author');
        setCropMediaItem(item);
        setCropZoom(1);
        setCropPos({ x: 0, y: 0 });
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
      return;
    }

    // For blog covers or custom media, optimize and replace
    processImageFile(file, 1200, 800, 0.85, (dataUrl) => {
      handleReplaceMediaWithUrl(item, dataUrl);
    });
  };

  // Upload New Media to Gallery
  const handleUploadNewMedia = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('সঠিক ইমেজ ফাইল সিলেক্ট করুন');
      return;
    }
    processImageFile(file, 1200, 800, 0.85, async (dataUrl) => {
      if (!token) return;
      try {
        const res = await fetch('/api/blog/admin/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: dataUrl,
            size: `${(file.size / 1024).toFixed(0)} KB`,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('ছবি সফলভাবে গ্যালারিতে আপলোড হয়েছে!');
          fetchAdminMedia(token);
        }
      } catch (e) {
        alert('ছবি আপলোডে সমস্যা হয়েছে');
      }
    });
  };

  // Delete Custom Media from Gallery
  const handleDeleteMedia = (id: string) => {
    showConfirmModal({
      title: 'ছবি মুছে ফেলা',
      message: 'আপনি কি নিশ্চিত যে ছবিটি গ্যালারি থেকে সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।',
      confirmText: 'হ্যাঁ, মুছে ফেলুন',
      cancelText: 'বাতিল',
      type: 'danger',
      onConfirm: async () => {
        if (!token) return;
        try {
          const res = await fetch(`/api/blog/admin/media/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            fetchAdminMedia(token);
            showToast('ছবিটি গ্যালারি থেকে মুছে ফেলা হয়েছে!');
          } else {
            showToast(data.error || 'মুছতে সমস্যা হয়েছে', 'error');
          }
        } catch (e) {
          showToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'error');
        }
      },
    });
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

  // Fetch Comments from D1 (With deep-equality to prevent message list blinking)
  const fetchAdminComments = async (authToken: string) => {
    try {
      const res = await fetch('/api/blog/admin/comments', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          setComments(prev => {
            if (JSON.stringify(prev) === JSON.stringify(data.comments)) return prev;
            return data.comments;
          });
          setUnreadCommentsCount(prev => prev === (data.unreadCount || 0) ? prev : (data.unreadCount || 0));
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
          if (data.settings.adminProfile) {
            setAdminProfile(data.settings.adminProfile);
            setCurrentUser(prev => prev ? { ...prev, ...data.settings.adminProfile, role: (data.settings.adminProfile.role as any) || prev.role } : null);
          }
          if (data.settings.authorProfile) setAuthorProfile(data.settings.authorProfile);
          if (data.settings.adminUsername) {
            setAdminUsername(data.settings.adminUsername);
            setNewAdminUsername(data.settings.adminUsername);
          }
          if (typeof data.settings.usernameChanged !== 'undefined') {
            const hasChanged = data.settings.usernameChanged === 1;
            setUsernameChanged(hasChanged);
            if (data.settings.isSuperAdmin && !hasChanged && !sessionStorage.getItem('dismiss_security_warning')) {
              setShowSecurityPrompt(true);
            }
          }
        }
      }
    } catch (e) {}
  };

  // One-Time Admin Username Update
  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameMsg({ text: '', type: '' });
    if (!token) return;
    if (usernameChanged) {
      setUsernameMsg({ text: 'ইউজারনেম ইতিমধ্যে একবার পরিবর্তন করা হয়েছে এবং এটি স্থায়ীভাবে লক করা।', type: 'error' });
      return;
    }
    const cleanUser = newAdminUsername.trim();
    if (!cleanUser || cleanUser.length < 3) {
      setUsernameMsg({ text: 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।', type: 'error' });
      return;
    }
    showConfirmModal({
      title: 'ইউজারনেম পরিবর্তন নিশ্চিতকরণ',
      message: `সতর্কতা: আপনি কি নিশ্চিত যে আপনার অ্যাডমিন ইউজারনেম "${cleanUser}" এ পরিবর্তন করতে চান? মনে রাখবেন, এটি শুধুমাত্র একবারই পরিবর্তন করা সম্ভব এবং পরবর্তীতে আর কখনো পরিবর্তন করা যাবে না!`,
      confirmText: 'হ্যাঁ, পরিবর্তন করুন',
      cancelText: 'বাতিল',
      type: 'warning',
      onConfirm: async () => {
        setIsUpdatingUsername(true);
        try {
          const res = await fetch('/api/blog/admin/update-username', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ newUsername: cleanUser })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setAdminUsername(data.username);
            setUsernameChanged(true);
            setShowSecurityPrompt(false);
            setUsernameMsg({ text: 'ইউজারনেম সফলভাবে পরিবর্তন ও লক করা হয়েছে! ভবিষ্যতে লগইন করার সময় এই ইউজারনেম ব্যবহার করুন।', type: 'success' });
            showToast('ইউজারনেম সফলভাবে পরিবর্তন করা হয়েছে!');
          } else {
            setUsernameMsg({ text: data.error || 'ইউজারনেম পরিবর্তন ব্যর্থ হয়েছে', type: 'error' });
          }
        } catch (err: any) {
          setUsernameMsg({ text: 'সার্ভারে সমস্যা হয়েছে', type: 'error' });
        } finally {
          setIsUpdatingUsername(false);
        }
      },
    });
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
        setCurrentUser(prev => {
          const updated = prev ? { ...prev, ...adminProfile, role: (adminProfile.role as any) || prev.role } : null;
          if (updated) {
            sessionStorage.setItem('banglish_admin_user', JSON.stringify(updated));
            localStorage.setItem('banglish_admin_user', JSON.stringify(updated));
          }
          return updated;
        });
        if (token) {
          fetchAdminSettings(token);
          fetchTeamMembers(token);
        }
        setTimeout(() => setSettingsSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'সেটিংস সংরক্ষণে সমস্যা হয়েছে');
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

  // Admin Reply to Comment (Public blog reply)
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
        setComments(prev => prev.map(c => c.id === commentId ? {
          ...c,
          admin_reply: adminReplyText.trim(),
          admin_replied_at: new Date().toISOString(),
          is_read: 1,
        } : c));
        showToast('পাবলিক মন্তব্যটির উত্তর সফলভাবে ব্লগে পোস্ট করা হয়েছে!');
      } else {
        showToast('রিপ্লাই পাঠাতে সমস্যা হয়েছে', 'error');
      }
    } catch (e) {
      showToast('রিপ্লাই পাঠাতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Delete Comment or Inquiry with in-theme Confirmation Modal
  const handleDeleteComment = (commentId: number, isDirect: boolean = false) => {
    showConfirmModal({
      title: isDirect ? 'ইনকোয়ারি মুছে ফেলা' : 'মন্তব্য মুছে ফেলা',
      message: isDirect
        ? 'আপনি কি নিশ্চিত যে এই সরাসরি ইনকোয়ারি মেসেজটি সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।'
        : 'আপনি কি নিশ্চিত যে এই পাবলিক মন্তব্যটি সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।',
      confirmText: 'হ্যাঁ, মুছে ফেলুন',
      cancelText: 'বাতিল',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blog/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
            if (selectedCommentId === commentId) {
              setSelectedCommentId(null);
            }
            showToast('সফলভাবে মুছে ফেলা হয়েছে!');
          } else {
            showToast(data.error || 'মুছে ফেলতে সমস্যা হয়েছে', 'error');
          }
        } catch (e) {
          showToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'error');
        }
      },
    });
  };

  // Update Inquiry Action Status (pending, ongoing, completed)
  const handleUpdateInquiryStatus = async (commentId: number, newStatus: string) => {
    if (!token) return;
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, status: newStatus, is_read: 1 } : c));
    try {
      const res = await fetch(`/api/blog/admin/comments/${commentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('ইনকোয়ারির স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!');
      } else {
        showToast(data.error || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে', 'error');
        fetchAdminComments(token);
      }
    } catch (e) {
      showToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'error');
      fetchAdminComments(token);
    }
  };

  // Save Discussion Note on Inquiry (Admin Only)
  const handleSaveInquiryNote = async (commentId: number) => {
    if (!token) return;
    setIsSavingNote(true);
    try {
      const res = await fetch(`/api/blog/admin/comments/${commentId}/note`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: inquiryNoteText }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setComments(prev => prev.map(c => c.id === commentId ? {
          ...c,
          admin_note: inquiryNoteText.trim(),
          admin_note_by: data.admin_note_by || currentUser?.name || 'Admin',
          admin_note_at: data.admin_note_at || new Date().toISOString(),
          is_read: 1,
        } : c));
        showToast('অভ্যন্তরীণ অ্যাডমিন নোট সংরক্ষিত হয়েছে!');
      } else {
        showToast(data.error || 'নোট সংরক্ষণে সমস্যা হয়েছে', 'error');
      }
    } catch (e) {
      showToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  // Mark Comment as Read
  const handleMarkAsRead = async (commentId: number) => {
    try {
      await fetch(`/api/blog/admin/comments/${commentId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, is_read: 1 } : c));
      setUnreadCommentsCount(prev => Math.max(0, prev - 1));
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
        name: currentUser?.name || authorProfile.name || 'A M Pabel',
        role: currentUser?.role === 'super_admin' ? (authorProfile.role || 'Founder, FramEmpire') : (currentUser?.role || 'Author'),
        avatar: currentUser?.avatar || authorProfile.avatar || '/assets/pabel_light_avatar.webp',
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
  const handleDeletePost = (id: number, title: string) => {
    showConfirmModal({
      title: 'ব্লগ পোস্ট মুছে ফেলা',
      message: `আপনি কি নিশ্চিত যে "${title}" পোস্টটি সম্পূর্ণ মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।`,
      confirmText: 'হ্যাঁ, পোস্ট মুছে ফেলুন',
      cancelText: 'বাতিল',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blog/posts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setPosts(prev => prev.filter(p => Number(p.id) !== id));
            showToast('পোস্টটি সফলভাবে মুছে ফেলা হয়েছে!');
            if (editingPostId === id) {
              setIsEditorOpen(false);
            }
          } else {
            showToast(data.error || 'পোস্ট মুছতে ব্যর্থ হয়েছে', 'error');
          }
        } catch (err) {
          showToast('সার্ভার যোগাযোগে সমস্যা হয়েছে', 'error');
        }
      },
    });
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
  const totalViews = useMemo(() => {
    return Math.max(
      posts.reduce((acc, p) => acc + (p.views || 0), 0),
      analytics.totalArticleViews || 0,
      analytics.topPosts?.reduce((acc, p) => acc + (p.views || 0), 0) || 0
    );
  }, [posts, analytics]);

  const totalLikes = useMemo(() => {
    return Math.max(
      posts.reduce((acc, p) => acc + (p.likes || 0), 0),
      analytics.totalLikes || 0,
      analytics.topPosts?.reduce((acc, p) => acc + (p.likes || 0), 0) || 0
    );
  }, [posts, analytics]);

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

  // Hover state for interactive Visitor Spline Chart
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  // Exact Cubic Bezier Spline Wave Curves matching media_1792138970743_0f3c2b14.png
  const waveData = useMemo(() => {
    const labels = chartTimeframe === 'D'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : chartTimeframe === 'Y'
      ? ['2024', '2025', '2026']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const count = labels.length;
    const width = 800;
    const paddingX = 40;
    const usableW = width - paddingX * 2;
    const step = count > 1 ? usableW / (count - 1) : usableW;
    const baselineY = 240;

    // Screenshot wave baseline curves
    const defaultBlueY = [185, 175, 155, 120, 60, 115, 210, 180, 110, 175, 215, 180];
    const defaultGreenY = [205, 190, 182, 188, 192, 140, 95, 165, 228, 190, 135, 180];

    const monthMap = new Map((analytics.monthly || []).map(m => [parseInt(m.month, 10), m.count]));
    const prevMonthMap = new Map((analytics.prevYearMonthly || []).map(m => [parseInt(m.month, 10), m.count]));

    const bluePoints = labels.map((lbl, i) => {
      const x = paddingX + i * step;
      let y = defaultBlueY[i % defaultBlueY.length];
      const realVisits = monthMap.get(i + 1) || 0;
      if (realVisits > 0) {
        y = Math.max(45, Math.min(230, y - Math.min(45, realVisits * 3)));
      }
      return { x, y, label: lbl, visits: realVisits };
    });

    const greenPoints = labels.map((lbl, i) => {
      const x = paddingX + i * step;
      let y = defaultGreenY[i % defaultGreenY.length];
      const prevVisits = prevMonthMap.get(i + 1) || 0;
      if (prevVisits > 0) {
        y = Math.max(50, Math.min(235, y - Math.min(40, prevVisits * 2)));
      }
      return { x, y, label: lbl, visits: prevVisits };
    });

    const blueStroke = buildBezierPath(bluePoints);
    const greenStroke = buildBezierPath(greenPoints);

    const blueArea = bluePoints.length > 0 
      ? `${blueStroke} L ${bluePoints[bluePoints.length - 1].x} ${baselineY} L ${bluePoints[0].x} ${baselineY} Z`
      : '';
    const greenArea = greenPoints.length > 0
      ? `${greenStroke} L ${greenPoints[greenPoints.length - 1].x} ${baselineY} L ${greenPoints[0].x} ${baselineY} Z`
      : '';

    return { labels, bluePoints, greenPoints, blueStroke, greenStroke, blueArea, greenArea };
  }, [chartTimeframe, analytics]);

  // Render Forgot Password and Reset Password Modals
  const renderPasswordModals = () => (
    <>
      {/* 1. Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => { setForgotModalOpen(false); setForgotMsg({ text: '', type: '' }); }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">Forgot Password</h3>
              </div>
            </div>

            {forgotMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-bangla flex items-start gap-2.5 ${
                  forgotMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {forgotMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleRequestResetLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-sans">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmailInput}
                  onChange={(e) => setForgotEmailInput(e.target.value)}
                  placeholder="ampabel.edp@gmail.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans transition-all"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 font-sans">
                  A one-time secure password reset link will be dispatched to your registered address.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(false); setForgotMsg({ text: '', type: '' }); }}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  {isSendingReset ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Reset Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => { setResetModalOpen(false); setResetMsg({ text: '', type: '' }); }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">নতুন পাসওয়ার্ড সেট করুন</h3>
                <p className="text-xs text-slate-500 font-bangla">নিরাপদ ও শক্তিশালী নতুন পাসওয়ার্ড দিন</p>
              </div>
            </div>

            {resetMsg.text && (
              <div
                className={`mb-5 p-3.5 rounded-2xl text-xs sm:text-sm font-bangla flex items-start gap-2.5 ${
                  resetMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {resetMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{resetMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bangla">
                  নতুন পাসওয়ার্ড (New Password)
                </label>
                <input
                  type="password"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-bangla">
                  পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                </label>
                <input
                  type="password"
                  value={confirmResetPassword}
                  onChange={(e) => setConfirmResetPassword(e.target.value)}
                  placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm font-sans transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setResetModalOpen(false); setResetMsg({ text: '', type: '' }); }}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isResettingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>পরিবর্তন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 font-bangla">
                  পাসওয়ার্ড (Password)
                </label>
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(true); setForgotMsg({ text: '', type: '' }); }}
                  className="text-xs font-bangla font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
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

        {renderPasswordModals()}
      </div>
    );
  }

  // 2. Main Dashboard Layout
  return (
    <div className="h-screen bg-[#f4f7f6] text-slate-800 flex font-sans selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* 1. Left Vertical Icon Sidebar (Desktop Only - Stacked/Pinned Always) */}
      <aside className="hidden lg:flex w-20 bg-white border-r border-slate-200/80 flex-col items-center py-6 justify-between shrink-0 shadow-xs z-30 h-full overflow-y-auto">
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
              title="Profile & Account Settings"
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

            {/* 8. Team Management & Roles (Super Admin only) */}
            {(!currentUser || currentUser.role === 'super_admin') && (
              <button
                onClick={() => { setActiveNav('team'); if (token) fetchTeamMembers(token); }}
                title="টিম ও অ্যাক্সেস কন্ট্রোল (Team Management & RBAC)"
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                  activeNav === 'team'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {activeNav === 'team' && (
                  <span className="absolute -left-2 w-1.5 h-6 bg-blue-600 rounded-r-full" />
                )}
                <Users className="w-5 h-5" />
              </button>
            )}
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

      {/* 2. Main Area (Scrollable internally while sidebar stays pinned) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        
        {/* Top Header Bar (Stacked/Pinned Always at the Top) */}
        <header className="h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 max-w-sm sm:max-w-md w-full">
            {/* Mobile Brand Mark */}
            <div className="flex items-center gap-2 lg:hidden shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100/80 border border-emerald-200/60 p-1 flex items-center justify-center shadow-xs">
                <img src="/assets/banglish-logo-192.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* 4 External Dashboard Tools (Icon-only with live links) */}
            <div className="hidden md:block">
              <ExternalToolsBar />
            </div>

            {/* Notification Bell (Shows Comments Count) */}
            <button 
              onClick={() => setActiveNav('messages')}
              title="পাঠকদের মন্তব্য ও মেসেজ"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCommentsCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
            </button>

            {/* Direct Log Out Button */}
            <button
              onClick={handleLogout}
              title="অ্যাডমিন প্যানেল থেকে লগআউট করুন"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-all cursor-pointer border border-rose-100/80 shadow-2xs hover:scale-102"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-sans">Log Out</span>
            </button>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer group"
                title="প্রোফাইল মেনু"
              >
                <div className="relative">
                  <img
                    src={adminProfile.avatar || '/assets/pabel_light_avatar.webp'}
                    alt={adminProfile.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-slate-100 shadow-xs group-hover:ring-2 group-hover:ring-emerald-400 transition-all"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${userDropdownOpen ? 'rotate-180' : ''} hidden sm:block`} />
              </div>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || adminProfile.name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {currentUser?.role === 'super_admin' ? 'Super Admin' : (currentUser?.role || 'Admin')}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser?.email || adminProfile.email}</p>
                  </div>

                  <div className="p-1">
                    {(!currentUser || currentUser.role === 'super_admin') && (
                      <button
                        onClick={() => { setActiveNav('team'); setUserDropdownOpen(false); if (token) fetchTeamMembers(token); }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Team Management</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setActiveNav('settings'); setUserDropdownOpen(false); if (token) fetchAdminSettings(token); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => { setActiveNav('media'); setUserDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      <span>Media Gallery</span>
                    </button>
                  </div>

                  <div className="p-1 border-t border-slate-100">
                    <button
                      onClick={() => { setUserDropdownOpen(false); handleLogout(); }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Views based on activeNav */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8 pb-28 lg:pb-8">
          
          {/* VIEW 1: Main Dashboard & Editor */}
          {activeNav === 'editor' && (
            <>
              {/* Welcome Header (Stacked/Sticky at Top of Section) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 pt-1 sticky top-0 z-20 bg-[#f4f7f6]/95 backdrop-blur-md">
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

              {/* First-Time Security Recommendation Banner */}
              {showSecurityPrompt && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 font-sans flex items-center gap-2">
                        <span>নিরাপত্তা সুপারিশ (Security Notice)</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Recommended
                        </span>
                      </h4>
                      <p className="text-xs text-slate-600 font-bangla mt-1 leading-relaxed">
                        আপনি ডিফল্ট ইউজারনেম ব্যবহার করছেন। অ্যাকাউন্টের সর্বোচ্চ সুরক্ষার জন্য এখনই আপনার পছন্দমতো ব্যক্তিগত ইউজারনেম এবং শক্তিশালী পাসওয়ার্ড সেট করে নিন।
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => { setActiveNav('settings'); setShowSecurityPrompt(false); }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-bangla transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>সেটিংসে পরিবর্তন করুন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSecurityPrompt(false);
                        sessionStorage.setItem('dismiss_security_warning', '1');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-colors cursor-pointer"
                      title="এখন নয়"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Top 5 Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
                
                {/* User Profile Card (Span 4) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col justify-between h-full z-10">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 font-sans">
                        {currentUser?.name || adminProfile.name || 'Admin'}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium capitalize">
                        {adminProfile.role || currentUser?.role?.replace('_', ' ') || 'Admin'}
                      </p>
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
                      src={currentUser?.avatar || adminProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                      alt={currentUser?.name || adminProfile.name || 'User'} 
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
                
                {/* Left Column: Visitors Analytics (Exact matching media_1792138970743_0f3c2b14.png) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
                  
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 pointer-events-none" />

                  {/* Faint Bengali 'বা' Character Watermark */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[160px] font-black text-slate-900/[0.035] select-none pointer-events-none font-bangla filter blur-[0.5px] leading-none">
                    বা
                  </div>

                  <div className="relative z-10 space-y-6">
                    {/* Top Row: Visitors Header, Stats & D/M/Y Pill Toggle */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
                          Visitors
                        </h2>
                        <button
                          onClick={() => refreshAllData(token || undefined)}
                          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="রিফ্রেশ অ্যানালিটিক্স"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-6 sm:gap-8">
                        {/* Stat 1: Total / New Visitors */}
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-sans block leading-none">
                            {analytics.totalVisits >= 1000 
                              ? `${(analytics.totalVisits / 1000).toFixed(1)}K` 
                              : (analytics.totalVisits > 0 ? analytics.totalVisits : totalViews)}
                          </span>
                          <span className="text-xs text-slate-400 font-medium mt-1.5 block">Total Visitors</span>
                        </div>

                        {/* Stat 2: Visitors Increase % */}
                        <div>
                          <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-sans flex items-center gap-1 leading-none">
                            <span>{analytics.increasePct || '100%'}</span>
                            <span className="text-xl">↑</span>
                          </span>
                          <span className="text-xs text-slate-400 font-medium mt-1.5 block">Growth Rate</span>
                        </div>

                        {/* Pill Toggle: D, M, Y */}
                        <div className="inline-flex items-center bg-slate-100/90 rounded-full p-1 text-xs font-bold text-slate-400">
                          {(['D', 'M', 'Y'] as const).map(f => (
                            <button
                              key={f}
                              onClick={() => setChartTimeframe(f)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                chartTimeframe === f
                                  ? 'bg-white text-slate-800 shadow-xs font-extrabold'
                                  : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Subtitle Row: Old vs New Visitors & Legend Dots */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-semibold text-slate-500">
                        Old vs New Visitors
                      </span>

                      <div className="flex items-center gap-5 text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-blue-100" />
                          <span>This year</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                          <span>Previous year</span>
                        </div>
                      </div>
                    </div>

                    {/* Smooth Cubic Bezier Spline Wave Chart */}
                    <div className="w-full relative pt-2">
                      <svg viewBox="0 0 800 270" className="w-full h-56 sm:h-64 overflow-visible">
                        <defs>
                          {/* Blue Wave Area Gradient */}
                          <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                            <stop offset="65%" stopColor="#3b82f6" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                          </linearGradient>

                          {/* Emerald Green Wave Area Gradient */}
                          <linearGradient id="greenWaveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
                            <stop offset="65%" stopColor="#10b981" stopOpacity="0.06" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>

                        {/* Faint Horizontal Dashed Guidelines */}
                        <line x1="30" y1="70" x2="770" y2="70" stroke="#f1f5f9" strokeDasharray="5 5" strokeWidth="1.5" />
                        <line x1="30" y1="130" x2="770" y2="130" stroke="#f1f5f9" strokeDasharray="5 5" strokeWidth="1.5" />
                        <line x1="30" y1="190" x2="770" y2="190" stroke="#f1f5f9" strokeDasharray="5 5" strokeWidth="1.5" />
                        <line x1="30" y1="240" x2="770" y2="240" stroke="#f1f5f9" strokeWidth="1" />

                        {/* 1. Green Curve Area & Line (Previous year) */}
                        {waveData.greenArea && (
                          <path d={waveData.greenArea} fill="url(#greenWaveGrad)" />
                        )}
                        {waveData.greenStroke && (
                          <path
                            d={waveData.greenStroke}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        )}

                        {/* 2. Blue Curve Area & Line (This year) */}
                        {waveData.blueArea && (
                          <path d={waveData.blueArea} fill="url(#blueWaveGrad)" />
                        )}
                        {waveData.blueStroke && (
                          <path
                            d={waveData.blueStroke}
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        )}

                        {/* Peak Points / Inflection Circles matching Screenshot */}
                        {/* Peak 1: May (Blue) */}
                        {waveData.bluePoints[4] && (
                          <g className="cursor-pointer">
                            <circle cx={waveData.bluePoints[4].x} cy={waveData.bluePoints[4].y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                            <circle cx={waveData.bluePoints[4].x} cy={waveData.bluePoints[4].y} r="2" fill="#2563eb" />
                          </g>
                        )}
                        {/* Peak 2: Jun (Green junction) */}
                        {waveData.greenPoints[5] && (
                          <g className="cursor-pointer">
                            <circle cx={waveData.greenPoints[5].x} cy={waveData.greenPoints[5].y} r="5" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
                            <circle cx={waveData.greenPoints[5].x} cy={waveData.greenPoints[5].y} r="2" fill="#10b981" />
                          </g>
                        )}
                        {/* Peak 3: Aug (Blue inflection) */}
                        {waveData.bluePoints[7] && (
                          <g className="cursor-pointer">
                            <circle cx={waveData.bluePoints[7].x} cy={waveData.bluePoints[7].y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                            <circle cx={waveData.bluePoints[7].x} cy={waveData.bluePoints[7].y} r="2" fill="#2563eb" />
                          </g>
                        )}
                        {/* Peak 4: Oct (Green rise) */}
                        {waveData.greenPoints[9] && (
                          <g className="cursor-pointer">
                            <circle cx={waveData.greenPoints[9].x} cy={waveData.greenPoints[9].y} r="5" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
                            <circle cx={waveData.greenPoints[9].x} cy={waveData.greenPoints[9].y} r="2" fill="#10b981" />
                          </g>
                        )}

                        {/* Interactive Invisible Hover Columns */}
                        {waveData.bluePoints.map((bp, i) => (
                          <rect
                            key={i}
                            x={bp.x - 20}
                            y={10}
                            width={40}
                            height={240}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPointIdx(i)}
                            onMouseLeave={() => setHoveredPointIdx(null)}
                          />
                        ))}

                        {/* Hover Tooltip Card in SVG */}
                        {hoveredPointIdx !== null && waveData.bluePoints[hoveredPointIdx] && (
                          <g transform={`translate(${waveData.bluePoints[hoveredPointIdx].x}, ${Math.min(waveData.bluePoints[hoveredPointIdx].y, 160)})`}>
                            <line y1={-30} y2={240 - Math.min(waveData.bluePoints[hoveredPointIdx].y, 160)} stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
                            <rect x="-65" y="-55" width="130" height="46" rx="10" fill="#0f172a" opacity="0.95" />
                            <text x="0" y="-38" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                              {waveData.labels[hoveredPointIdx]}
                            </text>
                            <text x="0" y="-21" textAnchor="middle" fill="#93c5fd" fontSize="10">
                              Visits: {waveData.bluePoints[hoveredPointIdx].visits} live
                            </text>
                          </g>
                        )}
                      </svg>

                      {/* X-Axis Month / Day Labels */}
                      <div className="flex items-center justify-between px-3 pt-1">
                        {waveData.labels.map((lbl, idx) => (
                          <div key={idx} className="flex-1 text-center">
                            <span className={`text-[11px] font-medium block truncate ${
                              hoveredPointIdx === idx ? 'text-blue-600 font-bold' : 'text-slate-400'
                            }`}>
                              {lbl}
                            </span>
                          </div>
                        ))}
                      </div>
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
                            <div className="flex items-center gap-2.5 ml-auto">
                              <button
                                onClick={() => openEditPostEditor(post)}
                                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-semibold transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                                <button
                                  onClick={() => handleDeletePost(Number(post.id), post.title)}
                                  className="flex items-center gap-1 text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                                  title="পোস্ট মুছুন"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
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

          {/* VIEW 2: Unified Messages & Inquiries Inbox (Meta Business Suite Style) */}
          {activeNav === 'messages' && (() => {
            const allInquiries = comments.filter(c => Boolean(c.is_direct));
            const allComments = comments.filter(c => !c.is_direct);

            // Filter by Top Category Tab: 'all' | 'inquiries' | 'comments'
            let categoryFiltered = comments;
            if (inboxMainTab === 'inquiries') {
              categoryFiltered = allInquiries;
            } else if (inboxMainTab === 'comments') {
              categoryFiltered = allComments;
            }

            // Filter by Status / Badge: 'all' | 'unread' | 'pending' | 'ongoing' | 'completed'
            let statusFiltered = categoryFiltered.filter(c => {
              if (inboxStatusFilter === 'all') return true;
              if (inboxStatusFilter === 'unread') return !c.is_read;
              if (inboxStatusFilter === 'pending') return Boolean(c.is_direct) && (c.status || 'pending') === 'pending';
              if (inboxStatusFilter === 'ongoing') return Boolean(c.is_direct) && c.status === 'ongoing';
              if (inboxStatusFilter === 'completed') return Boolean(c.is_direct) && c.status === 'completed';
              return true;
            });

            // Filter by Search Query
            const finalFiltered = statusFiltered.filter(c => {
              if (!inboxSearchQuery.trim()) return true;
              const q = inboxSearchQuery.toLowerCase();
              return (
                c.author_name?.toLowerCase().includes(q) ||
                c.phone_number?.toLowerCase().includes(q) ||
                c.author_email?.toLowerCase().includes(q) ||
                c.content?.toLowerCase().includes(q) ||
                c.post_title?.toLowerCase().includes(q) ||
                c.post_slug?.toLowerCase().includes(q) ||
                c.admin_note?.toLowerCase().includes(q)
              );
            });

            // Selected comment
            const selectedItem = comments.find(c => c.id === selectedCommentId) || (typeof window !== 'undefined' && window.innerWidth >= 1024 ? finalFiltered[0] : null) || null;

            // Counts for Badges
            const unreadCount = comments.filter(c => !c.is_read).length;
            const pendingCount = allInquiries.filter(c => (c.status || 'pending') === 'pending').length;
            const ongoingCount = allInquiries.filter(c => c.status === 'ongoing').length;
            const completedCount = allInquiries.filter(c => c.status === 'completed').length;

            return (
              <div className="space-y-5">
                
                {/* Inbox Header Card (Stacked/Pinned Sticky Header) */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3.5 sticky top-0 z-20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5 font-sans">
                        <span>Inbox</span>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {comments.length}
                        </span>
                        {unreadCount > 0 && (
                          <span className="text-[11px] font-bangla font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                            {unreadCount}টি অপঠিত
                          </span>
                        )}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 font-bangla mt-1">
                        Respond to messages, manage inquiries and track customer interactions.
                      </p>
                    </div>

                    <button
                      onClick={() => { if (token) fetchAdminComments(token); }}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-bangla transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>রিফ্রেশ</span>
                    </button>
                  </div>

                  {/* Top Category Tabs (Like Meta Business Suite: All | Inquiries | Comments) */}
                  {/* Top Category Tabs (Side-by-side with icons, English only) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
                    <button
                      onClick={() => { setInboxMainTab('all'); setSelectedCommentId(null); }}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        inboxMainTab === 'all'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>All</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        inboxMainTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {comments.length}
                      </span>
                    </button>

                    <button
                      onClick={() => { setInboxMainTab('inquiries'); setSelectedCommentId(null); }}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        inboxMainTab === 'inquiries'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Inquiries</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        inboxMainTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {allInquiries.length}
                      </span>
                      {pendingCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </button>

                    <button
                      onClick={() => { setInboxMainTab('comments'); setSelectedCommentId(null); }}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        inboxMainTab === 'comments'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Comments</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        inboxMainTab === 'comments' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {allComments.length}
                      </span>
                    </button>

                    {/* WhatsApp Live Inbox Tab: STRICTLY Super Admin Only */}
                    {currentUser?.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          setInboxMainTab('whatsapp');
                          if (token) fetchWhatsAppChats(token);
                        }}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          inboxMainTab === 'whatsapp'
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp</span>
                        {whatsappChats.length > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                            inboxMainTab === 'whatsapp' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'
                          }`}>
                            {whatsappChats.length}
                          </span>
                        )}
                        {totalWaUnread > 0 && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono font-bold">
                            {totalWaUnread}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Condition: If WhatsApp tab is selected by Super Admin */}
                {inboxMainTab === 'whatsapp' && currentUser?.role === 'super_admin' ? (() => {
                  const filteredWaChats = whatsappChats.filter(chat => {
                    if (waSearchQuery.trim()) {
                      const q = waSearchQuery.toLowerCase();
                      const matchPhone = chat.phone_number?.toLowerCase().includes(q);
                      const matchName = chat.customer_name?.toLowerCase().includes(q);
                      const matchMsg = chat.last_message?.toLowerCase().includes(q);
                      if (!matchPhone && !matchName && !matchMsg) return false;
                    }
                    if (waFilter === 'unread') return (chat.unread_count || 0) > 0;
                    if (waFilter === 'takeover') return chat.ai_paused === 1;
                    if (waFilter === 'ai') return chat.ai_paused !== 1;
                    return true;
                  });

                  const currentChat = whatsappChats.find(c => 
                    c.phone_number === selectedWaPhone || 
                    c.phone_number.replace(/\D/g, '') === (selectedWaPhone || '').replace(/\D/g, '')
                  ) || waSelectedChat || null;

                  return (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col lg:flex-row h-[calc(100vh-210px)] min-h-[580px] max-h-[820px]">
                      
                      {/* LEFT COLUMN: Customer Conversations List (Hidden on mobile when chat is open) */}
                      <div className={`w-full lg:w-[360px] xl:w-[380px] border-r border-slate-100 bg-slate-50/40 flex flex-col shrink-0 h-full ${selectedWaPhone ? 'hidden lg:flex' : 'flex'}`}>
                        
                        {/* Search & Header */}
                        <div className="p-3.5 bg-white border-b border-slate-100 space-y-2.5 shrink-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 font-bangla flex items-center gap-1.5">
                              <MessageCircle className="w-4 h-4 text-emerald-600" />
                              <span>গ্রাহক বার্তা তালিকা</span>
                            </span>
                            <button
                              onClick={() => { if (token) fetchWhatsAppChats(token); }}
                              disabled={isLoadingWaChats}
                              className="text-[11px] text-slate-500 hover:text-emerald-700 font-bangla flex items-center gap-1 transition-colors cursor-pointer"
                              title="রিফ্রেশ"
                            >
                              <RefreshCw className={`w-3 h-3 ${isLoadingWaChats ? 'animate-spin text-emerald-600' : ''}`} />
                              <span>রিফ্রেশ</span>
                            </button>
                          </div>

                          <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={waSearchQuery}
                              onChange={e => setWaSearchQuery(e.target.value)}
                              placeholder="খুঁজুন (নাম, মোবাইল নম্বর, বার্তা...)"
                              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                            {waSearchQuery && (
                              <button
                                onClick={() => setWaSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Filter Badges */}
                        <div className="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 bg-slate-50/70 shrink-0">
                          {[
                            { id: 'all', label: 'সবগুলো', count: whatsappChats.length },
                            { id: 'unread', label: 'অপঠিত', count: whatsappChats.filter(c => (c.unread_count || 0) > 0).length },
                            { id: 'takeover', label: 'টেকওভার', count: whatsappChats.filter(c => c.ai_paused === 1).length },
                            { id: 'ai', label: 'AI সক্রিয়', count: whatsappChats.filter(c => c.ai_paused !== 1).length },
                          ].map(f => (
                            <button
                              key={f.id}
                              onClick={() => setWaFilter(f.id as any)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bangla font-bold whitespace-nowrap transition-all cursor-pointer ${
                                waFilter === f.id
                                  ? 'bg-emerald-700 text-white shadow-2xs'
                                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                              }`}
                            >
                              <span>{f.label}</span>
                              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                                waFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {f.count}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Chat List Scroll Container */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
                          {filteredWaChats.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                              <MessageCircle className="w-8 h-8 text-slate-300 mx-auto" />
                              <p className="text-xs font-semibold text-slate-500 font-bangla">
                                {whatsappChats.length === 0
                                  ? 'এখনো কোনো হোয়াটসঅ্যাপ কথোপকথন পাওয়া যায়নি।'
                                  : 'ফিল্টারের সাথে কোনো চ্যাট মিলেনি।'}
                              </p>
                            </div>
                          ) : (
                            filteredWaChats.map(chat => {
                              const isSelected = selectedWaPhone === chat.phone_number;
                              const isTakeover = chat.ai_paused === 1;
                              const unread = chat.unread_count || 0;

                              return (
                                <button
                                  key={chat.phone_number}
                                  type="button"
                                  onClick={() => {
                                    const targetPhone = chat.phone_number;
                                    setSelectedWaPhone(targetPhone);
                                    setWaSelectedChat(chat);
                                    fetchWhatsAppMessages(targetPhone);
                                  }}
                                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-50/90 border-l-4 border-l-emerald-600 shadow-2xs'
                                      : 'hover:bg-slate-50/80'
                                  }`}
                                >
                                  {/* Avatar */}
                                  <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/80 flex items-center justify-center text-emerald-800 font-bold text-sm shadow-2xs">
                                      {chat.customer_name ? chat.customer_name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-emerald-700" />}
                                    </div>
                                    {unread > 0 && (
                                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono flex items-center justify-center">
                                        {unread}
                                      </span>
                                    )}
                                  </div>

                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <h4 className="text-xs font-bold text-slate-900 truncate font-sans">
                                        {chat.customer_name || chat.phone_number}
                                      </h4>
                                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                        {chat.last_timestamp ? new Date(chat.last_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                      </span>
                                    </div>

                                    {/* Phone & Status Badges */}
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 truncate">
                                        <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                        <span>{chat.phone_number}</span>
                                      </span>
                                      {isTakeover ? (
                                        <span className="text-[9px] font-bold font-bangla px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 shrink-0 flex items-center gap-0.5">
                                          <Shield className="w-2 h-2 text-amber-600" />
                                          <span>টেকওভার</span>
                                        </span>
                                      ) : (
                                        <span className="text-[9px] font-bold font-bangla px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-0.5">
                                          <Sparkles className="w-2 h-2 text-emerald-600" />
                                          <span>AI সক্রিয়</span>
                                        </span>
                                      )}
                                    </div>

                                    {/* Last Message Preview */}
                                    <p className="text-xs text-slate-600 line-clamp-1 font-bangla">
                                      {chat.last_sender === 'agent' && (
                                        <span className="font-bold text-emerald-700">আপনি: </span>
                                      )}
                                      {(chat.last_sender === 'model' || chat.last_sender === 'bot') && (
                                        <span className="font-bold text-indigo-600">Gemini: </span>
                                      )}
                                      {chat.last_sender === 'user' && (
                                        <span className="font-bold text-slate-700">গ্রাহক: </span>
                                      )}
                                      <span>{chat.last_message || 'বার্তা'}</span>
                                    </p>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* RIGHT COLUMN: WhatsApp Live Chat Detail Area (Full screen on mobile when open) */}
                      <div className={`flex-1 flex flex-col bg-white min-w-0 h-full ${selectedWaPhone ? 'flex' : 'hidden lg:flex'}`}>
                        {!selectedWaPhone ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-slate-50/30">
                            <div className="w-16 h-16 rounded-3xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                              <MessageCircle className="w-8 h-8" />
                            </div>
                            <div className="max-w-md space-y-2">
                              <h3 className="text-lg font-bold text-slate-900 font-sans">
                                WhatsApp Live Monitoring & Super Admin Takeover
                              </h3>
                              <p className="text-xs text-slate-500 font-bangla leading-relaxed">
                                বাম পাশের তালিকা থেকে যেকোনো কাস্টমারের চ্যাট নির্বাচন করুন।
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Chat Header Bar */}
                            <div className="shrink-0 p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
                              <div className="flex items-center gap-2.5 min-w-0">
                                {/* Mobile Back Button */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedWaPhone(null)}
                                  className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Back to list"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-200">
                                  {currentChat?.customer_name ? currentChat.customer_name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-emerald-700" />}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate font-sans">
                                    {currentChat?.customer_name || selectedWaPhone}
                                  </h3>
                                  <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400 font-mono">
                                    <span>{selectedWaPhone}</span>
                                    <span className="text-slate-300">•</span>
                                    <a
                                      href={`https://wa.me/${selectedWaPhone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-600 hover:underline flex items-center gap-0.5"
                                    >
                                      <span>WhatsApp</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons: Takeover / Agent Toggle & Delete */}
                              <div className="flex items-center gap-2 shrink-0">
                                {currentChat?.ai_paused === 1 ? (
                                  <button
                                    type="button"
                                    disabled={isTogglingAi}
                                    onClick={() => handleToggleWaAi(selectedWaPhone, 1)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                    title="Click to resume AI"
                                  >
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>Takeover</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isTogglingAi}
                                    onClick={() => handleToggleWaAi(selectedWaPhone, 0)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                    title="Click to takeover"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Agent</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteWaChat(selectedWaPhone, currentChat?.customer_name || selectedWaPhone)}
                                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
                                  title="Delete conversation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Message Thread History Area (Scrolls smoothly inside container) */}
                            <div
                              ref={waChatScrollRef}
                              className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 bg-slate-50/60 min-h-0"
                            >
                              {isLoadingWaMessages && waMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400 space-y-2">
                                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                                  <span className="text-xs font-bangla font-semibold">মেসেজ লোড হচ্ছে...</span>
                                </div>
                              ) : waMessages.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 font-bangla text-xs">
                                  এই কথোপকথনে এখনো কোনো মেসেজ পাওয়া যায়নি।
                                </div>
                              ) : (
                                waMessages.map(msg => {
                                  const isUser = msg.sender === 'user';
                                  const isBot = msg.sender === 'bot';
                                  const isAgent = msg.sender === 'agent';

                                  return (
                                    <div
                                      key={msg.id || `${msg.timestamp}_${msg.message.slice(0, 10)}`}
                                      className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                                    >
                                      <div
                                        className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl shadow-2xs leading-relaxed ${
                                          isUser
                                            ? 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-xs'
                                            : isAgent
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20 rounded-tr-xs'
                                            : 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-slate-900 rounded-tr-xs'
                                        }`}
                                      >
                                        {/* Bubble Header */}
                                        <div className={`text-[10px] font-bold mb-1 flex items-center gap-1 ${
                                          isUser ? 'text-slate-500 font-sans' : isAgent ? 'text-emerald-100 justify-end font-bangla' : 'text-indigo-700 justify-end font-bangla'
                                        }`}>
                                          {isUser && (
                                            <>
                                              <User className="w-3 h-3 text-slate-400" />
                                              <span>{currentChat?.customer_name || 'গ্রাহক'}</span>
                                            </>
                                          )}
                                          {isBot && (
                                            <>
                                              <Sparkles className="w-3 h-3 text-indigo-600" />
                                              <span>Gemini AI</span>
                                            </>
                                          )}
                                          {isAgent && (
                                            <>
                                              <Shield className="w-3 h-3 text-emerald-200" />
                                              <span>এডমিন রিপ্লাই</span>
                                            </>
                                          )}
                                        </div>

                                        {/* Message Content */}
                                        <p className="text-xs sm:text-sm font-bangla whitespace-pre-wrap leading-relaxed">
                                          {msg.message}
                                        </p>

                                        {/* Timestamp */}
                                        <div className={`text-[10px] mt-1 text-right font-mono flex items-center justify-end gap-1 ${
                                          isUser ? 'text-slate-400' : isAgent ? 'text-emerald-200' : 'text-indigo-500'
                                        }`}>
                                          <span>
                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                          </span>
                                          {isAgent && <Check className="w-3 h-3 text-emerald-200" />}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>

                            {/* Bottom Reply Box (Always Pinned at the bottom of the chat) */}
                            <form
                              onSubmit={handleSendWhatsAppMessage}
                              className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-100 flex items-end gap-2 sm:gap-3"
                            >
                              <div className="flex-1 min-w-0">
                                <textarea
                                  value={waReplyText}
                                  onChange={e => setWaReplyText(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendWhatsAppMessage();
                                    }
                                  }}
                                  rows={2}
                                  placeholder="Leave a message..."
                                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none leading-relaxed"
                                />
                              </div>

                              <button
                                type="submit"
                                disabled={isSendingWa || !waReplyText.trim()}
                                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-bangla transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer disabled:opacity-50 shrink-0 self-end mb-1"
                              >
                                {isSendingWa ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>পাঠানো হচ্ছে...</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-3.5 h-3.5" />
                                    <span>পাঠান</span>
                                  </>
                                )}
                              </button>
                            </form>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })() : (
                /* Main Split CRM Workspace (Left: List, Right: Detail + Side Notes) */
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col lg:flex-row min-h-[720px]">
                  
                  {/* LEFT COLUMN: Message List (Hidden on mobile when an inquiry is selected) */}
                  <div className={`w-full lg:w-[350px] xl:w-[380px] border-r border-slate-100 bg-slate-50/40 flex flex-col shrink-0 ${selectedCommentId ? 'hidden lg:flex' : 'flex'}`}>
                    
                    {/* Search Bar */}
                    <div className="p-3 bg-white border-b border-slate-100">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inboxSearchQuery}
                          onChange={e => setInboxSearchQuery(e.target.value)}
                          placeholder="Search (নাম, ফোন, বার্তা...)"
                          className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        {inboxSearchQuery && (
                          <button
                            onClick={() => setInboxSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filter Pills Under Search */}
                    <div className="p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 bg-slate-50/70">
                      {[
                        { id: 'all', label: 'All', count: categoryFiltered.length },
                        { id: 'unread', label: 'Unread', count: unreadCount },
                        { id: 'pending', label: 'Pending', count: pendingCount },
                        { id: 'ongoing', label: 'Ongoing', count: ongoingCount },
                        { id: 'completed', label: 'Completed', count: completedCount },
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setInboxStatusFilter(f.id as any)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bangla font-bold whitespace-nowrap transition-all cursor-pointer ${
                            inboxStatusFilter === f.id
                              ? 'bg-slate-900 text-white shadow-2xs'
                              : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200/60'
                          }`}
                        >
                          {f.label} {f.count > 0 ? `(${f.count})` : ''}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable Conversation List */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80 max-h-[660px]">
                      {finalFiltered.length === 0 ? (
                        <div className="py-20 px-4 text-center text-slate-400 font-bangla">
                          <Mail className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                          <p className="text-xs">কোনো বার্তা বা মন্তব্য পাওয়া যায়নি।</p>
                        </div>
                      ) : (
                        finalFiltered.map(c => {
                          const isSelected = selectedItem?.id === c.id;
                          const currentStatus = c.status || 'pending';
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCommentId(c.id);
                                setInquiryNoteText(c.admin_note || '');
                                setAdminReplyText(c.admin_reply || '');
                                if (!c.is_read) handleMarkAsRead(c.id);
                              }}
                              className={`w-full text-left p-3.5 transition-all flex items-start gap-3 cursor-pointer relative ${
                                isSelected
                                  ? 'bg-blue-50/80 border-l-4 border-l-blue-600 shadow-xs'
                                  : 'hover:bg-white bg-slate-50/20 border-l-4 border-l-transparent'
                              }`}
                            >
                              {/* Avatar */}
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-xs ${
                                c.is_direct
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}>
                                {(c.author_name || 'U')[0]}
                              </div>

                              {/* Content Snippet */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <h4 className={`text-xs font-bangla truncate ${
                                    !c.is_read ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                                  }`}>
                                    {c.author_name}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-sans">
                                    {new Date(c.created_at).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>

                                {/* Channel Tag & Status */}
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-bangla ${
                                    c.is_direct
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {c.is_direct ? 'ফর্ম মেসেজ' : 'কমেন্ট'}
                                  </span>

                                  {c.is_direct && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-bangla flex items-center gap-1 ${
                                      currentStatus === 'completed'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : currentStatus === 'ongoing'
                                        ? 'bg-sky-100 text-sky-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {currentStatus === 'completed' ? (
                                        <>
                                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                          <span>সম্পন্ন</span>
                                        </>
                                      ) : currentStatus === 'ongoing' ? (
                                        <>
                                          <RefreshCw className="w-2.5 h-2.5 text-blue-600" />
                                          <span>চলমান</span>
                                        </>
                                      ) : (
                                        <>
                                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                                          <span>পেন্ডিং</span>
                                        </>
                                      )}
                                    </span>
                                  )}

                                  {c.admin_note && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bangla flex items-center gap-0.5">
                                      <FileText className="w-2.5 h-2.5 text-amber-600" />
                                      <span>নোট</span>
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-500 font-bangla truncate leading-relaxed">
                                  {c.content}
                                </p>
                              </div>

                              {/* Unread Blue Dot */}
                              {!c.is_read && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100 shrink-0 mt-1.5" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Active Thread & Admin Notes Panel */}
                  <div className={`flex-1 flex flex-col bg-white overflow-hidden ${selectedCommentId ? 'flex' : 'hidden lg:flex'}`}>
                    {!selectedItem ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                        <Mail className="w-14 h-14 text-slate-300 mb-3" />
                        <h3 className="text-base font-bold text-slate-700 font-bangla">কোনো মেসেজ নির্বাচিত নেই</h3>
                        <p className="text-xs text-slate-400 font-bangla mt-1 max-w-sm">
                          বাম পাশের তালিকা থেকে যেকোনো মেসেজ বা কমেন্ট নির্বাচন করে বিস্তারিত তথ্য দেখুন।
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Conversation Header */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                          <div className="flex items-center gap-3">
                            {/* Mobile Back Button to return to Inquiry List */}
                            <button
                              type="button"
                              onClick={() => setSelectedCommentId(null)}
                              className="lg:hidden p-1.5 -ml-1 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Back to inquiries list"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm uppercase text-white shadow-xs shrink-0 ${
                              selectedItem.is_direct ? 'bg-blue-600' : 'bg-emerald-600'
                            }`}>
                              {(selectedItem.author_name || 'U')[0]}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                <h3 className="font-extrabold text-slate-900 text-base font-bangla">
                                  {selectedItem.author_name}
                                </h3>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-bangla ${
                                  selectedItem.is_direct ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {selectedItem.is_direct ? 'ফর্ম ইনকোয়ারি' : 'ব্লগ মন্তব্য'}
                                </span>

                                {/* Action Status Dropdown Beside Name (No Emojis, Pure Lucide Icons) */}
                                {selectedItem.is_direct && (
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                      className={`px-3 py-1 rounded-xl text-xs font-bold font-bangla flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
                                        (selectedItem.status || 'pending') === 'completed'
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200/90 hover:bg-emerald-100'
                                          : (selectedItem.status || 'pending') === 'ongoing'
                                          ? 'bg-blue-50 text-blue-800 border-blue-200/90 hover:bg-blue-100'
                                          : 'bg-amber-50 text-amber-800 border-amber-200/90 hover:bg-amber-100'
                                      }`}
                                    >
                                      {(selectedItem.status || 'pending') === 'completed' ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (selectedItem.status || 'pending') === 'ongoing' ? (
                                        <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      )}
                                      <span>
                                        {(selectedItem.status || 'pending') === 'completed'
                                          ? 'সম্পন্ন (Completed)'
                                          : (selectedItem.status || 'pending') === 'ongoing'
                                          ? 'চলমান (Ongoing)'
                                          : 'অপেক্ষমান (Pending)'}
                                      </span>
                                      <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                                    </button>

                                    {statusDropdownOpen && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-40"
                                          onClick={() => setStatusDropdownOpen(false)}
                                        />
                                        <div className="absolute left-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                                          <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 font-bangla uppercase tracking-wider border-b border-slate-100">
                                            অ্যাকশন স্ট্যাটাস পরিবর্তন
                                          </div>

                                          {[
                                            {
                                              id: 'pending',
                                              label: 'অপেক্ষমান (Pending)',
                                              sub: 'যোগাযোগ বাকি',
                                              icon: Clock,
                                              iconColor: 'text-amber-500',
                                              hoverClass: 'hover:bg-amber-50',
                                            },
                                            {
                                              id: 'ongoing',
                                              label: 'চলমান (Ongoing)',
                                              sub: 'কথা চলছে',
                                              icon: RefreshCw,
                                              iconColor: 'text-blue-500',
                                              hoverClass: 'hover:bg-blue-50',
                                            },
                                            {
                                              id: 'completed',
                                              label: 'সম্পন্ন (Completed)',
                                              sub: 'সমাপ্ত হয়েছে',
                                              icon: CheckCircle2,
                                              iconColor: 'text-emerald-500',
                                              hoverClass: 'hover:bg-emerald-50',
                                            },
                                          ].map(opt => {
                                            const Icon = opt.icon;
                                            const isSelected = (selectedItem.status || 'pending') === opt.id;
                                            return (
                                              <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => {
                                                  handleUpdateInquiryStatus(selectedItem.id, opt.id);
                                                  setStatusDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs font-bangla transition-colors cursor-pointer ${opt.hoverClass} ${
                                                  isSelected ? 'bg-slate-50 font-bold text-slate-900' : 'text-slate-700'
                                                }`}
                                              >
                                                <div className="flex items-center gap-2.5">
                                                  <Icon className={`w-4 h-4 ${opt.iconColor}`} />
                                                  <div>
                                                    <div className="font-semibold">{opt.label}</div>
                                                    <div className="text-[10px] text-slate-400 font-normal">{opt.sub}</div>
                                                  </div>
                                                </div>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-bangla mt-0.5">
                                <span>{new Date(selectedItem.created_at).toLocaleString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                <span>•</span>
                                <Link
                                  href={`/blog/${selectedItem.post_slug}`}
                                  target="_blank"
                                  className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                                >
                                  <span>{selectedItem.post_title || selectedItem.post_slug}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {!selectedItem.is_read ? (
                              <button
                                onClick={() => handleMarkAsRead(selectedItem.id)}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-bangla transition-colors cursor-pointer"
                              >
                                পড়া হয়েছে
                              </button>
                            ) : (
                              <span className="text-[11px] font-bangla font-semibold text-slate-400 px-2">
                                পঠিত
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteComment(selectedItem.id, Boolean(selectedItem.is_direct))}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer border border-rose-100"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Split Body: Left = Message & Action/Reply, Right = Admin Only Notes */}
                        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-y-auto">
                          
                          {/* Main Left: Conversation & Action Section */}
                          <div className="xl:col-span-7 p-5 sm:p-6 space-y-6 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col justify-between">
                            <div className="space-y-5">
                              {/* Customer Message Bubble */}
                              <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                                  <span>গ্রাহকের মূল বার্তা:</span>
                                </div>
                                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-sm sm:text-base text-slate-900 font-bangla leading-relaxed shadow-2xs">
                                  {selectedItem.content}
                                </div>
                              </div>

                              {/* Customer Contact Card (If direct inquiry) */}
                              {selectedItem.is_direct && selectedItem.phone_number && (
                                <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/70 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-blue-600" />
                                      <span className="text-xs font-bold text-slate-700 font-bangla">গ্রাহকের মোবাইল নম্বর:</span>
                                      <span className="font-mono text-sm font-bold text-slate-900">{selectedItem.phone_number}</span>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <a
                                      href={`tel:${selectedItem.phone_number.replace(/\s+/g, '')}`}
                                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-bangla flex items-center gap-1.5 shadow-xs transition-colors"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      <span>সরাসরি কল করুন</span>
                                    </a>
                                    <a
                                      href={`https://wa.me/${selectedItem.phone_number.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-bangla flex items-center gap-1.5 shadow-xs transition-colors"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                      <span>WhatsApp চ্যাট</span>
                                    </a>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedItem.phone_number || '');
                                        showToast('মোবাইল নম্বর কপি করা হয়েছে!');
                                      }}
                                      className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold font-bangla flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>কপি</span>
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Customer Email (if provided) */}
                              {selectedItem.author_email && (
                                <div className="text-xs text-slate-500 font-bangla flex items-center gap-1.5">
                                  <span>ইমেইল:</span>
                                  <a href={`mailto:${selectedItem.author_email}`} className="text-blue-600 font-mono font-medium hover:underline">
                                    {selectedItem.author_email}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Differentiated Bottom Interaction Area: Only for Public Comments */}
                            {!selectedItem.is_direct && (
                              <div className="pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xs font-bold text-slate-900 font-bangla flex items-center gap-1.5">
                                    <Reply className="w-4 h-4 text-emerald-600" />
                                    <span>পাবলিক রিপ্লাই (ব্লগ পোস্টে সরাসরি প্রদর্শিত হবে):</span>
                                  </h4>
                                </div>

                                  {/* Existing Published Reply */}
                                  {selectedItem.admin_reply && (
                                    <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-800 font-bangla space-y-1">
                                      <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>প্রকাশিত রিপ্লাই:</span>
                                      </div>
                                      <p className="leading-relaxed pl-5">{selectedItem.admin_reply}</p>
                                    </div>
                                  )}

                                  <div className="space-y-2">
                                    <textarea
                                      value={adminReplyText}
                                      onChange={e => setAdminReplyText(e.target.value)}
                                      rows={3}
                                      placeholder="মন্তব্যকারীর জন্য উত্তর লিখুন (এটি ব্লগে পাঠকদের সামনে প্রদর্শিত হবে)..."
                                      className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed"
                                    />
                                    <div className="flex justify-end">
                                      <button
                                        type="button"
                                        disabled={isSendingReply || !adminReplyText.trim()}
                                        onClick={() => handleSendAdminReply(selectedItem.id)}
                                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-bangla transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                                      >
                                        {isSendingReply ? (
                                          <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                            <span>পোস্ট হচ্ছে...</span>
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-3.5 h-3.5" />
                                            <span>পাবলিক রিপ্লাই পোস্ট করুন</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* Side Panel: Admin-Only Internal Notes ("r pase note rakhbe for admin only") */}
                          <div className="xl:col-span-5 p-5 sm:p-6 bg-amber-50/20 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Lock className="w-4 h-4 text-amber-600" />
                                  <h4 className="text-sm font-extrabold text-slate-900 font-bangla">
                                    অভ্যন্তরীণ নোট (Admin Only)
                                  </h4>
                                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    গোপনীয়
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-bangla mt-1 leading-relaxed">
                                  গ্রাহকের সাথে ফোনে বা হোয়াটসঅ্যাপে কী কথা হয়েছে তার নোট লিখে রাখুন। এটি পোর্টাল ছাড়া আর কোথাও দেখা যাবে না।
                                </p>
                              </div>

                              {/* Saved Note Card */}
                              {selectedItem.admin_note ? (
                                <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs space-y-2">
                                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 font-bangla">
                                    <span className="flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                                      <span>সংরক্ষিত নোট</span>
                                    </span>
                                    <span className="text-[10px] text-amber-700/80 font-normal">
                                      {selectedItem.admin_note_by || 'Admin'}
                                      {selectedItem.admin_note_at && ` • ${new Date(selectedItem.admin_note_at).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-800 font-bangla leading-relaxed pl-5 whitespace-pre-wrap">
                                    {selectedItem.admin_note}
                                  </p>
                                </div>
                              ) : (
                                <div className="p-4 rounded-2xl bg-white/60 border border-dashed border-amber-200 text-center text-xs text-slate-400 font-bangla py-6">
                                  এখনও কোনো অভ্যন্তরীণ নোট যোগ করা হয়নি।
                                </div>
                              )}

                              {/* Note Editor */}
                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-700 font-bangla">
                                  নোট লিখুন বা আপডেট করুন:
                                </label>
                                <textarea
                                  value={inquiryNoteText}
                                  onChange={e => setInquiryNoteText(e.target.value)}
                                  rows={4}
                                  placeholder="যেমন: ফোনে কথা হয়েছে, কাস্টমার ম্যাকবুক এম১-এ বাংলা টাইপিং লেগ সমস্যার সমাধান সম্পর্কে জানতে চেয়েছেন..."
                                  className="w-full p-3.5 rounded-xl border border-amber-200 bg-white text-xs font-bangla focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed shadow-2xs"
                                />
                              </div>
                            </div>

                            {/* Note Save Button */}
                            <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between gap-3">
                              <span className="text-[11px] text-slate-400 font-bangla">
                                টিমের সবাই এই নোট দেখতে পারবে
                              </span>
                              <button
                                type="button"
                                disabled={isSavingNote || !inquiryNoteText.trim()}
                                onClick={() => handleSaveInquiryNote(selectedItem.id)}
                                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs font-bangla transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                              >
                                {isSavingNote ? (
                                  <>
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>সেভ হচ্ছে...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>নোট সংরক্ষণ করুন</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                        </div>
                      </>
                    )}
                  </div>

                </div>
              )}

              </div>
            );
          })()}

          {/* VIEW: Analytics & Traffic Insights */}
          {activeNav === 'analytics' && (
            <div className="space-y-8">
              {/* Header (Stacked/Sticky at Top of Section) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs sticky top-0 z-20">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Traffic Analytics Insights</span>
                  </h2>
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

            </div>
          )}

          {/* VIEW: Media Gallery */}
          {activeNav === 'media' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header (Stacked/Sticky at Top of Section) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 sticky top-0 z-20 bg-white/95 backdrop-blur-md pt-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                    <span>Media Gallery</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Manage and replace author avatars, blog covers, and uploaded images across the entire website.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-full p-1 text-xs font-semibold">
                    {(['all', 'profiles', 'covers', 'custom'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setMediaFilter(tab)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer capitalize ${
                          mediaFilter === tab ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-500'
                        }`}
                      >
                        {tab === 'all' ? 'All Media' : tab === 'profiles' ? 'Avatars' : tab === 'covers' ? 'Covers' : 'Uploads'}
                      </button>
                    ))}
                  </div>

                  <input
                    type="file"
                    ref={newMediaFileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadNewMedia(file);
                    }}
                  />

                  <button
                    onClick={() => newMediaFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>

              {/* Hidden file input for Replace */}
              <input
                type="file"
                ref={mediaFileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && replacingMediaItem) {
                    handleReplaceMediaFile(replacingMediaItem, file);
                    setReplacingMediaItem(null);
                  }
                }}
              />

              {/* Grid of media */}
              {isLoadingMedia ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                  <p className="text-sm">Loading media gallery...</p>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-sm font-medium">No media found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {mediaList
                    .filter(item => {
                      if (mediaFilter === 'profiles') return item.type === 'author_avatar' || item.type === 'admin_avatar';
                      if (mediaFilter === 'covers') return item.type === 'cover_image';
                      if (mediaFilter === 'custom') return item.type === 'custom';
                      return true;
                    })
                    .map((item) => (
                      <div key={item.id} className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-3.5 flex flex-col justify-between group hover:border-blue-300 hover:shadow-xs transition-all">
                        <div className="space-y-3">
                          <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-200 relative border border-slate-200/60 flex items-center justify-center">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {item.isProfile && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-bold backdrop-blur-xs">
                                Profile
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{item.usedIn}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200/60">
                          <button
                            onClick={() => {
                              setReplacingMediaItem(item);
                              mediaFileInputRef.current?.click();
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                          </button>

                          {item.type === 'custom' && (
                            <button
                              onClick={() => handleDeleteMedia(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeNav === 'calendar' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header (Stacked/Sticky at Top of Section) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 sticky top-0 z-20 bg-white/95 backdrop-blur-md pt-2">
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
                            {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                              <button
                                onClick={() => handleDeletePost(Number(post.id), post.title)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="পোস্ট মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 4: Settings (Clean Titles, Device Upload & Drag Position) */}
          {activeNav === 'settings' && (
            <div className="space-y-8">
              {/* Main Page Title: Settings (Stacked/Sticky at Top of Section) */}
              <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-200/80 sticky top-0 z-20 bg-[#f4f7f6]/95 backdrop-blur-md">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  Settings
                </h1>

                {settingsSuccessMsg && (
                  <div className="p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bangla flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{settingsSuccessMsg}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* Section 1: Profile & Author Profile */}
                <div className="space-y-8">
                  {/* Card 1: Profile */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-100 pb-3">
                      Profile
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                      <div 
                        className="relative group w-20 h-20 shrink-0 cursor-pointer" 
                        onClick={() => adminFileInputRef.current?.click()}
                        title="Upload photo from device"
                      >
                        <img 
                          src={adminProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                          alt="Avatar" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm group-hover:opacity-85 transition-opacity"
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
                          if (file) handleProfileFileSelected(file, 'admin');
                        }}
                      />

                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => adminFileInputRef.current?.click()}
                          className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-blue-100"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Name</label>
                          <input
                            type="text"
                            value={adminProfile.name}
                            onChange={e => setAdminProfile({ ...adminProfile, name: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                          <input
                            type="email"
                            value={adminProfile.email}
                            onChange={e => setAdminProfile({ ...adminProfile, email: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold font-sans text-slate-700 uppercase">
                          {adminProfile.role || currentUser?.role || 'Member'}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSavingSettings}
                        onClick={handleSaveSettings}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                      >
                        {isSavingSettings ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving Profile...</span>
                          </>
                        ) : (
                          <span>Save Profile</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Author Profile (Super Admin & Admin Only) */}
                  {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900 font-sans">
                          Author Profile
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          Site-Wide Default
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div 
                          className="relative group w-20 h-20 shrink-0 cursor-pointer" 
                          onClick={() => authorFileInputRef.current?.click()}
                          title="Upload author photo from device"
                        >
                          <img 
                            src={authorProfile.avatar || '/assets/pabel_light_avatar.webp'} 
                            alt="Author" 
                            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-sm group-hover:opacity-85 transition-opacity"
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
                            if (file) handleProfileFileSelected(file, 'author');
                          }}
                        />

                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => authorFileInputRef.current?.click()}
                            className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-blue-100"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Author Name</label>
                            <input
                              type="text"
                              value={authorProfile.name}
                              onChange={e => setAuthorProfile({ ...authorProfile, name: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Role / Designation</label>
                            <input
                              type="text"
                              value={authorProfile.role}
                              onChange={e => setAuthorProfile({ ...authorProfile, role: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio</label>
                          <textarea
                            rows={2}
                            value={authorProfile.bio}
                            onChange={e => setAuthorProfile({ ...authorProfile, bio: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>

                        <button
                          type="button"
                          disabled={isSavingSettings}
                          onClick={handleSaveSettings}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        >
                          {isSavingSettings ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving Author Profile...</span>
                            </>
                          ) : (
                            <span>Save Author Profile</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 2: Security, Username & Password */}
                <div className="space-y-8">
                  {/* Card 1: Username (One-Time Update, Super Admin Only) */}
                  {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                          <User className="w-5 h-5 text-emerald-600" />
                          <span>Username</span>
                        </h2>
                        {usernameChanged ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Locked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <span>1 Change Allowed</span>
                          </span>
                        )}
                      </div>

                    {usernameMsg.text && (
                      <div
                        className={`p-3.5 rounded-2xl text-xs font-bangla flex items-start gap-2.5 ${
                          usernameMsg.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border border-rose-200 text-rose-800'
                        }`}
                      >
                        {usernameMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <span>{usernameMsg.text}</span>
                      </div>
                    )}

                    {usernameChanged ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">
                            Current Username
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value={adminUsername}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-mono cursor-not-allowed"
                            />
                            <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-bangla leading-relaxed flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>আপনার অ্যাকাউন্টের ইউজারনেম একবার পরিবর্তন করার পর স্থায়ীভাবে লক করা হয়েছে।</span>
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleUpdateUsername} className="space-y-4">
                        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-bangla leading-relaxed flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>সতর্কতা:</strong> আপনি শুধুমাত্র <strong>একবারই</strong> আপনার অ্যাডমিন ইউজারনেম পরিবর্তন করতে পারবেন। একবার সেভ করার পর এটি আর পরিবর্তন করা যাবে না।
                          </span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 font-sans">
                            New Username (নতুন ইউজারনেম)
                          </label>
                          <input
                            type="text"
                            required
                            minLength={3}
                            value={newAdminUsername}
                            onChange={(e) => setNewAdminUsername(e.target.value)}
                            placeholder="যেমন: pabel_admin"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                          <p className="text-[11px] text-slate-400 mt-1 font-sans">
                            Only English letters, numbers, and symbols (_ . -) are allowed.
                          </p>
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingUsername}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-bangla transition-all cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                        >
                          {isUpdatingUsername ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>সংরক্ষণ ও লক করা হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>ইউজারনেম সেভ ও লক করুন (একবার পরিবর্তনযোগ্য)</span>
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                  {/* Card 2: Password */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Key className="w-5 h-5 text-emerald-600" />
                      <span>Password</span>
                    </h2>

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
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                          নতুন পাসওয়ার্ড (New Password)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                          নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                        </label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="পুনরায় নতুন পাসওয়ার্ড লিখুন"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs font-bangla transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        পাসওয়ার্ড আপডেট করুন
                      </button>
                    </form>

                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-xs text-emerald-950 font-bangla leading-relaxed space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>ইমেইলে পাসওয়ার্ড রিসেট লিংক:</span>
                      </div>
                      <p className="text-slate-600">
                        ভবিষ্যতে পাসওয়ার্ড ভুলে গেলে লগইন স্ক্রিনের &quot;পাসওয়ার্ড ভুলে গেছেন?&quot; বোতাম ব্যবহার করে আপনার নিবন্ধিত ইমেইলে (`{currentUser?.email || adminProfile.email || 'আপনার ইমেইল'}`) সিকিউর ওয়ান-টাইম রিসেট লিংক পাঠিয়ে পাসওয়ার্ড রিসেট করতে পারবেন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: Git Backup */}
          {activeNav === 'backup' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header (Stacked/Sticky at Top of Section) */}
              <div className="flex items-center justify-between pb-3 pt-1 border-b border-slate-100 sticky top-0 z-20 bg-white/95 backdrop-blur-md">
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

          {/* VIEW 8: Team Management & RBAC */}
          {activeNav === 'team' && (
            <div className="space-y-8">
              {/* Header (Stacked/Sticky at Top of Section) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 pt-1 border-b border-slate-200/80 sticky top-0 z-20 bg-[#f4f7f6]/95 backdrop-blur-md">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight flex items-center gap-2.5">
                    <Users className="w-7 h-7 text-emerald-600" />
                    <span>Team Management & Roles</span>
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { if (token) fetchTeamMembers(token); }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-bangla transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTeam ? 'animate-spin' : ''}`} />
                    <span>রিফ্রেশ</span>
                  </button>

                  <button
                    onClick={() => {
                      setTeamActionMsg({ text: '', type: '' });
                      setIsAddMemberOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/20"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>+ Add New Member</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {teamActionMsg.text && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-bangla flex items-start gap-2.5 ${
                    teamActionMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {teamActionMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{teamActionMsg.text}</span>
                </div>
              )}

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Members</span>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-1">{teamMembers.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block flex items-center gap-1">
                    <span>👑 Super Admin</span>
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                    {teamMembers.filter(m => m.role === 'super_admin').length}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block flex items-center gap-1">
                    <span>✍️ Editor</span>
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                    {teamMembers.filter(m => m.role === 'editor').length}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block flex items-center gap-1">
                    <span>📝 Author / Mod</span>
                  </span>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                    {teamMembers.filter(m => m.role === 'author' || m.role === 'moderator').length}
                  </p>
                </div>
              </div>

              {/* Members List Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Active Team Directory</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-sans">{teamMembers.length} Accounts</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3 px-6">Member</th>
                        <th className="py-3 px-6">Role & Permissions</th>
                        <th className="py-3 px-6">Status</th>
                        <th className="py-3 px-6">Joined Date</th>
                        <th className="py-3 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {teamMembers.map(member => {
                        const isSelf = currentUser?.id === member.id || currentUser?.username === member.username;
                        const roleColor = {
                          super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
                          editor: 'bg-blue-50 text-blue-700 border-blue-200',
                          author: 'bg-amber-50 text-amber-700 border-amber-200',
                          moderator: 'bg-rose-50 text-rose-700 border-rose-200',
                        }[member.role] || 'bg-slate-50 text-slate-700 border-slate-200';

                        const roleLabel = {
                          super_admin: '👑 Super Admin',
                          editor: '✍️ Editor',
                          author: '📝 Author',
                          moderator: '🛡️ Moderator',
                        }[member.role] || member.role;

                        return (
                          <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={member.avatar || '/assets/pabel_light_avatar.webp'}
                                  alt={member.name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5 font-bold text-slate-900 font-sans">
                                    <span>{member.name}</span>
                                    {isSelf && (
                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">You</span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-mono">@{member.username} • {member.email}</p>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${roleColor}`}>
                                  {roleLabel}
                                </span>
                                {!isSelf && (
                                  <select
                                    value={member.role}
                                    onChange={(e) => handleUpdateTeamMember(member.id, { role: e.target.value })}
                                    className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                                  >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="author">Author</option>
                                    <option value="moderator">Moderator</option>
                                  </select>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <button
                                disabled={isSelf}
                                onClick={() => handleUpdateTeamMember(member.id, { status: member.status === 'active' ? 'inactive' : 'active' })}
                                title={isSelf ? 'নিজের স্ট্যাটাস পরিবর্তন করা সম্ভব নয়' : 'ক্লিক করে স্ট্যাটাস পরিবর্তন করুন'}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                  isSelf ? 'cursor-default opacity-80' : 'cursor-pointer hover:opacity-85'
                                } ${
                                  member.status === 'active'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                <span className="capitalize">{member.status}</span>
                              </button>
                            </td>

                            <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                              {member.created_at ? new Date(member.created_at).toLocaleDateString('en-GB') : 'Primary'}
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isSelf && (
                                  <button
                                    onClick={() => handleDeleteTeamMember(member.id, member.name)}
                                    title="টিম থেকে মুছে ফেলুন"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 9: More Screen (Meta Business Suite Style - Tools & Settings Grid/List) */}
          {activeNav === 'more' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
              
              {/* Profile Card Header */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser?.avatar || adminProfile.avatar || '/assets/pabel_light_avatar.webp'}
                      alt={currentUser?.name || adminProfile.name || 'Admin'}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate font-sans">
                        {currentUser?.name || adminProfile.name || 'Admin'}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {currentUser?.role === 'super_admin' ? 'Super Admin' : (currentUser?.role || 'Admin')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5 font-sans">
                      {currentUser?.email || adminProfile.email || 'admin@banglish.bd'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveNav('settings'); if (token) fetchAdminSettings(token); }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">প্রোফাইল</span>
                </button>
              </div>

              {/* Section 1: Management & Tools */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans px-1">
                  ম্যানেজ ও প্ল্যানিং (Manage & Insights)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Planner */}
                  <button
                    onClick={() => setActiveNav('calendar')}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-bangla">
                          কন্টেন্ট প্ল্যানার (Planner)
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bangla">শিডিউল ও প্রকাশিত পোস্ট</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Insights / Analytics */}
                  <button
                    onClick={() => { setActiveNav('analytics'); if (token) fetchAnalytics(token); }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-bangla">
                          ইনসাইটস (Insights)
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bangla">ভিজিটর ট্রাফিক ও পেজভিউ</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Media */}
                  <button
                    onClick={() => setActiveNav('media')}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-bangla">
                          মিডিয়া গ্যালারি (Media)
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bangla">কাভার ছবি ও ব্যানার লাইব্রেরি</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  {/* Database & Git Backup */}
                  <button
                    onClick={() => { setActiveNav('backup'); generateGitBackupCode(); }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-bangla">
                          গিট ব্যাকআপ (Git Sync)
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bangla">ডাটাবেজ সেফটি ও ব্যাকআপ কোড</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              {/* Section 2: Team & Settings */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans px-1">
                  টিম ও সেটিংস (Team & Settings)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Team Management (Super Admin only) */}
                  {(!currentUser || currentUser.role === 'super_admin') && (
                    <button
                      onClick={() => { setActiveNav('team'); if (token) fetchTeamMembers(token); }}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors font-bangla">
                            টিম ম্যানেজমেন্ট (Team)
                          </h4>
                          <p className="text-[11px] text-slate-400 font-bangla">মেম্বার রোল ও অ্যাক্সেস কন্ট্রোল</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  )}

                  {/* Profile & Security Settings */}
                  <button
                    onClick={() => { setActiveNav('settings'); if (token) fetchAdminSettings(token); }}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors font-bangla">
                          অ্যাকাউন্ট সেটিংস (Settings)
                        </h4>
                        <p className="text-[11px] text-slate-400 font-bangla">পাসওয়ার্ড ও প্রোফাইল এডিট</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              {/* Section 3: External Analytics & Tools */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans px-1">
                  এক্সটার্নাল প্ল্যাটফর্ম (External Tools)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 flex flex-col items-center text-center gap-2 transition-all group"
                  >
                    <img src="/icons/search-console.png" alt="GSC" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    <span className="text-xs font-bold text-slate-700 font-sans">Search Console</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">Open <ExternalLink className="w-2.5 h-2.5" /></span>
                  </a>

                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-slate-50 flex flex-col items-center text-center gap-2 transition-all group"
                  >
                    <img src="/icons/google-analytics.png" alt="GA4" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    <span className="text-xs font-bold text-slate-700 font-sans">Google Analytics</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">Open <ExternalLink className="w-2.5 h-2.5" /></span>
                  </a>

                  <a
                    href="https://clarity.microsoft.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-slate-50 flex flex-col items-center text-center gap-2 transition-all group"
                  >
                    <img src="/icons/microsoft-clarity.png" alt="Clarity" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    <span className="text-xs font-bold text-slate-700 font-sans">MS Clarity</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">Open <ExternalLink className="w-2.5 h-2.5" /></span>
                  </a>

                  <a
                    href="https://tagmanager.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 flex flex-col items-center text-center gap-2 transition-all group"
                  >
                    <img src="/icons/google-tag-manager.png" alt="GTM" className="w-7 h-7 object-contain group-hover:scale-110 transition-transform" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                    <span className="text-xs font-bold text-slate-700 font-sans">Tag Manager</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">Open <ExternalLink className="w-2.5 h-2.5" /></span>
                  </a>
                </div>
              </div>

              {/* Section 4: Live Blog & Log Out */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/blog"
                  target="_blank"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-emerald-200/70"
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span>লাইভ ওয়েবসাইট ও ব্লগ দেখুন (View Site)</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-rose-200/70 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>লগআউট করুন (Log Out)</span>
                </button>
              </div>

            </div>
          )}

        </main>

        {/* Mobile Fixed Bottom Navigation Bar (Meta Business Suite App Style) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1 flex items-center justify-around pb-[calc(env(safe-area-inset-bottom)+0.35rem)]">
          {/* 1. Home */}
          <button
            onClick={() => { setActiveNav('editor'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 transition-all cursor-pointer ${
              activeNav === 'editor' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeNav === 'editor' ? 'bg-blue-50' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          {/* 2. Content */}
          <button
            onClick={() => { setActiveNav('calendar'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 transition-all cursor-pointer ${
              activeNav === 'calendar' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeNav === 'calendar' ? 'bg-blue-50' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">Content</span>
          </button>

          {/* 3. Center Elevated Plus Button */}
          <button
            onClick={openNewPostEditor}
            title="নতুন আর্টিকেল তৈরি করুন"
            className="relative -top-3 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 border-4 border-white transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* 4. Inbox */}
          <button
            onClick={() => { 
              setActiveNav('messages'); 
              if (token) fetchAdminComments(token); 
              if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            className={`flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 transition-all cursor-pointer relative ${
              activeNav === 'messages' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all relative ${activeNav === 'messages' ? 'bg-blue-50' : ''}`}>
              <Mail className="w-5 h-5" />
              {unreadCommentsCount > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Inbox</span>
          </button>

          {/* 5. More (3 lines) */}
          <button
            onClick={() => { setActiveNav('more'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex flex-col items-center justify-center gap-1 min-w-[54px] py-1 transition-all cursor-pointer ${
              activeNav === 'more' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${activeNav === 'more' ? 'bg-blue-50' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        </nav>
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
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                {editingPostId && (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                  <button
                    type="button"
                    onClick={() => handleDeletePost(editingPostId, editorTitle)}
                    className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>পোস্ট মুছুন</span>
                  </button>
                )}
              </div>

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

      {/* 4. Circular Avatar Drag & Crop Reposition Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Move className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-base font-sans">
                  {cropTarget === 'admin' ? 'Position Profile Picture' : cropTarget === 'author' ? 'Position Author Profile Picture' : 'Position Image'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-bangla">
              মাউস অথবা আঙুল দিয়ে ড্র্যাগ করে ছবিটি বৃত্তের ভেতরে সঠিক স্থানে বসান এবং জুম নিয়ন্ত্রণ করুন।
            </p>

            {/* Circular Viewport Preview Frame */}
            <div className="flex justify-center py-2">
              <div
                className="w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500 shadow-xl relative cursor-grab active:cursor-grabbing select-none bg-slate-900 flex items-center justify-center"
                onMouseDown={handleCropMouseDown}
                onMouseMove={handleCropMouseMove}
                onMouseUp={handleCropMouseUp}
                onMouseLeave={handleCropMouseUp}
                onTouchStart={handleCropTouchStart}
                onTouchMove={handleCropTouchMove}
                onTouchEnd={handleCropTouchEnd}
              >
                <img
                  src={cropImageSrc}
                  alt="Crop Target"
                  draggable={false}
                  style={{
                    transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropZoom})`,
                    transformOrigin: 'center center',
                    maxWidth: 'none',
                  }}
                  className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-75"
                />

                {/* Subtle centering crosshair guide */}
                <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-full" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 pointer-events-none" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 pointer-events-none" />
              </div>
            </div>

            {/* Zoom Slider Control */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-blue-600" />
                  <span>জুম স্কেল (Zoom)</span>
                </span>
                <span className="font-mono text-blue-600 font-bold">{cropZoom.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-3">
                <ZoomOut className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmAvatarCrop}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>পজিশন সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Member Modal */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans">Add Team Member</h3>
                  <p className="text-[11px] text-slate-500 font-bangla">নতুন টিম মেম্বারকে অ্যাক্সেস দিন</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTeamMember} className="p-6 space-y-4">
              {modalMemberError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bangla flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{modalMemberError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                  পূর্ণ নাম (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="যেমন: Tanvir Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    ইউজারনেম (Username) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberUsername}
                    onChange={(e) => setNewMemberUsername(e.target.value)}
                    placeholder="যেমন: tanvir_editor"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                    ইমেইল (Official Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="tanvir@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                  পাসওয়ার্ড (Temporary Password) *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newMemberPassword}
                  onChange={(e) => setNewMemberPassword(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 font-bangla mb-1.5">
                  অ্যাক্সেস রোল (Role & Permissions) *
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer text-slate-800"
                >
                  <option value="editor">✍️ Editor (সব পোস্ট তৈরি/এডিট/পাবলিশ ও কমেন্ট ম্যানেজ)</option>
                  <option value="author">📝 Author (শুধুমাত্র নিজের পোস্ট তৈরি ও ড্রাফট করা)</option>
                  <option value="moderator">🛡️ Moderator (শুধুমাত্র কমেন্ট ও মেসেজ রিভিউ করা)</option>
                  <option value="super_admin">👑 Super Admin (সকল পারমিশন, টিম ম্যানেজমেন্ট ও সেটিংস)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMember}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingMember ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>যুক্ত হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>মেম্বার যুক্ত করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {renderPasswordModals()}

      {/* In-Theme Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center text-center transform animate-in zoom-in-95 duration-200">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-inner ${
              confirmModal.type === 'danger'
                ? 'bg-rose-50 border border-rose-100 text-rose-600'
                : confirmModal.type === 'warning'
                ? 'bg-amber-50 border border-amber-100 text-amber-600'
                : 'bg-blue-50 border border-blue-100 text-blue-600'
            }`}>
              {confirmModal.type === 'danger' ? (
                <Trash2 className="w-7 h-7" />
              ) : confirmModal.type === 'warning' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <Info className="w-7 h-7" />
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-slate-600 font-bangla mt-2 leading-relaxed px-1">
              {confirmModal.message}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {confirmModal.cancelText || 'বাতিল'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmModal.onConfirm;
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  action();
                }}
                className={`w-full sm:w-auto flex-1 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all cursor-pointer ${
                  confirmModal.type === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                    : confirmModal.type === 'warning'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                }`}
              >
                {confirmModal.confirmText || 'হ্যাঁ, নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating In-Theme Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-[130] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'error'
            ? 'bg-rose-950/90 text-rose-100 border-rose-800/80 shadow-rose-950/30'
            : toast.type === 'info'
            ? 'bg-slate-900/90 text-slate-100 border-slate-800/80 shadow-slate-950/30'
            : 'bg-slate-900/95 text-slate-100 border-slate-800 shadow-slate-950/40'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bangla font-medium">
            {toast.message}
          </span>
          <button
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title="বন্ধ করুন"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
