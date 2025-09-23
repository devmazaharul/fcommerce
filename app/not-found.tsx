'use client';
import './globals.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4 animate-bounce">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
        Oops! Page not found
      </h2>
      <p className="text-gray-500 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved. Go back
        to the homepage or try again.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => router.back()}
          variant={'outline'}
          className="cursor-pointer"
        >
          <ChevronLeft size={20} />
          Go Back
        </Button>

        <Link href="/">
          <Button className="cursor-pointer">Home</Button>
        </Link>
      </div>
    </div>
  );
}
