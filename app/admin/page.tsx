'use client';

import React, { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Phone, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { getOrders } from '@/server/order';
import { Order } from '@/types';
import toast from 'react-hot-toast';
import { StoreConfigaration } from '@/constant';
import GenerateReport from './Generatereport';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data as Order[]))
      .catch(() => toast.error('Failed to fetch orders'))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => !o.status).length;
  const confirmedOrders = orders.filter((o) => o.status).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
       <GenerateReport orders={orders} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className='shadow-gray-100 shadow-2xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart /> Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-gray-500">{pendingOrders} pending</p>
          </CardContent>
        </Card>

 <Card className='shadow-gray-100 shadow-2xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign /> Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">BDT {totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total revenue</p>
          </CardContent>
        </Card>

      <Card className='shadow-gray-100 shadow-2xl'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Confirmed Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{confirmedOrders}</p>
            <p className="text-sm text-gray-500">Orders completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden shadow-2xl shadow-gray-100 bg-white">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading orders...</div>
        ) : orders.length > 0 ? (
          <Table >
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>trxId</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((o, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                  <TableCell>{o.name}</TableCell>
                  <TableCell>{o.phone}</TableCell>
                  <TableCell className="capitalize">{o.payment_method}</TableCell>
                  <TableCell>
                    {o.status ? (
                      <span className="text-green-500 ">Confirmed</span>
                    ) : (
                      <span className="text-red-500 ">Pending</span>
                    )}
                  </TableCell>
                  <TableCell >BDT {o.trx_id}</TableCell>
                  <TableCell className="font-bold">BDT {o.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        )}
      </div>

      {/* Contact Info */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail size={16} /> {StoreConfigaration.storeInfo.contactEmail}
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone size={16} />  {StoreConfigaration.storeInfo.contactNumber}
        </div>
      </div>
    </div>
  );
}
