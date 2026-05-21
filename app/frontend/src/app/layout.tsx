import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "अवSaar — Student Placement Platform",
  description: "A student-driven platform centralizing placement circulars, internship notices, and career updates for the KIIT community. Independent. Community-built. Not an official KIIT portal.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
