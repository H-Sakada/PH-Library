'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, ShieldCheck, UserCheck, RefreshCcw } from 'lucide-react';
import { CURRENT_STUDENT } from '@/lib/mock-data';
import { getPurchases, resetAllPurchases } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();
  const [purchaseCount, setPurchaseCount] = useState<number>(0);
  const [showResetNotice, setShowResetNotice] = useState<boolean>(false);

  const updateCount = () => {
    const list = getPurchases();
    setPurchaseCount(list.length);
  };

  useEffect(() => {
    updateCount();
    const handleUpdate = () => updateCount();
    window.addEventListener('purchases_updated', handleUpdate);
    return () => window.removeEventListener('purchases_updated', handleUpdate);
  }, []);

  const handleReset = () => {
    if (confirm('Reset your purchased books for testing?')) {
      resetAllPurchases();
      setShowResetNotice(true);
      setTimeout(() => setShowResetNotice(false), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-700 to-blue-900 text-white shadow-md shadow-indigo-600/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Peng Hong
              </span>
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Library
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Academic & Digital Reader Portal
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            Catalog
          </Link>

          <Link
            href="/my-library"
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === '/my-library'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <Library className="h-4 w-4" />
            <span>My Books</span>
            {purchaseCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                {purchaseCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === '/admin'
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            Publisher Admin
          </Link>
        </nav>

        {/* Student Session & Demo Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                {CURRENT_STUDENT.fullName}
              </p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                {CURRENT_STUDENT.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            title="Reset test purchases in local storage"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition-colors"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>

      </div>

      {showResetNotice && (
        <div className="bg-amber-500 py-1 text-center text-xs font-bold text-white animate-fade-in">
          ✓ Purchases reset. All books now require payment to test unlock.
        </div>
      )}
    </header>
  );
}
