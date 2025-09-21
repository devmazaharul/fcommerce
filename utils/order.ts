import { z } from "zod";

export const orderSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "bkash"]),
  bkashNumber: z.string().optional(),
  trxId: z.string().optional(),
});

// refine -> যদি paymentMethod = bkash হয়, তাহলে bkashNumber & trxId required
export const checkoutSchema = orderSchema.refine(
  (data) => {
    if (data.paymentMethod === "bkash") {
      return data.bkashNumber && data.trxId;
    }
    return true;
  },
  {
    message: "Bkash number & Trx ID are required for Bkash payment",
    path: ["bkashNumber"],
  }
);

export type CheckoutFormType = z.infer<typeof checkoutSchema>;
