import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { BetaBanner } from "@/components/ui/beta-banner";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "अवSaar — Student Placement Platform",
//   description: "A student-driven platform centralizing placement circulars, internship notices, and career updates for the KIIT community. Independent. Community-built. Not an official KIIT portal.",
//   icons: {
//     icon: "/favicon.png",
//     apple: "/favicon.png",
//   },
// };

export const metadata: Metadata = {
	title: {
		default: "अवSaar — Student Placement Platform",
		template: "%s | अवSaar",
	},

	description: "A student-driven platform centralizing placement circulars, internship notices, and career updates for the KIIT community. Independent. Community-built. Not an official KIIT portal.",
	keywords: ["Avsaar", "KIIT placements", "placement portal", "student platform", "internships", "career updates", "KIIT internship portal"],

	authors: [{ name: "Team UdaanX" }],

	creator: "Avsaar",
	publisher: "Avsaar",

	metadataBase: new URL("https://avsaar.vercel.app"),

	openGraph: {
		title: "अवSaar — Student Placement Platform",
		description: "Placements, internships, and career opportunities — centralized for students. Independent, community-built, and not an official KIIT portal.",

		url: "https://avsaar.vercel.app",

		siteName: "अवSaar",

		images: [
			{
				url: "/avsaar-og-image.png",
				width: 1200,
				height: 630,
				alt: "अवSaar — Student Placement Platform",
			},
		],

		locale: "en_IN",
		type: "website",
	},

	twitter: {
		card: "summary_large_image",
		title: "अवSaar — Student Placement Platform",
		description: "A student-driven platform centralizing placement circulars, internship notices, and career updates for the KIIT community. Independent. Community-built. Not an official KIIT portal.",

		images: ["/avsaar-og-image.png"],
	},

	icons: {
		icon: "/favicon.png",
		shortcut: "/favicon.png",
		apple: "/favicon.png",
	},

	category: "education",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <BetaBanner />
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster />
            <Analytics />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
