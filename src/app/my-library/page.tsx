'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Library, ShieldCheck, QrCode, Calendar, Receipt } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { MOCK_BOOKS, CURRENT_STUDENT } from '@/lib/mock-data';
import { getPurchases } from '@/lib/storage';

export default function MyLibraryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const loadPurchases = () => {
      const list = getPurchases();
      setPurchases(list);
      const bookIds = new Set(list.map((p) => p.bookId));
      const books = MOCK_BOOKS.filter((b) => bookIds.has(b.id));
      setPurchasedBooks(books);
    };

    loadPurchases();
    window.addEventListener('purchases_updated', loadPurchases);
    return () => window.removeEventListener('purchases_updated', loadPurchases);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <Library className="h-4 w-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              My Student Library
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Active digital licenses for <strong>{CURRENT_STUDENT.fullName}</strong> ({CURRENT_STUDENT.studentId})
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
        >
          <span>Browse More Books</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Content */}
      {purchasedBooks.length > 0 ? (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchasedBooks.map((book) => {
              const purchase = purchases.find((p) => p.bookId === book.id);
              return (
                <div 
                  key={book.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Cover Header */}
                  <div className={`relative h-44 bg-gradient-to-br ${book.coverGradient} p-5 text-white flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
                        {book.category}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Active License</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="line-clamp-2 text-base font-bold text-white drop-shadow-xs">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-200 mt-0.5 truncate">{book.author}</p>
                    </div>
                  </div>

                  {/* Body & Receipt info */}
                  <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
                    {purchase && (
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500 space-y-1 dark:bg-slate-800/60 dark:border-slate-700/60">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Receipt className="h-3 w-3 text-slate-400" />
                            Receipt:
                          </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {purchase.transactionId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Paid via:</span>
                          <span className="font-semibold text-rose-600">ABA PayWay</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        href={`/books/${book.id}/read`}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Open Protected Reader</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="my-16 mx-auto max-w-md rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
            No Books Purchased Yet
          </h3>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Your personal digital bookshelf is currently empty. Explore the catalog, test the free preview chapters, and unlock full access with ABA PayWay.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              <span>Explore Course Books</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
