import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Invoice",
  description:
    "Generate a professional invoice with line items, taxes, and payment terms — polished by AI in seconds.",
};

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
