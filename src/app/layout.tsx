import type { Metadata } from 'next';
import './globals.css';
import { HeaderFooterWrapper } from '@/components/HeaderFooterWrapper';

export const metadata: Metadata = {
  title: 'Peng Hong Digital Library | Protected Academic Books & ABA PayWay',
  description: 'Digital textbook publishing portal with secure locked-PDF canvas reader, dynamic student watermarking, and instant ABA PayWay / KHQR payment activation.',
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
