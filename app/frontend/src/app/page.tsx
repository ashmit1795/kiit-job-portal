"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Building, GraduationCap, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/50 backdrop-blur-md dark:bg-zinc-950/50 sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight text-blue-600 dark:text-blue-500" href="#">
          <GraduationCap className="h-6 w-6 mr-2" />
          <span className="hidden sm:inline-block">KIIT Placement Portal</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-zinc-600 dark:text-zinc-300">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-48 flex justify-center items-center text-center px-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="container px-4 md:px-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="mx-auto max-w-[800px] space-y-4">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 mb-4 transition-all hover:scale-105">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
                Official placement tracking for KIIT students
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-zinc-900 dark:text-zinc-50 leading-tight">
                Your gateway to <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  top career opportunities
                </span>
              </h1>
              <p className="mx-auto max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 font-medium leading-relaxed">
                A centralized platform for KIIT University students to discover, track, and apply for placements, internships, and hackathons.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login">
                <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  Access Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 tracking-tight">Streamlined Placement Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-md">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Secure Access</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Sign in exclusively with your official @kiit.ac.in credentials to access verified opportunities.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-md">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Latest Circulars</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Get instant access to official placement circulars, internship postings, and webinar details.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 space-y-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-md">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <Building className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Smart Tracking</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Filter opportunities by your eligibility criteria, track deadlines, and download official PDFs easily.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
          © {new Date().getFullYear()} KIIT Placement Portal. All rights reserved.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 sm:mt-0 font-medium tracking-tight">
          Developed for KIIT University
        </p>
      </footer>
    </div>
  );
}
