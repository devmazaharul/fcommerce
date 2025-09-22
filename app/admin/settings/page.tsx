'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserCircle, Bell, Lock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authData, changeAdminPassword, getAdminInfo, updateAdminInfo } from '@/server/admin';
import { useRouter } from 'next/navigation';
import { passwordSchema, profileSchema } from '@/utils/adminValidation';
import { PasswordFormValues, ProfileFormValues } from '@/types';



export default function SettingsPage() {
const router=useRouter()

const [email, setemail] = useState("")
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await authData();
      if (res.success) {
            setemail(res.data?.email as string)
        const adminInfo = await getAdminInfo(res.data?.email as string);
        if (adminInfo.error) {
          toast.error(adminInfo.error.message);
          return;
        }

        profileForm.reset({
          name: adminInfo.data.name || '',
          address: adminInfo.data.address || '',
          phone: adminInfo.data.phone || ''
        });
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (data: ProfileFormValues) => {
  try {
    const updateFun=await updateAdminInfo({...data,email:email}) 
    if(!updateFun.success) throw new Error(updateFun?.message || "Faield to update info");
  
    profileForm.reset({
      name:updateFun.data?.name || '',
      address:updateFun.data?.address || '',
      phone:updateFun.data?.phone || '',
    })
    toast.success("Successfully updated")
  } catch (error:unknown) {
    if(error instanceof Error){
      toast.error(error.message)
    }else{
      toast.error("Faield to update inforamtion")
    }
  }
  };

  const handleChangePassword = async (data: PasswordFormValues) => {
  try {
    const chnagePObj={
currentPassword:data.currentPassword,
newPassword:data.newPassword,
email:email
    }
   const chanegePass=await changeAdminPassword({...chnagePObj})
   if(!chanegePass.success) throw new Error(chanegePass.message)
    profileForm.reset({
      name: '',
      address: '',
      phone: '',
    })
    router.push("/access")
    toast.success("Successfully changed your password")
  } catch (error:unknown) {
    if(error instanceof Error){
      toast.error(error.message)
    }else{
      toast.error("Faield to change password ")
    }
  }
  };

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
          Settings
        </h1>

        {/* Profile Card */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader className="flex items-center gap-4">
            <UserCircle size={28} className="text-gray-500" />
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account&apos;s profile info.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={profileForm.handleSubmit(handleSaveProfile)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...profileForm.register('name')} />
                {profileForm.formState.errors.name && (
                  <p className="text-red-500 text-sm">
                    {profileForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...profileForm.register('address')} />
                {profileForm.formState.errors.address && (
                  <p className="text-red-500 text-sm">
                    {profileForm.formState.errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...profileForm.register('phone')} />
                {profileForm.formState.errors.phone && (
                  <p className="text-red-500 text-sm">
                    {profileForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="flex items-center gap-2 cursor-pointer">
                <Save size={18} />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader className="flex items-center gap-4">
            <Lock size={28} className="text-gray-500" />
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={passwordForm.handleSubmit(handleChangePassword)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...passwordForm.register('currentPassword')}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <p className="text-red-500 text-sm">
                    {passwordForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register('newPassword')}
                />
                {passwordForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {passwordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register('confirmPassword')}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="flex items-center gap-2 cursor-pointer">
                <Save size={18} />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Card */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader className="flex items-center gap-4">
            <Bell size={28} className="text-gray-500" />
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Decide which notifications you would like to receive.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive email alerts for important updates.
                </p>
              </div>
              <Switch defaultChecked className="cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
