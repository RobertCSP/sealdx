import GeneratingLoader from "@/components/GeneratingLoader";
import { ProposalFormData } from "../types";

interface Props {
  data: ProposalFormData;
  onGenerate: () => void;
  isLoading?: boolean;
  apiError?: string | null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-3 border-b border-white/8 bg-white/[0.02]">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {title}
        </h3>
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

export default function StepReview({ data, onGenerate, isLoading, apiError }: Props) {
  const total = data.lineItems.reduce((sum, item) => {
    const n = parseFloat(item.price);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const filledLineItems = data.lineItems.filter(
    (item) => item.service || item.price
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Review & Generate</h2>
        <p className="text-sm text-slate-400 mt-1">
          Everything look right? Hit generate and we&apos;ll create your
          proposal.
        </p>
      </div>

      {/* Your Business */}
      <Section title="Your Business">
        <Row label="Business Name" value={data.businessName} />
        <Row label="Your Name" value={data.yourName} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
      </Section>

      {/* Client */}
      <Section title="Client">
        <Row label="Client Name" value={data.clientName} />
        <Row label="Company" value={data.clientCompany} />
        <Row label="Client Email" value={data.clientEmail} />
      </Section>

      {/* Proposal Details */}
      <Section title="Proposal Details">
        <Row label="Project Title" value={data.projectTitle} />
        <Row label="Timeline" value={data.timeline} />
        <Row label="Payment Terms" value={data.paymentTerms} />
        <div className="flex gap-3">
          <span className="text-sm text-slate-500 w-36 shrink-0">
            Services
          </span>
          <span className="text-sm text-white whitespace-pre-wrap leading-relaxed">
            {data.servicesDescription}
          </span>
        </div>
        {data.additionalNotes && (
          <div className="flex gap-3">
            <span className="text-sm text-slate-500 w-36 shrink-0">
              Notes
            </span>
            <span className="text-sm text-white whitespace-pre-wrap leading-relaxed">
              {data.additionalNotes}
            </span>
          </div>
        )}
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="space-y-2">
          {filledLineItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <span className="text-sm text-white">
                {item.service || "—"}
              </span>
              <span className="text-sm text-slate-300 tabular-nums">
                $
                {parseFloat(item.price || "0").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-white/8 flex justify-between items-center">
            <span className="text-sm font-semibold text-white">Total</span>
            <span className="text-base font-bold text-white tabular-nums">
              $
              {total.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
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
      {isLoading && <GeneratingLoader type="proposal" />}

      {/* Generate CTA — hidden while loading */}
      {!isLoading && (
        <>
          <button
            type="button"
            onClick={onGenerate}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl
              bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold
              text-base transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40
              hover:-translate-y-0.5"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M5 3l14 9-14 9V3z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Generate Proposal
          </button>
          <p className="text-center text-xs text-slate-600">
            Takes about 10–20 seconds. Powered by Claude AI.
          </p>
        </>
      )}
    </div>
  );
}
