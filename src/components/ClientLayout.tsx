'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
