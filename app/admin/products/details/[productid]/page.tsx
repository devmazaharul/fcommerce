'use client';

import React, { useEffect, useState } from 'react';
import { format as formatDate } from 'date-fns';
import { Product } from '@/types';
import { getProductById } from '@/server/products';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/utils';

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router=useRouter()
  const params = useParams() as { productid: string };




  useEffect(() => {
      if (!params.productid) return 
    async function fetchProduct() {
      try {
        const { data, error } = await getProductById(params.productid);
        if (error) {
          setError(error.message);
        } else {
          setProduct(data);
        }
      } catch {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.productid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg font-medium">❌ Product not found</p>
      </div>
    );
  }

  const finalPrice = product.discount_status
    ? product.price - product.discount
    : product.price;


    const handleEdit=(productid:string)=>{
     if(productid){
         router.push(`/admin/products/edit/${productid}`)
     }
    }

  return (
    <main className="min-h-screen  p-6">
            <Button className='cursor-pointer' onClick={()=>handleEdit(params.productid)}>Edit</Button>
      <div className="max-w-5xl mx-auto bg-white shadow-2xl shadow-gray-100 border-gray-200 rounded-2xl overflow-hidden border">
        {/* Header */}
        
        <div className="flex items-center justify-between p-6 border-b ">
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight">🧾 Product Invoice</h1>
            <p className="text-sm text-gray-500">Product ID: {product.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(new Date(), 'PPP')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Image
              height={100}
              width={100}
                src={product.image ?? '/placeholder.png'}
                alt={product.name}
                className=" object-cover rounded-xl border border-gray-100"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="mt-2 text-gray-600">{product.short_desc}</p>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {product.long_desc}
                </p>
              </div>
            </div>

            {/* Meta Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4  p-4 rounded-lg ">
              <div>
                <p className="text-xs text-gray-500">SKU</p>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Slug</p>
                <p className="font-medium">{product.slug}</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className=" rounded-xl p-6  ">
            <h3 className="text-lg font-semibold mb-4">💰 Pricing Summary</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Base Price:</span>
                <span className="font-medium">{formatPrice(product.price)}</span>
              </p>
              {product.discount_status && (
                <p className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>- {formatPrice(product.discount)}</span>
                </p>
              )}
              <hr className="my-2" />
              <p className="flex justify-between text-lg font-bold">
                <span>Final Price:</span>
                <span>{formatPrice(finalPrice)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
