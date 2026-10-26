import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { BookDetailsClient } from './BookDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return MOCK_BOOKS.map((book) => ({
    id: book.id,
  }));
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params;
  const book = MOCK_BOOKS.find((b) => b.id === id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Books</span>
      </Link>

      <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6">
        <div>
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            {book.category}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-stone-900">
            {book.title}
          </h1>
          <p className="mt-1 text-sm text-stone-600 font-medium">
            {book.author} • {book.publisher}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-stone-700">
          {book.description}
        </p>

        <BookDetailsClient book={book} />

        {/* Table of contents */}
        <div className="border-t border-stone-100 pt-6">
          <h2 className="text-sm font-bold text-stone-900 mb-3">
            Table of Contents
          </h2>
          <div className="divide-y divide-stone-100 text-xs">
            {book.tableOfContents.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="text-stone-800">{item.title}</span>
                <span className="text-stone-400">p.{item.page}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
