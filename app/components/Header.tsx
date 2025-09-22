'use client';
import {Agdasima ,Acme} from 'next/font/google';
import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store';
import { usePathname } from 'next/navigation';
import { StoreConfigaration } from '@/constant';

const fontHeader=Acme({
weight:"400",
style:"normal",
subsets:["latin"]
})

export default function Header() {
  const totalItems = useCartStore((state) => state.totalItems());

    const pathName=usePathname()

      if(pathName=="/checkout"){
          return 
      }
  return (
    <header className="w-full  shadow-2xl shadow-gray-100 border-b  border-b-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-10 py-4 flex justify-between items-center">
        
        {/* Left: Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-bold  uppercase text-gray-700">
          <span className={fontHeader.className}>
            {StoreConfigaration.storeInfo.name}
          </span>
        </Link>

        {/* Right: Cart */}
        <Link href="/cart" className="relative flex items-center">
          <ShoppingCart size={28} className="text-gray-700 hover:text-gray-900 transition-colors" />
          
          {/* Cart Badge */}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
