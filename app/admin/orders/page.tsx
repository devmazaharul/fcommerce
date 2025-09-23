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
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/utils';

export type PaymentMethod = 'bkash' | 'cod';
export type Order = {
  id: string;
  name: string;
  phone: string;
  address: string;
  payment_method: PaymentMethod;
  bkash_number?: string;
  trx_id: string;
  total: number;
  status: boolean;
};

export default function OrdersTable() {
  const [currentOrders, setCurrentOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  type filterKeys = 'bkash' | 'cod' | 'porder' | 'corder' | 'all';
  const [paymentFilter, setPaymentFilter] = useState<filterKeys>('all');

  const router = useRouter();

 const fetchOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    console.log(data);
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
    } catch {
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
    <div className="min-h-screen p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Label htmlFor="order-search" className="sr-only">Search Orders</Label>
            <Input
              id="order-search"
              placeholder="Search by name, phone, TRX ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Label htmlFor="order-filter" className="sr-only">Filter Orders</Label>
            <Select
              value={paymentFilter}
              onValueChange={(value) => setPaymentFilter(value as filterKeys)}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Filter Orders" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem className='cursor-pointer' value="all">All Payments</SelectItem>
                <SelectItem className='cursor-pointer' value="bkash">Bkash</SelectItem>
                <SelectItem className='cursor-pointer' value="cod">COD</SelectItem>
                <SelectItem className='cursor-pointer' value="porder">Pending Orders</SelectItem>
                <SelectItem className='cursor-pointer' value="corder">Confirmed Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="default" className="h-10 mt-2 sm:mt-0 w-full sm:w-auto cursor-pointer" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 overflow-x-auto shadow-2xl shadow-gray-100 bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : filteredOrders && filteredOrders.length > 0 ? (
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow className="bg-gray-50 border-gray-200">
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Name</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Phone</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Address</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Payment</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">B. Number</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">TRX ID</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Total</TableHead>
                <TableHead className="font-bold text-gray-700 whitespace-nowrap">Status</TableHead>
                <TableHead className="text-right font-bold text-gray-700 whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-gray-50 transition-colors duration-200 border-gray-200"
                >
                  <TableCell className="font-medium text-gray-900 whitespace-nowrap capitalize">{order.name}</TableCell>
                  <TableCell className="text-gray-600 whitespace-nowrap">{order.phone}</TableCell>
                  <TableCell className="text-gray-600 max-w-[200px] whitespace-normal">{order.address}</TableCell>
                  <TableCell className="capitalize text-gray-600 whitespace-nowrap">{order.payment_method}</TableCell>
                  <TableCell className="text-gray-600 whitespace-nowrap">{order.bkash_number || 'N/A'}</TableCell>
                  <TableCell className="text-gray-600 whitespace-nowrap">{order.trx_id || 'N/A'}</TableCell>
                  <TableCell className="font-semibold text-gray-900 whitespace-nowrap">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    {order.status === false ? (
                      <Button
                        variant="destructive"
                        className="h-8 px-3 text-sm cursor-pointer whitespace-nowrap"
                        onClick={() => handleConfirm(order.id!)}
                      >
                        Confirm
                      </Button>
                    ) : (
                      <p className="cursor-pointer text-green-600  whitespace-nowrap">Confirmed</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className='cursor-pointer'
                          onClick={() => handleAction('view', order.id!)}
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction('delete', order.id!)}
                          className="text-red-600 cursor-pointer"
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