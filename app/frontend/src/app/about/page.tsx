"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Lightbulb, Users, Target, Telescope } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Logo href="/" height={30} />
      </header>
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-3xl space-y-10 animate-in fade-in duration-300">
        <Link href="/">
          <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-emerald-400 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>

        {/* Heading */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-900/30 flex items-center justify-center text-emerald-400">
              <Heart className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">About अवSaar</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed text-lg">
            An independent, student-built placement information platform for the KIIT community.
          </p>
          <div className="inline-block text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
            Not an official KIIT University product
          </div>
        </div>

        {/* Origin story */}
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-foreground">Why we built this</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            If you&apos;ve been a KIIT student navigating placements, you know the drill — circulars arrive in five different WhatsApp groups, critical deadlines get buried under memes and forwarded messages, and you inevitably find out about an opportunity <em>after</em> it has closed.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            अवSaar started as a frustration and became a project. We wanted one clean place where every placement circular, internship notice, and hackathon announcement actually lived — organized, searchable, and filtered to what matters to you personally.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;re students. We built this for ourselves, and for everyone else going through the same chaos.
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Target className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-foreground">What we&apos;re trying to do</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1 shrink-0">→</span>
              Centralize placement information so students don&apos;t miss opportunities because of information fragmentation.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1 shrink-0">→</span>
              Surface only the opportunities you&apos;re actually eligible for, based on your branch, batch, and CGPA.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1 shrink-0">→</span>
              Give every circular a permanent, searchable home — no more hunting through chat history.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1 shrink-0">→</span>
              Reduce last-minute placement chaos and missed deadlines through better visibility.
            </li>
          </ul>
        </div>

        {/* Community model */}
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-foreground">How it works — a community model</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            अवSaar runs on a community contribution model. Trusted student volunteers help keep the platform current by posting and organizing circulars. Every volunteer post goes through a review before it&apos;s published. Admins maintain quality and accuracy.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Information on अवSaar is community-maintained and best-effort. While we strive for accuracy, always cross-reference important details with official KIIT T&P communications.
          </p>
        </div>

        {/* Key features */}
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <h2 className="text-xl font-semibold">What&apos;s on the platform</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Placement drives, internship notices, PPO opportunities</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Hackathons, webinars, and talks</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Personalized feed filtered by your eligibility criteria</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Official circular PDF downloads with deadline tracking</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> KIIT Google account authentication (@kiit.ac.in)</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Role-based access: students, volunteers, and platform admins</li>
          </ul>
        </div>

        {/* Future vision */}
        <div className="space-y-4 p-6 rounded-xl border border-emerald-700/20 bg-emerald-950/20">
          <div className="flex items-center gap-2 text-emerald-400">
            <Telescope className="h-5 w-5" />
            <h2 className="text-xl font-semibold text-foreground">Where we hope to go</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The long-term vision for अवSaar is a smoother, more organized placement experience for everyone in the KIIT ecosystem. We&apos;re just getting started — features like push notifications, AI-assisted circular parsing, and advanced analytics are on the roadmap.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;re an independent initiative, and we genuinely hope the work we&apos;re doing here is useful. If it resonates with KIIT&apos;s Training & Placement department at some point in the future, we&apos;d welcome any conversation about how we can contribute to an even better ecosystem together.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Until then — we&apos;re building, one circular at a time.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-border/30 bg-card/30 text-center">
          <p className="text-xs text-muted-foreground/60 leading-relaxed">
            अवSaar is an independent student initiative and is <strong className="text-muted-foreground/80">not affiliated with, endorsed by, or operated by KIIT University</strong>. All institutional names, trademarks, and branding belong to their respective owners. Information on this platform is community-contributed and best-effort.
          </p>
        </div>
      </main>
    </div>
  );
}
