import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Proposal",
  description:
    "Fill in your project details and our AI will write a polished, client-ready proposal in under 2 minutes.",
};

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
