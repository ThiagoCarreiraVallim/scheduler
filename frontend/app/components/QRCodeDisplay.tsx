'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { whatsappApi } from '@/lib/api';

export default function QRCodeDisplay({ onReady }: { onReady: () => void }) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkQrCode = async () => {
      try {
        const data = await whatsappApi.getQrCode();
        setQrCode(data.qrCode);
        setIsReady(data.isReady);
        
        if (data.isReady) {
          onReady();
        }
      } catch (err) {
        setError('Failed to connect to backend');
        console.error(err);
      }
    };

    // Check immediately
    checkQrCode();

    // Poll every 3 seconds
    const interval = setInterval(checkQrCode, 3000);

    return () => clearInterval(interval);
  }, [onReady]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-semibold">{error}</p>
        <p className="text-sm text-red-500 mt-2">Make sure the backend is running</p>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg">
        <svg className="w-16 h-16 text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-800 font-semibold text-xl">WhatsApp Connected!</p>
        <p className="text-green-600 text-sm mt-2">You can now schedule messages</p>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">Waiting for QR Code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
      <p className="text-gray-600 mb-6 text-center">
        Open WhatsApp on your phone and scan this QR code
      </p>
      <div className="bg-white p-4 rounded-lg border-4 border-gray-200">
        <QRCodeSVG value={qrCode} size={256} />
      </div>
      <p className="text-sm text-gray-500 mt-4">
        QR Code refreshes automatically
      </p>
    </div>
  );
}
