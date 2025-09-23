'use client';
import { Concert_One } from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store';
import { usePathname } from 'next/navigation';
import { StoreConfigaration } from '@/constant';

// Signature-style font
const logoFont =   Concert_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Header() {
  const totalItems = useCartStore((state) => state.totalItems());
  const pathName = usePathname();

  if (pathName === "/checkout") {
    return null;
  }

  return (
    <header className="w-full shadow-lg shadow-gray-100 border-b border-b-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-10 py-4 flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link 
          href="/" 
          className={`text-3xl md:text-4xl font-bold text-gray-800 tracking-wide hover:text-gray-900 transition-colors ${logoFont.className}`}
        >
          {StoreConfigaration.storeInfo.name}
        </Link>

        {/* Right: Cart */}
        <Link href="/cart" className="relative flex items-center group">
          <ShoppingBag  
            size={25} 
            className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300" 
          />
          
          {/* Cart Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
