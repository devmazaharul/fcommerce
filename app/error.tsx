'use client';
import './globals.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-6 max-w-md">
        An unexpected error has occurred. Please try refreshing the page or go back home.
      </p>

      <div className="flex gap-4">
        <Button
        variant={"outline"}
          onClick={() => reset()}
       className='cursor-pointer'
        >
          <RefreshCw size={20} />
          Try Again
        </Button>

        <Button
          onClick={() => router.push('/')}
      variant={"default"}
      className='cursor-pointer'
        >
          Home
        </Button>
      </div>
    </div>
  );
}
