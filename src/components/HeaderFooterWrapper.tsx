'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isReaderPage = pathname.includes('/read');

  if (isReaderPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function HeaderFooterWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50">{children}</div>}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
