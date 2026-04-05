import FormField from "../FormField";
import { ProposalFormData } from "../types";

interface Props {
  data: ProposalFormData;
  onChange: (field: keyof ProposalFormData, value: string) => void;
  errors: Partial<Record<keyof ProposalFormData, string>>;
}

export default function StepBusinessInfo({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Your Business Info</h2>
        <p className="text-sm text-slate-400 mt-1">
          This appears on your proposal as the sender.
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

      {/* Logo upload — placeholder for future implementation */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Logo{" "}
          <span className="ml-1.5 text-xs font-normal text-slate-500">
            (optional)
          </span>
        </label>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-dashed border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors cursor-not-allowed">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 16l4-4 4 4 4-6 4 6"
                stroke="#475569"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
                stroke="#475569"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-500">Logo upload coming soon</p>
            <p className="text-xs text-slate-600 mt-0.5">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
