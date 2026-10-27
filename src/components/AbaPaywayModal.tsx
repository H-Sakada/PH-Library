'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';
import { Book, Purchase } from '@/types/book';
import { generateSimulatedKhqrSvg, generateTransactionId } from '@/lib/aba-payway';
import { recordPurchase } from '@/lib/storage';

interface AbaPaywayModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (purchase: Purchase) => void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function AbaPaywayModalContent({ book, onClose, onSuccess }: AbaPaywayModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [transactionId] = useState<string>(() => generateTransactionId());
  const [qrImage, setQrImage] = useState<string>('');
  const [abapayDeeplink, setAbapayDeeplink] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);
  const [isLiveGateway, setIsLiveGateway] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Generating QR code...');

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const completeUnlock = useCallback(
    (tranId: string) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      setIsProcessing(false);
      setIsSuccess(true);
      const purchase = recordPurchase(
        book.id,
        book.priceUSD,
        book.priceKHR,
        'aba_payway',
        `ABA-${tranId}`
      );
      setTimeout(() => {
        onSuccess(purchase);
      }, 1200);
    },
    [book, onSuccess]
  );

  // Initialize QR and polling on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadQrAndStartPolling() {
      try {
        const response = await fetch('/api/payway/generate-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: book.id,
            amount: book.priceUSD,
            tranId: transactionId,
          }),
        });

        const rawData: unknown = await response.json();
        if (isCancelled) return;

        if (isRecord(rawData) && rawData['success'] === true) {
          const liveQrImage = typeof rawData['qrImage'] === 'string' ? rawData['qrImage'] : '';
          const deeplink = typeof rawData['abapayDeeplink'] === 'string' ? rawData['abapayDeeplink'] : '';

          if (liveQrImage.length > 0) {
            setQrImage(liveQrImage);
            setAbapayDeeplink(deeplink);
            setIsLiveGateway(true);
            setStatusMessage('Scan with ABA Mobile or any Bakong App');
            setIsLoadingQr(false);

            // Start polling check-transaction every 3 seconds
            pollingRef.current = setInterval(async () => {
              try {
                const checkRes = await fetch(
                  `/api/payway/check-transaction?tranId=${encodeURIComponent(transactionId)}`
                );
                const checkData: unknown = await checkRes.json();
                if (isRecord(checkData)) {
                  const isPaid = typeof checkData['isPaid'] === 'boolean' ? checkData['isPaid'] : false;
                  if (isPaid) {
                    completeUnlock(transactionId);
                  }
                }
              } catch {
                // Ignore transient polling network errors
              }
            }, 3000);
            return;
          }
        }
      } catch {
        // Fallback to simulated mode
      }

      if (!isCancelled) {
        setIsLiveGateway(false);
        setStatusMessage('Demo Mode: Using Simulated KHQR');
        setIsLoadingQr(false);
      }
    }

    loadQrAndStartPolling();

    return () => {
      isCancelled = true;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [book.id, book.priceUSD, transactionId, completeUnlock]);

  // Expiry countdown timer
  useEffect(() => {
    if (isSuccess) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSuccess]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completeUnlock(transactionId);
    }, 800);
  };

  const simulatedKhqrSvg = generateSimulatedKhqrSvg(book.priceUSD, book.title);

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
            {isLiveGateway && (
              <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5">
                Live Sandbox
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 text-xs cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-center">
          {isSuccess ? (
            <div className="py-6">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 animate-bounce" />
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

              {/* QR Code Frame */}
              <div className="mx-auto my-3 h-56 w-56 rounded-lg border border-stone-200 p-1.5 relative flex items-center justify-center bg-white shadow-xs">
                {isLoadingQr ? (
                  <div className="flex flex-col items-center justify-center">
                    <RefreshCw className="h-7 w-7 text-red-600 animate-spin" />
                    <p className="mt-2 text-xs font-medium text-stone-600">
                      Generating ABA KHQR...
                    </p>
                  </div>
                ) : qrImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrImage}
                    alt="ABA PayWay KHQR"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    dangerouslySetInnerHTML={{ __html: simulatedKhqrSvg }}
                  />
                )}

                {isProcessing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-lg">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                    <p className="mt-2 text-xs font-semibold text-stone-700">
                      Verifying Payment...
                    </p>
                  </div>
                )}
              </div>

              {/* Status & Polling Notice */}
              {isLiveGateway ? (
                <div className="mb-2 flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Listening for payment...</span>
                </div>
              ) : (
                <p className="mb-2 text-[11px] text-stone-500">
                  {statusMessage}
                </p>
              )}

              {/* Deeplink for Mobile */}
              {abapayDeeplink && (
                <a
                  href={abapayDeeplink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:underline"
                >
                  <span>Open in ABA Mobile App</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {/* Expiry Timer */}
              <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400">
                <Clock className="h-3 w-3" />
                <span>Expires in {minutes}:{seconds}</span>
              </div>

              {/* Manual Immediate Unlock Option */}
              <button
                type="button"
                onClick={handleSimulatePayment}
                disabled={isProcessing}
                className="mt-3 w-full rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Simulate Payment (Unlock Book Now)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AbaPaywayModal(props: AbaPaywayModalProps) {
  if (!props.isOpen) return null;
  return <AbaPaywayModalContent {...props} />;
}
