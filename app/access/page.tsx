'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, LockKeyhole, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { loginAdmin } from '@/server/admin';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password must be at least 1 characters.' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function AdminLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const router=useRouter()
  const onSubmit = async (data: LoginSchema) => {
    try {
      const loginFun=await loginAdmin(data.email,data.password)
        if(loginFun.success){
          toast.success("Login success")
          router.push("/admin")
        }
    } catch (error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Something went wrong');
  }
}

  };

  return (
    <div className="flex items-center justify-center min-h-screen  p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 shadow-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Login
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <div className="relative mt-1">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="pl-10 w-full py-4"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="pl-10 w-full py-4"
              />
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full cursor-pointer py-5"
            disabled={isSubmitting}
          >
            <LogIn size={20} />
            <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
          </Button>
        </form>
      </div>
    </div>
  );
}