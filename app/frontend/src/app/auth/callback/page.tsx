"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Still resolving auth state — stay on the loading screen
    if (isLoading) return;
    // Already acted — prevent double redirects
    if (hasRedirected.current) return;

    if (user) {
      // Backend user is loaded — route based on profile completion
      hasRedirected.current = true;
      if (!user.profile_completed && user.role !== "admin") {
        router.replace("/onboarding");
      } else {
        router.replace("/jobs");
      }
      return;
    }

    // isLoading is false and user is null.
    // This can happen on the very first INITIAL_SESSION event when there is
    // no existing session yet (Supabase fires it before the OAuth code is
    // exchanged). Check whether Supabase actually has a session; if it does
    // but we still have no app-user it means the backend call failed — only
    // then redirect to login.
    supabase.auth.getSession().then(({ data }) => {
      if (hasRedirected.current) return;
      if (!data.session) {
        // No Supabase session at all → the INITIAL_SESSION null event;
        // wait for the real SIGNED_IN event to fire (isLoading will flip again)
        return;
      }
      // There IS a session but no app-user → backend refused the sign-in
      // (403 already showed a toast and signed out via auth-provider)
      hasRedirected.current = true;
      router.replace("/login");
    });
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
