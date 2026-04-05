// Reusable labeled input / textarea used across all steps.

interface BaseProps {
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
}

interface InputProps extends BaseProps {
  type?: "text" | "email" | "tel" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  as?: "input";
}

interface TextareaProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  as: "textarea";
}

interface SelectProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  as: "select";
}

type Props = InputProps | TextareaProps | SelectProps;

export default function FormField(props: Props) {
  const { label, optional, error, hint } = props;

  const labelEl = (
    <label className="block text-sm font-medium text-slate-300 mb-1.5">
      {label}
      {optional && (
        <span className="ml-1.5 text-xs font-normal text-slate-500">
          (optional)
        </span>
      )}
    </label>
  );

  const baseClass = `w-full rounded-lg px-3.5 py-2.5 text-sm bg-white/5 border
    text-white placeholder:text-slate-600 outline-none transition-colors
    focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
    ${error ? "border-red-500/60" : "border-white/10 hover:border-white/20"}`;

  let control: React.ReactNode;

  if (props.as === "textarea") {
    control = (
      <textarea
        className={`${baseClass} resize-none`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        rows={props.rows ?? 4}
      />
    );
  } else if (props.as === "select") {
    control = (
      <select
        className={`${baseClass} cursor-pointer`}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        style={{ backgroundColor: "#111827" }}
      >
        {props.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        type={props.type ?? "text"}
        className={baseClass}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    );
  }

  return (
    <div>
      {labelEl}
      {control}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
