'use client';

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { ProductFormValues, productSchema } from "@/utils/productvalidation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/server/products";

export default function AddProductForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      short_desc: "",
      long_desc: "",
      price: 0,
      discount: 0,
      discount_status: false,
      category: "",
      image: "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      const response=await createProduct(values)
      if(response.error){
        toast.error(`Failed to add product Please check your inputs and try again.`);
        return
      }
      
      toast.success("Product has been created");
      reset();
    } catch (err) {

      toast.error("Failed to create product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-2xl shadow-gray-100 border border-gray-200"
        noValidate
      >
        {/* Name */}
        <div>
          <Label className="mb-1">Product Name</Label>
          <Input {...register("name")} placeholder="e.g. Nike Air Zoom Pegasus 41" />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Short & Long desc */}
        <div>
          <Label className="mb-1">Short Description</Label>
          <Input {...register("short_desc")} placeholder="Short summary (one line)" />
          {errors.short_desc && <p className="text-sm text-red-600 mt-1">{errors.short_desc.message}</p>}
        </div>

        <div>
          <Label className="mb-1">Long Description</Label>
          <Textarea {...register("long_desc")} placeholder="Detailed description" rows={6} />
          {errors.long_desc && <p className="text-sm text-red-600 mt-1">{errors.long_desc.message}</p>}
        </div>

        {/* Price, Discount, Discount Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1">Price (BDT)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g. 12000"
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <Label className="mb-1">Discount %</Label>
            <Controller
              name="discount_status"
              control={control}
              render={({ field: { value } }) => (
                <Input
                  type="number"
                  step={1}
                  min={0}
                  max={100}
                  {...register("discount", { valueAsNumber: true })}
                  placeholder="0"
                  disabled={!value} // ✅ enable only when checkbox is checked
                />
              )}
            />
            {errors.discount && <p className="text-sm text-red-600 mt-1">{errors.discount.message}</p>}
          </div>

          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            <Controller
              name="discount_status"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="discount_status"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              )}
            />
            <Label htmlFor="discount_status">Enable Discount</Label>
          </div>
        </div>

        {/* Category & Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="mb-1">Category</Label>
            <Input {...register("category")} placeholder="e.g. Shoes, Electronics" />
            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <Label className="mb-1">Image URL</Label>
            <Input {...register("image")} placeholder="https://..." />
            {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" type="button" onClick={() => reset()}>
            Reset
          </Button>
          <Button className="cursor-pointer" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
