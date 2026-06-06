"use client";

import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
// Note: Mobile sheet to be added using shadcn Sheet later.

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center md:hidden">
        <button type="button" className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 flex justify-end">
        <div className="ml-4 flex items-center md:ml-6">
          <span className="text-sm font-medium text-gray-700 mr-4">
            {user?.email || 'User'}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-900 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
