import Link from "next/link";

const benefits = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5" />
        <path
          d="M12 7v5l3 3"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Under 2 Minutes",
    description:
      "Stop spending hours crafting documents from scratch. Sealdx generates polished proposals and invoices instantly so you can focus on winning clients.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="#3b82f6"
          strokeWidth="1.5"
        />
        <path
          d="M7 9h10M7 13h6"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Professional Quality",
    description:
      "Every document looks like it came from a seasoned design studio — consistent branding, clean layout, and the right tone for your industry.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 3l2 2-5 5"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 5l2-2"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "AI-Powered",
    description:
      "Our AI understands your project details and writes compelling copy tailored to your client — no templates, no generic filler text.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-powered document generation
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
          Create Professional{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Proposals & Invoices
          </span>{" "}
          in Under 2 Minutes
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
          Describe your project, and our AI writes a polished, client-ready
          document for you — no design skills needed, no blank-page paralysis.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/proposal"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Create a Proposal
          </Link>
          <Link
            href="/invoice"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all hover:-translate-y-0.5"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform"
            >
              <rect
                x="4"
                y="3"
                width="16"
                height="18"
                rx="2"
                stroke="white"
                strokeWidth="1.8"
              />
              <path
                d="M8 8h8M8 12h5M8 16h3"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Create an Invoice
          </Link>
        </div>

        {/* Social proof hint */}
        <p className="mt-6 text-sm text-slate-600">
          No credit card required &middot; Free to start
        </p>
      </main>

      {/* ── Benefits ── */}
      <section className="px-6 py-20 bg-white/[0.02] border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-white mb-3">
            Why teams choose Sealdx
          </h2>
          <p className="text-center text-slate-500 text-sm mb-12">
            Built for freelancers, agencies, and consultants who close deals fast.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                <path
                  d="M2 4h12M2 8h8M2 12h5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-slate-400">
              Seal<span className="text-blue-400">dx</span>
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} Sealdx. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/proposal" className="hover:text-slate-300 transition-colors">
              Proposals
            </Link>
            <Link href="/invoice" className="hover:text-slate-300 transition-colors">
              Invoices
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
