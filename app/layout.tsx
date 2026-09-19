import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskForge AI – Skill Marketplace for Micro-Tasks",
  description: "AI-Powered Skill Marketplace for Micro-Tasks. Automated project breakdown, skill matching, quality verification, and Stripe escrow payouts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable");
  }

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <Providers publishableKey={publishableKey}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
