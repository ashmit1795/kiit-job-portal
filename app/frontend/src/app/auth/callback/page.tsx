"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

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
        setError(err.message || "Failed to authenticate.");
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
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">Authentication Error: {error}</p>
        <button onClick={() => router.push("/login")} className="text-blue-500 underline">
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      <p className="text-sm text-zinc-500">Signing you in...</p>
    </div>
  );
}
