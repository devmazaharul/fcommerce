'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const FaildPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
        </div>
      }
    >
      <FaildContent />
    </Suspense>
  );
};

const FaildContent = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id') ?? 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white rounded-2xl p-12  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-3xl font-extrabold text-red-700 mb-4">Payment Failed</h1>
        <p className="text-lg text-red-600 mb-2">
          Payment ID: <strong>{paymentId}</strong>
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Something went wrong. Please try again or contact support.
        </p>
        <Button className='cursor-pointer'>
          Retry Payment
        </Button>
      </div>
    </div>
  );
};

export default FaildPage;
