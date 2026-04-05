"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const supabase = createBrowserClient();

    async function fetchProfile(userId: string) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_status")
        .eq("id", userId)
        .single();
      setIsPro(profile?.subscription_status === "pro");
    }

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
      if (data.user) await fetchProfile(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        fetchProfile(u.id);
      } else {
        setIsPro(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogOut() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/proposal", label: "Proposals" },
        { href: "/invoice", label: "Invoices" },
        { href: "/pricing", label: "Pricing" },
      ]
    : [];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 group-hover:bg-blue-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h8M2 12h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Seal<span className="text-blue-400">dx</span>
            </span>
            {isPro && (
              <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full
                bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 leading-none">
                PRO
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          {user && (
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className={`hover:text-white transition-colors ${pathname === l.href ? "text-white" : ""}`}>
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop auth controls */}
          <div className="hidden md:flex items-center gap-3">
            {ready && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-slate-500 max-w-[180px] truncate">
                      {user.user_metadata?.full_name
                        ? (user.user_metadata.full_name as string).split(" ")[0]
                        : user.email}
                    </span>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm
                        font-medium text-slate-400 hover:text-white border border-white/10
                        hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"
                      className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600
                        hover:bg-blue-500 text-white text-sm font-semibold transition-colors
                        shadow-lg shadow-blue-900/30">
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg
              border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0f1e] px-6 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`flex items-center py-2.5 text-sm font-medium transition-colors
                  ${pathname === l.href ? "text-white" : "text-slate-400 hover:text-white"}`}>
                {l.label}
              </Link>
            ))}

            {ready && (
              <div className="pt-3 mt-3 border-t border-white/5 space-y-2">
                {user ? (
                  <>
                    <p className="text-xs text-slate-600 truncate pb-1">{user.email}</p>
                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-2 py-2.5 text-sm font-medium
                        text-slate-400 hover:text-white transition-colors"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"
                      className="flex py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup"
                      className="flex items-center justify-center py-2.5 rounded-lg bg-blue-600
                        hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
