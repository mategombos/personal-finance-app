'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { scanReceipt, fileToBase64, ScannedReceipt } from '@/lib/receiptScanner';
import { clsx } from 'clsx';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

interface Props {
  onResult: (data: ScannedReceipt) => void;
}

export function ReceiptScanner({ onResult }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError(null);

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image is too large. Maximum size is 10 MB.');
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await scanReceipt(base64, file.type || 'image/jpeg');
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        title="Scan receipt with AI"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
          !loading
            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800'
        )}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Camera className="h-3.5 w-3.5" />
        )}
        {loading ? 'Scanning…' : 'Scan Receipt'}
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
