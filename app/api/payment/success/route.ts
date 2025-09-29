import { supabase } from "@/utils/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const bodydat = await req.json();
    const payId=bodydat.paymentId;
    const findTrx=await supabase.from("orders").select("*")
    if(findTrx.error) throw new Error("No orders found")

      const findOne=findTrx.data.find((item)=>item.trx_id.includes(payId))
    if(!findOne) throw new Error("No order ")
     await supabase
  .from("orders")
  .update({ trx_id: `${payId}-(confirmed)` })
  .eq("id", findOne.id);
    return NextResponse.json(
      { message: "Data received successfully", data: bodydat },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { message: "Error occurred while processing request" },
      { status: 500 }
    );
  }
};
