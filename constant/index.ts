export const StoreConfigaration=Object.freeze({
  storeInfo:{
    name:"Store",
    authors:"Store Team",
    address:"Dahaka, Bangladesh",
    contactEmail:"support@yourdomain.com",
    contactNumber:'01797575932',
    title:"Store – Small Ecommerce Site",
    doamin:"https://yourdomain.com",
    description:"Store is a small ecommerce site where you can explore and buy quality products at affordable prices.",
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
      message:"number a taka send money kore nicer box a apnar bkash number and trxId ta bosaben"
    }
  },
 product:{
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
    max: { value: 100000, message: "Price must not exceed 100000" },
  },
  discount: {
    min: { value: 0, message: "Discount cannot be negative" },
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
}

})