import type { Metadata } from 'next';
import './globals.css';
import { HeaderFooterWrapper } from '@/components/HeaderFooterWrapper';

export const metadata: Metadata = {
  title: 'Prof. Lay PengHong | Course Books (RULE)',
  description: 'Academic course books portal for Royal University of Law and Economics (RULE) by Prof. Lay PengHong.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen">
        <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
      </body>
    </html>
  );
}
