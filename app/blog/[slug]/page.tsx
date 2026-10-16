import React from 'react';
import { blogPosts, BlogPost } from '@/data/blogData';
import BlogPostClient from './BlogPostClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post - Banglish Keyboard',
      description: 'Banglish Keyboard Official Blog',
    };
  }

  const cover = post.coverImage || (post as any).cover_image;

  return {
    title: `${post.seoTitle || (post as any).seo_title || post.title} | Banglish Keyboard`,
    description: post.excerpt,
    alternates: {
      canonical: `https://banglish.bd/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://banglish.bd/blog/${post.slug}`,
      siteName: 'Banglish Keyboard',
      images: cover ? [{ url: cover }] : [],
      type: 'article',
      publishedTime: post.isoDate || (post as any).iso_date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: cover ? [cover] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initialPost = blogPosts.find(p => p.slug === slug) || null;

  return <BlogPostClient slug={slug} initialPost={initialPost} />;
}
