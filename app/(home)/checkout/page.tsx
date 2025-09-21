'use client';
import React from 'react';
import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';
import { ShoppingCart, MapPin,  CreditCard, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { createOrder } from '@/server/order';
import { StoreConfigaration } from '@/constant';
import { formatPrice } from '@/utils';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutFormType, checkoutSchema } from '@/utils/order';


export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormType) => {
    try {
      const makeOrderObj = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        note: data.note,
        payment_method: data.paymentMethod,
        trx_id: data.paymentMethod === "bkash" ? data.trxId! : "cod-39934548",
        product_ids: cart.map((item) => item.id),
        total: totalPrice,
      };

      const pushToDb = await createOrder(makeOrderObj);
      if (pushToDb.status === 200) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/");
      }
    } catch  {
      toast.error(
        `Order failed. Please try again or contact ${StoreConfigaration.storeInfo.contactNumber}`
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingCart size={50} className="mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-8 text-center md:text-left">
          Secure Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Shipping Info */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl shadow-gray-100 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin size={24} /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <input {...register("name")} placeholder="Full Name *" className="input" />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                {/* Phone */}
                <div>
                  <input {...register("phone")} placeholder="Phone Number *" className="input" />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                {/* Address */}
                <div className="md:col-span-2">
                  <textarea {...register("address")} placeholder="Full Address *" className="input h-24" />
                  {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>
                {/* Note */}
                <div className="md:col-span-2">
                  <textarea {...register("note")} placeholder="Note (Optional)" className="input h-16" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl shadow-gray-100 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={24} /> Payment Method
              </h2>
              <div className="flex flex-col gap-4">
                <label className="flex gap-3">
                  <input type="radio" value="cod" {...register("paymentMethod")} /> Cash on Delivery
                </label>
                <label className="flex gap-3">
                  <input type="radio" value="bkash" {...register("paymentMethod")} /> Bkash
                </label>

                {paymentMethod === "bkash" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input {...register("bkashNumber")} placeholder="Bkash Number" className="input" />
                    {errors.bkashNumber && <p className="text-red-500 text-sm">{errors.bkashNumber.message}</p>}

                    <input {...register("trxId")} placeholder="Trx ID" className="input" />
                    {errors.trxId && <p className="text-red-500 text-sm">{errors.trxId.message}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-2xl shadow-gray-100 border border-gray-100 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package size={24} /> Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-4">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full cursor-pointer py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-600"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


