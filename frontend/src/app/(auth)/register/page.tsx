"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('procurement_officer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // POST to backend to create user record
        await api.post('/auth/register', {
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role,
        });
        
        router.push('/login');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.detail) {
        setError(typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail));
      } else {
        const errorMessage = (err as any).message || 'An error occurred during registration.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-primary" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center mix-blend-overlay opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-panel p-10 rounded-2xl max-w-lg text-white backdrop-blur-md border-white/20"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Join VendorBridge</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Connect with global suppliers, automate approvals, and generate AI-driven insights from day one. Scale your procurement efforts today.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 z-10">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm lg:w-96 glass-panel p-8 sm:p-10 rounded-2xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">V</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">VendorBridge</h2>
            </div>
            <h2 className="mt-8 text-2xl font-semibold leading-9 tracking-tight text-foreground">
              Create an account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 text-sm text-destructive-foreground bg-destructive rounded-lg font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-foreground">First Name</label>
                    <input required type="text" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background/50 backdrop-blur-sm transition-all" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-foreground">Last Name</label>
                    <input required type="text" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background/50 backdrop-blur-sm transition-all" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-foreground">Email address</label>
                  <input required type="email" className="mt-2 block w-full rounded-md border-0 py-2.5 px-3.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background/50 backdrop-blur-sm transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-foreground">Password</label>
                  <input required type="password" minLength={6} className="mt-2 block w-full rounded-md border-0 py-2.5 px-3.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background/50 backdrop-blur-sm transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-foreground">Role</label>
                  <select required className="mt-2 block w-full rounded-md border-0 py-2.5 px-3.5 text-foreground shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-background/50 backdrop-blur-sm transition-all" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="procurement_officer">Procurement Officer</option>
                    <option value="vendor">Vendor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-2.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Registering..." : "Register Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
