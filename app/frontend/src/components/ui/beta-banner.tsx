"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Megaphone, Info } from "lucide-react";

const MESSAGES = [
  <span>अवSaar is currently in beta — help us test by exploring all dashboard features!</span>,
  <span>This is a community-driven project — <a href="https://forms.gle/NfcXBM7uYaxNU33u9" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors pointer-events-auto">share your feedback & suggestions!</a></span>,
  <span>A central hub for KIIT placements, internships, and career updates.</span>
];

const ICONS = [Sparkles, Megaphone, Info];

export function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(true); // Default to true to prevent hydration mismatch
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Handle Hydration & check localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem("avsaar-beta-banner-dismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  // Handle Text Rotation with smooth transition
  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 300); // Wait for fade-out to finish
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    localStorage.setItem("avsaar-beta-banner-dismissed", "true");
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  const ActiveIcon = ICONS[currentIdx % ICONS.length];

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 border-b border-emerald-950/60 bg-gradient-to-r from-emerald-950/20 via-zinc-950 to-emerald-950/20 py-2 sm:py-2.5 px-4 pr-10 sm:px-8 sm:pr-12 md:px-16 flex items-center justify-center transition-all duration-300 select-none">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="flex items-center gap-2 max-w-4xl text-center z-10 pr-2 sm:pr-0">
        <span className="shrink-0 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase">
          Beta
        </span>
        
        <div
          className={`flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm font-medium text-zinc-300 transition-all duration-300 ${
            fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <ActiveIcon className="h-3.5 w-3.5 text-emerald-400 shrink-0 hidden xs:inline sm:inline" />
          <span className="leading-snug text-left sm:text-center">{MESSAGES[currentIdx]}</span>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all z-20"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
