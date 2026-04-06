"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Document {
  id: string;
  type: "proposal" | "invoice";
  title: string;
  client_name: string;
  client_company: string;
  form_data: Record<string, unknown>;
  generated_content: Record<string, unknown>;
  created_at: string;
}

interface BusinessInfo {
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
}

function DocCard({ href, icon, title, description, cta }: {
  href: string; icon: React.ReactNode; title: string; description: string; cta: string;
}) {
  return (
    <Link href={href}
      className="group flex flex-col gap-4 p-6 rounded-2xl border border-white/8
        bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/20
        transition-all hover:-translate-y-0.5">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center
        group-hover:bg-blue-500/20 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-blue-400
        group-hover:text-blue-300 transition-colors">
        {cta}
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Link>
  );
}

function ProposalIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <rect x="4" y="3" width="16" height="18" rx="2" stroke="#10b981" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h5M8 16h3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Business Info Section ─────────────────────────────────────────────────────

function BusinessInfoSection({ userId }: { userId: string }) {
  const [info, setInfo] = useState<BusinessInfo>({ businessName: "", yourName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.from("profiles").select("business_info").eq("id", userId).single()
      .then(({ data }) => {
        if (data?.business_info) {
          setInfo(data.business_info as BusinessInfo);
          // Sync to localStorage so forms pick it up
          localStorage.setItem("sealdx_business_info", JSON.stringify(data.business_info));
        } else {
          // Fall back to localStorage
          const local = localStorage.getItem("sealdx_business_info");
          if (local) setInfo(JSON.parse(local));
        }
        setLoading(false);
      });
  }, [userId]);

  async function handleSave() {
    setSaving(true);
    const supabase = createBrowserClient();
    await supabase.from("profiles").upsert({ id: userId, business_info: info });
    localStorage.setItem("sealdx_business_info", JSON.stringify(info));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const hasInfo = info.businessName || info.yourName;

  return (
    <div className="mb-10">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between group mb-4"
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors">
          My Business Info
        </h2>
        <div className="flex items-center gap-2">
          {hasInfo && !expanded && (
            <span className="text-xs text-slate-500">{info.businessName}</span>
          )}
          <svg
            width="14" height="14" fill="none" viewBox="0 0 24 24"
            className={`text-slate-600 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="grid sm:grid-cols-2 gap-3">
                  <div className="h-10 rounded-lg bg-white/5" />
                  <div className="h-10 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 mb-2">
                Saved here and auto-filled on new proposals and invoices.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">Business Name</span>
                  <input
                    value={info.businessName}
                    onChange={(e) => setInfo((p) => ({ ...p, businessName: e.target.value }))}
                    placeholder="Acme Studio"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10
                      text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50
                      focus:bg-white/8 transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">Your Name</span>
                  <input
                    value={info.yourName}
                    onChange={(e) => setInfo((p) => ({ ...p, yourName: e.target.value }))}
                    placeholder="Jane Smith"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10
                      text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50
                      focus:bg-white/8 transition-all"
                  />
                </label>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">Email</span>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => setInfo((p) => ({ ...p, email: e.target.value }))}
                    placeholder="jane@acmestudio.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10
                      text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50
                      focus:bg-white/8 transition-all"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-400 block mb-1.5">
                    Phone <span className="text-slate-600 font-normal">(optional)</span>
                  </span>
                  <input
                    type="tel"
                    value={info.phone}
                    onChange={(e) => setInfo((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10
                      text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500/50
                      focus:bg-white/8 transition-all"
                  />
                </label>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500
                    text-white text-sm font-semibold transition-all disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Info"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Saved
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justUpgraded = searchParams.get("upgraded") === "1";
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setUser(data.user);

      supabase
        .from("documents")
        .select("id, type, title, client_name, client_company, form_data, generated_content, created_at")
        .order("created_at", { ascending: false })
        .then(({ data: docs, error }) => {
          if (!error && docs) {
            const seen = new Set<string>();
            const unique = (docs as Document[]).filter((d) => {
              const key = `${d.type}|${d.title}|${d.client_name}`;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
            setDocuments(unique);
          }
          setDocsLoading(false);
        });
    });
  }, [router]);

  function handleView(doc: Document) {
    if (doc.type === "proposal") {
      sessionStorage.setItem("sealdx_form_data", JSON.stringify(doc.form_data));
      sessionStorage.setItem("sealdx_proposal", JSON.stringify(doc.generated_content));
      sessionStorage.setItem("sealdx_proposal_doc_id", doc.id);
      router.push("/proposal/result");
    } else {
      sessionStorage.setItem("sealdx_invoice_form_data", JSON.stringify(doc.form_data));
      sessionStorage.setItem("sealdx_invoice", JSON.stringify(doc.generated_content));
      sessionStorage.setItem("sealdx_invoice_doc_id", doc.id);
      router.push("/invoice/result");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const supabase = createBrowserClient();
    await supabase.from("documents").delete().eq("id", deleteId);
    setDocuments((prev) => prev.filter((d) => d.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-4xl">

        {/* Pro upgrade success banner */}
        {justUpgraded && (
          <div className="mb-8 flex items-center gap-3 px-5 py-4 rounded-2xl
            bg-emerald-500/10 border border-emerald-500/20">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-emerald-400">You&apos;re now on Pro!</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Unlimited documents and branding-free PDFs are now active.
              </p>
            </div>
          </div>
        )}

        {/* Welcome header */}
        <div className="mb-10">
          <p className="text-sm text-blue-400 font-medium mb-1">Dashboard</p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back{user.user_metadata?.full_name
              ? `, ${(user.user_metadata.full_name as string).split(" ")[0]}`
              : user.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">{user.email}</p>
        </div>

        {/* Business Info */}
        <BusinessInfoSection userId={user.id} />

        {/* Create new */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Create New
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <DocCard href="/proposal" cta="Create Proposal" title="Business Proposal"
              description="Win clients with a polished, AI-written proposal delivered in under 2 minutes."
              icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>}
            />
            <DocCard href="/invoice" cta="Create Invoice" title="Invoice"
              description="Generate a professional invoice with line items, taxes, and payment terms."
              icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="3" width="16" height="18" rx="2" stroke="#3b82f6" strokeWidth="1.8" />
                <path d="M8 8h8M8 12h5M8 16h3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>}
            />
          </div>
        </div>

        {/* Your Documents */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
            Your Documents
          </h2>

          {docsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-5 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-white/5 rounded w-1/3" />
                      <div className="h-3 bg-white/5 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-6 py-12
              flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path d="M9 17H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"
                    stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="9" y="11" width="12" height="10" rx="2" stroke="#475569" strokeWidth="1.5" />
                  <path d="M12 14h6M12 17h4" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-1">No documents yet</p>
              <p className="text-sm text-slate-500 max-w-xs">
                Create your first proposal or invoice to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 sm:px-6 py-4 sm:py-5
                    flex items-center gap-3 sm:gap-4 hover:border-white/12 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    doc.type === "proposal" ? "bg-blue-500/10" : "bg-emerald-500/10"
                  }`}>
                    {doc.type === "proposal" ? <ProposalIcon /> : <InvoiceIcon />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        doc.type === "proposal"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {doc.type === "proposal" ? "Proposal" : "Invoice"}
                      </span>
                    </div>
                    <p className="text-white font-semibold text-sm truncate">{doc.title}</p>
                    <p className="text-slate-500 text-xs truncate">
                      {doc.client_name}{doc.client_company ? ` · ${doc.client_company}` : ""}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 hidden sm:block shrink-0">
                    {new Date(doc.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleView(doc)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300
                        border border-blue-500/20 hover:border-blue-500/40 transition-all">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      View
                    </button>
                    <button onClick={() => setDeleteId(doc.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300
                        border border-red-500/20 hover:border-red-500/40 transition-all">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                        <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10
            bg-[#0d1425] shadow-2xl shadow-black/60 p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full
              bg-red-500/10 border border-red-500/20 mx-auto mb-4">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"
                  stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-1">Delete document?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-slate-300
                  hover:bg-white/5 text-sm font-medium transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white
                  text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
