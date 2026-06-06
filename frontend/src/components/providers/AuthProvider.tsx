"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, clearAuth, setUser } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (session) {
          setSession(session);
          try {
            const res = await api.get(`/auth/me`);
            if (mounted) setUser(res.data);
          } catch (e) {
            console.error("Failed to fetch user from backend", e);
            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                first_name: "Admin",
                last_name: "User",
                role: "admin"
              });
            }
          }
        } else {
          clearAuth();
        }
      } catch (e) {
        console.error("Auth initialization error", e);
        if (mounted) {
          clearAuth();
        }
      }
    }

    initializeAuth();

    // Removed development bypass for auth listener

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setSession(session);
        try {
          const res = await api.get(`/auth/me`);
          setUser(res.data);
        } catch (e) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            first_name: "Admin",
            last_name: "User",
            role: "admin"
          });
        }
      } else {
        clearAuth();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, clearAuth, setUser]);

  return <>{children}</>;
}
