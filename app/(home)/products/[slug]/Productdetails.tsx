'use client';

import { Product } from '@/types';
import Image from 'next/image';
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { StoreConfigaration } from '@/constant';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const {
    name,
    short_desc,
    long_desc,
    price,
    discount,
    discount_status,
    image,
    category,
    sku,
    id,
  } = product;

  const discountedPrice = discount_status
    ? +(price - (price * discount) / 100)
    : price;
  const hasDiscount = discount_status && discount > 0;

  const addToCart = useCartStore((pre) => pre.addToCart);
  const cartList = useCartStore((pre) => pre.cart);
  const findCurrentProduct = cartList.find((item) => item.id === id);
  const router = useRouter();

  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCart = () => {
    if (findCurrentProduct) {
      router.push('/cart');
      return;
    }

    addToCart({ ...product });
    toast.success(`${name} added to cart!`);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Image */}
          <div className="relative">
            <div className="relative w-full aspect-square overflow-hidden  group">
              {!imgLoaded && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
              )}
              <Image
                src={image}
                alt={name}
                fill
                className={`object-contain rounded-md p-6 transition-transform duration-500 group-hover:scale-105 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                onLoadingComplete={() => setImgLoaded(true)}
              />
            
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-6">
            {/* Meta */}
            <div className="text-sm text-gray-500">
              <span className="capitalize">{category}</span>
              <span className="mx-2">•</span>
              <span className="font-medium"> {sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {name}
            </h1>

            {/* Short Desc */}
            <p className="text-gray-600 text-lg">{short_desc}</p>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl md:text-4xl font-extrabold text-gray-800">
                {formatPrice(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="line-through text-lg text-gray-400">
                  {formatPrice(price)}
                </span>
              )}
              {hasDiscount && (
                <span className="px-2 py-0.5 bg-red-500 text-white font-medium text-sm rounded-md">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleCart}
              className={`w-fit flex items-center cursor-pointer justify-center gap-3 px-6 py-3 rounded-xl text-lg  transition-all duration-300 shadow-md
                ${
                  findCurrentProduct
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02]'
                    : `${StoreConfigaration.components.btn_details_bg} ${StoreConfigaration.components.btn_details_text} hover:${StoreConfigaration.components.btn_details_bg_hover} hover:scale-[1.02]`
                }`}
            >
              <ShoppingCart size={20} />
              {findCurrentProduct ? 'Go to cart' : 'Order now'}
            </button>
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-16  p-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{long_desc}</p>
        </div>
      </div>
    </div>
  );
}
