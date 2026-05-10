"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: March 14, 2026</p>
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground prose-headings:text-foreground space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide when signing in with your @kiit.ac.in Google account, including your name, email address, profile photo, and academic details you enter during onboarding (branch, batch, CGPA, percentages).</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>Your information is used to personalize your job feed, verify your eligibility for opportunities, and provide a better user experience. We do not sell your data to third parties.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage</h2>
            <p>Your data is securely stored using Supabase infrastructure with encryption at rest and in transit. Access is restricted to authorized administrators only.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us through the Contact page.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
