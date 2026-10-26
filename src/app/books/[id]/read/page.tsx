import { notFound } from 'next/navigation';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { LockedPdfViewer } from '@/components/LockedPdfViewer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return MOCK_BOOKS.map((book) => ({
    id: book.id,
  }));
}

export default async function ReadPage({ params }: PageProps) {
  const { id } = await params;
  const book = MOCK_BOOKS.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return <LockedPdfViewer book={book} />;
}
