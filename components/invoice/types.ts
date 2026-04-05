export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: string; // kept as string so inputs stay controlled
  rate: string;     // kept as string so inputs stay controlled
  // amount = parseFloat(quantity) * parseFloat(rate) — computed, never stored
}

export interface InvoiceFormData {
  // Step 1 — Your Business Info
  businessName: string;
  yourName: string;
  email: string;
  phone: string;

  // Step 2 — Client Info
  clientName: string;
  clientCompany: string;
  clientEmail: string;

  // Step 3 — Invoice Details
  invoiceNumber: string;
  invoiceDate: string;   // YYYY-MM-DD
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  taxRate: string;       // percentage string, e.g. "8.5"
  notes: string;
}

export const PAYMENT_TERMS = [
  "Due on receipt",
  "Net 15",
  "Net 30",
  "Net 60",
] as const;

// Map payment terms to days offset for due-date calculation
export const TERMS_DAYS: Record<string, number> = {
  "Due on receipt": 0,
  "Net 15": 15,
  "Net 30": 30,
  "Net 60": 60,
};

export function createInitialFormData(): InvoiceFormData {
  return {
    businessName: "",
    yourName: "",
    email: "",
    phone: "",
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    invoiceNumber: "INV-001",
    invoiceDate: new Date().toISOString().slice(0, 10),
    paymentTerms: "Net 30",
    lineItems: [emptyLineItem()],
    taxRate: "",
    notes: "",
  };
}

export function emptyLineItem(): InvoiceLineItem {
  return { id: crypto.randomUUID(), description: "", quantity: "1", rate: "" };
}

/** Calculate due date string from an invoice date and payment terms */
export function calcDueDate(invoiceDate: string, terms: string): string {
  if (!invoiceDate) return "";
  const d = new Date(invoiceDate + "T00:00:00"); // force local time
  d.setDate(d.getDate() + (TERMS_DAYS[terms] ?? 30));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Compute subtotal, taxAmount, total from form data */
export function calcTotals(data: InvoiceFormData) {
  const subtotal = data.lineItems.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return sum + qty * rate;
  }, 0);
  const taxRate = parseFloat(data.taxRate) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  return { subtotal, taxRate, taxAmount, total };
}

export const REQUIRED_FIELDS: Record<number, (keyof InvoiceFormData)[]> = {
  1: ["businessName", "yourName", "email"],
  2: ["clientName", "clientCompany"],
  3: ["invoiceNumber", "invoiceDate"],
  4: [],
};
