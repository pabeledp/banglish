#!/usr/bin/env node

/**
 * Sync Blog Posts from Cloudflare D1 to data/blogData.ts
 * Ensures 100% Zero-Data-Loss Git Backup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../data/blogData.ts');

console.log('🔄 Fetching latest blog posts from Cloudflare D1 (banglish-bot-db)...');

try {
  const cmd = `npx wrangler d1 execute banglish-bot-db --remote --json --command "SELECT * FROM blog_posts ORDER BY created_at DESC;"`;
  const rawOutput = execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  
  const parsed = JSON.parse(rawOutput);
  const rows = parsed[0]?.results || [];

  console.log(`📥 Retrieved ${rows.length} posts from Cloudflare D1.`);

  const formattedPosts = rows.map((r, idx) => ({
    id: `post-${String(r.id).padStart(3, '0')}`,
    index: String(idx + 1).padStart(3, '0'),
    slug: r.slug,
    title: r.title,
    seoTitle: r.seo_title || r.title,
    subtitle: r.subtitle || '',
    category: r.category || 'সফটওয়্যার',
    date: r.date,
    isoDate: r.iso_date,
    readTime: r.read_time || '৫ মিনিট পড়ার সময়',
    featured: Boolean(r.featured),
    coverImage: r.cover_image || '',
    coverAlt: r.cover_alt || r.title,
    canonical: `https://banglish.bd/blog/${r.slug}`,
    author: {
      name: r.author_name || 'A M Pabel',
      role: r.author_role || 'Founder, FramEmpire',
      avatar: r.author_avatar || '/assets/pabel_light_avatar.webp',
    },
    excerpt: r.excerpt || '',
    tags: typeof r.tags === 'string' ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : (r.tags || []),
    content: r.content || '',
    views: r.views || 0,
    status: r.status || 'published',
  }));

  const blogCategories = [
    "সকল আর্টিকেল",
    "সফটওয়্যার",
    "টাইপিং গাইড",
    "টিপস & ট্রিকস",
    "নতুন আপডেট"
  ];

  const fileContent = `/**
 * Banglish Official Blog Data Store
 * Built on the architecture of ampabel.com
 * Synced automatically from Cloudflare D1 on ${new Date().toISOString()}
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

export const blogPosts: BlogPost[] = ${JSON.stringify(formattedPosts, null, 2)};
`;

  fs.writeFileSync(targetFile, fileContent, 'utf8');
  console.log(`✅ Successfully synced ${formattedPosts.length} posts to data/blogData.ts!`);
} catch (err) {
  console.error('❌ Failed to sync from D1:', err.message);
  process.exit(1);
}
