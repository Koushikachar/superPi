import { NextResponse } from "next/server";
import { sbServer } from "@/lib/supabase";
/** Sign out (POST from a form). Ends the Supabase session and tells the browser to wipe this site's cache and storage
 *  (localStorage, sessionStorage, IndexedDB), so nothing from the account, or from older versions of the app, is left behind on the device. */
export async function POST(req: Request) {
  const url = new URL(req.url), origin = req.headers.get("origin"), host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (origin && new URL(origin).host !== host) return new Response("Forbidden", { status: 403 }); // only our own pages can sign someone out
  await (await sbServer()).auth.signOut().catch(() => {});
  const res = NextResponse.redirect(new URL("/login", url.origin), 303);
  res.headers.set("Clear-Site-Data", '"cache", "storage"');
  return res;
}
