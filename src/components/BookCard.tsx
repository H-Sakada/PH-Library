'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Lock, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { isBookPurchased } from '@/lib/storage';
import { AbaPaywayModal } from './AbaPaywayModal';

interface BookCardProps {
  book: Book;
  onPurchaseSuccess?: () => void;
}

export function BookCard({ book, onPurchaseSuccess }: BookCardProps) {
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
    if (onPurchaseSuccess) onPurchaseSuccess();
  };

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
        
        {/* Book Cover Visual Container */}
        <Link href={`/books/${book.id}`} className="relative block aspect-[4/3] w-full overflow-hidden p-6 cursor-pointer">
          <div className={`relative h-full w-full rounded-xl bg-gradient-to-br ${book.coverGradient} p-5 text-white shadow-lg transition-transform duration-300 group-hover:scale-102 flex flex-col justify-between overflow-hidden`}>
            
            {/* Book Spine Texture overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-white/10 border-r border-white/20" />
            
            {/* Top Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase backdrop-blur-xs text-white">
                {book.category}
              </span>
              {purchased ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Purchased</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
                  <Lock className="h-3 w-3 text-amber-300" />
                  <span>Free Preview: {book.previewPages} Pgs</span>
                </span>
              )}
            </div>

            {/* Book Title & Author inside cover */}
            <div className="relative z-10 mt-auto pl-2">
              <h3 className="line-clamp-2 text-base font-extrabold tracking-tight text-white drop-shadow-sm">
                {book.title}
              </h3>
              <p className="mt-1 text-xs text-slate-200 font-medium truncate">
                {book.author}
              </p>
            </div>

            {/* Subtle background decorative seal */}
            <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full border-4 border-white/10 opacity-40 pointer-events-none" />
          </div>
        </Link>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {book.totalPages} Pages • {book.publishDate}
            </span>
            <div className="text-right">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                ${book.priceUSD.toFixed(2)}
              </span>
              <span className="ml-1 text-xs font-semibold text-slate-500">
                (៛{book.priceKHR.toLocaleString()})
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
            {book.description}
          </p>

          {/* Action Footer */}
          <div className="mt-auto pt-4 flex items-center gap-2">
            {purchased ? (
              <Link
                href={`/books/${book.id}/read`}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Read Full Book</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href={`/books/${book.id}/read`}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Preview</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setShowPayModal(true)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/25 hover:from-red-700 hover:to-rose-700 transition-all cursor-pointer"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>PayWay ($ {book.priceUSD.toFixed(2)})</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AbaPaywayModal
        book={book}
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
