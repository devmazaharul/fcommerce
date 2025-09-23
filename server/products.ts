import { createProductType, Product } from '@/types';
import { supabase } from '@/utils/supabaseClient';

const createProduct = async (product: createProductType) => {
  let productCounter = 1;
  function generateSlug(name: string) {
    const isEnglishOnly = /^[a-zA-Z0-9\s-]+$/.test(name);

    if (!isEnglishOnly) {
      return `product-${Date.now()}-${productCounter++}`;
    }

    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  const newProd = {
    ...product,
    slug: generateSlug(product.name),
    sku: 'SKU-' + Math.floor(Math.random() * 1000000), // random sku
  };

  return await supabase.from('products').insert(newProd).select();
};

const getAllProducts = async () => {
  try {
    const { error, data } = await supabase.from('products').select('*').order("createdat",{ascending:false})
    if (error) throw new Error('product fatching error');
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getProductById = (productid: string) => {
  return supabase.from('products').select('*').eq('id', productid).single();
};

const updateProductInfo = async (
  newProd: createProductType & { id: string }
) => {
  const { data, error } = await supabase
    .from('products')
    .update({
      name: newProd.name,
      short_desc: newProd.short_desc,
      long_desc: newProd.long_desc,
      price: newProd.price,
      discount: newProd.discount,
      discount_status: newProd.discount_status,
      category: newProd.category,
      image: newProd.image,
    })
    .eq('id', newProd.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    status: true,
    data,
  };
};


const deleteProductWithId =async(productid:string)=>{
  return supabase.from("products").delete().eq("id",productid).single()
}

export { getAllProducts, createProduct, getProductById, updateProductInfo,deleteProductWithId  };
