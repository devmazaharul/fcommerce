import { z } from "zod";

import { StoreConfigaration } from "@/constant/index";
const rules=StoreConfigaration.product

export const productSchema = z.object({
  name: z
    .string()
    .min(rules.name.min.value, rules.name.min.message)
    .max(rules.name.max.value, rules.name.max.message),

  short_desc: z
    .string()
    .min(rules.short_desc.min.value, rules.short_desc.min.message)
    .max(rules.short_desc.max.value, rules.short_desc.max.message),

  long_desc: z
    .string()
    .min(rules.long_desc.min.value, rules.long_desc.min.message)
    .max(rules.long_desc.max.value, rules.long_desc.max.message)
    .optional(),

  price: z
    .number()
    .min(rules.price.min.value, rules.price.min.message)
    .max(rules.price.max.value, rules.price.max.message),

  discount: z
    .number("Discount must be a number" )
    .min(rules.discount.min.value, rules.discount.min.message)
    .max(rules.discount.max.value, rules.discount.max.message),

  discount_status: z.boolean(
   rules.discount_status.message,
  ),

  category: z
    .string()
    .min(rules.category.min.value, rules.category.min.message)
    .max(rules.category.max.value, rules.category.max.message),

  image: z
    .string()
    .url(rules.image.message)
    .max(rules.image.max.value, rules.image.max.message),
}) .refine((data) => {
    if (data.discount_status) {
      return data.discount >= 1; 
    }
    return true;
  }, {
    message: "Provide at least 1% discount when discount status is enabled",
    path: ["discount"],
  });


export type ProductFormValues=z.infer<typeof productSchema>
