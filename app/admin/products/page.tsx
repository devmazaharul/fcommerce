'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import {
  Search,
  ArrowUpDown,
  MoreHorizontal,
  PlusCircle,
  BarChart,
  Grid,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { getAllProducts } from '@/server/products';
import Link from 'next/link';



// Dummy Products

const itemsPerPage = 10;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(price);

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

  // Filtering & Sorting
  useEffect(() => {


    const getProducts=async()=>{
      const allProducts=await getAllProducts();
      if(!allProducts) throw new Error("Error")
      
        let filtered = allProducts.filter((p) =>
      [p.name, p.category, p.sku].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    switch (sortCriteria) {
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setSortedProducts(filtered);
    setCurrentPage(1);
    }

  getProducts()
  }, [searchQuery, sortCriteria]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handleAction = (action: string, productId: string) => {
    console.log(`${action} -> ${productId}`);
  };

  const renderProductCard = (p: Product) => (
    <Card key={p.id} className="overflow-hidden rounded-xl border-gray-200 shadow-2xl shadow-gray-200 hover:shadow-lg transition-all">
      <div className="relative w-full aspect-[4/3]">
        <Image src={p.image} alt={p.name} fill className="object-cover transition-transform group-hover:scale-105" />
      </div>
      <CardContent className="p-4 text-center">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{p.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{p.category}</p>
        <p className="text-lg font-bold text-gray-600 mt-2">{formatPrice(p.price)}</p>
        {p.discount_status && <span className="text-xs text-red-500">-{p.discount}% off</span>}
        
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3">
            <BarChart size={40} className="text-blue-500" />
            <h1 className="text-3xl font-extrabold text-gray-800">Product Dashboard</h1>
          </div>
          <Link href={"/admin/products/add"} className="mt-3 sm:mt-0 flex items-center gap-2 cursor-pointer">
          <Button className='cursor-pointer'>  <PlusCircle size={18} /> Add Product</Button>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 mb-6 bg-white rounded-xl shadow-2xl shadow-gray-100 border border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search by name, category or SKU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full rounded-md border border-gray-300 focus-visible:ring-gray-600 focus-visible:border-gray-600"
            />
          </div>

     <Select value={sortCriteria} onValueChange={setSortCriteria}>
  <SelectTrigger className="
    w-full md:w-52 
    rounded-md 
    border border-gray-300 
    bg-gray-50 
    text-gray-700 
    hover:bg-gray-100 
    focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:border-gray-600
    transition-colors duration-200
    flex items-center
  ">
    <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
    <SelectValue placeholder="Sort by" />
  </SelectTrigger>

  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
    <SelectItem
      value="newest"
      className="hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-150"
    >
      Newest First
    </SelectItem>
    <SelectItem
      value="oldest"
      className="hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-150"
    >
      Oldest First
    </SelectItem>
    <SelectItem
      value="price_desc"
      className="hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-150"
    >
      Price (High → Low)
    </SelectItem>
    <SelectItem
      value="price_asc"
      className="hover:bg-gray-100 px-2 py-1 rounded transition-colors duration-150"
    >
      Price (Low → High)
    </SelectItem>
   
  </SelectContent>
</Select>


          <div className="flex items-center gap-2">
            <Button variant={viewMode=="table"?"default":"outline"} className={'hidden md:flex cursor-pointer'} onClick={() => setViewMode('table')} >
              Table View
            </Button>

            <Button variant={viewMode=="grid"?"default":"outline"} className='cursor-pointer' onClick={() => setViewMode('grid')}>
              <Grid size={18} className="mr-2" /> Grid View
            </Button>
            
          </div>
        </div>

        {/* Products */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">Adjust your search or filters.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xl shadow-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-200">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50 transition border-gray-200">
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                       <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell className="text-gray-600">{p.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{formatPrice(p.price)}</span>
                        {p.discount_status && (
                          <span className="text-xs text-red-500">-{p.discount}% off</span>
                        )}
                      </div>
                    </TableCell>
                   
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('edit', p.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('view', p.id)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('delete', p.id)} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map(renderProductCard)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

