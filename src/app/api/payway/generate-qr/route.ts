import { NextRequest, NextResponse } from 'next/server';
import { requestPaywayQr } from '@/lib/payway-server';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
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

    const amountVal = rawBody['amount'];
    let amount = 0;
    if (typeof amountVal === 'number') {
      amount = amountVal;
    } else if (typeof amountVal === 'string') {
      amount = parseFloat(amountVal);
    }

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment amount' },
        { status: 400 }
      );
    }

    const currencyVal = rawBody['currency'];
    const currency = typeof currencyVal === 'string' && currencyVal.length > 0 ? currencyVal : 'USD';

    const tranIdVal = rawBody['tranId'];
    const tranId = typeof tranIdVal === 'string' && tranIdVal.length > 0 ? tranIdVal : undefined;

    const result = await requestPaywayQr({
      tranId,
      amount,
      currency,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
