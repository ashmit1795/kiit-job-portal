import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the Terms of Service for अवSaar to learn about eligibility guidelines, volunteer and contributor codes of conduct, and platform rules for our independent placement portal.",
};

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
        <p className="text-xs text-muted-foreground">Last updated: May 22, 2026</p>

        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-400/80">
          <strong>Important:</strong> अवSaar is an independent, student-run platform and is <strong>not affiliated with, operated by, or endorsed by KIIT University</strong>. By using this platform, you acknowledge this distinction.
        </div>

        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground prose-headings:text-foreground space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using अवSaar, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. These terms may be updated periodically — continued use constitutes acceptance.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Who Can Use अवSaar</h2>
            <p>अवSaar is available to KIIT students and community members who authenticate with a valid @kiit.ac.in Google account. This is a technical restriction to maintain community relevance — it does not imply any official institutional affiliation or endorsement.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Non-Affiliation Disclaimer</h2>
            <p>अवSaar is an independent student initiative. We are not KIIT University. We are not the T&P department. We are not acting on behalf of any official KIIT body. All institutional names, trademarks, and circular content referenced on this platform belong to their respective owners and are used purely for informational convenience.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Community-Contributed Content</h2>
            <p>Placement information on अवSaar is contributed by community volunteers and is best-effort. We do not guarantee the accuracy, completeness, or timeliness of any information. Placement circulars, deadlines, and eligibility details should always be verified through official KIIT T&P communications before acting on them.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. User Conduct</h2>
            <p>You agree not to misuse the platform, post misleading or inaccurate information, attempt to access features beyond your assigned role, or impersonate any person or organization. Violations may result in removal from the platform.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Content & Intellectual Property</h2>
            <p>Circular PDFs and official documents shared on अवSaar remain the property of KIIT University and the respective companies that issued them. They are shared purely for informational access and discoverability — not for redistribution or commercial use.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. No Guarantee of Outcomes</h2>
            <p>अवSaar is a placement information and discovery tool. We make no guarantees about placement outcomes, the accuracy of opportunity details, or the availability of roles listed on the platform. Use the information here as a starting point, not a definitive source.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">8. Platform Availability</h2>
            <p>अवSaar is provided on an &quot;as-is&quot; basis by a small student team. We do our best to keep it running, but we cannot guarantee uninterrupted availability. We reserve the right to modify or temporarily suspend the platform without notice.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
