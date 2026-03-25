import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sealdx — Proposals & Invoices in Under 2 Minutes",
  description:
    "Create professional proposals and invoices instantly with AI. Close deals faster with Sealdx.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#0a0f1e] text-[#f0f4ff]`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
