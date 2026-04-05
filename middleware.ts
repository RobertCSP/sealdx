import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require a logged-in session
const PROTECTED = ["/dashboard", "/proposal", "/invoice"];
// Routes that logged-in users shouldn't visit (auth pages)
const AUTH_ONLY = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  // createServerClient from @supabase/ssr refreshes the session cookie
  // on every request by reading/writing cookies via the response object.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write updated cookies back to both the request and response
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() also silently refreshes expired tokens
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users away from protected pages
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (isProtected && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect logged-in users away from login/signup
  const isAuthPage = AUTH_ONLY.includes(pathname);
  if (isAuthPage && user) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  // Run middleware on these paths only — skip static files and API routes
  matcher: [
    "/dashboard/:path*",
    "/proposal/:path*",
    "/invoice/:path*",
    "/login",
    "/signup",
  ],
};
