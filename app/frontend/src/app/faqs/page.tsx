"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Is अवSaar an official KIIT University portal?",
    a: "No. अवSaar is an independent, student-built initiative and is not affiliated with, endorsed by, or officially operated by KIIT University. It is not a product of KIIT's Training & Placement department. Always verify critical placement information through official KIIT channels.",
  },
  {
    q: "Who manages अवSaar?",
    a: "अवSaar is managed by a small team of KIIT students. Trusted community volunteers help keep placement information current, and platform admins review all volunteer-submitted content before it goes live.",
  },
  {
    q: "Where does the information come from?",
    a: "Information is contributed by community volunteers who collect placement circulars, internship notices, and announcements from various sources. All volunteer posts go through a review process before being published. We strongly recommend cross-referencing important details with official KIIT T&P communications.",
  },
  {
    q: "Who can use अवSaar?",
    a: "अवSaar is open to KIIT students and community members who sign in with their @kiit.ac.in Google account. This is a technical restriction to keep the community relevant — it does not imply any official university endorsement.",
  },
  {
    q: "How does the personalized feed work?",
    a: "Once you complete your profile with your branch, batch, and CGPA, the 'My Feed' tab automatically filters opportunities to show only what you're eligible for based on those criteria. No more manually checking if a posting is relevant to you.",
  },
  {
    q: "Can students contribute updates?",
    a: "Yes — trusted community members can become volunteers and help post circulars and opportunities. If you're interested in contributing, speak to a platform admin through the Contact page.",
  },
  {
    q: "How accurate is the information?",
    a: "We do our best to ensure accuracy, but अवSaar is a community-maintained platform. Information is best-effort and may occasionally be incomplete or delayed. For anything time-sensitive or official, always check KIIT's official T&P communications directly.",
  },
  {
    q: "Why use अवSaar instead of WhatsApp groups?",
    a: "WhatsApp groups bury circulars under unrelated messages, have no search, no deadline tracking, and no eligibility filtering. अवSaar gives every posting a permanent, searchable home — with filters, PDF downloads, and a feed tuned to your profile. Less noise. More signal.",
  },
  {
    q: "Are the announcements on अवSaar official KIIT notices?",
    a: "No. Announcements on अवSaar are community-contributed and are not official KIIT notices. They are shared for informational convenience. Treat them as community-sourced information and verify anything important through official KIIT channels.",
  },
  {
    q: "How frequently is information updated?",
    a: "Updates depend on community volunteer activity. We aim to keep the feed current, but there may be gaps. If you notice a missing opportunity, reach out through the Contact page — or consider becoming a volunteer.",
  },
  {
    q: "I'm having trouble signing in. What do I do?",
    a: "Make sure you're using your @kiit.ac.in Google account. If the issue persists, clear your browser cookies and try again. For further help, reach out through the Contact page.",
  },
  {
    q: "Will अवSaar collaborate with KIIT in the future?",
    a: "We'd genuinely welcome it. Our goal is to make placement communication smoother for everyone in the KIIT ecosystem. If the initiative resonates with KIIT's T&P department at some point, we'd be excited to explore how we can contribute to an even better placement experience together. For now, we're building independently.",
  },
];

export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null);

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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Common questions about अवSaar — what it is, how it works, and what it isn&apos;t.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border/50 rounded-xl bg-card/50 overflow-hidden transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-border/30 bg-card/30 text-center">
          <p className="text-xs text-muted-foreground/60">
            अवSaar is an independent student initiative and is not affiliated with KIIT University. Have a question not covered here? <Link href="/contact" className="text-emerald-500 hover:underline">Contact us</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}
