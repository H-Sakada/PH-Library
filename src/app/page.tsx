'use client';

import { useState } from 'react';
import { Search, BookOpen, ShieldCheck, QrCode, Lock, GraduationCap, Sparkles } from 'lucide-react';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { BookCard } from '@/components/BookCard';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Law', 'Economics', 'Technology', 'Business'];

  const filteredBooks = MOCK_BOOKS.filter((book) => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 py-16 sm:py-24 text-white">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-indigo-400" />
            <span>Academic Portal • Royal University of Law and Economics (RULE)</span>
          </div>

          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Protected Digital Books & <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
              Instant ABA PayWay Access
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Read authorized academic textbooks and commercial law monographs. Preview sample chapters free, then unlock full books instantly via National Bank KHQR & ABA Mobile.
          </p>

          {/* Search Box */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by book title, author, or legal topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/90 py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 shadow-xl backdrop-blur-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Key Security Pillars */}
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xs">
              <Lock className="h-5 w-5 text-amber-400" />
              <h4 className="mt-2 text-xs font-bold text-white">Locked PDF Canvas</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Anti-download & anti-print protection</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xs">
              <QrCode className="h-5 w-5 text-rose-400" />
              <h4 className="mt-2 text-xs font-bold text-white">ABA PayWay</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Instant unlock with Bakong KHQR</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h4 className="mt-2 text-xs font-bold text-white">Student Watermark</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Dynamic email & ID stamps on each page</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xs">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <h4 className="mt-2 text-xs font-bold text-white">Free Preview</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Read first 2–3 chapters before paying</p>
            </div>
          </div>

        </div>
      </section>

      {/* CATALOG SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Category Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Course Books & Publications
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredBooks.length} available textbooks
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="my-16 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-slate-700 dark:text-slate-300">
              No matching books found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search query or choosing another category.
            </p>
          </div>
        )}

      </section>

      {/* HOW IT WORKS / WORKFLOW BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-12 text-white border border-slate-800">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Workflow Guide
            </span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-black">
              How the Locked-PDF Reader Works
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our architecture protects your published digital assets from piracy while offering students a fast, seamless checkout experience through ABA Bank.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-black text-sm">
                01
              </div>
              <h4 className="mt-4 text-base font-bold">1. Free Sample Preview</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Students can browse the catalog and read the first 2 to 3 chapters in the web reader without logging in or paying.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600/20 text-rose-400 font-black text-sm">
                02
              </div>
              <h4 className="mt-4 text-base font-bold">2. Scan ABA PayWay KHQR</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                When reaching locked pages, a modal displays the dynamic KHQR code. Scan using ABA Mobile or any Bakong app.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 font-black text-sm">
                03
              </div>
              <h4 className="mt-4 text-base font-bold">3. Canvas Stream & Watermark</h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Upon payment confirmation, the rest of the book renders into HTML5 canvas with a non-removable translucent watermark of the student&apos;s email.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
