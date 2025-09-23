'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getProductById, updateProductInfo } from '@/server/products';


// react-hook-form + zod
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { productSchema } from '@/utils/productvalidation';

// ✅ Validation Schema

type ProductForm = z.infer<typeof productSchema>;

export default function ProductEditPage() {
  const params = useParams() as { productid: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const discountstatus = watch('discount_status');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await getProductById(params.productid);
        if (error || !data) {
          toast.error('Product not found');
          router.push('/products');
          return;
        }
        // set default values
        reset(data);
      } catch {
        toast.error('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.productid, reset, router]);

  useEffect(() => {
    if (!discountstatus) {
      setValue('discount', 0, { shouldValidate: true });
    }
  }, [discountstatus, setValue]);

  const onSubmit = async (values: ProductForm) => {
    try {
      const response = await updateProductInfo({
        ...values,
        id: params.productid,
      });
      if (response.status) {
        toast.success('Product updated successfully!');
        router.push(`/admin/products/details/${params.productid}`);
        return;
      }
    } catch (err: unknown) {
      if(err instanceof Error){
        toast.error(err.message || ' Failed to update product');
      }else{
        toast.error(' Failed to update product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading product...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen  p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl  rounded-2xl overflow-hidden border border-gray-200 shadow-gray-100">
        {/* Header */}
        <div className="p-6 border-b ">
          <h1 className="text-2xl font-bold">✏️ Edit Product</h1>
          <p className="text-sm text-gray-500">
            Product ID: {params.productid}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium">
              Short Description
            </label>
            <input
              type="text"
              {...register('short_desc')}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors.short_desc && (
              <p className="text-red-500 text-sm">
                {errors.short_desc.message}
              </p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium">
              Long Description
            </label>
            <textarea
              {...register('long_desc')}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors.long_desc && (
              <p className="text-red-500 text-sm">{errors.long_desc.message}</p>
            )}
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Discount</label>
              <input
                type="number"
                step="0.01"
                {...register('discount', { valueAsNumber: true })}
                className="mt-1 w-full rounded-md border px-3 py-2"
                disabled={!discountstatus}
              />
              {errors.discount && (
                <p className="text-red-500 text-sm">
                  {errors.discount.message}
                </p>
              )}
            </div>
          </div>

          {/* Discount Status */}
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register('discount_status')} />
            <label>Discount Active</label>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              type="text"
              {...register('category')}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="text"
              {...register('image')}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button disabled={isSubmitting} className="cursor-pointer">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </main>
  );
}
