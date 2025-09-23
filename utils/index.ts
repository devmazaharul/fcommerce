import { SignJWT, jwtVerify } from "jose";


 const formatPrice = (
  value: number,
  options?: {
    locale?: string;
    currency?: string;
  }
): string => {
  const {
    locale = "en-US",
    currency = "BDT",
  } = options || {};

  try {
    const formattedValue = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0, 
    }).format(value);

    // BDT চিহ্নের আগে স্পেস যোগ করা
    return formattedValue.replace('BDT', '৳').replace('$', '৳');
    
  } catch (error) {
    console.error("Error formatting price:", error);
    return `${value} ${currency}`;
  }
};

const bdMobileRegex = /^01[3-9]\d{8}$/;
const nameRegex = /^[A-Za-z\s]{2,50}$/;
const addressRegex = /^[A-Za-z0-9\s,.-]{5,200}$/;
const bkashTrxRegex = /^[A-Za-z0-9]{10,20}$/;


const secret = new TextEncoder().encode(process.env.JWT_SECRET!); 

// Token generate
export async function generateToken(payload: {role:string;email:string;name:string}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") 
    .sign(secret);
}

// Token verify
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (e) {
    return null;
  }
}


export {
  bdMobileRegex,
  addressRegex,
  nameRegex,
  formatPrice,
  bkashTrxRegex
}