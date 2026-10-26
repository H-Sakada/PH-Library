'use client';

import { Purchase } from '@/types/book';
import { CURRENT_STUDENT } from './mock-data';

const STORAGE_KEY_PURCHASES = 'penghong_library_purchases';

// Initial mock purchases for demonstration
const DEFAULT_PURCHASES: Purchase[] = [
  // You can leave empty or give 1 purchased book for quick testing
];

export function getPurchases(): Purchase[] {
  if (typeof window === 'undefined') return DEFAULT_PURCHASES;
  try {
    const data = localStorage.getItem(STORAGE_KEY_PURCHASES);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(DEFAULT_PURCHASES));
      return DEFAULT_PURCHASES;
    }
    return JSON.parse(data) as Purchase[];
  } catch {
    return DEFAULT_PURCHASES;
  }
}

export function isBookPurchased(bookId: string): boolean {
  const purchases = getPurchases();
  return purchases.some((p) => p.bookId === bookId && p.status === 'completed');
}

export function recordPurchase(
  bookId: string,
  amountUSD: number,
  amountKHR: number,
  paymentMethod: 'aba_payway' = 'aba_payway',
  transactionId?: string
): Purchase {
  const purchases = getPurchases();
  
  // Check if already purchased
  const existing = purchases.find((p) => p.bookId === bookId);
  if (existing) {
    return existing;
  }

  const newPurchase: Purchase = {
    id: `pur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    bookId,
    userId: CURRENT_STUDENT.id,
    userEmail: CURRENT_STUDENT.email,
    userName: CURRENT_STUDENT.fullName,
    amountUSD,
    amountKHR,
    paymentMethod,
    transactionId: transactionId || `ABA-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  const updated = [newPurchase, ...purchases];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(updated));
    // Dispatch storage event so other components update reactively
    window.dispatchEvent(new Event('purchases_updated'));
  }

  return newPurchase;
}

export function revokePurchase(bookId: string): void {
  if (typeof window === 'undefined') return;
  const purchases = getPurchases().filter((p) => p.bookId !== bookId);
  localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(purchases));
  window.dispatchEvent(new Event('purchases_updated'));
}

export function resetAllPurchases(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify([]));
  window.dispatchEvent(new Event('purchases_updated'));
}
