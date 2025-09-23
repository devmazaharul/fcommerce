export const StoreConfigaration=Object.freeze({
  storeInfo:{
    name:"Infinity",
    authors:"Infinity Team",
    address:"Dahaka, Bangladesh",
    contactEmail:"support@yourdomain.com",
    contactNumber:'01797575932',
    title:"Infinity – Small Ecommerce Site",
    doamin:"https://yourdomain.com",
    description:"Infinity is a small ecommerce site where you can explore and buy quality products at affordable prices.",
    startDate:new Date().toLocaleDateString(),
    avablityDatesInWakys:"sun-sat",
    locale:"en-US",
    keywords:[
    "ecommerce",
    "online store",
    "shopping",
    "buy products",
    "small business",
  ]
  },
  payment:{
    bkash:{
      acc_number:"0179757932",
      type:"personal",
      message:"নাম্বারে টাকা পাঠানোর পর নিচের বক্সে আপনার বিকাশ নাম্বার আর TrxID লিখে দিন। "
    }
  },
 product:{
  cart:{
    max_add_tocart:10,
    min_add_tocart:1
  },
  name: {
    min: { value: 3, message: "Name must be at least 3 characters" },
    max: { value: 70, message: "Name must be less than 50 characters" },
  },
  short_desc: {
    min: { value: 5, message: "Short description must be at least 5 characters" },
    max: { value: 100, message: "Short description must be less than 100 characters" },
  },
  long_desc: {
    min: { value: 10, message: "Long description must be at least 10 characters" },
    max: { value: 1000, message: "Long description must be less than 1000 characters" },
  },
  price: {
    min: { value: 1, message: "Price must be greater than 0" },
    max: { value: 1000000, message: "Price must not exceed 1000000" },
  },
  discount: {
    min: { value: 1, message: "Discount cannot be negative" },
    max: { value: 100, message: "Discount cannot be more than 100%" },
  },
  discount_status: {
    type: "boolean",
    message: "Discount status must be true or false",
  },
  category: {
    min: { value: 2, message: "Category must be at least 2 characters" },
    max: { value: 50, message: "Category must be less than 50 characters" },
  },
  image: {
    type: "url",
    max: { value: 255, message: "Image URL must be less than 255 characters" },
    message: "Image must be a valid URL",
  },
},
components:{
  btn_bg:"bg-gray-700",
  btn_details_bg:"bg-gray-700",
  btn_details_bg_hover:"bg-blue-700",
  btn_details_text:"text-white",
  btn_bg_hover:"bg-gray-600",
  text_color:'text-white',
  price_text_color:'text-gray-700',
}

})