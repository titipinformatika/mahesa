'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="size-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="size-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Terjadi Kesalahan</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Maaf, sistem mengalami kendala saat memuat data. 
        <span className="block mt-1 text-sm opacity-70 font-mono">[{error.message || 'Unknown Error'}]</span>
      </p>
      <Button 
        onClick={reset}
        className="gap-2"
      >
        <RefreshCcw className="size-4" />
        Coba Lagi
      </Button>
    </div>
  );
}
