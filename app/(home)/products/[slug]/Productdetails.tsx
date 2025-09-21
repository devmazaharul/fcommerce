'use client';

import { Product } from '@/types';
import Image from 'next/image';
import React from 'react';
import { ShoppingCart} from 'lucide-react';
import { formatPrice } from '@/utils';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';

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
  const isAvailable = 1;

  const addToCart = useCartStore((pre) => pre.addToCart);
  const cartList = useCartStore((pre) => pre.cart);
  const findCurrentProduct = cartList.find((item) => item.id === id);
  const router = useRouter();

  const handleCart = () => {
    if (!findCurrentProduct) {
      addToCart({ ...product });
      router.push('/cart');
      return;
    }

    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 rounded-3xl shadow-2xl shadow-gray-100 p-6 lg:p-10 bg-white">
        {/* Left: Product Image */}
        <div className="lg:w-1/2 relative rounded-2xl overflow-hidden">
          <div className="relative w-full aspect-square overflow-hidden group">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>

          {hasDiscount && (
            <span className="absolute top-4 left-4 z-10 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-sm text-gray-500 font-medium">
              {category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 leading-tight">
              {name}
            </h1>
            <p className="text-gray-600 mt-1 text-md">{short_desc}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">
              SKU: <span className="text-gray-800 font-semibold">{sku}</span>
            </p>

            {/* Price section */}
            <div className="mt-4 flex flex-col items-start gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-xl md:text-2xl font-extrabold text-gray-600">
                  {formatPrice(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="line-through text-gray-400 text-lg">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleCart}
            className={`mt-6 w-full cursor-pointer flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300
              ${
                isAvailable
                  ? 'bg-gray-800 text-white hover:bg-gray-900 shadow-md transform hover:scale-105'
                  : 'bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
          >
            <ShoppingCart size={20} />
            <span>
              {findCurrentProduct && findCurrentProduct.quantity>0
                ? 'Go to cart'
                : 'Order now'}
            </span>
          </button>
        </div>
      </div>

      {/* Product Long Description */}
      <div className="mt-12 p-6 lg:p-10 ">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Product Description
        </h2>
        <p className="text-gray-700 leading-relaxed">{long_desc}</p>
      </div>
    </div>
  );
}
