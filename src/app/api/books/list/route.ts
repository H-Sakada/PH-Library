import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_BOOKS } from '@/lib/mock-data';
import { Book } from '@/types/book';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const supabaseBooks: Book[] = data.map((row) => ({
            id: row.id,
            title: row.title,
            author: row.author,
            category: row.category,
            priceUSD: parseFloat(row.price_usd),
            priceKHR: parseInt(row.price_khr, 10),
            description: row.description || '',
            totalPages: row.total_pages || 10,
            previewPages: row.preview_pages || 3,
            publishDate: '2026 Edition',
            publisher: row.publisher || 'Royal University of Law and Economics (RULE)',
            tableOfContents: [
              { title: 'Introduction & Course Syllabus', page: 1 },
              { title: 'Chapter 1: Foundational Framework', page: 2 },
              { title: 'Chapter 2: Core Analysis', page: 3 },
              { title: 'Chapter 3: Advanced Principles', page: Math.min(row.preview_pages + 1, row.total_pages) },
            ],
            pages: [
              {
                pageNumber: 1,
                chapterTitle: 'Introduction & Course Syllabus',
                isSample: true,
                paragraphs: [
                  row.description || 'Welcome to this course textbook by Prof. Lay PengHong.',
                  'Assigned readings and legal analysis must be prepared prior to class.',
                ],
              },
              {
                pageNumber: 2,
                chapterTitle: 'Chapter 1: Foundational Framework',
                isSample: true,
                paragraphs: [
                  'Foundational legal and economic principles applicable under Cambodian statutory law.',
                ],
              },
              {
                pageNumber: row.preview_pages + 1,
                chapterTitle: 'Restricted Material',
                isSample: false,
                paragraphs: [
                  '🔒 [RESTRICTED] Full student textbook access requires payment confirmation via ABA PayWay.',
                ],
              },
            ],
          }));

          return NextResponse.json({
            books: supabaseBooks,
            source: 'supabase',
          });
        }
      }
    }

    // Fallback to default mock textbooks
    return NextResponse.json({
      books: MOCK_BOOKS,
      source: 'local',
    });
  } catch (err: unknown) {
    console.error('Fetch books error:', err);
    return NextResponse.json({ books: MOCK_BOOKS, source: 'fallback' });
  }
}
