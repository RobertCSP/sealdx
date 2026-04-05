import FormField from "../FormField";
import { ProposalFormData } from "../types";

interface Props {
  data: ProposalFormData;
  onChange: (field: keyof ProposalFormData, value: string) => void;
  errors: Partial<Record<keyof ProposalFormData, string>>;
}

export default function StepClientInfo({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Client Info</h2>
        <p className="text-sm text-slate-400 mt-1">
          Who is this proposal addressed to?
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Client Name"
          value={data.clientName}
          onChange={(v) => onChange("clientName", v)}
          placeholder="John Doe"
          error={errors.clientName}
        />
        <FormField
          label="Client Company"
          value={data.clientCompany}
          onChange={(v) => onChange("clientCompany", v)}
          placeholder="Globex Corp"
          error={errors.clientCompany}
        />
      </div>

      <FormField
        label="Client Email"
        type="email"
        value={data.clientEmail}
        onChange={(v) => onChange("clientEmail", v)}
        placeholder="john@globexcorp.com"
        optional
      />
    </div>
  );
}
