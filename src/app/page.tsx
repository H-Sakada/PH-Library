'use client';

import { useState, useEffect } from 'react';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { BookCard } from '@/components/BookCard';
import { Book } from '@/types/book';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Law' | 'Economics'>('All');
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);

  useEffect(() => {
    fetch('/api/books/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.books && Array.isArray(data.books) && data.books.length > 0) {
          setBooks(data.books);
        }
      })
      .catch(() => {
        // Fallback to MOCK_BOOKS
      });
  }, []);

  const categories: Array<'All' | 'Law' | 'Economics'> = ['All', 'Law', 'Economics'];

  const filteredBooks = books.filter((book) => {
    if (selectedCategory === 'All') return true;
    return book.category === selectedCategory;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      
      {/* Simple Category Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900">
            Published Books
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Select a textbook to read the free sample or unlock full access.
          </p>
        </div>

        {/* 2 Categories + All */}
        <div className="flex gap-1.5 bg-stone-100 p-1 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books List (1 or 2 books) */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

    </div>
  );
}
