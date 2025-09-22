'use client';

import { Product } from '@/types';
import Image from 'next/image';
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { StoreConfigaration } from '@/constant';

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

  const handleCart = () => {
    // If the product is already in the cart, navigate to the cart page
    if (findCurrentProduct) {
      router.push('/cart');
      return;
    }
    
    // Add to cart and then navigate
    addToCart({ ...product });
    toast.success(`${name} added to cart!`);
    router.push('/cart');
  };

  return (
    <div className=" min-h-screen ">
      <div className="container mx-auto md:px-4 py-12 lg:py-16">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12  p-6 lg:p-10 ">
          {/* Left: Product Image */}
          <div className="lg:w-1/2 relative overflow-hidden ">
            <div className="relative w-full aspect-square overflow-hidden group ">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 p-5 group-hover:scale-105"
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

          {/* Right: Product Details and Actions */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-sm text-gray-500 font-medium">
                {category}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {name}
              </h1>
              <p className="text-gray-600 text-lg">{short_desc}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span>SKU:</span>
                <span className="text-gray-800 font-semibold">{sku}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="mt-6 flex flex-col items-start gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-extrabold text-gray-700">{formatPrice(discountedPrice)}</span>
                {hasDiscount && (
                  <span className="line-through text-gray-400 text-xl">
                    {formatPrice(price)}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleCart}
              className={`mt-8 w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl  cursor-pointer text-lg transition-all duration-300
                ${findCurrentProduct
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md transform hover:scale-105'
                  : `${StoreConfigaration.components.btn_details_bg} ${StoreConfigaration.components.btn_details_text} hover:${StoreConfigaration.components.btn_details_bg_hover} shadow-md transform hover:scale-105`
                }`}
            >
              <ShoppingCart size={20} />
              <span>
                {findCurrentProduct ? 'Go to cart' : 'Order now'}
              </span>
            </button>
          </div>
        </div>

        {/* Product Long Description Section */}
        <div className="mt-12 p-6 lg:p-10  0">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4  ">
            Product Description
          </h2>
          <p className="text-gray-700 leading-relaxed">{long_desc}</p>
        </div>
      </div>
    </div>
  );
}