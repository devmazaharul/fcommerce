'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { formatPrice } from '@/utils';
import { useCartStore } from '@/store';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { StoreConfigaration } from '@/constant';

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const router = useRouter();

  const totalPrice = useCartStore((state) => state.totalPrice());

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">
          Start adding items you love to your cart.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-gray-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className=" min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const price = item.discount_status
                ? item.price * (1 - item.discount / 100)
                : item.price;

              const itemTotal = price * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl shadow-2xl shadow-gray-50 border border-gray-200/60 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="w-28 h-28 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex-1 flex flex-col items-center sm:items-start gap-1 text-center sm:text-left">
                    <h2 className="font-bold text-lg text-gray-900">
                      {item.name}
                    </h2>
                    <div className="w-48">
                      <p className="text-sm text-gray-500 truncate overflow-hidden">
                        {item.short_desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-2 font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.quantity >= StoreConfigaration.product.cart.max_add_tocart-1) {
                            toast.error(
                              'Maximum 10 products allowed at a time!'
                            );
                          }
                          addToCart(item, 1);
                        }}
                        disabled={item.quantity >= StoreConfigaration.product.cart.max_add_tocart}
                        className="p-1 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase quantity"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3 sm:gap-2 sm:ml-auto">
                    <span className="text-xl font-extrabold text-gray-700">
                      {formatPrice(itemTotal)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-full cursor-pointer md:bg-red-100 md:hover:bg-red-200 hover:text-red-500 text-red-600 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1  p-6 rounded-2xl shadow-2xl shadow-gray-100 border border-gray-200/50 sticky top-8 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="font-medium">Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center text-gray-700 font-bold text-lg pt-4 border-t border-gray-200">
                <span>Total</span>
                <span className='font-extrabold'>{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button
              className="mt-6 w-full cursor-pointer py-3 bg-gray-700 text-white rounded-xl shadow-md hover:bg-gray-900 transition-colors duration-300"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link
              href="/products"
              className="mt-4 w-full text-center inline-block py-3  text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
