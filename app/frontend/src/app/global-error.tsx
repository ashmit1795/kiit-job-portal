"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Application Error</h2>
              <p className="text-slate-400 text-sm">
                An unexpected error occurred in the system. Our team has been notified.
              </p>
            </div>
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 active:scale-95 transition-all text-sm"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";
