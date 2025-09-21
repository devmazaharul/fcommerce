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
import { confirmOrder, deleteOrderWithId, getOrders } from '@/server/order';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type PaymentMethod = 'bkash' | 'cod';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(price);

export default function OrdersTable() {
  const [currentOrders, setCurrentOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  type filterKeys='bkash' | 'cod' | 'porder'|'corder'|'all'
  const [paymentFilter, setPaymentFilter] = useState<filterKeys>('all');

  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setCurrentOrders(data as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => fetchOrders();

  const handleAction = async (action: 'view' | 'delete', orderId: string) => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure?')) return;
        const res = await deleteOrderWithId(orderId);
        if (res.error) {
          toast.error('Order delete error: ' + res.error.message);
          return;
        }
        toast.success('Order has been deleted');
        setCurrentOrders((prev) => prev?.filter((order) => order.id !== orderId) || []);
      }

      if (action === 'view') {
        router.push(`/admin/orders/${orderId}`);
      }
    } catch (error) {
      toast.error('Unexpected error');
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
    } catch {
      toast.error('Order not confirmed');
    }
  };

const filteredOrders = currentOrders?.filter((order) => {
  const matchesSearch =
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.trx_id.toLowerCase().includes(searchTerm.toLowerCase());

  let matchesFilter = true;

  if (paymentFilter === 'bkash' || paymentFilter === 'cod') {
    matchesFilter = order.payment_method === paymentFilter;
  } else if (paymentFilter === 'porder') {
    matchesFilter = order.status === false;
  } else if (paymentFilter === 'corder') {
    matchesFilter = order.status === true;
  }

  return matchesSearch && matchesFilter;
});

  return (
    <div className="bg-gray-50 min-h-screen p-6">

  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
  <h1 className="text-2xl font-bold">Orders</h1>
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
    {/* Search Input */}
    <div className="w-full sm:w-64">
      <Label htmlFor="order-search" className="sr-only">
        Search Orders
      </Label>
      <Input
        id="order-search"
        placeholder="Search by name, phone, TRX ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    {/* Filter Select */}
    <div className="w-full sm:w-48">
      <Label htmlFor="order-filter" className="sr-only">
        Filter Orders
      </Label>
      <Select
     
        value={paymentFilter}
        onValueChange={(value) => setPaymentFilter(value as filterKeys)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Filter Orders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="bkash">Bkash</SelectItem>
          <SelectItem value="cod">COD</SelectItem>
          <SelectItem value="porder">Pending Orders</SelectItem>
          <SelectItem value="corder">Confirmed Orders</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Refresh Button */}
    <Button variant="default" className="h-10 mt-2 sm:mt-0" onClick={handleRefresh}>
      Refresh
    </Button>
  </div>
</div>


      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-2xl shadow-gray-100 bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-gray-200">
                <TableHead className="font-bold text-gray-700">Name</TableHead>
                <TableHead className="font-bold text-gray-700">Phone</TableHead>
                <TableHead className="font-bold text-gray-700">Address</TableHead>
                <TableHead className="font-bold text-gray-700">Payment</TableHead>
                <TableHead className="font-bold text-gray-700">TRX ID</TableHead>
                <TableHead className="font-bold text-gray-700">Total</TableHead>
                <TableHead className="font-bold text-gray-700">Confirm</TableHead>
                <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...filteredOrders].reverse().map((order, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-200 border-gray-200"
                >
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell className="capitalize">{order.payment_method}</TableCell>
                  <TableCell>{order.trx_id}</TableCell>
                  <TableCell className="font-bold">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    {order.status == false ? (
                      <Button
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => handleConfirm(order.id!)}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <p className="cursor-pointer text-green-500">Confirmed</p>
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
                          onClick={() => handleAction('view', order.id!)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded transition-colors"
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('delete', order.id!)}
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
