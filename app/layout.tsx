import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Banglish — Best Avro & iAvro Alternative for macOS & Windows',
  description: 'Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard for Apple Silicon M1-M4, Intel Macs, and Windows 10/11. Free, offline & private.',
  keywords: [
    'Best Avro Alternative for Mac',
    'Best Avro Alternative for Windows',
    'Best iAvro Alternative',
    'Avro alternative software for macOS',
    'Bangla Dictionary',
    'Bangla English Arabic Dictionary',
    'Phonetic Bangla keyboard',
    'Bangla keyboard Windows',
    'Banglish'
  ],
  authors: [{ name: 'Team FramEmpire, A M Pabel' }],
  metadataBase: new URL('https://banglish.bd'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Banglish — Best Avro & iAvro Alternative for macOS & Windows',
    description: 'Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard with Tri-lingual Dictionary.',
    url: 'https://banglish.bd/',
    siteName: 'Banglish',
    images: [
      {
        url: '/assets/banglish-logo-512.png',
        width: 512,
        height: 512,
        alt: 'Banglish — Best Avro Alternative',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/assets/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/banglish-logo-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Hind+Siliguri:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="relative min-h-screen text-slate-800 bg-white selection:bg-emerald-100 selection:text-emerald-900">
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
