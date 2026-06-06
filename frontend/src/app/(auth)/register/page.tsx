'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../../store/authStore';
import { api } from '../../../lib/api';
import { UserPlus, Mail, Key, User, Phone, MapPin, Briefcase, FileText, ShieldAlert, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login, setLoading, setError, error, isLoading } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('procurement_officer');
  const [country, setCountry] = useState('India');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Register new user on backend
      const response = await api.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
        role,
        country,
        additional_info: additionalInfo
      });

      // Automatically log in after registration in dev/demo mode
      const loginResponse = await api.post('/auth/login', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role: role,
      });

      const { access_token, user } = loginResponse.data;
      login(access_token, user);
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Registration failed. Please check the entered data.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Neon Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-lg bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-300 hover:border-slate-700/80">
        
        {/* Logo and Welcome */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 mb-3 animate-pulse">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create ERP Account
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Register to join the VendorBridge network
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl p-3.5 text-red-400 text-sm">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                First Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Last Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Email / Password */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Password *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Key className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min. 6 chars"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Phone / Role */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Phone className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9988776655"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                System Role *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                  <Briefcase className="h-4.5 w-4.5" />
                </span>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="procurement_officer" className="bg-slate-950 text-white">Procurement Officer</option>
                  <option value="vendor" className="bg-slate-950 text-white">Vendor / Supplier</option>
                  <option value="manager" className="bg-slate-950 text-white">Manager / Approver</option>
                  <option value="admin" className="bg-slate-950 text-white">System Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Country */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Country
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 pointer-events-none">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="India"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Additional Details
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-500 pointer-events-none">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="GST number, company registration info or other notes..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-2.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Register'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-5 text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
