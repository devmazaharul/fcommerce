
import React from 'react'

import { getAllProducts } from '@/server/products'
import ProductCard from '../components/Card'

export default async function page() {

  const products=await getAllProducts()
 if(!products) return <h1>No product found</h1>

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-5 py-10'>
      {products.map((item) => (
        <ProductCard
        key={item.id}
          product={item}
        />
      ))}
    </div>
  )
}
