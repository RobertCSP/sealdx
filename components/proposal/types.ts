export interface LineItem {
  id: string;
  service: string;
  price: string; // string so the input stays controlled; parse to number for total
}

export interface ProposalFormData {
  // Step 1 — Your Business Info
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
  // logo: placeholder — not wired up yet

  // Step 2 — Client Info
  clientName: string;
  clientCompany: string;
  clientEmail: string;

  // Step 3 — Proposal Details
  projectTitle: string;
  servicesDescription: string;
  timeline: string;
  lineItems: LineItem[];
  paymentTerms: string;
  additionalNotes: string;
}

export const EMPTY_LINE_ITEM = (): LineItem => ({
  id: crypto.randomUUID(),
  service: "",
  price: "",
});

export const INITIAL_FORM_DATA: ProposalFormData = {
  businessName: "",
  yourName: "",
  email: "",
  phone: "",
  clientName: "",
  clientCompany: "",
  clientEmail: "",
  projectTitle: "",
  servicesDescription: "",
  timeline: "",
  lineItems: [EMPTY_LINE_ITEM()],
  paymentTerms: "Net 30",
  additionalNotes: "",
};

export const PAYMENT_TERMS = [
  "Due on receipt",
  "Net 15",
  "Net 30",
  "Net 60",
] as const;

// Which fields are required per step (used for validation)
export const REQUIRED_FIELDS: Record<number, (keyof ProposalFormData)[]> = {
  1: ["businessName", "yourName", "email"],
  2: ["clientName", "clientCompany"],
  3: ["projectTitle", "servicesDescription", "timeline"],
  4: [],
};
