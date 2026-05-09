"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  { q: "Who can use Avsaar?", a: "Avsaar is exclusively for KIIT University students, volunteers, and administrators. You must sign in with your official @kiit.ac.in email to access the platform." },
  { q: "How are job postings added?", a: "Placement circulars are posted by authorized volunteers and administrators. Volunteer-submitted posts require admin approval before they become visible to students." },
  { q: "What types of opportunities are posted?", a: "We cover placements, internships, internship-to-PPO opportunities, hackathons, webinars, and talks — everything that comes through official KIIT channels." },
  { q: "How does the personalized feed work?", a: "Once you complete your profile with your branch, batch, and CGPA, the 'My Feed' tab shows only the opportunities you're eligible for based on those criteria." },
  { q: "Can I download official circulars?", a: "Yes! Every job posting includes the original circular PDF uploaded by the poster. You can download it directly from the job detail page." },
  { q: "I'm having trouble signing in. What do I do?", a: "Make sure you're using your @kiit.ac.in Google account. If the issue persists, clear your browser cookies and try again, or contact us through the Contact page." },
];

export default function FAQsPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="h-7 w-7 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-black text-xs">A</div>
          <span className="hidden sm:inline-block">Avsaar</span>
        </Link>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-3xl space-y-8 animate-in fade-in duration-300">
        <Link href="/">
          <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Quick answers to common questions about Avsaar.</p>
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
      </main>
    </div>
  );
}
