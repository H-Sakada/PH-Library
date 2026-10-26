'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Upload, 
  BookOpen, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  FileCheck, 
  Lock, 
  Eye, 
  QrCode,
  CheckCircle,
  X
} from 'lucide-react';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { Book } from '@/types/book';

export default function AdminPage() {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // New book form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Law' as Book['category'],
    priceUSD: '4.50',
    priceKHR: '18000',
    previewPages: '3',
    totalPages: '12',
    description: '',
  });

  const handlePriceUSDChange = (usd: string) => {
    const num = parseFloat(usd) || 0;
    setFormData({
      ...formData,
      priceUSD: usd,
      priceKHR: Math.round(num * 4000).toString(),
    });
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) return;

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      priceUSD: parseFloat(formData.priceUSD) || 5,
      priceKHR: parseInt(formData.priceKHR) || 20000,
      description: formData.description || 'Newly published academic course book.',
      coverGradient: 'from-slate-900 via-indigo-950 to-blue-900',
      totalPages: parseInt(formData.totalPages) || 10,
      previewPages: parseInt(formData.previewPages) || 3,
      publishDate: '2026 Edition',
      publisher: 'RULE Academic Publications',
      isbn: `978-99950-${Math.floor(10 + Math.random() * 89)}-${Math.floor(10 + Math.random() * 89)}-${Math.floor(1 + Math.random() * 9)}`,
      tableOfContents: [
        { title: 'Introduction & Chapter 1', page: 1 },
        { title: 'Chapter 2: Core Analysis', page: 2 },
        { title: 'Chapter 3: Advanced Principles', page: 4 },
      ],
      pages: [
        {
          pageNumber: 1,
          chapterTitle: 'Introduction & Core Concepts',
          isSample: true,
          paragraphs: [
            formData.description || 'This course material introduces foundational principles and case studies.',
            'Course participants are required to examine statutory benchmarks and analytical frameworks.'
          ]
        },
        {
          pageNumber: 2,
          chapterTitle: 'Chapter 1: Foundational Structure',
          isSample: true,
          paragraphs: [
            'Analyzing structural developments under contemporary regulatory policies.'
          ]
        },
        {
          pageNumber: 4,
          chapterTitle: 'Chapter 2: Restricted Material',
          isSample: false,
          paragraphs: [
            '🔒 [RESTRICTED CONTENT] This page requires a licensed student account.'
          ]
        }
      ]
    };

    setBooks([newBook, ...books]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setFormData({
        title: '',
        author: '',
        category: 'Law',
        priceUSD: '4.50',
        priceKHR: '18000',
        previewPages: '3',
        totalPages: '12',
        description: '',
      });
    }, 1200);
  };

  const totalRevenueUSD = 345.50;
  const totalRevenueKHR = 1382000;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Publisher Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Book Publications & Sales Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload protected PDF textbooks, configure free preview limits, and manage ABA PayWay revenue.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-800 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Book</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Total Books</span>
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            {books.length}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">
            ✓ 100% Protected with Canvas DRM
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Total Readers</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
            142
          </p>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Active university student sessions
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">ABA PayWay Revenue</span>
            <QrCode className="h-5 w-5 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ${totalRevenueUSD}
            </span>
            <span className="text-xs font-bold text-slate-500">
              (៛{totalRevenueKHR.toLocaleString()})
            </span>
          </div>
          <p className="mt-1 text-xs text-rose-600 font-semibold">
            Settled to Merchant Account
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Protection Rate</span>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-600">
            0 Leaks
          </p>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Dynamic watermark on every page
          </p>
        </div>

      </div>

      {/* Publications Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Catalog Management
            </h3>
            <p className="text-xs text-slate-500">
              Manage preview limits, pricing, and view publication status.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {books.length} publications listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-6">Book Title & Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (USD / KHR)</th>
                <th className="py-3 px-4">Preview Policy</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {books.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                    <div className="font-bold">{b.title}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{b.author}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    ${b.priceUSD.toFixed(2)} <span className="text-slate-400 font-normal">/ ៛{b.priceKHR.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                    Pages 1–{b.previewPages} Free ({b.totalPages} total)
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Published
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/books/${b.id}`}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold p-1"
                      title="View Book Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/books/${b.id}/read`}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold p-1"
                      title="Open in Locked Reader"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PUBLISH NEW BOOK MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Publish Academic Book
                </h3>
                <p className="text-xs text-slate-500">
                  Upload PDF and configure preview restrictions.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-10 text-center animate-fade-in">
                <CheckCircle className="mx-auto h-16 w-16 text-emerald-500 animate-bounce" />
                <h4 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                  Book Published Successfully!
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Protected with Canvas DRM and registered in the catalog.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateBook} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cambodian Intellectual Property Law"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Author / Professor *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Peng Hong"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Book['category'] })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                    >
                      <option value="Law">Law</option>
                      <option value="Economics">Economics</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Price (USD $)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={formData.priceUSD}
                      onChange={(e) => handlePriceUSDChange(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Price (KHR ៛)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.priceKHR}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Free Preview Pages
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.previewPages}
                      onChange={(e) => setFormData({ ...formData, previewPages: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">Chapters after this require ABA payment</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Total Book Pages
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.totalPages}
                      onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Simulated File Upload Drag & Drop */}
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center dark:border-slate-700">
                  <Upload className="mx-auto h-8 w-8 text-indigo-600" />
                  <p className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Upload Manuscript PDF
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    PDF will be stored in an encrypted private vault and streamed only to authorized canvas sessions.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-800 transition-all cursor-pointer"
                  >
                    Publish to Catalog
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
