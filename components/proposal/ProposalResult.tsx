"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GeneratedProposal } from "@/app/api/generate-proposal/route";
import { ProposalFormData } from "./types";
import { createBrowserClient } from "@/lib/supabase";

async function downloadProposalPDF(
  proposal: GeneratedProposal,
  formData: ProposalFormData,
  showBranding: boolean
) {
  const [{ pdf }, { default: ProposalPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ProposalPDF"),
  ]);

  const blob = await pdf(
    <ProposalPDF proposal={proposal} formData={formData} showBranding={showBranding} />
  ).toBlob();

  const date = new Date().toISOString().slice(0, 10);
  const company = (formData.clientCompany || "Client")
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${company}-Proposal-${date}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold shrink-0">
          {number}
        </span>
        <h2 className="text-base font-bold text-white uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="pl-10">{children}</div>
    </section>
  );
}

function Divider() {
  return <div className="border-t border-white/6" />;
}

export default function ProposalResult() {
  const router = useRouter();
  const [proposal, setProposal] = useState<GeneratedProposal | null>(null);
  const [formData, setFormData] = useState<ProposalFormData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const savedRef = useRef(false); // prevent double-saving in strict mode

  useEffect(() => {
    const storedProposal = sessionStorage.getItem("sealdx_proposal");
    const storedForm = sessionStorage.getItem("sealdx_form_data");
    if (!storedProposal) {
      router.replace("/proposal");
      return;
    }
    const parsedProposal: GeneratedProposal = JSON.parse(storedProposal);
    const parsedForm: ProposalFormData | null = storedForm ? JSON.parse(storedForm) : null;
    setProposal(parsedProposal);
    setFormData(parsedForm);

    // Auto-save to Supabase.
    // Skip if sealdx_proposal_doc_id is already set — means this document was
    // either just saved this session, or was loaded from the dashboard (View).
    const alreadySavedId = sessionStorage.getItem("sealdx_proposal_doc_id");

    // Fetch the user's plan so the PDF download uses the right branding
    const supabaseForProfile = createBrowserClient();
    supabaseForProfile.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        console.log("[ProposalResult] No logged-in user — defaulting to free branding");
        return;
      }
      const { data: profile, error } = await supabaseForProfile
        .from("profiles")
        .select("subscription_status")
        .eq("id", data.user.id)
        .single();

      console.log("[ProposalResult] Profile fetch result:", { profile, error });

      if (error || !profile) {
        // Profile row missing (user signed up before the trigger was added).
        // Upsert a free profile so future checks work, then check Stripe status below.
        console.log("[ProposalResult] No profile row found — upserting free profile");
        await supabaseForProfile.from("profiles").upsert({ id: data.user.id });
        setIsPro(false);
        return;
      }

      const pro = profile.subscription_status === "pro";
      console.log("[ProposalResult] subscription_status:", profile.subscription_status, "→ isPro:", pro);
      setIsPro(pro);
    });

    if (!savedRef.current && !alreadySavedId && parsedForm) {
      savedRef.current = true; // synchronous guard against StrictMode double-fire
      console.log("[ProposalResult] Starting save for new document...");
      const supabase = createBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) {
          console.log("[ProposalResult] Save skipped — no logged-in user");
          return;
        }
        supabase
          .from("documents")
          .insert({
            user_id: data.user.id,
            type: "proposal",
            title: parsedForm.projectTitle || "Untitled Proposal",
            client_name: parsedForm.clientName || "",
            client_company: parsedForm.clientCompany || "",
            form_data: parsedForm,
            generated_content: parsedProposal,
          })
          .select("id")
          .single()
          .then(({ data: saved, error }) => {
            if (error) {
              console.error("[ProposalResult] Save FAILED:", error.message, error);
              return;
            }
            if (saved) {
              console.log("[ProposalResult] Save SUCCESS — doc id:", saved.id);
              sessionStorage.setItem("sealdx_proposal_doc_id", saved.id);
              // Increment the monthly counter in profiles
              supabase
                .rpc("increment_document_count", { p_user_id: data.user!.id })
                .then(({ error: rpcError }) => {
                  if (rpcError) console.warn("[ProposalResult] increment_document_count failed:", rpcError.message);
                  else console.log("[ProposalResult] Document count incremented");
                });
            }
          });
      });
    } else {
      console.log("[ProposalResult] Save skipped — alreadySavedId:", alreadySavedId, "savedRef:", savedRef.current);
    }
  }, [router]);

  if (!proposal) return null;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      {/* ── Toolbar ── */}
      <div className="mx-auto max-w-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-white">
          {formData?.projectTitle || "Proposal"} — Generated
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sessionStorage.removeItem("sealdx_proposal");
              sessionStorage.removeItem("sealdx_form_data");
              sessionStorage.removeItem("sealdx_proposal_doc_id");
              router.push("/proposal");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
              text-slate-400 hover:text-white border border-white/10 hover:border-white/20
              hover:bg-white/5 transition-all"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Start Over
          </button>

          <button
            onClick={() => {
              sessionStorage.setItem("sealdx_editing", "1");
              router.push("/proposal");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium
              text-slate-400 hover:text-white border border-white/10 hover:border-white/20
              hover:bg-white/5 transition-all"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit
          </button>

          <button
            onClick={async () => {
              if (!proposal || !formData || pdfLoading) return;
              console.log("[ProposalResult] Downloading PDF — isPro:", isPro, "showBranding:", !isPro);
              setPdfLoading(true);
              try {
                await downloadProposalPDF(proposal, formData, !isPro);
              } finally {
                setPdfLoading(false);
              }
            }}
            disabled={pdfLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
              bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md
              shadow-blue-900/30 hover:-translate-y-0.5 active:scale-[0.99]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {pdfLoading ? (
              <>
                <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Proposal document ── */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/8 bg-white/[0.03] shadow-2xl shadow-black/40 overflow-hidden">
        <div className="px-8 py-8 bg-gradient-to-br from-blue-900/30 to-transparent border-b border-white/6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">
                Business Proposal
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {formData?.projectTitle || "Project Proposal"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Prepared for{" "}
                <span className="text-white font-medium">
                  {formData?.clientName}
                  {formData?.clientCompany ? `, ${formData.clientCompany}` : ""}
                </span>
              </p>
            </div>
            <div className="text-right text-sm text-slate-500 space-y-0.5">
              <p className="text-white font-semibold">{formData?.businessName}</p>
              <p>{formData?.yourName}</p>
              <p>{formData?.email}</p>
              {formData?.phone && <p>{formData.phone}</p>}
              <p className="pt-1 text-slate-600">{today}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8 text-[15px] leading-relaxed text-slate-300">
          <Section number="01" title="Introduction">
            <p className="whitespace-pre-wrap">{proposal.introduction}</p>
          </Section>
          <Divider />
          <Section number="02" title="Scope of Work">
            <p className="whitespace-pre-wrap">{proposal.scopeOfWork}</p>
          </Section>
          <Divider />
          <Section number="03" title="Timeline">
            <p className="whitespace-pre-wrap">{proposal.timeline}</p>
          </Section>
          <Divider />
          <Section number="04" title="Pricing">
            <div className="rounded-xl overflow-hidden border border-white/8">
              <div className="grid grid-cols-[1fr_160px] bg-white/[0.04] px-4 py-2.5 border-b border-white/8">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">Price</span>
              </div>
              {proposal.pricingTable.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_160px] px-4 py-3 border-b border-white/5 last:border-0">
                  <span className="text-slate-200">{row.service}</span>
                  <span className="text-slate-200 text-right tabular-nums">{row.price}</span>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_160px] px-4 py-3 bg-blue-600/10 border-t border-blue-500/20">
                <span className="font-bold text-white">Total</span>
                <span className="font-bold text-white text-right tabular-nums">{proposal.totalAmount}</span>
              </div>
            </div>
          </Section>
          <Divider />
          <Section number="05" title="Terms & Conditions">
            <p className="whitespace-pre-wrap">{proposal.termsAndConditions}</p>
          </Section>
          <Divider />
          <Section number="06" title="Next Steps">
            <p className="whitespace-pre-wrap">{proposal.nextSteps}</p>
          </Section>
        </div>

        <div className="px-8 py-5 border-t border-white/6 bg-white/[0.01] flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-600">
            Generated by <span className="text-blue-500 font-medium">Sealdx</span>
          </p>
          <p className="text-xs text-slate-600">{today}</p>
        </div>
      </div>
    </div>
  );
}
