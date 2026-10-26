import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building, 
  QrCode, 
  ArrowLeft,
  Share2
} from 'lucide-react';
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        {/* Left Column: Book Cover Presentation (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
          <div className="sticky top-24 w-full max-w-sm">
            <div className={`relative aspect-[3/4] w-full rounded-2xl bg-gradient-to-br ${book.coverGradient} p-8 text-white shadow-2xl overflow-hidden flex flex-col justify-between`}>
              
              {/* Spine simulation */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/10 border-r border-white/20" />

              {/* Category pill */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                  {book.category}
                </span>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-xs">
                  {book.totalPages} Pages
                </span>
              </div>

              {/* Title & Author */}
              <div className="relative z-10 pl-2">
                <h1 className="text-2xl font-black tracking-tight leading-tight drop-shadow-md">
                  {book.title}
                </h1>
                <p className="mt-2 text-sm text-slate-200 font-medium">
                  {book.author}
                </p>
                <div className="mt-4 pt-3 border-t border-white/20 text-[11px] text-slate-300">
                  {book.publisher}
                </div>
              </div>

              {/* Decorative watermark */}
              <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full border-8 border-white/10 opacity-30 pointer-events-none" />
            </div>

            {/* Quick stats box under cover */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[10px] font-bold uppercase text-slate-400">Free Preview</span>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{book.previewPages} Pages</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                <span className="text-[10px] font-bold uppercase text-slate-400">Protection</span>
                <p className="text-sm font-black text-emerald-600">Canvas DRM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Description & Client Actions (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {book.category} Edition
              </span>
              <span className="text-xs text-slate-500">• {book.publishDate}</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {book.title}
            </h2>

            <p className="mt-2 text-base text-slate-600 dark:text-slate-400 font-medium">
              By <span className="text-indigo-600 dark:text-indigo-400 font-bold">{book.author}</span>
            </p>
          </div>

          {/* Client Purchase & Reader Action Card */}
          <BookDetailsClient book={book} />

          {/* Book Synopsis */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Course Synopsis & Overview
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {book.description}
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Publisher</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{book.publisher}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">ISBN Identifier</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">{book.isbn}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Payment Channel</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">ABA PayWay KHQR</span>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Table of Contents ({book.tableOfContents.length} Sections)
              </h3>
              <span className="text-xs text-slate-500">
                First {book.previewPages} pages free to read
              </span>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {book.tableOfContents.map((item, idx) => {
                const isLocked = item.page > book.previewPages;
                return (
                  <div key={idx} className="flex items-center justify-between py-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-600 font-bold text-xs dark:bg-slate-800 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isLocked ? (
                        <span className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          <Lock className="h-3 w-3" />
                          <span>Requires License</span>
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Free Sample
                        </span>
                      )}
                      <span className="text-xs text-slate-400 w-8 text-right font-mono">
                        p.{item.page}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
