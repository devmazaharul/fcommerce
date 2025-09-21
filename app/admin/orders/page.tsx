'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { confirmOrder, deleteOrderWithId, getOrders, getSingleOrder } from '@/server/order';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export type PaymentMethod = 'bkash' | 'cod';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(price);
};

export default function OrdersTable() {
  const [currentOrders, setCurrentOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getOrders()
      .then((data) => {
        setCurrentOrders(data as Order[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    getOrders()
      .then((data) => {
        setCurrentOrders(data as Order[]);
      })
      .finally(() => setLoading(false));
    // চাইলে router.refresh() ও করতে পারো
  };

type ActionUnion = "view" | "delete";

const handleAction = async (action: ActionUnion, orderId: string) => {
  try {
    if (action === "delete") {
      if(!confirm("Are you sure?")){
        return 
      }
      const res = await deleteOrderWithId(orderId) 

      if (res.error) {
        toast.error("Order delete error: " + res.error.message);
        return;
      }

      toast.success("Order has been deleted");
      // যদি local state থেকে remove করতে চাও
      setCurrentOrders((prev) =>
        prev?.filter((order) => order.id !== orderId) || []
      );
    }

    if (action === "view") {
      router.push(`/admin/orders/${orderId}`)
      // const res = await getSingleOrder(orderId);

      // if (res.error) {
      //   toast.error("Error fetching order: " + res.error.message);
      //   return;
      // }

      // // এখন তুমি order data দেখাতে পারো modal, route বা অন্য কোথাও
      // console.log("Single order data:", res.data);
    }
  } catch (error: unknown) {
    toast.error("Unexpected error");
    console.error(error);
  }
};


  const handleConfirm = async (orderid: string) => {
    try {
      const res = await confirmOrder(orderid);
      if (res.status == 200) {
        toast.success('Order confirmed');
        const updatedData = currentOrders?.map((item) =>
          item.id === orderid ? { ...item, status: true } : item
        );
        setCurrentOrders(updatedData as Order[]);
      }
    } catch (error) {
      toast.error('Order not confirmed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <Button
          variant="default"
          onClick={handleRefresh}
          className="px-4 py-2 rounded cursor-pointer transition"
        >
          Refresh
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-2xl shadow-gray-100 bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : currentOrders && currentOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-gray-200">
                <TableHead className="font-bold text-gray-700">Name</TableHead>
                <TableHead className="font-bold text-gray-700">Phone</TableHead>
                <TableHead className="font-bold text-gray-700">
                  Address
                </TableHead>
                <TableHead className="font-bold text-gray-700">
                  Payment
                </TableHead>
                <TableHead className="font-bold text-gray-700">
                  TRX ID
                </TableHead>
                <TableHead className="font-bold text-gray-700">Total</TableHead>
                <TableHead className="font-bold text-gray-700">
                  Confirm
                </TableHead>
                <TableHead className="text-right font-bold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...currentOrders].reverse().map((order, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-200 border-gray-200"
                >
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell className="capitalize">
                    {order.payment_method}
                  </TableCell>
                  <TableCell>{order.trx_id}</TableCell>
                  <TableCell className="font-bold">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    {order.status == false ? (
                      <Button
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleConfirm(order.id)}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <p className="cursor-pointer  text-green-500">
                        Confirmed
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="bg-white rounded-lg shadow-lg border border-gray-200 w-40 py-1"
                      >
                        <DropdownMenuItem
                          onClick={() => handleAction('view', order.id)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('delete', order.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition-colors"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
