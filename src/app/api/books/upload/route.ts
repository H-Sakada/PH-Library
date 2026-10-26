import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import { Book } from '@/types/book';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. Verify Admin PIN
    const pin = formData.get('pin')?.toString() || '';
    const configuredPin = process.env.ADMIN_PIN || '1234';

    if (pin !== configuredPin) {
      return NextResponse.json(
        { error: 'Invalid Admin PIN. Access denied.' },
        { status: 401 }
      );
    }

    // 2. Parse Book Fields
    const title = formData.get('title')?.toString().trim();
    const category = formData.get('category')?.toString() as 'Law' | 'Economics';
    const priceUSD = parseFloat(formData.get('priceUSD')?.toString() || '5.00');
    const priceKHR = parseInt(formData.get('priceKHR')?.toString() || '20000', 10);
    const previewPages = parseInt(formData.get('previewPages')?.toString() || '3', 10);
    const totalPages = parseInt(formData.get('totalPages')?.toString() || '10', 10);
    const description = formData.get('description')?.toString().trim() || '';
    const file = formData.get('file') as File | null;

    if (!title || !category || !['Law', 'Economics'].includes(category)) {
      return NextResponse.json(
        { error: 'Missing required book title or invalid category.' },
        { status: 400 }
      );
    }

    // Generate unique ID and clean filename
    const idSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const bookId = `${idSlug}-${Date.now().toString().slice(-4)}`;
    const storagePath = `textbooks/${bookId}.pdf`;

    let uploadedStoragePath = storagePath;

    // 3. Upload PDF to Private Supabase Storage Bucket if configured
    if (isSupabaseConfigured() && file) {
      const adminSupabase = getSupabaseAdminClient();
      if (adminSupabase) {
        const fileBuffer = await file.arrayBuffer();
        const { error: uploadError } = await adminSupabase.storage
          .from('books')
          .upload(storagePath, fileBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          return NextResponse.json(
            { error: `Storage upload failed: ${uploadError.message}` },
            { status: 500 }
          );
        }

        // Insert metadata row into Supabase books table
        const { error: dbError } = await adminSupabase.from('books').insert({
          id: bookId,
          title,
          author: 'Prof. Lay PengHong',
          category,
          price_usd: priceUSD,
          price_khr: priceKHR,
          description,
          total_pages: totalPages,
          preview_pages: previewPages,
          storage_path: storagePath,
          publisher: 'Royal University of Law and Economics (RULE)',
        });

        if (dbError) {
          console.error('Supabase database error:', dbError);
          return NextResponse.json(
            { error: `Database insert failed: ${dbError.message}` },
            { status: 500 }
          );
        }
      }
    }

    // 4. Return created book object
    const newBook: Book = {
      id: bookId,
      title,
      author: 'Prof. Lay PengHong',
      category,
      priceUSD,
      priceKHR,
      description,
      totalPages,
      previewPages,
      publishDate: '2026 Edition',
      publisher: 'Royal University of Law and Economics (RULE)',
      tableOfContents: [
        { title: 'Introduction & Course Syllabus', page: 1 },
        { title: 'Chapter 1: Foundational Framework', page: 2 },
        { title: 'Chapter 2: Core Analysis', page: 3 },
        { title: 'Chapter 3: Advanced Principles (Protected)', page: Math.min(previewPages + 1, totalPages) },
      ],
      pages: [
        {
          pageNumber: 1,
          chapterTitle: 'Introduction & Course Syllabus',
          isSample: true,
          paragraphs: [
            description || 'Welcome to this course textbook by Prof. Lay PengHong.',
            'Course readings and case studies must be prepared prior to seminar sessions.',
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
          pageNumber: previewPages + 1,
          chapterTitle: `Chapter ${previewPages + 1}: Restricted Content`,
          isSample: false,
          paragraphs: [
            '🔒 [RESTRICTED] Full student textbook access requires payment confirmation via ABA PayWay.',
          ],
        },
      ],
    };

    return NextResponse.json({
      success: true,
      book: newBook,
      isSupabaseActive: isSupabaseConfigured(),
    });
  } catch (err: unknown) {
    console.error('Book upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
