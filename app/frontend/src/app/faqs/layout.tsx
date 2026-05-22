import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs)",
  description: "Find answers to common questions about eligibility, account verification, volunteer roles, placement drive listings, and independence on the अवSaar platform.",
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
