'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  BookOpen, 
  Lock, 
  ShieldCheck, 
  List, 
  Sun, 
  Moon, 
  Bookmark, 
  QrCode,
  AlertCircle
} from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { CURRENT_STUDENT } from '@/lib/mock-data';
import { isBookPurchased } from '@/lib/storage';
import { AbaPaywayModal } from './AbaPaywayModal';

interface LockedPdfViewerProps {
  book: Book;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';

export function LockedPdfViewer({ book }: LockedPdfViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ReaderTheme>('light');
  const [showToc, setShowToc] = useState<boolean>(false);
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check purchase status
  useEffect(() => {
    setIsPurchased(isBookPurchased(book.id));
    const handleUpdate = () => setIsPurchased(isBookPurchased(book.id));
    window.addEventListener('purchases_updated', handleUpdate);
    return () => window.removeEventListener('purchases_updated', handleUpdate);
  }, [book.id]);

  // Anti-piracy listeners (Prevent Print, Save, Inspect)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Print (Cmd+P or Ctrl+P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerSecurityNotice('Printing is disabled to protect copyrighted academic materials.');
      }
      // Prevent Save Page (Cmd+S or Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerSecurityNotice('Direct download of this protected text is disabled.');
      }
      // Prevent View Source (Cmd+U or Ctrl+U)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerSecurityNotice = (msg: string) => {
    setSecurityNotice(msg);
    setTimeout(() => setSecurityNotice(null), 3500);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePurchaseSuccess = (purchase: Purchase) => {
    setIsPurchased(true);
    setShowPayModal(false);
  };

  const isPageLocked = !isPurchased && currentPage > book.previewPages;
  const pageData = book.pages.find((p) => p.pageNumber === currentPage) || book.pages[0];

  // Theme styles
  const themeClasses: Record<ReaderTheme, { bg: string; pageBg: string; text: string; border: string }> = {
    light: {
      bg: 'bg-slate-200',
      pageBg: 'bg-white',
      text: 'text-slate-800',
      border: 'border-slate-300'
    },
    sepia: {
      bg: 'bg-[#f4ebd9]',
      pageBg: 'bg-[#fbf7ed]',
      text: 'text-[#433422]',
      border: 'border-[#e4d5be]'
    },
    dark: {
      bg: 'bg-slate-950',
      pageBg: 'bg-slate-900',
      text: 'text-slate-200',
      border: 'border-slate-800'
    }
  };

  const currentTheme = themeClasses[theme];
  const [formattedDate, setFormattedDate] = useState<string>('2026-10-26');

  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString('en-GB'));
  }, []);

  return (
    <div 
      ref={containerRef}
      onContextMenu={(e) => {
        e.preventDefault();
        triggerSecurityNotice('Right-click is protected on student digital copies.');
      }}
      className={`relative flex h-screen w-full flex-col select-none overflow-hidden ${currentTheme.bg} transition-colors duration-200`}
    >
      
      {/* 1. TOP HEADER TOOLBAR */}
      <header className="z-30 flex h-14 w-full items-center justify-between border-b border-slate-300/60 bg-white/95 px-4 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/books/${book.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </Link>

          <button
            onClick={() => setShowToc(!showToc)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
              showToc 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300' 
                : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200'
            }`}
          >
            <List className="h-4 w-4" />
            <span className="hidden md:inline">Contents</span>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {book.title}
            </h1>
            <p className="hidden sm:block text-[11px] text-slate-500 truncate">
              {book.author}
            </p>
          </div>
        </div>

        {/* Center / Right: Reader Options */}
        <div className="flex items-center gap-2">
          
          {/* Status Badge */}
          {isPurchased ? (
            <span className="hidden md:flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Full Access Unlocked</span>
            </span>
          ) : (
            <button
              onClick={() => setShowPayModal(true)}
              className="flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm hover:from-red-700 hover:to-rose-700 cursor-pointer"
            >
              <QrCode className="h-3 w-3" />
              <span>Unlock ($ {book.priceUSD.toFixed(2)})</span>
            </button>
          )}

          {/* Theme Selector */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`rounded-md p-1.5 text-xs ${theme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme('sepia')}
              title="Sepia Reading Mode"
              className={`rounded-md px-1.5 py-1 text-[11px] font-bold ${theme === 'sepia' ? 'bg-[#fbf7ed] text-[#433422] shadow-xs' : 'text-slate-500'}`}
            >
              Sepia
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Night Mode"
              className={`rounded-md p-1.5 text-xs ${theme === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500'}`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 px-1 py-0.5 text-xs dark:border-slate-700">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
              className="rounded p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
              className="rounded p-1 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Security alert toast */}
      {securityNotice && (
        <div className="absolute top-16 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in border border-rose-500/40">
          <AlertCircle className="h-4 w-4 text-rose-400" />
          <span>{securityNotice}</span>
        </div>
      )}

      {/* 2. MAIN READING CANVAS AREA */}
      <div className="relative flex flex-1 overflow-hidden">
        
        {/* Table of Contents Drawer */}
        {showToc && (
          <aside className="absolute left-0 top-0 bottom-0 z-20 w-72 border-r border-slate-300 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 overflow-y-auto animate-slide-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Table of Contents
              </span>
              <button 
                onClick={() => setShowToc(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {book.tableOfContents.map((item, idx) => {
                const isLockedItem = !isPurchased && item.page > book.previewPages;
                return (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        setCurrentPage(item.page);
                        setShowToc(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                        currentPage === item.page
                          ? 'bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isLockedItem && <Lock className="h-3 w-3 text-amber-500" />}
                        <span className="text-[11px] text-slate-400">p.{item.page}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}

        {/* Scrollable Document Stage */}
        <main className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center">
          
          {/* THE DIGITAL PAGE CONTAINER */}
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top' }}
            className={`relative min-h-[640px] w-full max-w-2xl rounded-2xl shadow-2xl transition-all duration-150 ${currentTheme.pageBg} ${currentTheme.border} border p-8 sm:p-14 overflow-hidden`}
          >
            
            {/* DYNAMIC ANTI-PIRACY SECURITY WATERMARK */}
            <div 
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-around overflow-hidden select-none opacity-[0.045] dark:opacity-[0.065]"
            >
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="whitespace-nowrap text-[15px] font-black uppercase tracking-widest text-slate-900 dark:text-white -rotate-25 transform"
                >
                  {CURRENT_STUDENT.email} • {CURRENT_STUDENT.studentId} • {formattedDate} • LICENSED COPY
                </div>
              ))}
            </div>

            {/* Page Header (Academic Folio) */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-[11px] font-semibold text-slate-400 dark:border-slate-800">
              <span className="truncate max-w-[70%]">{book.title}</span>
              <span>{book.publisher}</span>
            </div>

            {/* PAGE CONTENT */}
            <div className={`mt-8 space-y-5 ${currentTheme.text}`}>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-serif">
                {pageData.chapterTitle || `Page ${currentPage}`}
              </h2>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed font-serif">
                {pageData.paragraphs.map((para, i) => (
                  <p key={i} className="text-justify indent-6">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Page Footer */}
            <div className="mt-14 pt-6 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400 dark:border-slate-800">
              <span>{CURRENT_STUDENT.institution}</span>
              <span className="font-bold">Page {currentPage} of {book.totalPages}</span>
            </div>

            {/* 3. LOCKED OVERLAY (When reader hits a non-preview page without purchase) */}
            {isPageLocked && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md p-6 text-center animate-fade-in">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-xl shadow-rose-600/30">
                  <Lock className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                  Restricted Academic Content
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  You have reached the end of the free sample preview ({book.previewPages} pages). To continue reading Chapter 3 through Chapter 5 and access the examination review notes, complete the student fee payment.
                </p>

                {/* ABA PayWay Checkout Box */}
                <div className="mt-6 w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/90 p-5 text-left shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400">Unlock Full Access</span>
                      <p className="text-sm font-bold text-white truncate">{book.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-rose-400 leading-none">
                        ${book.priceUSD.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        ៛{book.priceKHR.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <ul className="my-3 space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Instant unlocking for <strong>{CURRENT_STUDENT.fullName}</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>Unlimited reading on mobile, tablet & desktop</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => setShowPayModal(true)}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-rose-600/30 hover:from-red-700 hover:to-rose-700 transition-all cursor-pointer"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Pay with ABA PayWay (KHQR)</span>
                  </button>
                </div>

                <button
                  onClick={() => setCurrentPage(book.previewPages)}
                  className="mt-4 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  ← Return to Preview Page {book.previewPages}
                </button>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* 3. BOTTOM NAVIGATION BAR */}
      <footer className="z-30 flex h-14 w-full items-center justify-between border-t border-slate-300/60 bg-white/95 px-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        
        {/* Left: Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Center: Page Slider & Info */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={book.totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="hidden md:block w-36 accent-indigo-600 h-1.5 cursor-pointer"
          />

          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            Page {currentPage} <span className="text-slate-400">/ {book.totalPages}</span>
          </span>

          {!isPurchased && currentPage <= book.previewPages && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
              Sample ({currentPage}/{book.previewPages})
            </span>
          )}
        </div>

        {/* Right: Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(book.totalPages, p + 1))}
          disabled={currentPage === book.totalPages}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
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
