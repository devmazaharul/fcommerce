'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/utils";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";
import { StoreConfigaration } from "@/constant";

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

  const discountedPrice = discount_status
    ? +(price - (price * discount) / 100)
    : price;
  const hasDiscount = discount_status && discount > 0;
  const findcart = cartList.find((item) => item.id === id);

  const handleOrder = () => {
    toast.success("Add to cart");
    addToCart({ ...product });
    router.push("/cart");
  };

  return (
    <article
      className="group relative rounded-2xl shadow-2xl shadow-gray-100 border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
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
            className="object-cover transition-transform duration-700"
            priority={false}
          />
        </Link>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white shadow-md">
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
            className="text-base font-bold text-gray-900 leading-tight line-clamp-2"
          >
            {name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{short_desc}</p>
        </Link>

        {/* Price */}
        <div className="mt-4 flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-gray-600">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm line-through text-gray-400">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        {findcart ? (
          <div className="flex mt-4 py-2.5 items-center gap-2 w-fit mx-auto overflow-hidden">
            <button
              onClick={() => updateQuantity(findcart.id, findcart.quantity - 1)}
              disabled={findcart.quantity <= 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md cursor-pointer font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              -
            </button>

            <span className="px-4 py-1 bg-white text-gray-900 font-medium">
              {findcart.quantity}
            </span>

            <button
              onClick={() => {
                if (findcart.quantity >= StoreConfigaration.product.cart.max_add_tocart-1) {
                  toast.error("Maximum 10 products allowed at a time!");
                }
                addToCart(findcart, 1);
              }}
              disabled={findcart.quantity >= StoreConfigaration.product.cart.max_add_tocart}
              className="px-3 py-1 bg-gray-200 text-gray-700 cursor-pointer font-bold rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleOrder}
            aria-label={`Add ${name} to cart`}
            className="mt-4 cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 bg-gray-600 text-white hover:bg-gray-700 shadow-md"
          >
            <ShoppingCart size={18} />
            <span>Order now</span>
          </button>
        )}
      </div>
    </article>
  );
}
