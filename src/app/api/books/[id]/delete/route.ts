import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, isSupabaseConfigured } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { pin } = await request.json();
    const configuredPin = process.env.ADMIN_PIN || '1234';

    if (pin !== configuredPin) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid Admin PIN' },
        { status: 401 }
      );
    }

    if (isSupabaseConfigured()) {
      const admin = getSupabaseAdminClient();
      if (admin) {
        // Delete record from database
        await admin.from('books').delete().eq('id', id);
        // Also remove file from private storage bucket
        await admin.storage.from('books').remove([`textbooks/${id}.pdf`]);
      }
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    console.error('Delete book error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
