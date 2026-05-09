"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";

export default function AboutPage() {
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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-900/30 flex items-center justify-center text-emerald-400">
              <Info className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Avsaar is an official placement tracking platform built exclusively for KIIT University. Our mission is to streamline the placement process and ensure every student has equal access to career opportunities.
          </p>
        </div>
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <h2 className="text-xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe every student deserves a seamless path to their dream career. Avsaar centralizes all placement circulars, internship notices, hackathon announcements, and webinar invites into one unified platform — eliminating the chaos of scattered WhatsApp groups and emails.
          </p>
        </div>
        <div className="space-y-4 p-6 rounded-xl border border-border/50 bg-card/50">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Secure authentication via @kiit.ac.in emails</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Personalized job feed based on academic profile</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Official circular downloads with deadline tracking</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400 mt-1">•</span> Role-based access for students, volunteers, and admins</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
