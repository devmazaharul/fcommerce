import { getAllProducts } from '@/server/products';
import Productdetails from './Productdetails';
import { Metadata } from 'next';
import { Product } from '@/types';

type PageProps = {
  params: { slug: string };
};

// Async function to generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } =await params;
  const products = (await getAllProducts()) as Product[];

  const findProduct = products.find((item) => item.slug === slug);

  if (!findProduct) {
    return {
      title: 'Product Not Found',
      description: 'The requested product does not exist.',
    };
  }

  return {
    title: findProduct.name,
    description: findProduct.short_desc,
    openGraph: {
      title: findProduct.name,
      description: findProduct.short_desc,
      images: [findProduct.image],
    },
  };
}

export default async function Page({ params }: {params:Promise<{slug:string}>}) {
  const { slug } = await params;

  // fetch products
  const productsPromise = getAllProducts() as Promise<Product[]>;
  const products = await productsPromise;

  if (!products || products.length === 0) {
    // Loading fallback
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <p>Loading products...</p>
      </div>
    );
  }

  const findProduct = products.find((item) => item.slug === slug);

  if (!findProduct) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Productdetails product={findProduct} />
    </div>
  );
}
