'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSingleOrder } from '@/server/order';
import { Order } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { StoreConfigaration } from '@/constant';

export default function SingleOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
const {name,address,contactEmail,contactNumber} =StoreConfigaration.storeInfo
  const orderId = params.orderid as string;

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    getSingleOrder(orderId)
      .then((res) => {
        if (res.error) {
          toast.error('Failed to fetch order');
        } else {
          setOrder(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => window.print();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      </div>
    );

  if (!order)
    return (
      <p className="p-6 text-red-500 text-center text-lg">Order not found.</p>
    );

  return (
    <div className="p-6  min-h-screen flex justify-center">
      <div className="w-full max-w-3xl">
        {/* Header Buttons */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button className="cursor-pointer" onClick={handlePrint}>
              Print
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-100 border border-gray-200 p-8">
          {/* Store + Order Info */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">🛒 {name || "store"}</h2>
              <p className="text-sm text-gray-600">
               {address || "Address here"}
              </p>
              <p className="text-sm text-gray-600">
                📧 {contactEmail} | ☎ {contactNumber}
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer + Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Customer Info
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {order.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span> {order.address}
              </p>
              {order.note && (
                <p className="text-gray-700">
                  <span className="font-semibold">Note:</span> {order.note}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Payment Info
              </h3>
              <p className="text-gray-700">
                <span className="font-semibold">Payment Method:</span>{' '}
                {order.payment_method}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">TRX ID:</span> {order.trx_id}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Total:</span>{' '}
                {order.total.toLocaleString()} BDT
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{' '}
                {order.status ? (
                  <span className="text-green-600 font-semibold">Confirmed</span>
                ) : (
                  <span className="text-red-600 font-semibold">Pending</span>
                )}
              </p>
            </div>
          </div>

          {/* Product List */}
          {/* <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2  pb-1">
              Products
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {order.product_ids.map((pid) => (
                <li
                  key={pid}
                  className="text-gray-700 px-3 py-1 rounded-md  "
                >
                  {pid}
                </li>
              ))}
            </ul>
          </div> */}

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
            Thank you for shopping with <span className="font-semibold"> {name}</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
