import { PrismaClient } from "@prisma/client";
/** Connection settings for Supabase's pooler. Prisma's defaults (5 s to connect, 10 s to wait for a free connection) are too
 *  tight when the database is far away: a page that asks for several things at once then failed with "Can't reach database
 *  server" (P1001). Longer limits make a slow moment wait instead of crashing the page. Values already in DATABASE_URL win.
 *  (Forcing connection_limit=1 was tried and made it worse: queries queued past the wait limit, P2024.)
 *  The real speed fix is running the server in the same region as the database (vercel.json). */
export function tunedUrl(url = process.env.DATABASE_URL ?? ""): string {
  if (!url) return url;
  const extra = ([["connect_timeout", "30"], ["pool_timeout", "30"]] as const).filter(([k]) => !new RegExp(`[?&]${k}=`).test(url)).map(([k, v]) => `${k}=${v}`);
  return extra.length ? `${url}${url.includes("?") ? "&" : "?"}${extra.join("&")}` : url;
}
const g = globalThis as unknown as { prisma?: PrismaClient };
export const db = g.prisma ?? new PrismaClient({ datasourceUrl: tunedUrl() || undefined, log: process.env.NODE_ENV === "production" ? ["error"] : ["error", "warn"] });
if (process.env.NODE_ENV !== "production") g.prisma = db;