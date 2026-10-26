'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone,
  Sparkles 
} from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { CURRENT_STUDENT } from '@/lib/mock-data';
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
    // Automatically navigate to reader
    router.push(`/books/${book.id}/read`);
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        
        {isPurchased ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5" />
                <span>You Own Full Academic Access</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Licensed to {CURRENT_STUDENT.fullName} ({CURRENT_STUDENT.email}). Unlimited reading on all devices.
              </p>
            </div>

            <Link
              href={`/books/${book.id}/read`}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all cursor-pointer flex-shrink-0"
            >
              <BookOpen className="h-4 w-4" />
              <span>Read Full Book Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400">Student License Fee</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    ${book.priceUSD.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    / ៛{book.priceKHR.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Smartphone className="h-4 w-4 text-rose-600" />
                <span>Instant ABA Mobile / KHQR Activation</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/books/${book.id}/read`}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <span>Read Free Preview (1–{book.previewPages})</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowPayModal(true)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-rose-600/30 hover:from-red-700 hover:to-rose-700 transition-all cursor-pointer"
              >
                <QrCode className="h-4 w-4" />
                <span>Pay with ABA PayWay (KHQR)</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Protected Canvas Viewing
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Dynamic Student Watermark
              </span>
              <span>24/7 Access on Any Browser</span>
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
