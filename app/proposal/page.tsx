"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase";
import ProposalForm from "@/components/proposal/ProposalForm";

const FREE_LIMIT = 3;

// Shown when the free user has hit their monthly limit
function UpgradePrompt({ count }: { count: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20
        flex items-center justify-center mx-auto mb-6">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-2xl font-extrabold text-white mb-2">
        You&apos;ve used all {FREE_LIMIT} free documents this month
      </h1>
      <p className="text-slate-400 text-sm max-w-sm mb-8">
        Upgrade to Pro for unlimited proposals and invoices, plus no Sealdx branding on your PDFs.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-2.5 rounded-lg bg-blue-600
            hover:bg-blue-500 text-white font-semibold text-sm transition-all
            shadow-lg shadow-blue-900/30 hover:-translate-y-0.5"
        >
          Upgrade to Pro — $9/month
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
      <p className="text-xs text-slate-600 mt-6">
        {count}/{FREE_LIMIT} documents used this month · Resets on the 1st of next month
      </p>
    </div>
  );
}

export default function ProposalPage() {
  const [status, setStatus] = useState<"loading" | "allowed" | "blocked">("loading");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setStatus("allowed"); return; }

      // Check subscription status first — Pro users are always allowed
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", data.user.id)
        .single();

      if (profile?.subscription_status === "pro") {
        setStatus("allowed");
        return;
      }

      // Count documents created this calendar month directly from the documents
      // table — more reliable than the profiles counter which can drift.
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      console.log("[ProposalPage] Docs this month:", count, "error:", error);

      const effective = count ?? 0;
      setCount(effective);
      setStatus(effective >= FREE_LIMIT ? "blocked" : "allowed");
    });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "blocked") return <UpgradePrompt count={count} />;

  return <ProposalForm />;
}
