import { Order } from '@/types';
import { supabase } from '@/utils/supabaseClient';

const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order("created_at", { ascending: false })
  if (error) {
    console.log(error);
    return;
  }

  return data;
};

const createOrder = async (item: Order) => {
  const { data, error } = await supabase.from('orders').insert(item).select();
  if (error) {
    throw new Error('Order not complete');
  }

  return {
    status: 200,
    data,
  };
};


const confirmOrder = async (orderId: string) => {
  const { error, data } = await supabase
    .from("orders")
    .update({ status: true })
    .eq("id", orderId) // শুধুমাত্র ওই order update হবে
    .select();

  if (error) {
    throw new Error("Order confirmation error: " + error.message);
  }

  return {
    status:200,
    data
  }
};





 const deleteOrderWithId = async (orderId: string) => {

    const response = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

   return response
  
};



 const getSingleOrder = async (orderId: string) => {

    const response = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single(); 

    return response
};


export { createOrder, getOrders,confirmOrder,deleteOrderWithId,getSingleOrder };
