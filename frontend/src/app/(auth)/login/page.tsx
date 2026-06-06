'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';
import { LogIn, Key, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, setError, error, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call login endpoint
      const response = await api.post('/auth/login', {
        email,
        password,
        // Add required fields by Pydantic UserCreate schema in mock login
        first_name: 'Temp',
        last_name: 'User',
        role: 'procurement_officer',
      });

      const { access_token, user } = response.data;
      login(access_token, user);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Failed to log in. Please check your credentials or register.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: 'admin' | 'procurement_officer' | 'vendor' | 'manager') => {
    // Inject a mock token based on selected role
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: `${role}@vendorbridge.app`,
      first_name: 'Mock',
      last_name: role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      role: role,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    login(`mock-${role}`, mockUser);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Neon Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-300 hover:border-slate-700/80">
        
        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4 animate-pulse">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            VendorBridge ERP
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Procurement & Vendor Management Portal
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl p-3.5 text-red-400 text-sm">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                <Key className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-3 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between text-xs text-slate-600">
          <hr className="w-full border-slate-800" />
          <span className="px-3 shrink-0">DEMO MOCK LOGIN</span>
          <hr className="w-full border-slate-800" />
        </div>

        {/* Mock Roles Login */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            onClick={() => handleMockLogin('procurement_officer')}
            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium transition-colors hover:text-white"
          >
            Officer Portal
          </button>
          <button
            onClick={() => handleMockLogin('vendor')}
            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium transition-colors hover:text-white"
          >
            Vendor Portal
          </button>
          <button
            onClick={() => handleMockLogin('manager')}
            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium transition-colors hover:text-white"
          >
            Manager Portal
          </button>
          <button
            onClick={() => handleMockLogin('admin')}
            className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs py-2 px-3 rounded-lg font-medium transition-colors hover:text-white"
          >
            Admin Panel
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
}
