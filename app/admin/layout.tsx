'use client';
import './style.css';

import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

import { ReactNode } from 'react';
import { Home, Box, ShoppingCart, Settings, ShieldUser } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { authData, logout } from '@/server/admin';

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const [user, setUser] = useState<{ name: string; email: string | null }>({
    name: '',
    email: null,
  });

  const router = useRouter();
  const pathName = usePathname();

  const handleLogout = async () => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await logout();
      if (res.success) {
        router.push('/access');
        toast.success('Logout success');
      }
    } catch {
      toast.error('Error during logout');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await authData();
      if (res.success) {
        setUser({
          name: res.data?.name as string ?? '',
          email: res.data?.email as string ?? null,
        });
      } else {
        handleLogout();
      }
    };
    fetchUser();
  }, []); // functional update used, dependency warning gone

  return (
    <html>
      <body>
        <div className="flex h-screen bg-white font-sans">
          {/* Sidebar */}
          <aside className="w-16 bg-gray-800 text-gray-100 print:hidden flex flex-col relative">
            <div className="p-4 text-center border-b border-gray-700">
              <h1 className="text-sm font-bold origin-left whitespace-nowrap">
                <ShieldUser />
              </h1>
            </div>
            <nav className="flex-1 flex flex-col items-center py-4 space-y-4">
              <Link
                href="/admin"
                className={`${
                  pathName === '/admin' ? 'bg-green-400' : ''
                } flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700 transition relative group`}
              >
                <Home size={20} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Dashboard
                </span>
              </Link>

              <Link
                href="/admin/orders"
                className={`${
                  pathName.startsWith('/admin/orders') ? 'bg-green-600' : ''
                } flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700 transition relative group`}
              >
                <ShoppingCart size={20} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Orders
                </span>
              </Link>

              <Link
                href="/admin/products"
                className={`${
                  pathName.startsWith('/admin/products') ? 'bg-green-600' : ''
                } flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700 transition relative group`}
              >
                <Box size={20} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Products
                </span>
              </Link>

              <Link
                href="/admin/settings"
                className={`${
                  pathName.startsWith('/admin/settings') ? 'bg-green-600' : ''
                } flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-700 transition relative group`}
              >
                <Settings size={20} />
                <span className="absolute left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  Settings
                </span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Header */}
            <header className="h-16 print:hidden bg-white shadow-2xl shadow-gray-50 border-b border-gray-200 px-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Welcome, Admin</h2>
              </div>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
                    >
                      <span className="font-bold text-gray-700">
                        {user.name.charAt(0) || 'A'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 shadow-2xl shadow-gray-200 border-gray-200"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium capitalize">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <User size={16} /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-600 cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
