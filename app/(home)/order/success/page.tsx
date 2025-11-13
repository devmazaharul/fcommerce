'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id') ?? 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white rounded-xl p-10 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">✅ Payment Successful!</h1>
        <p className="text-lg text-green-800">
          Payment ID: <strong>{paymentId}</strong>
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;
