"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowRight, 
  Briefcase, 
  Bell, 
  Search, 
  Users, 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  MapPin,
  Menu, 
  X, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Sparkles, 
  Clock, 
  Lock, 
  ShieldAlert,
  GraduationCap,
  Calendar,
  Layers
} from "lucide-react";

export default function LandingPage() {
  const { session, user, isLoading } = useAuth();
  const isAuthenticated = !!session && !!user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const avatarFallback = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  // CTA buttons — optimistic rendering with no blocking spinner
  const renderHeaderCTA = (isMobile = false) => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-20 rounded-lg bg-muted/30 animate-pulse" />
          <div className="h-9 w-28 rounded-full bg-muted/30 animate-pulse" />
        </div>
      );
    }
    if (isAuthenticated) {
      return (
        <div className={`flex items-center ${isMobile ? "flex-col w-full gap-4 mt-4" : "gap-3"}`}>
          <Link href="/jobs" className={isMobile ? "w-full" : ""}>
            <Button variant="ghost" className={`font-medium gap-2 transition-premium hover:bg-emerald-950/30 hover:text-emerald-400 active:scale-[0.97] ${isMobile ? "w-full justify-center py-6 text-base" : ""}`}>
              <Briefcase className="h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/profile" className={isMobile ? "w-full flex justify-center mt-2" : ""}>
            <div className={`flex items-center gap-2 cursor-pointer group ${isMobile ? "border border-border/60 p-3 rounded-2xl w-full justify-center bg-card/45" : ""}`}>
              <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-premium">
                {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />}
                <AvatarFallback className="bg-emerald-950 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              {isMobile && (
                <span className="text-sm font-medium text-foreground">
                  {user?.full_name || "View Profile"}
                </span>
              )}
            </div>
          </Link>
        </div>
      );
    }
    return (
      <div className={`flex items-center ${isMobile ? "flex-col w-full gap-4 mt-6" : "gap-3"}`}>
        <Link href="/login" className={isMobile ? "w-full" : ""}>
          <Button variant="ghost" className={`font-medium transition-premium hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-[0.97] ${isMobile ? "w-full py-6 text-base" : ""}`}>Sign In</Button>
        </Link>
        <Link href="/login" className={isMobile ? "w-full" : ""}>
          <Button className={`bg-gradient-brand hover:opacity-95 text-white font-semibold rounded-full px-6 transition-premium hover:scale-[1.02] active:scale-[0.98] hover-shine hover:shadow-lg hover:shadow-emerald-500/25 ${isMobile ? "w-full py-6 text-base shadow-lg shadow-emerald-500/20" : ""}`}>
            Get Started
          </Button>
        </Link>
      </div>
    );
  };

  const renderHeroCTA = () => {
    if (isLoading) {
      return <div className="h-12 w-48 rounded-full bg-muted/30 animate-pulse mx-auto" />;
    }
    if (isAuthenticated) {
      return (
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto group/hero-cta">
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-brand hover:opacity-95 text-white font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-500/35 transition-premium hover:scale-[1.04] hover:-translate-y-0.5 hover-shine hover:shadow-emerald-500/20 hover:shadow-xl active:scale-[0.98] inline-flex items-center justify-center">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/hero-cta:translate-x-1" />
            </Button>
          </Link>
          <Link href="/profile" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-full border-emerald-500/25 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500/10 font-semibold transition-premium hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-emerald-950/45 hover:shadow-lg active:scale-[0.98]">
              My Profile <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    }
    return (
      <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-sm mx-auto group/hero-cta">
        <Link href="/login" className="w-full">
          <Button className="w-full h-13 px-8 rounded-full bg-gradient-brand hover:opacity-95 text-white text-base font-semibold shadow-xl shadow-emerald-950/50 border border-emerald-500/35 transition-premium hover:scale-[1.04] hover:-translate-y-0.5 hover-shine hover:shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center">
            Get Started for Free <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/hero-cta:translate-x-1.5" />
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Cinematic Dot Grid Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.08),rgba(255,255,255,0))] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50 z-0" />

      {/* Header */}
      <header className="px-4 lg:px-8 h-16 flex items-center justify-between border-b border-white/[0.04] bg-background/50 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <Logo href="/" height={34} />
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-colors">About</Link>
          <Link href="/faqs" className="text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-colors">FAQs</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-colors">Contact</Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-emerald-400 transition-colors">Tips</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center">
          {renderHeaderCTA()}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden p-2 rounded-lg border border-border/30 hover:border-emerald-500/30 hover:bg-emerald-950/20 text-foreground transition-all z-50 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-emerald-400 animate-in spin-in-12 duration-200" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Mobile Navigation Drawer / Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-0 left-0 w-screen h-screen bg-background/95 backdrop-blur-2xl z-40 flex flex-col p-6 animate-in fade-in duration-300 md:hidden">
            <div className="flex items-center justify-between h-16 border-b border-border/20 mb-8">
              <Logo href="/" height={32} />
            </div>

            <nav className="flex flex-col gap-5 text-lg font-medium">
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-emerald-950/10 hover:text-emerald-400 transition-all"
              >
                <span>About Avsaar</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/faqs" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-emerald-950/10 hover:text-emerald-400 transition-all"
              >
                <span>FAQs</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-emerald-950/10 hover:text-emerald-400 transition-all"
              >
                <span>Contact Us</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/blog" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:bg-emerald-950/10 hover:text-emerald-400 transition-all"
              >
                <span>Placement Tips</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </nav>

            <div className="mt-auto border-t border-border/30 pt-6">
              {renderHeaderCTA(true)}
              <p className="text-center text-xs text-muted-foreground/60 mt-6 leading-relaxed">
                Independent Student Initiative · Not Officially Affiliated with KIIT University
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10 relative">
        <section className="w-full py-16 md:py-28 lg:py-36 flex flex-col justify-center items-center text-center px-4 overflow-hidden relative">
          
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-emerald-500/10 rounded-full blur-[100px] md:blur-[130px] animate-drift-slow pointer-events-none z-0" />
          <div className="absolute bottom-10 left-1/3 w-[250px] md:w-[450px] h-[250px] md:h-[450px] bg-green-500/5 rounded-full blur-[90px] md:blur-[120px] animate-drift-fast pointer-events-none z-0" />

          <div className="container max-w-5xl px-4 md:px-6 space-y-10 relative z-10">
            <div className="mx-auto max-w-[850px] space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Badge Callout */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-950/45 px-4 py-1.5 text-xs md:text-sm font-medium text-emerald-400 shadow-inner backdrop-blur-md transition-premium hover:border-emerald-500/45 hover:bg-emerald-950/65 hover:scale-[1.02] active:scale-[0.98] hover:shadow-emerald-500/10 hover:shadow-md cursor-default select-none mx-auto group/badge">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 group-hover/badge:rotate-12 group-hover/badge:scale-110 transition-transform duration-300" />
                <span>Made by students, for students · KIIT Community</span>
              </div>
              
              {/* Header Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] md:leading-[1.05] text-foreground">
                Placement updates,<br />
                <span className="text-gradient-brand">beautifully unified.</span>
              </h1>
              
              {/* Subheading */}
              <p className="mx-auto max-w-xl text-muted-foreground text-sm sm:text-base md:text-xl leading-relaxed font-normal">
                Ditch the WhatsApp notifications. Discover drive updates, eligibility parameters, and circular PDFs curated in a sleek dashboard.
              </p>
              
              {/* CTAs */}
              <div className="pt-2">
                {renderHeroCTA()}
              </div>
            </div>

            {/* Personalized Welcome Banner */}
            {isAuthenticated && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500" style={{ animationDelay: "200ms" }}>
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/65 border border-emerald-500/20 backdrop-blur-md shadow-lg shadow-black/20">
                  <Avatar className="h-7 w-7 border border-emerald-500/20">
                    {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || "User"} />}
                    <AvatarFallback className="bg-emerald-950 text-emerald-400 font-semibold text-[10px]">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Glad to have you back, <span className="text-emerald-400 font-semibold">{user?.full_name?.split(" ")[0]}</span>!
                  </span>
                </div>
              </div>
            )}

            {/* Interactive UX Mockup Preview (Aesthetic Asset matching the screenshot) */}
            <div className="w-full max-w-5xl mx-auto pt-8 animate-in fade-in zoom-in-95 duration-1000 delay-300 select-none animate-float">
              <div className="rounded-2xl border border-emerald-500/10 bg-[#020604] p-4 sm:p-6 shadow-2xl shadow-black/60 relative overflow-hidden transition-premium hover:border-emerald-500/20 group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between border-b border-emerald-950/40 pb-4 mb-5 text-left select-none">
                  {/* Red, Yellow, Green Window Dots */}
                  <div className="flex items-center gap-1.5 group/window-dots cursor-pointer">
                    <span className="h-3 w-3 rounded-full bg-[#ef4444]/90 shadow-sm shadow-[#ef4444]/30 hover:bg-[#ef4444] transition-colors" />
                    <span className="h-3 w-3 rounded-full bg-[#eab308]/90 shadow-sm shadow-[#eab308]/30 hover:bg-[#eab308] transition-colors" />
                    <span className="h-3 w-3 rounded-full bg-[#22c55e]/90 shadow-sm shadow-[#22c55e]/30 hover:bg-[#22c55e] transition-colors" />
                  </div>
                  {/* Centered Address URL */}
                  <div className="hidden sm:flex items-center gap-2 bg-[#050a08] border border-emerald-950/80 rounded-lg px-6 py-1.5 text-[11px] font-medium text-emerald-400/60 font-mono tracking-wide shadow-inner transition-premium hover:border-emerald-500/25">
                    <Lock className="h-3 w-3 text-emerald-500/40" />
                    <span>avsaar.vercel.app/jobs</span>
                  </div>
                  {/* Right Side Status Dot */}
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-500/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                    <span>My Feed</span>
                  </div>
                </div>

                {/* Search Bar & Filter Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
                  {/* Search Input Mock */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#050a08] border border-emerald-950/60 flex-1 text-left transition-premium hover:border-emerald-500/20 hover:bg-[#060e0a] cursor-pointer">
                    <Search className="h-4 w-4 text-emerald-500/40" />
                    <span className="text-xs sm:text-sm text-emerald-500/40">Search companies, roles...</span>
                  </div>
                  {/* Filter Select Mock */}
                  <div className="flex items-center justify-between gap-6 px-3 py-2.5 rounded-lg bg-[#050a08] border border-emerald-950/60 text-left text-xs sm:text-sm text-emerald-400/80 min-w-[120px] transition-premium hover:border-emerald-500/20 hover:bg-[#060e0a] cursor-pointer">
                    <span>All Types</span>
                    <ChevronDown className="h-4 w-4 text-emerald-500/60" />
                  </div>
                </div>

                {/* Grid of 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                  
                  {/* Card 1: Sales Development Representative */}
                  <div className="p-5 rounded-xl border-l-4 border-l-[#7c3aed] border-y border-r border-[#0e1712] bg-[#050a08] flex flex-col justify-between min-h-[290px] shadow-lg shadow-black/20 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:border-emerald-500/20 hover:shadow-black/50 hover:shadow-xl cursor-pointer group/card1">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/15 rounded px-2.5 py-0.5">
                          Internship + PPO
                        </span>
                        <span className="text-[10px] font-medium text-[#10b981] bg-[#059669]/10 border border-[#059669]/15 rounded px-2 py-0.5">
                          approved
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-foreground leading-tight group-hover/card1:text-emerald-400 transition-colors">
                        Sales Development Representative...
                      </h4>
                      
                      {/* Company Info */}
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[10px] font-bold text-[#10b981] group-hover/card1:scale-110 group-hover/card1:border-[#10b981]/40 transition-premium">
                          C
                        </div>
                        <span className="text-xs text-muted-foreground">ContraVault AI</span>
                      </div>
                      
                      {/* Ref ID */}
                      <p className="text-[10px] text-muted-foreground/45 font-mono">
                        Ref: KIIT-DU/T&P/26/403
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      {/* Parameters Grid */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-[#10b981] font-medium">
                          <div className="flex items-center gap-1">
                            <span>₹</span> 9 - 15 LPA
                          </div>
                          <div className="flex items-center gap-1">
                            <span>₹</span> 40k/month
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>Bangalore</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>CGPA ≥ 6</span>
                        </div>
                      </div>

                      {/* Batch Tag */}
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/25 rounded px-2.5 py-0.5">
                          2027
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold pt-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Tomorrow</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Apprenticeship Programme */}
                  <div className="p-5 rounded-xl border-l-4 border-l-[#2563eb] border-y border-r border-[#0e1712] bg-[#050a08] flex flex-col justify-between min-h-[290px] shadow-lg shadow-black/20 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:border-emerald-500/20 hover:shadow-black/50 hover:shadow-xl cursor-pointer group/card2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-[#60a5fa] bg-[#2563eb]/10 border border-[#2563eb]/15 rounded px-2.5 py-0.5">
                          Internship
                        </span>
                        <span className="text-[10px] font-medium text-[#10b981] bg-[#059669]/10 border border-[#059669]/15 rounded px-2 py-0.5">
                          approved
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-foreground leading-tight group-hover/card2:text-emerald-400 transition-colors">
                        Apprenticeship Programme
                      </h4>
                      
                      {/* Company Info */}
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[10px] font-bold text-[#10b981] group-hover/card2:scale-110 group-hover/card2:border-[#10b981]/40 transition-premium">
                          D
                        </div>
                        <span className="text-xs text-muted-foreground">DBS Tech India</span>
                      </div>
                      
                      {/* Ref ID */}
                      <p className="text-[10px] text-muted-foreground/45 font-mono">
                        Ref: KIIT-DU/T&P/26/246
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      {/* Parameters Grid */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 text-xs text-[#10b981] font-medium">
                          <span>₹</span> 36k/month
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>Hyderabad</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>CGPA ≥ 7</span>
                        </div>
                      </div>

                      {/* Batch Tag */}
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/25 rounded px-2.5 py-0.5">
                          2027
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold pt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Software Engineer (variety: FTE Job and Deadline Today) */}
                  <div className="p-5 rounded-xl border-l-4 border-l-[#db2777] border-y border-r border-[#0e1712] bg-[#050a08] flex flex-col justify-between min-h-[290px] shadow-lg shadow-black/20 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:border-emerald-500/20 hover:shadow-black/50 hover:shadow-xl cursor-pointer group/card3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-[#f472b6] bg-[#db2777]/10 border border-[#db2777]/15 rounded px-2.5 py-0.5">
                          Job (FTE)
                        </span>
                        <span className="text-[10px] font-medium text-[#10b981] bg-[#059669]/10 border border-[#059669]/15 rounded px-2 py-0.5">
                          approved
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-foreground leading-tight group-hover/card3:text-emerald-400 transition-colors">
                        Software Engineer
                      </h4>
                      
                      {/* Company Info */}
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center text-[10px] font-bold text-[#10b981] group-hover/card3:scale-110 group-hover/card3:border-[#10b981]/40 transition-premium">
                          A
                        </div>
                        <span className="text-xs text-muted-foreground">AntBox</span>
                      </div>
                      
                      {/* Ref ID */}
                      <p className="text-[10px] text-muted-foreground/45 font-mono">
                        Ref: KIIT-DU/T&P/26/251
                      </p>
                    </div>

                    <div className="pt-4 space-y-3">
                      {/* Parameters Grid */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-[#10b981] font-medium">
                          <div className="flex items-center gap-1">
                            <span>₹</span> 12 - 18 LPA
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>Bhubaneswar</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5 text-[#10b981]" />
                          <span>CGPA ≥ 7</span>
                        </div>
                      </div>

                      {/* Batch Tag */}
                      <div className="pt-1">
                        <span className="text-[10px] font-semibold bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/25 rounded px-2.5 py-0.5">
                          2027
                        </span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold pt-1 animate-pulse">
                        <Clock className="h-3.5 w-3.5 text-rose-400" />
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Frustration Comparison Section (Sleek UX Layout) */}
        <section className="w-full py-20 md:py-28 border-t border-white/[0.04] relative">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400">The Modern Alternative</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Why we made अवSaar
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                As students, we saw job announcements spread across dozen WhatsApp chats and PDFs. We built a structured home for opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* WhatsApp Chaos Card */}
              <div className="p-6 md:p-8 rounded-2xl border border-red-500/10 bg-red-950/5 flex flex-col justify-between relative overflow-hidden transition-premium hover:-translate-y-1.5 hover:scale-[1.005] hover:border-red-500/20 hover:bg-red-950/8 hover:shadow-2xl hover:shadow-red-950/25 group/chaos">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none group-hover/chaos:scale-125 transition-transform duration-700" />
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-950/30 border border-red-900/20 flex items-center justify-center text-red-400 group-hover/chaos:scale-110 group-hover/chaos:rotate-[-6deg] transition-premium">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover/chaos:text-red-400 transition-colors">The WhatsApp Chaos</h3>
                      <p className="text-xs text-muted-foreground/60">Fragmented, noisy, stressful</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-sm text-muted-foreground/80">
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <X className="h-4 w-4 text-red-500/60 mt-0.5 shrink-0" />
                      <span>Circulars get buried under casual chats and replies.</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <X className="h-4 w-4 text-red-500/60 mt-0.5 shrink-0" />
                      <span>No way to search by eligibility (CGPA, branch, or batch).</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <X className="h-4 w-4 text-red-500/60 mt-0.5 shrink-0" />
                      <span>Missing application deadlines due to chaotic notifications.</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <X className="h-4 w-4 text-red-500/60 mt-0.5 shrink-0" />
                      <span>Forwarded PDFs lack dynamic tracking or bookmarks.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-red-900/15 pt-6 mt-8 text-xs font-semibold text-red-400/85">
                  Result: Missed updates & career anxiety.
                </div>
              </div>

              {/* Avsaar Calm Card */}
              <div className="p-6 md:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/5 flex flex-col justify-between relative overflow-hidden transition-premium hover:-translate-y-1.5 hover:scale-[1.005] hover:border-emerald-500/35 hover:bg-emerald-950/8 hover:shadow-2xl hover:shadow-emerald-950/25 group/calm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none group-hover/calm:scale-125 transition-transform duration-700" />
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-900/40 border border-emerald-500/25 flex items-center justify-center text-emerald-400 group-hover/calm:scale-110 group-hover/calm:rotate-[6deg] transition-premium">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-emerald-400 group-hover/calm:text-emerald-300 transition-colors">The अवSaar Calm</h3>
                      <p className="text-xs text-emerald-400/60">Structured, personal, quiet</p>
                    </div>
                  </div>

                  <ul className="space-y-3.5 text-sm text-emerald-100/80">
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>A single dashboard where every placement drives lives.</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Automatic eligibility match based on your academic profile.</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Structured deadline calendar with visual alerts.</span>
                    </li>
                    <li className="flex items-start gap-2.5 transition-premium hover:translate-x-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>Original circular downloads with single-click access.</span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-emerald-500/15 pt-6 mt-8 text-xs font-semibold text-emerald-400">
                  Result: Peaceful search & targeted execution.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Grid with Modern Cards */}
        <section className="w-full py-20 md:py-28 border-t border-white/[0.04] bg-card/15">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <div className="text-xs font-semibold tracking-widest uppercase text-emerald-400">High-Tech Simplicity</div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Designed to track. Engineered to match.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                We designed Avsaar to be simple, fast, and light. No enterprise bloat — just placement updates tailored directly to you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Centralized Drive Feeds</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Circulars, placements, FTE, internships, hackathons — organized dynamically.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Drive Catalogues
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Eligibility Filters</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Input your CGPA, branch, and batch once. Let our algorithm filter the feed automatically.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Personalized matching
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Immediate PDF Access</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Download drive files directly with single-click signed, secured links.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Document archive
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Active Deadline Trackers</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Always see how many hours or days remain before registration closes.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Expiry awareness
                </div>
              </div>

              {/* Feature 5 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Secure Domain Lock</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ensured domain lockdown restricting platform access exclusively to `@kiit.ac.in` addresses.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Community security
                </div>
              </div>

              {/* Feature 6 */}
              <div className="p-6 rounded-2xl border border-white/[0.04] bg-background/50 flex flex-col justify-between h-[230px] hover:border-emerald-500/20 hover:bg-card/30 transition-premium hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/10 group">
                <div className="space-y-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:rotate-[3deg] group-hover:scale-105 group-hover:text-emerald-300 group-hover:border-emerald-400/35 transition-premium">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">Peer-Managed Curation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Verified student volunteers post opportunities, moderated immediately by admins.
                  </p>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground/45 group-hover:text-emerald-400 transition-colors">
                  Crowdsourced moderation
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Visual Highlights (Quick Numbers) */}
        <section className="w-full py-16 border-t border-white/[0.04] bg-background">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { val: "1 place", label: "Unified Directory", icon: Layers },
                { val: "Auto", label: "Eligibility Filter", icon: GraduationCap },
                { val: "Direct", label: "Circular Downloads", icon: Download },
                { val: "Realtime", label: "Active Countdown", icon: Calendar },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-white/[0.03] bg-card/45 backdrop-blur-sm text-center space-y-2 group hover:border-emerald-500/20 hover:bg-emerald-950/5 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-950/5 transition-premium">
                  <div className="h-8 w-8 rounded-lg bg-emerald-950/50 border border-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto group-hover:rotate-[4deg] group-hover:scale-110 group-hover:text-emerald-300 group-hover:border-emerald-400/20 transition-premium">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-extrabold text-gradient-brand">{item.val}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground uppercase font-medium tracking-wide mt-1 group-hover:text-emerald-400 transition-colors">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Declaration & Independence Callout */}
        <section className="w-full py-16 border-t border-white/[0.04] bg-emerald-950/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_bottom_left,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center space-y-6 group/decl">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto group-hover/decl:scale-110 group-hover/decl:rotate-[6deg] group-hover/decl:border-amber-400/40 transition-premium">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">Independent student initiative.</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
              We love KIIT and wanted to contribute positively. This is not an official university platform, and it doesn&apos;t represent the Training & Placement cell. It&apos;s built on a peer-curated basis to support students navigating their career paths.
            </p>
            <div className="text-xs text-muted-foreground/55 border border-white/[0.04] px-4 py-2.5 rounded-full inline-block bg-background/50 hover:border-amber-500/20 transition-colors">
              Not affiliated with, endorsed by, or operated by KIIT University
            </div>
          </div>
        </section>

        {/* Sticky Call-to-Action */}
        <section className="w-full py-20 border-t border-white/[0.04] relative overflow-hidden bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 text-center space-y-6 relative z-10 max-w-md">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Simplify your search.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {isAuthenticated
                ? "Your custom eligibility feed is configured and waiting. Go see recent circular additions."
                : "Secure your access. Log in with your institutional email address and unlock drive tracking immediately."
              }
            </p>
            <div>
              {isAuthenticated ? (
                <Link href="/jobs">
                  <Button className="h-12 px-8 rounded-full bg-gradient-brand hover:opacity-95 text-white font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-500/35 hover-shine transition-premium hover:scale-[1.04] hover:-translate-y-0.5 active:translate-y-0 group">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="h-12 px-8 rounded-full bg-gradient-brand hover:opacity-95 text-white font-semibold shadow-lg shadow-emerald-950/40 border border-emerald-500/35 hover-shine transition-premium hover:scale-[1.04] hover:-translate-y-0.5 active:translate-y-0">
                    Explore Avsaar Now
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.04] bg-card/25 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto">
            
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Logo href="/" height={28} />
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                An independent, student-led aggregator designed to ease opportunity discovery for the student community.
              </p>
              <div className="text-[10px] text-muted-foreground/45 border border-white/[0.03] px-3 py-1.5 rounded-xl inline-block bg-background/30">
                Not a KIIT University product
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Explore</h4>
              <ul className="space-y-2">
                {[
                  { href: "/about", label: "Origin Story" },
                  { href: "/contact", label: "Contact Us" },
                  { href: "/faqs", label: "Help Center" },
                  { href: "/blog", label: "Preparation Guides" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-400 transition-premium hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Policy</h4>
              <ul className="space-y-2">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/cookies", label: "Cookie Policy" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-400 transition-premium hover:translate-x-1 inline-block">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">Social</h4>
              <ul className="space-y-2">
                {[
                  { href: "https://github.com", label: "GitHub Hub" },
                  { href: "https://linkedin.com", label: "LinkedIn Network" },
                  { href: "https://twitter.com", label: "Community Feed" },
                ].map((link) => (
                  <li key={link.href} className="group/link">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-400 transition-premium hover:translate-x-1 inline-flex items-center gap-1">
                      {link.label} <ArrowRight className="h-3 w-3 -rotate-45 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Underbar */}
        <div className="border-t border-white/[0.03] py-6">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] sm:text-xs text-muted-foreground/60 text-center sm:text-left">
              &copy; {new Date().getFullYear()} अवSaar Platform · Crafted by Students
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/50 text-center sm:text-right">
              Not officially associated with KIIT University or Training & Placement Department.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
