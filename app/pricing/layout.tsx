import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free plan with 3 documents per month. Upgrade to Pro for $9/month — unlimited documents, no branding.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
