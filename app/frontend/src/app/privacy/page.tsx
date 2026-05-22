import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy for अवSaar to understand how we securely collect, store, and process student profile data, educational records, and uploaded resume PDFs.",
};

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
        <p className="text-xs text-muted-foreground">Last updated: May 22, 2026</p>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-400/80">
          अवSaar is an independent, student-run platform and is not affiliated with or operated by KIIT University. This privacy policy describes how we, the platform operators (a small team of students), handle your data.
        </div>
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground prose-headings:text-foreground space-y-6">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you sign in with your @kiit.ac.in Google account, we receive your name, email address, and profile photo from Google. During onboarding, you optionally provide academic details: your branch, batch, CGPA, 10th and 12th board percentages, and a resume PDF. These are used solely to personalize your experience on the platform.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Authenticate your identity and restrict access to the KIIT community</li>
              <li>Personalize your job feed based on your eligibility criteria</li>
              <li>Display your profile within the platform</li>
              <li>Send optional email notifications about new opportunities (you can opt out at any time from your profile settings)</li>
            </ul>
            <p>We do not sell your data, share it with third parties for commercial purposes, or use it for advertising.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage</h2>
            <p>Your data is stored securely using Supabase infrastructure, which provides encryption at rest and in transit. Resume PDFs are stored in private Supabase Storage buckets and are only accessible via short-lived signed URLs generated on demand. Access is restricted to authorized platform administrators.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Community-Contributed Content</h2>
            <p>Placement information on अवSaar is community-contributed by student volunteers. We are not responsible for the accuracy, completeness, or timeliness of this information. Always verify important placement details through official KIIT channels.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us through the <Link href="/contact" className="text-emerald-400 hover:underline">Contact page</Link>. We will process your request promptly.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Cookies</h2>
            <p>We use minimal cookies necessary for authentication and session management. We do not use tracking or advertising cookies. For more details, see our <Link href="/cookies" className="text-emerald-400 hover:underline">Cookie Policy</Link>.</p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
            <p>Questions about this privacy policy? Reach out through the <Link href="/contact" className="text-emerald-400 hover:underline">Contact page</Link>. As an independent student platform, we&apos;ll respond as promptly as we can.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
