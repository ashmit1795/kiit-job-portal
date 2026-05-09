"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) throw error;

        await refreshUser();
      } catch (err: any) {
        console.error("Auth callback error:", err);
        const message = err?.response?.data?.message || err.message || "Authentication failed. Please try again.";
        setError(message);
        toast.error(message);
      }
    };

    handleAuthCallback();
  }, [refreshUser]);

  useEffect(() => {
    if (user) {
      if (!user.profile_completed && user.role !== "admin") {
        router.push("/onboarding");
      } else {
        router.push("/jobs");
      }
    }
  }, [user, router]);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
        <div className="max-w-sm text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-400 mb-2">
            ✕
          </div>
          <h2 className="text-lg font-bold text-red-400">Authentication Failed</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={() => router.push("/login")}
            className="bg-gradient-brand hover:opacity-90 text-white font-semibold"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
