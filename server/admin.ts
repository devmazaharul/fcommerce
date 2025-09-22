'use server';

import { generateToken } from '@/utils';
import { supabase } from '@/utils/supabaseClient';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils';

const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw new Error(error.message);

  if (!data) throw new Error('Admin not found');

  if (data.password !== password)
    throw new Error('Login failed. Please check your credentials.');

  // add cokie
  const cookiesAction = await cookies();
  const payLoad = {
    role: data.role,
    email: data.email,
    name: data.name,
  };
  const token = await generateToken(payLoad);
  cookiesAction.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 43200, //12 hours
  });

  return {
    success: true,
    admin: {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
  };
};

const logout = async () => {
  const cookieAction = await cookies();
  cookieAction.delete('token');
  return {
    success: true,
  };
};

async function authData() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return {
      success: false,
      data: null,
    };
  }

  const tokenData = await verifyToken(token);
  if (!tokenData) {
    return {
      success: false,
      data: null,
    };
  }

  return {
    success: true,
    data: tokenData,
  };
}

const getAdminInfo = async (email: string) => {
  return supabase
    .from('admins')
    .select('id, name, email, role, created_at ,address , phone')
    .eq('email', email)
    .single();
};

type UpdateAdminInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

const updateAdminInfo = async (data: UpdateAdminInfo) => {
  try {
    const { error, data: updatedAdmin } = await supabase
      .from('admins')
      .update({
        name: data.name,
        address: data.address,
        phone: data.phone,
      })
      .eq('email', data.email)
      .select('name,email,address,phone')
      .single();

    if (error) throw error;

    return { success: true, data: updatedAdmin };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

type ChangePasswordInput = {
  email: string; 
  currentPassword: string; 
  newPassword: string; 
};

const changeAdminPassword = async (data: ChangePasswordInput) => {
  try {

    const { data: admin, error } = await supabase
      .from('admins')
      .select('password')
      .eq('email', data.email)
      .single();

    if (error) throw error;
    if (!admin) throw new Error('Admin not found');
    if (admin.password !== data.currentPassword)
      throw new Error('Invalid current password');

    // ৪️⃣ Supabase এ update
    const { error: updateError } = await supabase
      .from('admins')
      .update({ password: data.newPassword })
      .eq('email', data.email);

    if (updateError) throw updateError;

    //remove cookied and redirect to re login
    const cookieAction = await cookies();
    cookieAction.delete('token');
    return { success: true, message: 'Password updated successfully!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export {
  getAdminInfo,
  authData,
  loginAdmin,
  logout,
  updateAdminInfo,
  changeAdminPassword,
};
