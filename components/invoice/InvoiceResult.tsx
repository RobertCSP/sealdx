"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GeneratedInvoice } from "@/app/api/generate-invoice/route";
import { InvoiceFormData, calcDueDate, calcTotals } from "./types";
import { createBrowserClient } from "@/lib/supabase";

async function downloadInvoicePDF(
  invoice: GeneratedInvoice,
  formData: InvoiceFormData,
  showBranding: boolean
) {
  const [{ pdf }, { default: InvoicePDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./InvoicePDF"),
  ]);

  const blob = await pdf(
    <InvoicePDF invoice={invoice} formData={formData} showBranding={showBranding} />
  ).toBlob();

  const date = new Date().toISOString().slice(0, 10);
  const company = (formData.clientCompany || "Client")
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const num = formData.invoiceNumber.replace(/[^a-z0-9]/gi, "-");

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${company}-Invoice-${num}-${date}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

function Divider() {
  return <div className="border-t border-white/6" />;
}

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvoiceResult() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<GeneratedInvoice | null>(null);
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    const storedInvoice = sessionStorage.getItem("sealdx_invoice");
    const storedForm = sessionStorage.getItem("sealdx_invoice_form_data");
    if (!storedInvoice) { router.replace("/invoice"); return; }
    const parsedInvoice: GeneratedInvoice = JSON.parse(storedInvoice);
    const parsedForm: InvoiceFormData | null = storedForm ? JSON.parse(storedForm) : null;
    setInvoice(parsedInvoice);
    setFormData(parsedForm);

    // Auto-save to Supabase.
    // Skip if sealdx_invoice_doc_id is already set — means this document was
    // either just saved this session, or was loaded from the dashboard (View).
    const alreadySavedId = sessionStorage.getItem("sealdx_invoice_doc_id");

    // Fetch the user's plan so the PDF download uses the right branding
    const supabaseForProfile = createBrowserClient();
    supabaseForProfile.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        console.log("[InvoiceResult] No logged-in user — defaulting to free branding");
        return;
      }
      const { data: profile, error } = await supabaseForProfile
        .from("profiles")
        .select("subscription_status")
        .eq("id", data.user.id)
        .single();

      console.log("[InvoiceResult] Profile fetch result:", { profile, error });

      if (error || !profile) {
        console.log("[InvoiceResult] No profile row found — upserting free profile");
        await supabaseForProfile.from("profiles").upsert({ id: data.user.id });
        setIsPro(false);
        return;
      }

      const pro = profile.subscription_status === "pro";
      console.log("[InvoiceResult] subscription_status:", profile.subscription_status, "→ isPro:", pro);
      setIsPro(pro);
    });

    if (!savedRef.current && !alreadySavedId && parsedForm) {
      savedRef.current = true;
      console.log("[InvoiceResult] Starting save for new document...");
      const supabase = createBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) {
          console.log("[InvoiceResult] Save skipped — no logged-in user");
          return;
        }
        supabase
          .from("documents")
          .insert({
            user_id: data.user.id,
            type: "invoice",
            title: parsedForm.invoiceNumber || "Untitled Invoice",
            client_name: parsedForm.clientName || "",
            client_company: parsedForm.clientCompany || "",
            form_data: parsedForm,
            generated_content: parsedInvoice,
          })
          .select("id")
          .single()
          .then(({ data: saved, error }) => {
            if (error) {
              console.error("[InvoiceResult] Save FAILED:", error.message, error);
              return;
            }
            if (saved) {
              console.log("[InvoiceResult] Save SUCCESS — doc id:", saved.id);
              sessionStorage.setItem("sealdx_invoice_doc_id", saved.id);
              supabase
                .rpc("increment_document_count", { p_user_id: data.user!.id })
                .then(({ error: rpcError }) => {
                  if (rpcError) console.warn("[InvoiceResult] increment_document_count failed:", rpcError.message);
                  else console.log("[InvoiceResult] Document count incremented");
                });
            }
          });
      });
    } else {
      console.log("[InvoiceResult] Save skipped — alreadySavedId:", alreadySavedId, "savedRef:", savedRef.current);
    }
  }, [router]);

  if (!invoice || !formData) return null;

  const { subtotal, taxRate, taxAmount, total } = calcTotals(formData);
  const dueDate = calcDueDate(formData.invoiceDate, formData.paymentTerms);
  const filledItems = formData.lineItems.filter((i) => i.description || i.rate);

  const invoiceDateFormatted = formData.invoiceDate
    ? new Date(formData.invoiceDate + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      {/* ── Toolbar ── */}
      <div className="mx-auto max-w-3xl mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-bold text-white">
          {formData.invoiceNumber} — Generated
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sessionStorage.removeItem("sealdx_invoice");
              sessionStorage.removeItem("sealdx_invoice_form_data");
              sessionStorage.removeItem("sealdx_invoice_doc_id");
              router.push("/invoice");
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
              sessionStorage.setItem("sealdx_invoice_editing", "1");
              router.push("/invoice");
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
              if (!invoice || !formData || pdfLoading) return;
              console.log("[InvoiceResult] Downloading PDF — isPro:", isPro, "showBranding:", !isPro);
              setPdfLoading(true);
              try {
                await downloadInvoicePDF(invoice, formData, !isPro);
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

      {/* ── Invoice document ── */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/8 bg-white/[0.03] shadow-2xl shadow-black/40 overflow-hidden">
        <div className="px-8 py-8 bg-gradient-to-br from-blue-900/30 to-transparent border-b border-white/6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">Invoice</p>
              <h2 className="text-2xl font-extrabold text-white">{formData.businessName}</h2>
              <p className="text-slate-400 text-sm mt-1">{formData.yourName}</p>
              <p className="text-slate-400 text-sm">{formData.email}</p>
              {formData.phone && <p className="text-slate-400 text-sm">{formData.phone}</p>}
            </div>
            <div className="text-right space-y-1 text-sm">
              <p className="text-2xl font-extrabold text-white">{formData.invoiceNumber}</p>
              <div className="space-y-0.5 mt-2">
                <p><span className="text-slate-500">Date: </span><span className="text-slate-300">{invoiceDateFormatted}</span></p>
                <p><span className="text-slate-500">Due: </span><span className="text-white font-semibold">{dueDate}</span></p>
                <p><span className="text-slate-500">Terms: </span><span className="text-slate-300">{formData.paymentTerms}</span></p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-white/8">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Bill To</p>
            <p className="text-white font-semibold">{formData.clientName}</p>
            <p className="text-slate-400 text-sm">{formData.clientCompany}</p>
            {formData.clientEmail && <p className="text-slate-400 text-sm">{formData.clientEmail}</p>}
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="rounded-xl overflow-hidden border border-white/8">
            <div className="grid grid-cols-[1fr_80px_100px_100px] bg-white/[0.04] px-4 py-3 border-b border-white/8">
              {["Description", "Qty", "Rate", "Amount"].map((h) => (
                <span key={h} className={`text-xs font-semibold uppercase tracking-wide text-slate-500 ${h !== "Description" ? "text-right" : ""}`}>
                  {h}
                </span>
              ))}
            </div>
            {filledItems.map((item, i) => {
              const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
              return (
                <div key={item.id} className={`grid grid-cols-[1fr_80px_100px_100px] px-4 py-3 ${i < filledItems.length - 1 ? "border-b border-white/5" : ""}`}>
                  <span className="text-slate-200 text-sm">{item.description || "—"}</span>
                  <span className="text-slate-400 text-sm text-right tabular-nums">{item.quantity}</span>
                  <span className="text-slate-400 text-sm text-right tabular-nums">{fmt(parseFloat(item.rate) || 0)}</span>
                  <span className="text-slate-200 text-sm text-right tabular-nums">{fmt(amount)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 ml-auto w-64 rounded-xl overflow-hidden border border-white/8">
            <div className="flex justify-between px-4 py-2.5 border-b border-white/5 text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-200 tabular-nums">{fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between px-4 py-2.5 border-b border-white/5 text-sm">
                <span className="text-slate-400">Tax ({taxRate}%)</span>
                <span className="text-slate-200 tabular-nums">{fmt(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between px-4 py-3 bg-blue-600/10 border-t border-blue-500/20">
              <span className="text-sm font-bold text-white">Total Due</span>
              <span className="text-base font-bold text-white tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>

        <Divider />

        <div className="px-8 py-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Payment Terms</p>
            <p className="text-sm text-slate-300 leading-relaxed">{invoice.paymentTermsText}</p>
          </div>
          {invoice.polishedNotes && (
            <>
              <Divider />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Notes</p>
                <p className="text-sm text-slate-300 leading-relaxed">{invoice.polishedNotes}</p>
              </div>
            </>
          )}
        </div>

        <div className="px-8 py-5 border-t border-white/6 bg-white/[0.01] flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-slate-600">
            Generated by <span className="text-blue-500 font-medium">Sealdx</span>
          </p>
          <p className="text-xs text-slate-600">{formData.invoiceNumber}</p>
        </div>
      </div>
    </div>
  );
}
