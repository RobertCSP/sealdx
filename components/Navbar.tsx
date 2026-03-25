import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Simple geometric logo mark */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 group-hover:bg-blue-400 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4h12M2 8h8M2 12h5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Seal<span className="text-blue-400">dx</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/proposal" className="hover:text-white transition-colors">
            Proposals
          </Link>
          <Link href="/invoice" className="hover:text-white transition-colors">
            Invoices
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/proposal"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/proposal"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
