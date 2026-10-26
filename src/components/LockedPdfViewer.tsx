'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, CheckCircle, QrCode } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { CURRENT_STUDENT } from '@/lib/mock-data';
import { isBookPurchased } from '@/lib/storage';
import { AbaPaywayModal } from './AbaPaywayModal';

interface LockedPdfViewerProps {
  book: Book;
}

export function LockedPdfViewer({ book }: LockedPdfViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [formattedDate, setFormattedDate] = useState<string>('2026-10-26');

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString('en-GB'));
    setIsPurchased(isBookPurchased(book.id));
    const handleUpdate = () => setIsPurchased(isBookPurchased(book.id));
    window.addEventListener('purchases_updated', handleUpdate);
    return () => window.removeEventListener('purchases_updated', handleUpdate);
  }, [book.id]);

  // Anti-piracy: Disable Right-click and Print shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePurchaseSuccess = (purchase: Purchase) => {
    setIsPurchased(true);
    setShowPayModal(false);
  };

  const isPageLocked = !isPurchased && currentPage > book.previewPages;
  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || book.pages[0];

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
      className="flex min-h-screen flex-col bg-stone-100 select-none text-stone-900"
    >
      
      {/* 1. TOP BAR */}
      <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Books</span>
          </Link>
          <span className="text-stone-300">|</span>
          <span className="text-xs font-bold text-stone-900 truncate max-w-xs sm:max-w-md">
            {book.title}
          </span>
        </div>

        <div>
          {isPurchased ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Purchased</span>
            </span>
          ) : (
            <button
              onClick={() => setShowPayModal(true)}
              className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
            >
              <QrCode className="h-3 w-3" />
              <span>Unlock ($ {book.priceUSD.toFixed(2)})</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. READING CONTENT STAGE */}
      <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="relative min-h-[560px] w-full max-w-xl rounded-xl border border-stone-200 bg-white p-8 sm:p-12 shadow-sm overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Anti-Piracy Watermark Overlay */}
          <div 
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-around overflow-hidden select-none opacity-[0.035]"
          >
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="whitespace-nowrap text-xs font-bold uppercase tracking-widest -rotate-25 transform text-center"
              >
                {CURRENT_STUDENT.email} • {formattedDate} • RULE LICENSE
              </div>
            ))}
          </div>

          {/* Book Header on Page */}
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-[11px] text-stone-400">
              <span className="truncate">{book.title}</span>
              <span>{book.publisher}</span>
            </div>

            {/* Page Body */}
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-bold text-stone-900">
                {pageData.chapterTitle || `Page ${currentPage}`}
              </h2>

              <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
                {pageData.paragraphs.map((para, i) => (
                  <p key={i} className="text-justify indent-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Page Footer */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
            <span>RULE Student Edition</span>
            <span>Page {currentPage} of {book.totalPages}</span>
          </div>

          {/* LOCKED OVERLAY */}
          {isPageLocked && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700">
                <Lock className="h-6 w-6" />
              </div>

              <h3 className="mt-3 text-base font-bold text-stone-900">
                Locked Page
              </h3>
              <p className="mt-1 text-xs text-stone-500 max-w-xs">
                Free preview ends at page {book.previewPages}. Please complete the payment to read all chapters.
              </p>

              <div className="mt-4 rounded-lg bg-stone-50 border border-stone-200 p-3 w-full max-w-xs text-center">
                <div className="text-lg font-black text-stone-900">
                  ${book.priceUSD.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 ml-1">
                    (៛{book.priceKHR.toLocaleString()})
                  </span>
                </div>

                <button
                  onClick={() => setShowPayModal(true)}
                  className="mt-3 w-full rounded-md bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Pay with ABA PayWay
                </button>
              </div>

              <button
                onClick={() => setCurrentPage(book.previewPages)}
                className="mt-3 text-xs text-stone-400 hover:text-stone-600"
              >
                ← Back to free preview
              </button>
            </div>
          )}

        </div>
      </main>

      {/* 3. BOTTOM PAGINATION BAR */}
      <footer className="flex h-14 items-center justify-between border-t border-stone-200 bg-white px-4 sm:px-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-md border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 disabled:opacity-40 hover:bg-stone-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-medium text-stone-600">
          Page {currentPage} of {book.totalPages}
          {!isPurchased && currentPage <= book.previewPages && (
            <span className="ml-1 text-[11px] text-stone-400 font-normal">
              (Preview)
            </span>
          )}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(book.totalPages, p + 1))}
          disabled={currentPage === book.totalPages}
          className="flex items-center gap-1 rounded-md bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 hover:bg-stone-800"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>

      {/* ABA PayWay Modal */}
      <AbaPaywayModal
        book={book}
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
