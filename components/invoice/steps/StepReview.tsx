import GeneratingLoader from "@/components/GeneratingLoader";
import { InvoiceFormData, calcDueDate, calcTotals } from "../types";

interface Props {
  data: InvoiceFormData;
  onGenerate: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-3 border-b border-white/8 bg-white/[0.02]">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <span className="text-sm text-slate-500 w-36 shrink-0">{label}</span>
      <span className="text-sm text-white break-words">{value}</span>
    </div>
  );
}

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function StepReview({ data, onGenerate, isLoading, apiError }: Props) {
  const { subtotal, taxRate, taxAmount, total } = calcTotals(data);
  const dueDate = calcDueDate(data.invoiceDate, data.paymentTerms);
  const filledItems = data.lineItems.filter((i) => i.description || i.rate);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Review & Generate</h2>
        <p className="text-sm text-slate-400 mt-1">
          Everything look right? Hit generate and we&apos;ll create your invoice.
        </p>
      </div>

      <Section title="Your Business">
        <Row label="Business Name" value={data.businessName} />
        <Row label="Your Name" value={data.yourName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
      </Section>

      <Section title="Client">
        <Row label="Client Name" value={data.clientName} />
        <Row label="Company" value={data.clientCompany} />
        <Row label="Client Email" value={data.clientEmail} />
      </Section>

      <Section title="Invoice Details">
        <Row label="Invoice Number" value={data.invoiceNumber} />
        <Row label="Invoice Date" value={data.invoiceDate} />
        <Row label="Payment Terms" value={data.paymentTerms} />
        <Row label="Due Date" value={dueDate} />
        {data.notes && <Row label="Notes" value={data.notes} />}
      </Section>

      <Section title="Line Items & Totals">
        <div className="space-y-1.5">
          {/* Header */}
          <div className="grid grid-cols-[1fr_56px_80px_80px] gap-2 pb-1.5 border-b border-white/8">
            {["Description", "Qty", "Rate", "Amount"].map((h) => (
              <span key={h} className="text-xs text-slate-500 font-medium uppercase tracking-wide">{h}</span>
            ))}
          </div>
          {filledItems.map((item) => {
            const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
            return (
              <div key={item.id} className="grid grid-cols-[1fr_56px_80px_80px] gap-2 text-sm">
                <span className="text-white">{item.description || "—"}</span>
                <span className="text-slate-300 tabular-nums">{item.quantity}</span>
                <span className="text-slate-300 tabular-nums">${item.rate}</span>
                <span className="text-slate-300 tabular-nums">{fmt(amount)}</span>
              </div>
            );
          })}
          <div className="pt-2 mt-1 border-t border-white/8 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-white tabular-nums">{fmt(subtotal)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax ({taxRate}%)</span>
                <span className="text-white tabular-nums">{fmt(taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/8">
              <span className="text-white">Total</span>
              <span className="text-white tabular-nums">{fmt(total)}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* API error */}
      {apiError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 space-y-3">
          <div className="flex items-start gap-2.5 text-red-400 text-sm">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>
              <span className="font-semibold block mb-0.5">Something went wrong</span>
              {apiError}
            </span>
          </div>
          <button
            type="button"
            onClick={onGenerate}
            className="w-full py-2 rounded-lg border border-red-500/30 text-red-400
              hover:bg-red-500/10 text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && <GeneratingLoader type="invoice" />}

      {/* Generate button — hidden while loading */}
      {!isLoading && (
        <>
          <button
            type="button"
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl
              bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all
              shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5
              active:scale-[0.99]"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9V3z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Generate Invoice
          </button>
          <p className="text-center text-xs text-slate-600">
            Takes a few seconds. Powered by Claude AI.
          </p>
        </>
      )}
    </div>
  );
}
