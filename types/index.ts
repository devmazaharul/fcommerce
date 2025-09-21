export type Product = {
  id: string
  name: string
  short_desc: string
  long_desc: string
  price: number
  discount: number        
  discount_status: boolean 
  category: string
  image: string
  slug: string
  sku: string
}

export type createProductType={
  name: string
  short_desc: string
  long_desc?: string
  price: number
  discount: number        
  discount_status: boolean 
  category: string
  image: string
}


type PaymentMethod = "bkash" | "cod";

export interface Order {
  id?: string;
  name: string;
  phone: string;
  address: string;
  note?: string; // optional
  total:number;
  payment_method: PaymentMethod;
  trx_id: string; // bkash হলে trx id, না হলে cod-generated id
  product_ids: string[]; // array of product UUIDs
  status?:boolean;
  created_at?:Date

}
