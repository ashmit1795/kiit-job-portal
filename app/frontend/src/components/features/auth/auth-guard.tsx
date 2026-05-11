"use client";

import { useEffect } from "react";
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

  if (isLoading || (!session && !isLoading) || (session && !user)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return <>{children}</>;
}
