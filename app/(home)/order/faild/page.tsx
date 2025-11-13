'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const FaildPage: React.FC = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('id') || 'N/A';

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white rounded-xl p-10 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">❌ Payment Failed</h1>
        <p className="text-lg text-red-800">Payment ID: <strong>{paymentId}</strong></p>
        <p className="text-lg text-red-800">Please try again.</p>
      </div>
    </div>
  );
};

export default FaildPage;
