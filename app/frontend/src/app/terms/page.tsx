"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: March 14, 2026</p>
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground prose-headings:text-foreground space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using अवSaar, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Eligible Users</h2>
            <p>अवSaar is available exclusively to students, staff, and authorized personnel of KIIT University with a valid @kiit.ac.in email address.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. User Conduct</h2>
            <p>You agree not to misuse the platform, post misleading information, or attempt to access features beyond your assigned role.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Content Ownership</h2>
            <p>Job circulars and official documents posted on अवSaar remain the property of KIIT University and the respective companies. They are shared for informational purposes only.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Limitation of Liability</h2>
            <p>अवSaar is provided "as is" without warranty. We are not responsible for the accuracy of job postings or the outcome of any application process.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
