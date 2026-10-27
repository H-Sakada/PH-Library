import { createHmac } from 'crypto';

export interface PaywayQrSuccess {
  success: true;
  tranId: string;
  qrString: string;
  qrImage: string;
  abapayDeeplink: string;
  amount: number;
  currency: string;
}

export interface PaywayQrFailure {
  success: false;
  error: string;
}

export type PaywayQrResult = PaywayQrSuccess | PaywayQrFailure;

export interface PaywayCheckResult {
  success: boolean;
  tranId: string;
  status: number;
  description: string;
  paymentStatus: string;
  isPaid: boolean;
  error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value === 'string') {
    return value;
  }
  return '';
}

function getNumberField(record: Record<string, unknown>, key: string, fallback = 0): number {
  const value = record[key];
  if (typeof value === 'number') {
    return value;
  }
  return fallback;
}

export function getPaywayConfig() {
  const merchantId = process.env.ABA_PAYWAY_MERCHANT_ID || '';
  const apiKey = process.env.ABA_PAYWAY_API_KEY || '';
  const apiUrl = process.env.ABA_PAYWAY_API_URL || 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase';

  let baseUrl = 'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments';
  if (apiUrl.includes('/api/payment-gateway/v1/payments')) {
    const parts = apiUrl.split('/api/payment-gateway/v1/payments');
    baseUrl = `${parts[0]}/api/payment-gateway/v1/payments`;
  }

  return {
    merchantId,
    apiKey,
    baseUrl,
    isConfigured: merchantId.length > 0 && apiKey.length > 0,
  };
}

export function getPaywayTimestamp(): string {
  return new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
}

export function generatePaywayTransactionId(): string {
  const dateStr = Date.now().toString().slice(-6);
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `TRX${dateStr}${randomStr}`;
}

export function generatePaywayHash(dataToHash: string, apiKey: string): string {
  return createHmac('sha512', apiKey).update(dataToHash).digest('base64');
}

export async function requestPaywayQr(options: {
  tranId?: string;
  amount: number;
  currency?: string;
}): Promise<PaywayQrResult> {
  const config = getPaywayConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      error: 'ABA PayWay credentials are not configured in environment variables.',
    };
  }

  const reqTime = getPaywayTimestamp();
  const tranId = options.tranId || generatePaywayTransactionId();
  const amountStr = options.amount.toFixed(2);
  const currency = options.currency || 'USD';
  const paymentOption = 'abapay_khqr';

  const stringToHash = `${reqTime}${config.merchantId}${tranId}${amountStr}${paymentOption}${currency}`;
  const hash = generatePaywayHash(stringToHash, config.apiKey);

  const payload = {
    req_time: reqTime,
    merchant_id: config.merchantId,
    tran_id: tranId,
    amount: amountStr,
    currency,
    payment_option: paymentOption,
    hash,
  };

  try {
    const response = await fetch(`${config.baseUrl}/generate-qr`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const parsedData: unknown = JSON.parse(responseText);

    if (!isRecord(parsedData)) {
      return {
        success: false,
        error: 'Invalid response received from ABA PayWay server.',
      };
    }

    const qrImage = getStringField(parsedData, 'qrImage');
    const qrString = getStringField(parsedData, 'qrString');
    const abapayDeeplink = getStringField(parsedData, 'abapay_deeplink');

    if (qrImage.length > 0 || qrString.length > 0) {
      return {
        success: true,
        tranId,
        qrImage,
        qrString,
        abapayDeeplink,
        amount: options.amount,
        currency,
      };
    }

    const statusObj = parsedData['status'];
    let errorMessage = 'Failed to generate QR code from ABA PayWay.';
    if (isRecord(statusObj)) {
      const msg = getStringField(statusObj, 'message');
      if (msg.length > 0) {
        errorMessage = msg;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error communicating with ABA PayWay.';
    return {
      success: false,
      error: message,
    };
  }
}

export async function checkPaywayTransactionStatus(tranId: string): Promise<PaywayCheckResult> {
  const config = getPaywayConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      tranId,
      status: -1,
      description: 'Credentials not configured',
      paymentStatus: 'ERROR',
      isPaid: false,
      error: 'ABA PayWay credentials are not configured.',
    };
  }

  const reqTime = getPaywayTimestamp();
  const stringToHash = `${reqTime}${config.merchantId}${tranId}`;
  const hash = generatePaywayHash(stringToHash, config.apiKey);

  const payload = {
    req_time: reqTime,
    merchant_id: config.merchantId,
    tran_id: tranId,
    hash,
  };

  try {
    const response = await fetch(`${config.baseUrl}/check-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const parsedData: unknown = JSON.parse(responseText);

    if (!isRecord(parsedData)) {
      return {
        success: false,
        tranId,
        status: -1,
        description: 'Invalid server response',
        paymentStatus: 'UNKNOWN',
        isPaid: false,
      };
    }

    const status = getNumberField(parsedData, 'status', -1);
    const description = getStringField(parsedData, 'description');
    const paymentStatus = getStringField(parsedData, 'payment_status');

    const normalizedPaymentStatus = paymentStatus.toUpperCase();
    const isPaid = status === 0 || normalizedPaymentStatus === 'APPROVED' || normalizedPaymentStatus === 'SUCCESS';

    return {
      success: true,
      tranId,
      status,
      description,
      paymentStatus,
      isPaid,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to query transaction status.';
    return {
      success: false,
      tranId,
      status: -1,
      description: message,
      paymentStatus: 'ERROR',
      isPaid: false,
      error: message,
    };
  }
}
