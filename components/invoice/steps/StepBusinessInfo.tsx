import FormField from "@/components/proposal/FormField";
import { InvoiceFormData } from "../types";

interface Props {
  data: InvoiceFormData;
  onChange: (field: keyof InvoiceFormData, value: string) => void;
  errors: Partial<Record<keyof InvoiceFormData, string>>;
}

export default function StepBusinessInfo({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Your Business Info</h2>
        <p className="text-sm text-slate-400 mt-1">
          This appears on the invoice as the sender.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Business Name"
          value={data.businessName}
          onChange={(v) => onChange("businessName", v)}
          placeholder="Acme Studio"
          error={errors.businessName}
        />
        <FormField
          label="Your Name"
          value={data.yourName}
          onChange={(v) => onChange("yourName", v)}
          placeholder="Jane Smith"
          error={errors.yourName}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          placeholder="jane@acmestudio.com"
          error={errors.email}
        />
        <FormField
          label="Phone"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          placeholder="+1 (555) 000-0000"
          optional
        />
      </div>
    </div>
  );
}
