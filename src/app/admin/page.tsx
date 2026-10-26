'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Upload, 
  CheckCircle, 
  Trash2, 
  BookOpen, 
  ArrowLeft, 
  AlertCircle, 
  ShieldCheck, 
  Database 
} from 'lucide-react';
import { Book } from '@/types/book';
import { MOCK_BOOKS } from '@/lib/mock-data';

export default function AdminUploadPage() {
  const [pin, setPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Books list
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<'Law' | 'Economics'>('Law');
  const [priceUSD, setPriceUSD] = useState<string>('5.00');
  const [priceKHR, setPriceKHR] = useState<string>('20000');
  const [previewPages, setPreviewPages] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [description, setDescription] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // UI state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  // Load books
  const loadBooks = async () => {
    try {
      const res = await fetch('/api/books/list');
      const data = await res.json();
      if (data.books) {
        setBooks(data.books);
        setIsSupabaseActive(data.source === 'supabase');
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin.length > 0) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError('Invalid PIN. Default is 1234');
    }
  };

  const handlePriceChange = (val: string) => {
    setPriceUSD(val);
    const num = parseFloat(val) || 0;
    setPriceKHR((Math.round(num * 4000)).toString());
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setUploadErrorMessage('Please provide a book title.');
      return;
    }

    setIsUploading(true);
    setUploadErrorMessage(null);
    setUploadSuccessMessage(null);

    try {
      const fd = new FormData();
      fd.append('pin', pin);
      fd.append('title', title);
      fd.append('category', category);
      fd.append('priceUSD', priceUSD);
      fd.append('priceKHR', priceKHR);
      fd.append('previewPages', previewPages.toString());
      fd.append('totalPages', totalPages.toString());
      fd.append('description', description);
      if (selectedFile) {
        fd.append('file', selectedFile);
      }

      const res = await fetch('/api/books/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadSuccessMessage('✓ Book published successfully!');
      if (data.book) {
        setBooks([data.book, ...books]);
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setUploadErrorMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this published book?')) return;
    try {
      const res = await fetch(`/api/books/${bookId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== bookId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 1. PIN GATE VIEW
  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-4">
        <div className="w-full rounded-xl border border-stone-200 bg-white p-6 shadow-xs text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Lock className="h-5 w-5" />
          </div>

          <h2 className="mt-3 text-lg font-bold text-stone-900">
            Prof. Lay PengHong
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Enter Admin PIN to upload or manage course books.
          </p>

          <form onSubmit={handlePinSubmit} className="mt-5 space-y-3">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-center text-sm tracking-widest text-stone-900 focus:border-blue-700 focus:outline-none"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-red-600 font-medium">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 inline-block text-xs text-stone-400 hover:text-stone-600"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-stone-400 hover:text-stone-600 text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Site</span>
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-bold text-blue-700">Admin Mode</span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-stone-900">
            Course Book Publisher
          </h1>
          <p className="text-xs text-stone-500">
            Upload new textbooks to the private vault and manage student preview settings.
          </p>
        </div>

        {/* Cloud Connection Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs">
          <Database className="h-4 w-4 text-stone-500" />
          {isSupabaseActive ? (
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Supabase Storage Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-stone-600">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Local Storage Mode
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        
        {/* LEFT: UPLOAD FORM (7 COLS) */}
        <div className="md:col-span-7">
          <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Upload New Textbook
            </h2>

            {uploadSuccessMessage && (
              <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}

            {uploadErrorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>{uploadErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambodian Commercial Law & Regulations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none"
                />
              </div>

              {/* Category: Exactly Law or Economics */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'Law' | 'Economics')}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none bg-white"
                  >
                    <option value="Law">Law</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Prof. Lay PengHong"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500"
                  />
                </div>
              </div>

              {/* Price USD & KHR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={priceUSD}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Price (KHR ៛)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`៛${parseInt(priceKHR || '0', 10).toLocaleString()}`}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500"
                  />
                </div>
              </div>

              {/* Preview Pages Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Free Preview Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={previewPages}
                    onChange={(e) => setPreviewPages(parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-400">Chapters after this require ABA payment</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Total Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalPages}
                    onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Brief Course Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of course readings and topics covered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-blue-700 focus:outline-none"
                />
              </div>

              {/* PDF File Picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Select Manuscript (PDF)
                </label>
                <div className="rounded-lg border-2 border-dashed border-stone-300 p-4 text-center hover:border-stone-400 transition-colors">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="mt-1 text-[11px] text-stone-400">
                    PDF will be stored in your private vault with canvas copy-protection.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isUploading ? 'Uploading to Private Vault...' : 'Publish Book to Catalog'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT: CURRENTLY PUBLISHED BOOKS (5 COLS) */}
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
              Published Textbooks ({books.length})
            </h2>

            <div className="divide-y divide-stone-100">
              {books.map((b) => (
                <div key={b.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-bold text-stone-700">
                      {b.category}
                    </span>
                    <p className="mt-1 text-xs font-bold text-stone-900 truncate">
                      {b.title}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      ${b.priceUSD.toFixed(2)} (៛{b.priceKHR.toLocaleString()}) • Preview: {b.previewPages} pgs
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0 pt-1">
                    <Link
                      href={`/books/${b.id}/read`}
                      className="p-1 text-stone-400 hover:text-blue-700"
                      title="View Reader"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteBook(b.id)}
                      className="p-1 text-stone-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="rounded-xl bg-stone-50 border border-stone-200 p-4 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Canvas Protection Guaranteed</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Uploaded files are stored in a private object bucket. Direct downloading, printing, and right-click copying are blocked on student browsers.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
