import { createProductType, Product } from '@/types';
import { supabase } from '@/utils/supabaseClient';

const createProduct = async (product: createProductType) => {
  const generateSlug = product.name.trim().toLowerCase().split(' ').join('-');

  const newProd = {
    ...product,
    slug: generateSlug,
    sku: 'SKU-' + Math.floor(Math.random() * 1000000), // random sku
  };

 return await supabase.from('products').insert(newProd).select();
};

const getAllProducts = async () => {
  try {
    const { error, data } = await supabase.from('products').select('*');
    if (error) throw new Error('product fatching error');
    return data;
  } catch (error) {
    console.log(error);
  }
};

export { getAllProducts,createProduct };
