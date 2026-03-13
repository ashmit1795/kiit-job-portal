"use client";

import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { session, isLoading, signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && session) {
      if (user && !user.profile_completed && user.role !== "admin") {
        router.push("/onboarding");
      } else {
        router.push("/jobs");
      }
    }
  }, [session, user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-background to-background pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-6 rounded-2xl bg-card/80 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-900/20 border border-border/50">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-900/30">
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to Avsaar</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with your <span className="font-medium text-emerald-400">@kiit.ac.in</span> email to access opportunities.
          </p>
        </div>
        <Button
          onClick={signIn}
          className="w-full bg-gradient-brand hover:opacity-90 text-white font-semibold h-11 rounded-xl shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
          size="lg"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
