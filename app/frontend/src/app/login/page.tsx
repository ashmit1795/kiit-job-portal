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
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">KIIT Placement</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in with your @kiit.ac.in email to access opportunities.
          </p>
        </div>
        <div className="space-y-4">
          <Button onClick={signIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
