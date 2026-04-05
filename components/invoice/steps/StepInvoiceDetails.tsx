"use client";

import FormField from "@/components/proposal/FormField";
import {
  InvoiceFormData,
  InvoiceLineItem,
  PAYMENT_TERMS,
  calcDueDate,
  calcTotals,
  emptyLineItem,
} from "../types";

interface Props {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: unknown) => void;
  errors: Partial<Record<keyof InvoiceFormData, string>>;
}

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ── Line Items sub-component ────────────────────────────────────────────────

function LineItems({
  items,
  onChange,
}: {
  items: InvoiceLineItem[];
  onChange: (updated: InvoiceLineItem[]) => void;
}) {
  function update(id: string, field: keyof InvoiceLineItem, value: string) {
    onChange(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  }

  function add() {
    onChange([...items, emptyLineItem()]);
  }

  function remove(id: string) {
    if (items.length === 1) return;
    onChange(items.filter((i) => i.id !== id));
  }

  const inputCls =
    "w-full rounded-lg px-3 py-2.5 text-sm bg-white/5 border border-white/10 " +
    "hover:border-white/20 text-white placeholder:text-slate-600 outline-none " +
    "focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-colors";

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-3">
        Line Items
      </label>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_72px_100px_96px_32px] gap-2 px-1 mb-1">
        {["Description", "Qty", "Rate ($)", "Amount"].map((h) => (
          <span key={h} className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {h}
          </span>
        ))}
        <span />
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const amount =
            (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
          return (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_72px_100px_96px_32px] gap-2 items-center"
            >
              <input
                type="text"
                className={inputCls}
                value={item.description}
                onChange={(e) => update(item.id, "description", e.target.value)}
                placeholder="e.g. Web design"
              />
              <input
                type="number"
                min="0"
                step="1"
                className={inputCls}
                value={item.quantity}
                onChange={(e) => update(item.id, "quantity", e.target.value)}
                placeholder="1"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                className={inputCls}
                value={item.rate}
                onChange={(e) => update(item.id, "rate", e.target.value)}
                placeholder="0.00"
              />
              {/* Amount — read-only */}
              <div className="flex items-center px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/8 text-sm text-slate-400 tabular-nums">
                ${fmt(amount)}
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                disabled={items.length === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600
                  hover:text-red-400 hover:bg-red-500/10 transition-colors
                  disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Remove row"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={add}
        className="mt-3 flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add line item
      </button>
    </div>
  );
}

// ── Main step ────────────────────────────────────────────────────────────────

export default function StepInvoiceDetails({ data, onChange, errors }: Props) {
  const { subtotal, taxRate, taxAmount, total } = calcTotals(data);
  const dueDate = calcDueDate(data.invoiceDate, data.paymentTerms);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Invoice Details</h2>
        <p className="text-sm text-slate-400 mt-1">
          Set the invoice number, dates, line items, and any notes.
        </p>
      </div>

      {/* Invoice number + date */}
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Invoice Number"
          value={data.invoiceNumber}
          onChange={(v) => onChange("invoiceNumber", v)}
          placeholder="INV-001"
          error={errors.invoiceNumber}
        />
        <FormField
          label="Invoice Date"
          type="text"
          value={data.invoiceDate}
          onChange={(v) => onChange("invoiceDate", v)}
          placeholder="YYYY-MM-DD"
          error={errors.invoiceDate}
        />
      </div>

      {/* Payment terms + computed due date */}
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <FormField
          as="select"
          label="Payment Terms"
          value={data.paymentTerms}
          onChange={(v) => onChange("paymentTerms", v)}
          options={PAYMENT_TERMS}
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Due Date
            <span className="ml-1.5 text-xs font-normal text-slate-500">(calculated)</span>
          </label>
          <div className="w-full rounded-lg px-3.5 py-2.5 text-sm bg-white/[0.03] border border-white/8 text-slate-400">
            {dueDate || "—"}
          </div>
        </div>
      </div>

      {/* Line items */}
      <LineItems
        items={data.lineItems}
        onChange={(updated) => onChange("lineItems", updated)}
      />

      {/* Totals block */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] divide-y divide-white/5">
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="text-white tabular-nums">${fmt(subtotal)}</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-sm text-slate-400 flex-1">Tax rate</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={data.taxRate}
              onChange={(e) => onChange("taxRate", e.target.value)}
              placeholder="0"
              className="w-20 rounded-lg px-3 py-1.5 text-sm bg-white/5 border border-white/10
                hover:border-white/20 text-white placeholder:text-slate-600 outline-none
                focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-colors
                text-right tabular-nums"
            />
            <span className="text-sm text-slate-400">%</span>
          </div>
          <span className="text-sm text-white tabular-nums w-24 text-right">
            ${fmt(taxAmount)}
          </span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="text-sm font-bold text-white">Total</span>
          <span className="text-base font-bold text-white tabular-nums">${fmt(total)}</span>
        </div>
      </div>

      {/* Notes */}
      <FormField
        as="textarea"
        label="Notes / Memo"
        value={data.notes}
        onChange={(v) => onChange("notes", v)}
        placeholder='e.g. "Thank you for your business! Please make payment via bank transfer."'
        rows={3}
        hint="Our AI will polish this into professional language."
        optional
      />
    </div>
  );
}
