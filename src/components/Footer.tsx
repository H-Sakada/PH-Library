import Link from 'next/link';
import { BookOpen, ShieldCheck, QrCode, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Peng Hong Library
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
              Secure digital publication and reading portal for academic textbooks, commercial monographs, and student study materials. Built with proprietary canvas-protection to prevent unauthorized copying.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <Lock className="h-3.5 w-3.5 text-indigo-600" />
                <span>Encrypted Canvas Reader</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <QrCode className="h-3.5 w-3.5 text-rose-600" />
                <span>ABA PayWay & KHQR</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Dynamic Watermark</span>
              </div>
            </div>
          </div>

          {/* Academic Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Academic Portal
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-600 transition-colors">
                  All Textbooks
                </Link>
              </li>
              <li>
                <Link href="/my-library" className="hover:text-indigo-600 transition-colors">
                  Student Shelf
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">
                  Publisher Dashboard
                </Link>
              </li>
              <li>
                <span className="text-slate-400 text-xs">Royal University of Law and Economics (RULE)</span>
              </li>
            </ul>
          </div>

          {/* Payment Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Payment Security
            </h4>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-xs text-slate-500">
                Payments are processed through the National Bank of Cambodia’s KHQR switch via ABA Bank PayWay merchant gateway.
              </p>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Instant Activation
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Scan QR with ABA Mobile to unlock your book immediately.
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800">
          © 2026 Peng Hong Academic Library. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
