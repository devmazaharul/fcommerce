'use client';

import React, { use, useEffect, useState } from 'react';
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
import {
  UserCircle,
  Bell,
  Lock,
  Save,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authData } from '@/server/admin';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string | null }>({
    name: '',
    email: null,
  });

 useEffect(() => {
    const fetchUser = async () => {
      const res = await authData();
      if (res.success) {
        setUser({
          name: res.data?.name as string ?? '',
          email: res.data?.email as string ?? null,
        });
      }
    };
    fetchUser();
  }, []); 


  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে প্রোফাইল সেভ করার লজিক লিখুন
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে পাসওয়ার্ড পরিবর্তনের লজিক লিখুন
    toast.success('Password changed successfully!');
  };

  return (
    <div className="flex justify-center min-h-screen  p-6">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
          Settings
        </h1>

        {/* ✅ প্রোফাইল সেটিংস কার্ড */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserCircle size={28} className="text-gray-500" />
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account's profile information and email address.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user?.name || "Admin"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || "admin@example.com"} disabled />
              </div>
              <Button type="submit" className="flex items-center gap-2 cursor-pointer">
                <Save size={18} />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ✅ পাসওয়ার্ড সেটিংস কার্ড */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Lock size={28} className="text-gray-500" />
              <div>
                <CardTitle>Password</CardTitle>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="flex items-center gap-2 cursor-pointer">
                <Save size={18} />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ✅ নোটিফিকেশন সেটিংস কার্ড */}
        <Card className="shadow-2xl shadow-gray-100 border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Bell size={28} className="text-gray-500" />
              <div>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Decide which notifications you would like to receive.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email alerts for important updates.</p>
              </div>
              <Switch defaultChecked className='cursor-pointer' />
            </div>
         
          </CardContent>
        </Card>

     
      </div>
    </div>
  );
}