
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, QrCode } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { isBookPurchased } from '@/lib/storage';
import { AbaPaywayModal } from './AbaPaywayModal';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [purchased, setPurchased] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  useEffect(() => {
    setPurchased(isBookPurchased(book.id));
    const handleUpdate = () => setPurchased(isBookPurchased(book.id));
    window.addEventListener('purchases_updated', handleUpdate);
    return () => window.removeEventListener('purchases_updated', handleUpdate);
  }, [book.id]);

  const handleSuccess = (purchase: Purchase) => {
    setShowPayModal(false);
    setPurchased(true);
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-6 shadow-xs transition-shadow hover:shadow-md">

        {/* Category & Status */}
        <div className="flex items-center justify-between pb-4">
          <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${book.category === 'Law'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}>
            {book.category}
          </span>

          {purchased ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Purchased</span>
            </span>
          ) : (
            <span className="text-xs text-stone-400">
              Free preview: {book.previewPages} pages
            </span>
          )}
        </div>

        {/* Title & Author */}
        <h3 className="text-lg font-bold text-stone-900 leading-snug">
          {book.title}
        </h3>
        <p className="mt-1 text-xs text-stone-500 font-medium">
          {book.author} • {book.publisher}
        </p>

        {/* Brief description */}
        <p className="mt-3 text-xs leading-relaxed text-stone-600 line-clamp-3">
          {book.description}
        </p>

        {/* Price */}
        <div className="mt-5 border-t border-stone-100 pt-4 flex items-baseline justify-between">
          <div>
            <span className="text-xl font-black text-stone-900">
              ${book.priceUSD.toFixed(2)}
            </span>
            <span className="ml-1.5 text-xs text-stone-500">
              (៛{book.priceKHR.toLocaleString()})
            </span>
          </div>
          <span className="text-xs text-stone-400">
            {book.totalPages} pages
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-1 flex items-center gap-2">
          {purchased ? (
            <Link
              href={`/books/${book.id}/read`}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read Book</span>
            </Link>
          ) : (
            <>
              <Link
                href={`/books/${book.id}/read`}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                <span>Preview</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>PayWay</span>
              </button>
            </>
          )}
        </div>

      </div>

      <AbaPaywayModal
        book={book}
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
