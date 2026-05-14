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
  /** True only during the very first cold-start resolution. Never flips back to
   *  true after the initial session is determined — token refreshes and tab
   *  switches are handled silently without touching this flag. */
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
  // isLoading starts true and becomes false once the INITIAL_SESSION event
  // resolves. It is NEVER set back to true afterwards.
  const [isLoading, setIsLoading] = useState(true);

  // Prevent duplicate fetchAppUser calls
  const fetchingRef = useRef(false);
  // Track whether the first boot has already resolved
  const hasInitializedRef = useRef(false);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {

        // ── Silent events ────────────────────────────────────────────────
        // TOKEN_REFRESHED fires every ~10 min and on every tab-focus when
        // the token needs refreshing.  USER_UPDATED fires on profile changes.
        // Neither should cause a loading flash — just swap the token.
        if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          setSession(newSession);
          setAccessToken(newSession?.access_token ?? null);
          return;
        }

        // ── SIGNED_IN after initial boot ──────────────────────────────────
        // A real new sign-in after the initial session has already resolved.
        // We DON'T set isLoading here — the /auth/callback page handles its
        // own loading spinner. We just silently fetch the app user.
        if (event === "SIGNED_IN" && hasInitializedRef.current) {
          setSession(newSession);
          setAccessToken(newSession?.access_token ?? null);
          if (newSession) await fetchAppUser();
          return;
        }

        // ── Real auth transitions (INITIAL_SESSION, first SIGNED_IN, SIGNED_OUT)
        // Only these use the isLoading flag.
        setSession(newSession);
        setAccessToken(newSession?.access_token ?? null);

        if (newSession) {
          await fetchAppUser();
        } else {
          setUser(null);
        }

        // Mark as initialized and clear the loading flag — permanently.
        hasInitializedRef.current = true;
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
