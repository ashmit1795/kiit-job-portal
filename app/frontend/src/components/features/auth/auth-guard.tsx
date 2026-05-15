"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { session, user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  // Remember the last known user so we never flash a spinner on token refresh
  const lastKnownUserRef = useRef(user);
  if (user) lastKnownUserRef.current = user;

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (user && !user.profile_completed && user.role !== "admin" && !pathname.startsWith("/onboarding")) {
      router.push("/onboarding");
      return;
    }

    // Admins bypass profile requirement
  }, [session, user, isLoading, router, pathname]);

  // Only block on the initial cold-start (isLoading is permanently false after that).
  // After first boot: if session is gone → redirect is in flight, show nothing.
  // Never block on session object identity changes (token refresh).
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  // Not yet loaded + no session → redirect to login is in flight
  if (!session && !isLoading) {
    return null;
  }

  return <>{children}</>;
}
