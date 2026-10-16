import type { Metadata } from 'next';
import Script from 'next/script';
import AudioPlayer from '@/components/AudioPlayer';
import SiteTracker from '@/components/SiteTracker';
import './globals.css';

export const metadata: Metadata = {
  title: 'Banglish — Best Avro & iAvro Alternative for macOS & Windows',
  description: 'Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard for Apple Silicon M1-M4, Intel Macs, and Windows 10/11. Free, offline & private.',
  keywords: [
    'Best Avro Alternative for Mac',
    'Best Avro Alternative for Windows',
    'Best iAvro Alternative',
    'Avro alternative software for macOS',
    'Avro for Windows',
    'Phonetic Bangla keyboard for macOS and Windows',
    'Native Swift Bangla keyboard Apple Silicon',
    'Windows Bangla Typing',
    'Bangla keyboard Mac',
    'Bangla keyboard Windows',
    'iAvro replacement',
    'Apple Silicon M1 M2 M3 M4 Bangla',
    'Avro Keyboard alternative',
    'Bangla typing macOS',
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
        url: 'https://banglish.bd/assets/banglish-og-preview.png',
        width: 1024,
        height: 390,
        type: 'image/png',
        alt: 'Banglish — macOS ও Windows-এর জন্য দ্রুততম, নিখুঁত ও সম্পূর্ণ ফ্রি বাংলা টাইপিং সফটওয়্যার',
      },
      {
        url: 'https://banglish.bd/assets/banglish-og-preview.webp',
        width: 1024,
        height: 390,
        type: 'image/webp',
        alt: 'Banglish — macOS ও Windows-এর জন্য দ্রুততম, নিখুঁত ও সম্পূর্ণ ফ্রি বাংলা টাইপিং সফটওয়্যার',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banglish — Best Avro & iAvro Alternative for macOS & Windows',
    description: 'Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard with Tri-lingual Dictionary.',
    images: ['https://banglish.bd/assets/banglish-og-preview.png'],
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
  },
  verification: {
    other: {
      'facebook-domain-verification': '5rl38ybwfa6tmmdylipvjgnxshqabk',
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://banglish.bd/#software',
      name: 'Banglish',
      alternateName: [
        'Banglish Keyboard',
        'Banglish macOS',
        'Banglish Windows',
        'Banglish Avro Alternative',
        'Banglish iAvro Alternative'
      ],
      operatingSystem: 'macOS 12.0 or later (Monterey, Ventura, Sonoma, Sequoia) & Windows 10/11 (64-bit Beta)',
      applicationCategory: 'UtilitiesApplication',
      applicationSubCategory: 'Productivity',
      softwareVersion: '1.0.0',
      downloadUrl: 'https://banglish.bd/downloads/Banglish.dmg',
      installUrl: 'https://banglish.bd/#installation',
      url: 'https://banglish.bd/',
      image: 'https://banglish.bd/assets/banglish-logo-512.png',
      screenshot: 'https://banglish.bd/assets/banglish-og-preview.png',
      description: 'Banglish is the fastest, modern 100% native phonetic Bangla keyboard input method for macOS and Windows. Designed as the ultimate replacement for iAvro on Apple Silicon (M1/M2/M3/M4), Intel Macs, and Windows (Beta).',
      featureList: [
        '100% Native architecture for macOS & Windows',
        'Universal Binary: Native Apple Silicon (M1/M2/M3/M4) and Intel support',
        'Windows 10 and 11 (64-bit) Public Beta compatibility',
        'Zero telemetry, no background network calls, and 100% privacy',
        'Instant phonetic transliteration with zero typing latency',
        'Drop-in modern replacement for legacy iAvro'
      ],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      sameAs: [
        'https://www.facebook.com/banglishkeyboard/',
        'https://github.com/pabeledp/Banglish-Avro-Keyboard'
      ],
      author: {
        '@type': 'Person',
        name: 'A M Pabel',
        url: 'https://www.ampabel.com'
      },
      publisher: {
        '@type': 'Organization',
        '@id': 'https://banglish.bd/#organization',
        name: 'FramEmpire',
        url: 'https://www.framempire.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://banglish.bd/assets/banglish-logo-512.png'
        }
      }
    },
    {
      '@type': 'WebSite',
      '@id': 'https://banglish.bd/#website',
      url: 'https://banglish.bd/',
      name: 'Banglish',
      description: 'Best Avro & iAvro Alternative for macOS — 100% Native Swift Phonetic Bangla Keyboard',
      publisher: {
        '@id': 'https://banglish.bd/#organization'
      },
      inLanguage: ['bn', 'en']
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://banglish.bd/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Is Banglish a good alternative to iAvro for Mac?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes, Banglish is the ultimate modern alternative to iAvro for macOS. While legacy iAvro has not been updated for modern macOS architectures, Banglish is written 100% in native Swift utilizing Apple's modern InputMethodKit framework. It runs natively on macOS Sonoma, Sequoia, and earlier versions with zero input lag, full system stability, and zero privacy tracking."
          }
        },
        {
          '@type': 'Question',
          name: 'Does Banglish work natively on Apple Silicon (M1/M2/M3)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Banglish is built as a Universal Binary with native compilation for Apple Silicon chips (M1, M2, M3, M4) as well as Intel processors. It requires no Rosetta 2 translation, resulting in instant startup, microscopic memory usage, and maximum energy efficiency.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I type Bangla on macOS phonetically using Banglish?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Typing Bangla phonetically in Banglish works exactly like familiar phonetic typing: just type English phonetics according to sound (e.g., typing 'ami' produces 'আমি', 'bangla' produces 'বাংলা', and 'k' gives 'ক'). Once installed, you can switch to Banglish via the macOS input menu or standard shortcuts (such as Control+Space or Caps Lock) in any application."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <meta name="facebook-domain-verification" content="5rl38ybwfa6tmmdylipvjgnxshqabk" />
        
        {/* Primary Social Media & OpenGraph Preview Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Banglish" />
        <meta property="og:url" content="https://banglish.bd/" />
        <meta property="og:title" content="Banglish — Best Avro & iAvro Alternative for macOS & Windows" />
        <meta property="og:description" content="Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard for Apple Silicon & Windows. Free, offline & private." />
        <meta property="og:image" content="https://banglish.bd/assets/banglish-og-preview.png" />
        <meta property="og:image:secure_url" content="https://banglish.bd/assets/banglish-og-preview.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="390" />
        <meta property="og:image:alt" content="Banglish — Best Avro & iAvro Alternative for macOS & Windows" />

        {/* Twitter / X Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Banglish — Best Avro & iAvro Alternative for macOS & Windows" />
        <meta name="twitter:description" content="Download Banglish, the best Avro & iAvro alternative for macOS & Windows. 100% native phonetic Bangla keyboard for Apple Silicon & Windows. Free, offline & private." />
        <meta name="twitter:image" content="https://banglish.bd/assets/banglish-og-preview.png" />
        <meta name="twitter:image:alt" content="Banglish — Best Avro & iAvro Alternative for macOS & Windows" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Alkatra:wght@400;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Playpen+Sans+Arabic:wght@400;500;600;700&family=Anek+Bangla:wght@100..800&family=Fira+Code:wght@400;500;600&family=Galada&family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Mina:wght@400;700&family=Noto+Serif+Bengali:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="relative min-h-screen text-slate-800 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
        
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WP2JH4CG"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WP2JH4CG');`,
          }}
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TKXN340NZW"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TKXN340NZW');
            `,
          }}
        />

        {/* Background Grid Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern" aria-hidden="true" />

        {/* Ambient Floating Bangla Typography */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
          <span className="absolute top-28 left-[5%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/10 blur-[2.5px] float-glyph-1">অ</span>
          <span className="absolute top-[48%] left-[2%] text-6xl sm:text-8xl font-bangla font-bold text-teal-900/10 blur-[3px] float-glyph-2">আ</span>
          <span className="absolute top-20 right-[12%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/10 blur-[3px] float-glyph-3">ক</span>
          <span className="absolute top-[62%] right-[6%] text-6xl sm:text-8xl font-bangla font-bold text-teal-800/10 blur-[3.5px] float-glyph-1">খ</span>
          <span className="absolute top-[32%] right-[28%] text-5xl sm:text-7xl font-bangla font-semibold text-emerald-800/10 blur-[2px] float-glyph-4">গ</span>
          <span className="absolute bottom-28 left-[15%] text-7xl sm:text-9xl font-bangla font-bold text-emerald-900/10 blur-[3px] float-glyph-2">ব</span>
          <span className="absolute bottom-16 right-[20%] text-7xl sm:text-9xl font-bangla font-bold text-teal-900/10 blur-[3px] float-glyph-3">শ</span>
        </div>

        {/* Soft Ambient Glow Orbs */}
        <div className="fixed -top-40 right-0 w-[550px] h-[550px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none animate-subtle-pulse -z-10" />
        <div className="fixed top-1/2 -left-32 w-[450px] h-[450px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Children */}
        {children}

        {/* Global Live Visitor Tracker */}
        <SiteTracker />

        {/* Floating Audio Player with Equalizer */}
        <AudioPlayer />

      </body>
    </html>
  );
}
