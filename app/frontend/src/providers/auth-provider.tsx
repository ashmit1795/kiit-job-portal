"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { User as AppUser } from "@/types/user";
import api from "@/lib/api";
import { setAccessToken } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: AppUser | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Prevent duplicate fetchAppUser calls
  const fetchingRef = useRef(false);

  const fetchAppUser = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const { data } = await api.get<ApiResponse<AppUser>>("/auth/me");
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 403) {
        toast.error(message || "Access denied. Only @kiit.ac.in emails are allowed.");
        await supabase.auth.signOut();
      } else if (status === 401) {
        // handled by api interceptor
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
      console.error("Failed to fetch app user", error);
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Single source of truth: onAuthStateChange handles EVERYTHING
    // including the INITIAL_SESSION event, so no separate getSession() needed
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setAccessToken(newSession?.access_token ?? null);

        if (newSession) {
          await fetchAppUser();
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAppUser]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        signIn,
        signOut,
        refreshUser: fetchAppUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
