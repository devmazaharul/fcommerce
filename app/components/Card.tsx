'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/utils';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { StoreConfigaration } from '@/constant';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const addToCart = useCartStore((pre) => pre.addToCart);
  const cartList = useCartStore((pre) => pre.cart);
  const updateQuantity = useCartStore((pre) => pre.updateQuantity);
  const router = useRouter();

  const {
    name,
    price,
    discount,
    image,
    slug,
    id,
    discount_status,
    short_desc,
  } = product;

  const discountedPrice = discount_status ? +(price - (price * discount) / 100) : price;
  const hasDiscount = discount_status && discount > 0;
  const findCart = cartList.find((item) => item.id === id);
  const maxCartQuantity = StoreConfigaration.product.cart.max_add_tocart;

  const handleOrder = () => {
    toast.success('Added to cart!');
    addToCart({ ...product });
    router.push('/cart');
  };

  const handleQuantityUpdate = (quantity: number) => {
    if (quantity > maxCartQuantity) {
      toast.error(`You can't add more than ${maxCartQuantity} of this item.`);
      return;
    }
    updateQuantity(id, quantity);
  };

  return (
    <article
      className={`group relative rounded-2xl shadow-2xl shadow-gray-100 border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1`}
      aria-labelledby={`product-${product.id}-title`}
      tabIndex={0}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
        <Link
          href={`/products/${slug}`}
          aria-label={`Open ${name} product page`}
          className="block w-full h-full"
        >
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center text-xs font-bold px-3 py-1 rounded-md bg-red-500 text-white shadow-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">



        <Link
          href={`/products/${slug}`}
          aria-label={`Open ${name} product page`}
        >
          <h3
            id={`product-${product.id}-title`}
           className="text-lg font-semibold text-gray-800 truncate"
          >
            {name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">{short_desc}</p>
        </Link>

        {/* Price Section */}
        <div className="mt-4 flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-xl font-extrabold ${StoreConfigaration.components.price_text_color}`}>
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-lg line-through text-gray-400">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart/Quantity Controls */}
        {findCart ? (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handleQuantityUpdate(findCart.quantity - 1)}
              disabled={findCart.quantity <= 1}
              className="p-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={20} />
            </button>

            <span className="text-lg font-semibold px-4 text-gray-900">
              {findCart.quantity}
            </span>

            <button
              onClick={() => handleQuantityUpdate(findCart.quantity + 1)}
              disabled={findCart.quantity >= maxCartQuantity}
              className="p-2 bg-gray-200 text-gray-700 cursor-pointer font-bold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleOrder}
            aria-label={`Add ${name} to cart`}
            className={`mt-4 cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl  text-white transition-all duration-300 shadow-md transform hover:scale-105 ${StoreConfigaration.components.btn_bg} hover:${StoreConfigaration.components.btn_bg_hover}`}
          >
            <ShoppingCart size={18} />
            <span>Order now</span>
          </button>
        )}
      </div>
    </article>
  );
}