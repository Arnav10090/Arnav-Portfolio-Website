import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { siteMetadata, personSchema } from '@/data/metadata';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: 'Arnav Tiwari' }],
  creator: 'Arnav Tiwari',
  publisher: 'Arnav Tiwari',
  metadataBase: new URL(siteMetadata.canonicalUrl || 'https://arnavtiwari.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteMetadata.canonicalUrl,
    siteName: 'Arnav Tiwari Portfolio',
    title: siteMetadata.ogTitle,
    description: siteMetadata.ogDescription,
    ...(siteMetadata.ogImage && { 
      images: [{
        url: siteMetadata.ogImage,
        width: 1200,
        height: 630,
        alt: 'Arnav Tiwari - Software Engineer Portfolio'
      }] 
    }),
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.ogTitle,
    description: siteMetadata.ogDescription,
    creator: '@arnavtiwari',
    ...(siteMetadata.ogImage && { images: [siteMetadata.ogImage] }),
  },
  alternates: {
    canonical: siteMetadata.canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification tokens when available
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
        
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        
        {/* Structured Data (JSON-LD) for Person Schema */}
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
