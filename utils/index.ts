// utils/format.ts
 const formatPrice = (value: number, locale = "en-US", currency = "BDT") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

const bdMobileRegex = /^01[3-9]\d{8}$/;
const nameRegex = /^[A-Za-z\s]{2,50}$/;
const addressRegex = /^[A-Za-z0-9\s,.-]{5,200}$/;
const bkashTrxRegex = /^[A-Za-z0-9]{10,20}$/;

export {
  bdMobileRegex,
  addressRegex,
  nameRegex,
  formatPrice,
  bkashTrxRegex
}