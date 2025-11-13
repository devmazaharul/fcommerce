'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id') ?? 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center 0">
      <div className="bg-white rounded-2xl p-12  text-center max-w-md w-full transform transition duration-300 hover:scale-105">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-extrabold mb-4">Payment Successful!</h1>
        <p className="text-lg text-green-800 mb-2">
          Payment ID: <strong>{paymentId}</strong>
        </p>
        <p className="text-gray-600 text-sm mb-2">
          Thank you for your payment. You will receive a confirmation email shortly.
        </p>
        <Link href={"/"}>
        <Button className='cursor-pointer'>
           Go to Dashboard
        </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
