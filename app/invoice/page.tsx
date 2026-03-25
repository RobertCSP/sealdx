export default function InvoicePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
      <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center mb-6">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="#3b82f6" strokeWidth="1.8" />
          <path
            d="M8 8h8M8 12h5M8 16h3"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
        Create Invoice
      </h1>
      <p className="text-slate-400 text-base text-center max-w-sm">
        This page is coming soon. The AI invoice builder will live here.
      </p>
    </div>
  );
}
