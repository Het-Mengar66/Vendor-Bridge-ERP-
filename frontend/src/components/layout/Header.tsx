"use client";

import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';
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
    <header className="flex-shrink-0 h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center flex-1">
        <button type="button" className="md:hidden text-muted-foreground hover:text-foreground focus:outline-none p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors">
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Global Search Bar Placeholder */}
        <div className="hidden md:flex flex-1 max-w-md ml-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-full leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        <div className="h-8 w-px bg-border mx-2" />

        <div className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-foreground leading-tight group-hover:text-primary transition-colors">
              {user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-xs text-muted-foreground leading-tight">Admin</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </div>
        
        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1.5 text-destructive-foreground bg-destructive/10 border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground font-medium rounded-lg transition-all ml-2"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
