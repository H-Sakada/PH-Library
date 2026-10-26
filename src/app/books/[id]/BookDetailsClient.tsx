'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle, QrCode } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { isBookPurchased } from '@/lib/storage';
import { AbaPaywayModal } from '@/components/AbaPaywayModal';

interface BookDetailsClientProps {
  book: Book;
}

export function BookDetailsClient({ book }: BookDetailsClientProps) {
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  useEffect(() => {
    setIsPurchased(isBookPurchased(book.id));
    const handleUpdate = () => setIsPurchased(isBookPurchased(book.id));
    window.addEventListener('purchases_updated', handleUpdate);
    return () => window.removeEventListener('purchases_updated', handleUpdate);
  }, [book.id]);

  const handlePurchaseSuccess = (purchase: Purchase) => {
    setIsPurchased(true);
    setShowPayModal(false);
    router.push(`/books/${book.id}/read`);
  };

  return (
    <>
      <div className="rounded-lg bg-stone-50 border border-stone-200 p-4">
        {isPurchased ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span>You own full access to this textbook</span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Ready to read online on any browser.
              </p>
            </div>

            <Link
              href={`/books/${book.id}/read`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read Book</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-black text-stone-900">
                ${book.priceUSD.toFixed(2)}
                <span className="text-xs font-normal text-stone-500 ml-1.5">
                  / ៛{book.priceKHR.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Pages 1–{book.previewPages} are free to preview.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/books/${book.id}/read`}
                className="rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Preview
              </Link>

              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>Pay with ABA PayWay</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AbaPaywayModal
        book={book}
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
}
