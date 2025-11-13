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

export const mazaPayInit = async ({ amount }: { amount: number }) => {
  try {
    const payCreate = await fetch(process.env.NEXT_PUBLIC_PAYMENT_API_URL+"/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_PAYMENT_API_KEY as string,
      },
      body: JSON.stringify({ amount }),
    });

    if (!payCreate.ok) {
      // যদি response status 200 না হয়
      throw new Error(`Request failed with status ${payCreate.status}`);
    }

    const response = await payCreate.json();
    
    return {
      status: 200,
      data: response,
    };
  } catch (error: any) {
    console.error("❌ Payment creation error:", error.message);
    return {
      status: 400,
      message: error?.message || "Something went wrong",
    };
  }
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
