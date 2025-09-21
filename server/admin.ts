'use server'

import { generateToken } from "@/utils"
import { supabase } from "@/utils/supabaseClient"
import { cookies } from "next/headers"
import { verifyToken } from '@/utils'


export const loginAdmin = async (email: string, password: string) => {

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw new Error(error.message)

    if (!data) throw new Error("Admin not found")

    if (data.password !== password) throw new Error("Login failed. Please check your credentials.")

      // add cokie
      const cookiesAction=await cookies();
      const payLoad={
        role:data.role,
        email:data.email,
        name:data.name
      }
      const token=await generateToken(payLoad)
    cookiesAction.set("token", `Bearer ${token}`, {
  httpOnly: true,    
  secure: true,        
  sameSite: "strict", 
  path: "/",           
  maxAge: 60 * 60 * 24 
});

    return {
      success: true,
      admin: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    }
 
}

export const logout=async()=>{
  const cookieAction=await cookies()
  cookieAction.delete("token")
  return {
    success:true
  }
}




export  async function authData() {
let token=(await cookies()).get("token")?.value
if(!token){
  return {
    success:false,
    data:null
  }
}

token=token.split(" ")[1]
const tokenData=await verifyToken(token)
if(!tokenData){
   return {
    success:false,
    data:null
  }
}

 return {
    success:true,
    data:tokenData
  }

 
}
