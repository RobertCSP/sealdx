import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
    template: "%s | Sealdx",
  },
  description:
    "Create professional proposals and invoices instantly with AI. No design skills needed. Free to start.",
  metadataBase: new URL("https://www.getsealdx.com"),
  openGraph: {
    title: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
    description:
      "Generate polished, client-ready proposals and invoices with AI. Close deals faster.",
    url: "https://www.getsealdx.com",
    siteName: "Sealdx",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
    description:
      "Generate polished proposals and invoices with AI. Free to start.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
