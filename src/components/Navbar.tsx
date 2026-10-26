'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, RefreshCw } from 'lucide-react';
import { resetAllPurchases } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();

  const handleReset = () => {
    if (confirm('Reset purchases to test the payment flow again?')) {
      resetAllPurchases();
    }
  };

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Title / Professor & University Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-xs tracking-wider">
            LP
          </div>
          <div>
            <span className="font-bold text-stone-900 text-base leading-tight block">
              Prof. Lay PengHong
            </span>
            <span className="text-xs text-stone-500 block">
              Royal University of Law and Economics (RULE)
            </span>
          </div>
        </Link>

        {/* Minimal Navigation & Reset Demo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
              pathname === '/'
                ? 'bg-stone-100 text-stone-900 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Books
          </Link>

          <button
            onClick={handleReset}
            title="Reset test purchases"
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 px-2 py-1 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
}
