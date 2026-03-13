"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Building, GraduationCap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight" href="#">
          <div className="h-8 w-8 rounded-lg bg-gradient-brand flex items-center justify-center text-white font-black text-sm">A</div>
          <span className="hidden sm:inline-block text-foreground">Avsaar</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-brand hover:opacity-90 text-white font-semibold rounded-full px-6 transition-opacity">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-44 flex justify-center items-center text-center px-4 relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-400/8 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

          <div className="container px-4 md:px-6 space-y-8 relative z-10">
            <div className="mx-auto max-w-[800px] space-y-6">
              <div className="inline-flex items-center rounded-full border border-emerald-700/30 bg-emerald-950/50 px-4 py-1.5 text-sm font-medium text-emerald-400 transition-all hover:scale-105 cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                Official placement tracking for KIIT students
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                Your gateway to{" "}
                <br className="hidden sm:block" />
                <span className="text-gradient-brand">top career opportunities</span>
              </h1>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                Avsaar is a centralized platform for KIIT University students to discover, track, and access placements, internships, and hackathons.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5">
                  Access Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-16 md:py-24 border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">
              Streamlined Placement Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: ShieldCheck, title: "Secure Access", desc: "Sign in exclusively with your official @kiit.ac.in credentials to access verified opportunities." },
                { icon: Briefcase, title: "Latest Circulars", desc: "Get instant access to official placement circulars, internship postings, and webinar details." },
                { icon: Building, title: "Smart Tracking", desc: "Filter opportunities by your eligibility criteria, track deadlines, and download official PDFs." },
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-emerald-700/40 transition-all hover:shadow-lg hover:shadow-emerald-900/10 group">
                  <div className="h-14 w-14 rounded-xl bg-emerald-900/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Avsaar. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground mt-2 sm:mt-0 font-medium tracking-tight">
          Developed for KIIT University
        </p>
      </footer>
    </div>
  );
}
