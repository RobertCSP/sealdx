"use client";

import FormField from "../FormField";
import { LineItem, PAYMENT_TERMS, ProposalFormData, EMPTY_LINE_ITEM } from "../types";

interface Props {
  data: ProposalFormData;
  onChange: (field: keyof ProposalFormData, value: unknown) => void;
  errors: Partial<Record<keyof ProposalFormData, string>>;
}

export default function StepProposalDetails({ data, onChange, errors }: Props) {
  // Calculate the total from all line items that have a valid price
  const total = data.lineItems.reduce((sum, item) => {
    const n = parseFloat(item.price);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  function updateLineItem(id: string, field: keyof LineItem, value: string) {
    const updated = data.lineItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange("lineItems", updated);
  }

  function addLineItem() {
    onChange("lineItems", [...data.lineItems, EMPTY_LINE_ITEM()]);
  }

  function removeLineItem(id: string) {
    // Always keep at least one row
    if (data.lineItems.length === 1) return;
    onChange("lineItems", data.lineItems.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Proposal Details</h2>
        <p className="text-sm text-slate-400 mt-1">
          Describe the project scope, timeline, and pricing.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Project Title"
          value={data.projectTitle}
          onChange={(v) => onChange("projectTitle", v)}
          placeholder="Website Redesign"
          error={errors.projectTitle}
        />
        <FormField
          label="Timeline / Duration"
          value={data.timeline}
          onChange={(v) => onChange("timeline", v)}
          placeholder="2 weeks, 30 days…"
          error={errors.timeline}
        />
      </div>

      <FormField
        as="textarea"
        label="Description of Services"
        value={data.servicesDescription}
        onChange={(v) => onChange("servicesDescription", v)}
        placeholder="Describe what you'll do for the client in plain language. Our AI will polish it."
        rows={5}
        hint="Write in plain English — the AI will turn this into professional proposal copy."
        error={errors.servicesDescription}
      />

      {/* ── Line Items ── */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Pricing
        </label>

        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_140px_36px] gap-2 px-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Service
            </span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Price ($)
            </span>
            <span />
          </div>

          {data.lineItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_140px_36px] gap-2 items-center"
            >
              <input
                type="text"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm bg-white/5 border border-white/10
                  hover:border-white/20 text-white placeholder:text-slate-600 outline-none
                  focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-colors"
                value={item.service}
                onChange={(e) => updateLineItem(item.id, "service", e.target.value)}
                placeholder="e.g. UI Design"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm bg-white/5 border border-white/10
                  hover:border-white/20 text-white placeholder:text-slate-600 outline-none
                  focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-colors"
                value={item.price}
                onChange={(e) => updateLineItem(item.id, "price", e.target.value)}
                placeholder="0.00"
              />
              <button
                type="button"
                onClick={() => removeLineItem(item.id)}
                disabled={data.lineItems.length === 1}
                className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600
                  hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30
                  disabled:cursor-not-allowed"
                aria-label="Remove line item"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add line item button */}
        <button
          type="button"
          onClick={addLineItem}
          className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300
            font-medium transition-colors"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add another line item
        </button>

        {/* Total */}
        <div className="mt-4 flex justify-end">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-sm text-slate-400 font-medium">Total</span>
            <span className="text-lg font-bold text-white">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          as="select"
          label="Payment Terms"
          value={data.paymentTerms}
          onChange={(v) => onChange("paymentTerms", v)}
          options={PAYMENT_TERMS}
        />
        <div /> {/* spacer */}
      </div>

      <FormField
        as="textarea"
        label="Additional Notes"
        value={data.additionalNotes}
        onChange={(v) => onChange("additionalNotes", v)}
        placeholder="Anything else you'd like to include — warranty terms, revision policy, etc."
        rows={3}
        optional
      />
    </div>
  );
}
