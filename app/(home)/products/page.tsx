
import React from 'react';

import { getAllProducts } from '@/server/products';
import ProductCard from '@/app/components/Card';

export default async function page() {

  const products=await getAllProducts()
 if(!products) return <h1>No product found</h1>


  return (
    <div className='py-10'>
      <div className="text-center mb-8">
  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
    Products
  </h1>
  <p className="text-gray-500 text-base md:text-md">
    Browse all products available in our store
  </p>
  <div className="mt-3 w-24 h-1 bg-gray-800 mx-auto rounded-full"></div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 py-10">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
