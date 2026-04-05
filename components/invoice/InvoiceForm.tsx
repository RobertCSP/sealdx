"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createInitialFormData,
  REQUIRED_FIELDS,
  InvoiceFormData,
} from "./types";
import StepBusinessInfo from "./steps/StepBusinessInfo";
import StepClientInfo from "./steps/StepClientInfo";
import StepInvoiceDetails from "./steps/StepInvoiceDetails";
import StepReview from "./steps/StepReview";

const STEPS = [
  { number: 1, label: "Your Business" },
  { number: 2, label: "Client Info" },
  { number: 3, label: "Details" },
  { number: 4, label: "Review" },
];

function ProgressBar({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-white/10" />
        {STEPS.map((step) => {
          const done = current > step.number;
          const active = current === step.number;
          return (
            <div key={step.number} className="flex flex-col items-center gap-2 z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ring-2 transition-all duration-300
                  ${done ? "bg-blue-600 ring-blue-600 text-white"
                    : active ? "bg-blue-600/20 ring-blue-500 text-blue-300"
                    : "bg-[#0a0f1e] ring-white/10 text-slate-600"}`}
              >
                {done ? (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : step.number}
              </div>
              <span className={`text-[11px] font-medium hidden sm:block transition-colors
                ${active ? "text-blue-300" : done ? "text-slate-400" : "text-slate-600"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-slate-400 sm:hidden">
        Step {current} of {STEPS.length} —{" "}
        <span className="text-white font-medium">{STEPS[current - 1].label}</span>
      </p>
    </div>
  );
}

export default function InvoiceForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<InvoiceFormData>(() => {
    if (typeof window === "undefined") return createInitialFormData();

    // "Edit" button on the result page sets this flag — restore all fields
    const isEditing = sessionStorage.getItem("sealdx_invoice_editing") === "1";
    if (isEditing) {
      sessionStorage.removeItem("sealdx_invoice_editing");
      const saved = sessionStorage.getItem("sealdx_invoice_form_data");
      if (saved) return JSON.parse(saved) as InvoiceFormData;
    }

    // Fresh start — blank form, but pre-fill business info saved from last time
    const savedBiz = localStorage.getItem("sealdx_business_info");
    if (savedBiz) {
      const biz = JSON.parse(savedBiz);
      return { ...createInitialFormData(), ...biz };
    }

    return createInitialFormData();
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleChange(field: keyof InvoiceFormData, value: unknown) {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof InvoiceFormData]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const required = REQUIRED_FIELDS[step] ?? [];
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};
    for (const field of required) {
      const value = data[field];
      if (typeof value === "string" && !value.trim()) {
        newErrors[field] = "This field is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() { if (validate()) setStep((s) => Math.min(s + 1, 4)); }
  function goBack() { setErrors({}); setStep((s) => Math.max(s - 1, 1)); }

  async function handleGenerate() {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Something went wrong.");
      }
      const { invoice } = await res.json();
      // Persist business info locally and sync to Supabase profile
      const bizInfo = { businessName: data.businessName, yourName: data.yourName, email: data.email, phone: data.phone };
      localStorage.setItem("sealdx_business_info", JSON.stringify(bizInfo));
      // Fire-and-forget sync to profile (non-blocking)
      import("@/lib/supabase").then(({ createBrowserClient }) => {
        const sb = createBrowserClient();
        sb.auth.getUser().then(({ data: { user } }) => {
          if (user) sb.from("profiles").upsert({ id: user.id, business_info: bizInfo });
        });
      });
      // Clear any previously saved doc ID — this is a brand new generation
      sessionStorage.removeItem("sealdx_invoice_doc_id");
      sessionStorage.setItem("sealdx_invoice", JSON.stringify(invoice));
      sessionStorage.setItem("sealdx_invoice_form_data", JSON.stringify(data));
      router.push("/invoice/result");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unexpected error.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-28 pb-20">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create an Invoice</h1>
          <p className="text-slate-500 text-sm mt-1">
            Fill in the details below and our AI will polish the language.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8 shadow-xl shadow-black/30">
          <ProgressBar current={step} />

          <div className="min-h-[380px]">
            {step === 1 && <StepBusinessInfo data={data} onChange={handleChange} errors={errors} />}
            {step === 2 && <StepClientInfo data={data} onChange={handleChange} errors={errors} />}
            {step === 3 && <StepInvoiceDetails data={data} onChange={handleChange} errors={errors} />}
            {step === 4 && (
              <StepReview
                data={data}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                apiError={apiError}
              />
            )}
          </div>

          {/* Back / Next — hidden on step 4 (StepReview has its own CTA) */}
          {step < 4 && (
            <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-white/8">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  text-slate-400 hover:text-white border border-white/10 hover:border-white/20
                  hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">{step} / {STEPS.length}</span>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                    bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md
                    shadow-blue-900/30 hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  {step === 3 ? "Review Invoice" : "Continue"}
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-4 pt-4 border-t border-white/8">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  text-slate-400 hover:text-white border border-white/10 hover:border-white/20
                  hover:bg-white/5 transition-all"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
