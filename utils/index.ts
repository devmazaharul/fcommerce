import { SignJWT, jwtVerify } from "jose";

// utils/format.ts
 const formatPrice = (value: number, locale = "en-US", currency = "BDT") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

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