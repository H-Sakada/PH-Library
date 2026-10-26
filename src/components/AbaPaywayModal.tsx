'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Shield, Clock, ExternalLink, Sparkles, Smartphone } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { CURRENT_STUDENT } from '@/lib/mock-data';
import { generateSimulatedKhqrSvg, generateTransactionId } from '@/lib/aba-payway';
import { recordPurchase } from '@/lib/storage';

interface AbaPaywayModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (purchase: Purchase) => void;
}

export function AbaPaywayModal({ book, isOpen, onClose, onSuccess }: AbaPaywayModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setIsProcessing(false);
      setIsSuccess(false);
      setTransactionId(generateTransactionId());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const purchase = recordPurchase(
        book.id,
        book.priceUSD,
        book.priceKHR,
        'aba_payway',
        `ABA-${transactionId}`
      );
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess(purchase);
      }, 1500);
    }, 1200);
  };

  const khqrSvg = generateSimulatedKhqrSvg(book.priceUSD, book.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ABA Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <div className="rounded bg-white px-2 py-0.5 text-xs font-black tracking-wider text-red-600">
              ABA
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">PayWay Checkout</h3>
              <p className="text-[11px] text-rose-100">National Bank KHQR Integrated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle className="h-10 w-10 animate-bounce" />
              </div>
              <h4 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
                Payment Completed!
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Transaction ID: ABA-{transactionId}
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {book.title}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  ✓ Full Book Unlocked for {CURRENT_STUDENT.fullName}
                </p>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Redirecting to your secure reader...
              </p>
            </div>
          ) : (
            <div>
              {/* Transaction Summary */}
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Item</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {book.title}
                    </p>
                    <p className="text-[11px] text-slate-500">Student: {CURRENT_STUDENT.fullName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black text-indigo-700 dark:text-indigo-400 leading-none">
                      ${book.priceUSD.toFixed(2)}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      ៛{book.priceKHR.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="my-5 flex flex-col items-center">
                <div className="relative h-64 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700">
                  <div 
                    className="h-full w-full"
                    dangerouslySetInnerHTML={{ __html: khqrSvg }}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-xs">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-red-600 border-t-transparent" />
                      <p className="mt-2 text-xs font-bold text-slate-700">Verifying transaction...</p>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5 text-rose-500" />
                  <span>QR expires in <strong className="text-slate-800 dark:text-slate-200">{minutes}:{seconds}</strong></span>
                </div>
              </div>

              {/* Mobile Deep Link simulation */}
              <div className="rounded-lg bg-rose-50 border border-rose-100 p-2.5 text-center text-xs text-rose-800 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300">
                <div className="flex items-center justify-center gap-1 font-semibold">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Supports ABA Mobile, Bakong, Wing & ACLEDA</span>
                </div>
              </div>

              {/* Testing / Simulator Button */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/30 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Simulate Payment & Unlock Now</span>
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  Demo Mode: Click above to test the payment unlock webhook workflow.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-emerald-600" />
            <span>256-bit Encrypted Session</span>
          </div>
          <span>Merchant: PengHong_RULE</span>
        </div>
      </div>
    </div>
  );
}
