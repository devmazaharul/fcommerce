import z from "zod";

// Zod schemas
const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(50, 'Name must be less than 50 characters.'),
  address: z.string().trim().min(3, 'Address is required').max(255, 'Address must be less than 255 characters.'),
  phone: z.string().trim()
    .min(11, 'Phone number must be exactly 11 digits.')
    .max(11, 'Phone number must be exactly 11 digits.')
    .regex(/^01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number.'),
});
const passwordSchema = z
  .object({
    currentPassword: z.string().trim().min(1, 'Current password required'),
    newPassword: z.string().trim().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().trim().min(6, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export {
  profileSchema,
  passwordSchema
}