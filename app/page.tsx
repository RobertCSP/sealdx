import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
  description:
    "Sealdx uses AI to generate polished, client-ready proposals and invoices from your project details. Free to start. No design skills needed.",
  openGraph: {
    title: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
    description:
      "Generate professional proposals and invoices instantly with AI. Close deals faster.",
    url: "https://www.getsealdx.com",
    siteName: "Sealdx",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sealdx — AI Proposals & Invoices in Under 2 Minutes",
    description:
      "Generate professional proposals and invoices instantly with AI. Free to start.",
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Fill in your details",
    description:
      "Enter your business info, client name, and project scope. Our guided form takes less than 3 minutes.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "AI writes the document",
    description:
      "Our AI — powered by Claude — crafts professional, tailored copy for your proposal or invoice in seconds.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9"
          stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M16 3l2 2-5 5M18 5l2-2"
          stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Download your PDF",
    description:
      "Preview the result, make edits if needed, and download a polished PDF ready to send to your client.",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
          stroke="#3b82f6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const benefits = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Under 2 Minutes",
    description:
      "Stop spending hours on documents. Sealdx generates polished proposals and invoices instantly so you can focus on winning clients.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#3b82f6" strokeWidth="1.5" />
        <path d="M7 9h10M7 13h6" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Professional Quality",
    description:
      "Every document looks like it came from a seasoned design studio — consistent branding, clean layout, and the right tone.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9"
          stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 3l2 2-5 5M18 5l2-2"
          stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "AI-Powered",
    description:
      "Our AI understands your project and writes compelling copy tailored to your client — no templates, no generic filler text.",
  },
];

const faqs = [
  {
    q: "What is Sealdx?",
    a: "Sealdx is an AI-powered tool that generates professional proposals and invoices for freelancers, agencies, and consultants. You fill in your project details and we handle the writing, formatting, and design.",
  },
  {
    q: "Is it free to use?",
    a: "Yes — Sealdx is free to start. The free plan lets you create up to 3 documents per month. Upgrade to Pro for $9/month to get unlimited documents and PDF downloads without the Sealdx watermark.",
  },
  {
    q: "How does the AI write my proposal?",
    a: "We use Claude, one of the most advanced AI models available. You provide your project details, client name, and scope — the AI crafts a fully written, professional document tailored to your specific situation.",
  },
  {
    q: "Can I customize the output?",
    a: "Absolutely. After the AI generates your document, you can edit any part of it before downloading. The form also has an 'Edit' button so you can go back and regenerate with different details.",
  },
  {
    q: "What file format does the PDF download in?",
    a: "All downloads are standard PDF files that look great on any device and can be sent directly to clients or printed.",
  },
  {
    q: "Do I need design skills?",
    a: "None at all. Sealdx handles the layout and design automatically. Every document follows a clean, professional template that looks polished without any effort on your part.",
  },
];

const testimonials = [
  {
    quote:
      "I used to spend 2 hours writing proposals. Now I'm done in under 5 minutes and clients actually comment on how professional they look.",
    name: "Marcus T.",
    role: "Freelance Web Developer",
    initials: "MT",
    color: "bg-blue-500/20 text-blue-300",
  },
  {
    quote:
      "The invoice PDF looks more professional than anything I could design myself. My clients pay faster when they get a clean invoice.",
    name: "Priya S.",
    role: "Brand Consultant",
    initials: "PS",
    color: "bg-violet-500/20 text-violet-300",
  },
  {
    quote:
      "As a solo agency owner, every minute counts. Sealdx saves me hours every week that I can put back into client work.",
    name: "James R.",
    role: "Creative Agency Owner",
    initials: "JR",
    color: "bg-emerald-500/20 text-emerald-300",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-powered document generation
        </div>

        <h1 className="max-w-3xl text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
          Create Professional{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            Proposals & Invoices
          </span>{" "}
          in Under 2 Minutes
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
          Describe your project and our AI writes a polished, client-ready
          document for you — no design skills needed, no blank-page paralysis.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/proposal"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create a Proposal
          </Link>
          <Link
            href="/invoice"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all hover:-translate-y-0.5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
              className="group-hover:scale-110 transition-transform">
              <rect x="4" y="3" width="16" height="18" rx="2" stroke="white" strokeWidth="1.8" />
              <path d="M8 8h8M8 12h5M8 16h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Create an Invoice
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-600">
          No credit card required &middot; Free to start
        </p>
      </main>

      {/* ── How It Works ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            How it works
          </p>
          <h2 className="text-center text-3xl font-bold text-white mb-3">
            From blank page to ready-to-send in minutes
          </h2>
          <p className="text-center text-slate-500 text-sm mb-14 max-w-lg mx-auto">
            No learning curve. Just fill in a few fields and let the AI do the heavy lifting.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 relative">

            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 relative z-10">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-blue-500/60 tracking-widest uppercase mb-2">
                  Step {step.number}
                </span>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="px-6 py-20 bg-white/[0.02]">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-white mb-3">
            Why teams choose Sealdx
          </h2>
          <p className="text-center text-slate-500 text-sm mb-12">
            Built for freelancers, agencies, and consultants who close deals fast.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-blue-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {b.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            What people are saying
          </p>
          <h2 className="text-center text-2xl font-bold text-white mb-12">
            Trusted by freelancers & agencies
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" fill="#f59e0b" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 bg-white/[0.02] border-t border-white/5">
        <div className="mx-auto max-w-2xl">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">
            FAQ
          </p>
          <h2 className="text-center text-2xl font-bold text-white mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-5 rounded-xl border border-white/5 bg-white/[0.02]"
              >
                <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to close your next deal?
          </h2>
          <p className="text-slate-400 mb-8">
            Join hundreds of freelancers and agencies who use Sealdx to win clients faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:-translate-y-0.5"
            >
              See Pricing
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">No credit card required &middot; Free plan available</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-8 border-t border-white/5">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <svg width="12" height="12" fill="none" viewBox="0 0 16 16">
                <path d="M2 4h12M2 8h8M2 12h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-semibold text-slate-400">
              Seal<span className="text-blue-400">dx</span>
            </span>
          </div>
          <p>&copy; {new Date().getFullYear()} Sealdx. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/proposal" className="hover:text-slate-300 transition-colors">Proposals</Link>
            <Link href="/invoice" className="hover:text-slate-300 transition-colors">Invoices</Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
