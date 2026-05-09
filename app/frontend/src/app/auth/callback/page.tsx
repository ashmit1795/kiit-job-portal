"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Wait until auth provider has finished resolving
    if (isLoading) return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;

    if (user) {
      // Authenticated and backend-verified — go to the right page
      if (!user.profile_completed && user.role !== "admin") {
        router.replace("/onboarding");
      } else {
        router.replace("/jobs");
      }
    } else {
      // No user after loading finished — means sign-in failed
      // (unauthorized email, 403, signOut already called by auth-provider)
      // Just go to login — toast was already shown by auth-provider
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
