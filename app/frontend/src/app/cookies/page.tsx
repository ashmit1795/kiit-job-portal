"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Logo href="/" height={30} />
      </header>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-3xl space-y-8 animate-in fade-in duration-300">
        <Link href="/">
          <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: March 14, 2026</p>
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground prose-headings:text-foreground space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us provide a better experience by remembering your preferences and session information.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Cookies We Use</h2>
            <p><strong>Essential cookies:</strong> Required for authentication and security. These include your Supabase session token.</p>
            <p><strong>Preference cookies:</strong> Store your UI preferences such as theme settings.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Third-Party Cookies</h2>
            <p>We use Google OAuth for authentication, which may set its own cookies. Please refer to Google's privacy policy for more information.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Managing Cookies</h2>
            <p>You can manage or delete cookies through your browser settings. Note that disabling essential cookies may prevent you from using अवSaar.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
