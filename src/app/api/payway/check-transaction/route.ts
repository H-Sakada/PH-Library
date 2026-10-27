import { NextRequest, NextResponse } from 'next/server';
import { checkPaywayTransactionStatus } from '@/lib/payway-server';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tranId = searchParams.get('tranId') || searchParams.get('tran_id') || '';

    if (!tranId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const result = await checkPaywayTransactionStatus(tranId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    if (!isRecord(rawBody)) {
      return NextResponse.json(
        { success: false, error: 'Malformed request body' },
        { status: 400 }
      );
    }

    const tranIdVal = rawBody['tranId'] || rawBody['tran_id'];
    const tranId = typeof tranIdVal === 'string' ? tranIdVal : '';

    if (!tranId) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const result = await checkPaywayTransactionStatus(tranId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
