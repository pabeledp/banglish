'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Don't track admin pages or internal assets
    if (pathname.startsWith('/admin')) return;

    try {
      // 1. Get or create persistent visitor hash
      let hash = localStorage.getItem('banglish_visitor_hash');
      if (!hash) {
        hash = 'vis_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('banglish_visitor_hash', hash);
      }

      // 2. Prevent duplicate hits within same 2 minutes for the same path
      const sessionKey = `tracked_${pathname}`;
      const lastTracked = sessionStorage.getItem(sessionKey);
      const now = Date.now();
      if (lastTracked && now - Number(lastTracked) < 120000) {
        return;
      }
      sessionStorage.setItem(sessionKey, String(now));

      // 3. Send lightweight beacon/fetch to Cloudflare D1
      fetch('/api/blog/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname || '/',
          visitorHash: hash,
          referrer: document.referrer || '',
        }),
      }).catch(() => {});
    } catch (e) {}
  }, [pathname]);

  return null;
}
