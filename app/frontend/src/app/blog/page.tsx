"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

const posts = [
  { title: "Placement Season 2026 Kickoff", date: "March 10, 2026", excerpt: "The placement season for the 2026 graduating batch has officially begun. Stay tuned for daily updates on company visits and circular releases." },
  { title: "How to Prepare for Technical Interviews", date: "March 5, 2026", excerpt: "A comprehensive guide covering data structures, algorithms, system design, and behavioral questions to help you ace your placement interviews." },
  { title: "Top Companies Visiting KIIT This Month", date: "March 1, 2026", excerpt: "Here's a preview of the major companies scheduled to visit campus this month, along with tips on how to prepare for each." },
  { title: "Resume Building Workshop Recap", date: "February 25, 2026", excerpt: "Missed the workshop? Here's a summary of the key takeaways on crafting a standout resume that gets you shortlisted." },
];

export default function BlogPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">News, tips, and updates from the Avsaar team.</p>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.title} className="p-5 rounded-xl border border-border/50 bg-card/50 hover:border-emerald-700/30 hover:shadow-md hover:shadow-emerald-900/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <h2 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
