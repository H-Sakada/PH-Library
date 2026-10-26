'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState<number>(300);
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
      }, 1200);
    }, 1000);
  };

  const khqrSvg = generateSimulatedKhqrSvg(book.priceUSD, book.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm rounded-xl bg-white shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
              ABA
            </span>
            <span className="text-xs font-bold text-stone-800">
              PayWay (KHQR)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 text-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-center">
          {isSuccess ? (
            <div className="py-6">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
              <h4 className="mt-3 text-base font-bold text-stone-900">
                Payment Received
              </h4>
              <p className="mt-1 text-xs text-stone-500">
                Your book has been unlocked successfully.
              </p>
            </div>
          ) : (
            <div>
              {/* Amount */}
              <div>
                <p className="text-xs text-stone-500 truncate">{book.title}</p>
                <div className="mt-1 text-2xl font-black text-stone-900">
                  ${book.priceUSD.toFixed(2)}
                  <span className="text-xs font-normal text-stone-500 ml-1">
                    / ៛{book.priceKHR.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="mx-auto my-4 h-56 w-56 rounded-lg border border-stone-200 p-1.5 relative">
                <div 
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: khqrSvg }}
                />
                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    <p className="mt-2 text-xs font-semibold text-stone-700">Verifying...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400">
                <Clock className="h-3 w-3" />
                <span>Expires in {minutes}:{seconds}</span>
              </div>

              {/* Instant Test Action */}
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Simulate Payment (Unlock Book)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
