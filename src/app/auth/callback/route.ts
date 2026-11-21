import { NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
/** Supabase sends people here after an email link or "Continue with Google" with ?code=. We swap it for a session, then go on to `next`
 *  (default /onboarding). The app pages send anyone without a business to /onboarding, so a first-time Google sign-in lands there too. */
export async function GET(req: Request) {
  const u = new URL(req.url), code = u.searchParams.get("code"), nx = u.searchParams.get("next");
  const dest = nx && /^\/(?![\/\\])/.test(nx) && !/[\\\r\n]/.test(nx) ? nx : "/onboarding"; // only same-site paths
  const back = (m: string) => NextResponse.redirect(new URL("/login?e=" + encodeURIComponent(m), u.origin));
  if (u.searchParams.get("error")) return back(u.searchParams.get("error") === "access_denied" ? "Google sign-in was cancelled" : "Google sign-in didn't finish. Please try again");
  if (code && !(await (await sbServer()).auth.exchangeCodeForSession(code)).error) return NextResponse.redirect(new URL(dest, u.origin));
  return back("That sign-in link is invalid or expired. Sign in and we'll send a new one");
}
