'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
      <p className="text-gray-700 text-lg font-medium">Loading...</p>
    </div>
  );
}
