"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Briefcase, Building, ShieldCheck, Sparkles, Users, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const { session, user, isLoading } = useAuth();
  const isAuthenticated = !!session && !!user;

  const avatarFallback = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  // CTA buttons — optimistic rendering with no blocking spinner
  const HeaderCTA = () => {
    if (isLoading) {
      // Shimmer placeholder — same size as final buttons so there's no layout shift
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-20 rounded-lg bg-muted/30 animate-pulse" />
          <div className="h-9 w-28 rounded-full bg-muted/30 animate-pulse" />
        </div>
      );
    }
    if (isAuthenticated) {
      return (
        <div className="flex items-center gap-3">
          <Link href="/jobs">
            <Button variant="ghost" className="font-medium gap-2">
              <Briefcase className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/profile">
            <Avatar className="h-8 w-8 hover:ring-2 hover:ring-emerald-700/30 transition-all cursor-pointer">
              {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />}
              <AvatarFallback className="bg-emerald-900/30 text-emerald-400 font-semibold text-xs">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Link href="/login">
          <Button variant="ghost" className="font-medium">Sign In</Button>
        </Link>
        <Link href="/login">
          <Button className="bg-gradient-brand hover:opacity-90 text-white font-semibold rounded-full px-6 transition-opacity">
            Get Started
          </Button>
        </Link>
      </div>
    );
  };

  const HeroCTA = () => {
    if (isLoading) {
      return <div className="h-12 w-48 rounded-full bg-muted/30 animate-pulse mx-auto sm:mx-0" />;
    }
    if (isAuthenticated) {
      return (
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/jobs">
            <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full border-emerald-700/30 text-emerald-400 hover:bg-emerald-600/10 font-semibold transition-all hover:-translate-y-0.5">
              My Profile <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/login">
          <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5">
            Access Portal <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Logo href="/" height={36} />
        <HeaderCTA />
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-44 flex justify-center items-center text-center px-4 relative overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-400/8 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

          <div className="container px-4 md:px-6 space-y-8 relative z-10">
            <div className="mx-auto max-w-[800px] space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                अवSaar is a centralized platform for KIIT University students to discover, track, and access placements, internships, and hackathons.
              </p>
            </div>

            {/* Personalized greeting for authenticated users */}
            {isAuthenticated && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "200ms" }}>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 border border-emerald-700/30 backdrop-blur-sm">
                  <Avatar className="h-7 w-7">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />}
                    <AvatarFallback className="bg-emerald-900/30 text-emerald-400 font-semibold text-[10px]">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    Welcome back, <span className="text-emerald-400">{user?.full_name?.split(" ")[0] || "User"}</span>
                  </span>
                </div>
              </div>
            )}

            <HeroCTA />
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-16 md:py-24 border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4 tracking-tight">
              Streamlined Placement Process
            </h2>
            <p className="text-center text-muted-foreground max-w-lg mx-auto mb-12">
              Everything you need to stay on top of your career opportunities, curated for KIIT students.
            </p>
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

        {/* Stats section */}
        <section className="w-full py-16 md:py-20 border-t border-border/50 bg-card/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
              {[
                { icon: Briefcase, value: "500+", label: "Opportunities Posted" },
                { icon: Users, value: "10,000+", label: "Students Served" },
                { icon: Building, value: "200+", label: "Companies" },
                { icon: BarChart3, value: "95%", label: "Placement Rate" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2 p-4">
                  <stat.icon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-3xl md:text-4xl font-extrabold text-gradient-brand">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 border-t border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to explore your next opportunity?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              {isAuthenticated
                ? "Jump back into your dashboard and check the latest postings."
                : "Join thousands of KIIT students already using अवSaar to land their dream roles."
              }
            </p>
            {isAuthenticated ? (
              <Link href="/jobs">
                <Button className="h-12 px-8 rounded-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5">
                  Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="h-12 px-8 rounded-full bg-gradient-brand hover:opacity-90 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5">
                  Get Started Free <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Logo href="/" height={32} />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Centralized placement portal for KIIT University — connecting students with top career opportunities.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/contact", label: "Contact" },
                  { href: "/faqs", label: "FAQs" },
                  { href: "/blog", label: "Blog" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/cookies", label: "Cookie Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Connect</h4>
              <ul className="space-y-2.5">
                {[
                  { href: "https://github.com", label: "GitHub", external: true },
                  { href: "https://linkedin.com", label: "LinkedIn", external: true },
                  { href: "https://twitter.com", label: "Twitter / X", external: true },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50">
          <div className="container mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} अवSaar. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Made with ♥ for KIIT University
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
