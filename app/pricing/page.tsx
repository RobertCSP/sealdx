"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";

const FREE_FEATURES = [
  "3 documents per month",
  "AI-generated proposals",
  "AI-generated invoices",
  "PDF download",
  "Sealdx branding on PDFs",
];

const PRO_FEATURES = [
  "Unlimited documents",
  "AI-generated proposals",
  "AI-generated invoices",
  "PDF download",
  "No branding on PDFs",
  "Priority AI generation",
  "All future Pro features",
];

function CheckIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0">
      <path
        d="M5 13l4 4L19 7"
        stroke={muted ? "#475569" : "#3b82f6"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login?redirectTo=/pricing");
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      window.location.href = json.url; // redirect to Stripe hosted checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm text-blue-400 font-medium mb-2">Pricing</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Simple, honest pricing
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            Start free and upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Free</p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-slate-500 text-sm mb-1.5">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                Perfect for trying out Sealdx or occasional use.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckIcon muted />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="block text-center px-5 py-2.5 rounded-lg border border-white/10
                text-slate-300 hover:text-white hover:bg-white/5 text-sm font-semibold
                transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-blue-500/30 bg-blue-600/5 p-8 flex flex-col relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold
              px-3 py-1 rounded-bl-xl tracking-wide">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">Pro</p>
              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-extrabold text-white">$9</span>
                <span className="text-slate-400 text-sm mb-1.5">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">
                For freelancers and small businesses who need more.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>

            {error && (
              <p className="text-sm text-red-400 mb-3">{error}</p>
            )}

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500
                text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/30
                hover:-translate-y-0.5 active:scale-[0.99]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting to Stripe...
                </span>
              ) : "Upgrade to Pro →"}
            </button>

            <p className="text-center text-xs text-slate-600 mt-3">
              Cancel anytime · Secure checkout via Stripe
            </p>
          </div>
        </div>

        {/* FAQ teaser */}
        <p className="text-center text-sm text-slate-600 mt-10">
          Questions?{" "}
          <a href="mailto:hello@sealdx.com" className="text-blue-500 hover:text-blue-400 transition-colors">
            hello@sealdx.com
          </a>
        </p>

      </div>
    </div>
  );
}
