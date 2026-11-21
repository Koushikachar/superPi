import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { z } from "zod";
import { allow, clientIp } from "../src/lib/ratelimit";
import { csvCell } from "../src/lib/csv";

const read = (p: string) => readFileSync(p, "utf8");

describe("rate limiter (in-memory fallback)", () => {
  beforeEach(() => { delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN; });
  it("blocks after the limit and keeps blocking", async () => {
    for (let i = 0; i < 3; i++) expect(await allow("t:basic", 3, 60_000)).toBe(true);
    expect(await allow("t:basic", 3, 60_000)).toBe(false);
  });
  it("a burst of junk keys does not wipe everyone's counters", async () => {
    for (let i = 0; i < 3; i++) await allow("t:victim", 3, 60_000);
    for (let i = 0; i < 5100; i++) await allow(`t:junk:${i}`, 5, 60_000);   // just over the 5000 cap: the old code called hits.clear() here
    expect(await allow("t:victim", 3, 60_000)).toBe(false);                   // a key that is currently blocking someone is kept
  });
  it("expired entries are purged first", async () => {
    for (let i = 0; i < 5100; i++) await allow(`t:old:${i}`, 5, 1);           // 1 ms windows expire immediately
    await new Promise((r) => setTimeout(r, 5));
    for (let i = 0; i < 3; i++) await allow("t:fresh", 3, 60_000);
    for (let i = 0; i < 100; i++) await allow(`t:more:${i}`, 5, 60_000);
    expect(await allow("t:fresh", 3, 60_000)).toBe(false);
  });
});

describe("clientIp", () => {
  const h = (o: Record<string, string>) => new Headers(o);
  beforeEach(() => { delete process.env.TRUSTED_IP_HEADER; });
  it("prefers Vercel's own header over a client-sent X-Forwarded-For", () => expect(clientIp(h({ "x-vercel-forwarded-for": "1.1.1.1", "x-forwarded-for": "6.6.6.6" }))).toBe("1.1.1.1"));
  it("uses the configured trusted header first", () => { process.env.TRUSTED_IP_HEADER = "CF-Connecting-IP"; expect(clientIp(h({ "cf-connecting-ip": "2.2.2.2", "x-vercel-forwarded-for": "1.1.1.1" }))).toBe("2.2.2.2"); });
  it("falls back to the first forwarded address, then 'unknown'", () => { expect(clientIp(h({ "x-forwarded-for": "3.3.3.3, 10.0.0.1" }))).toBe("3.3.3.3"); expect(clientIp(h({}))).toBe("unknown"); });
});

describe("spreadsheet-safe CSV", () => {
  it.each(["=1+1", "+cmd", "-2+3", "@SUM(A1)", "\t=1", "\r=1"])("neutralises %j", (v) => expect(csvCell(v).startsWith(`"'`)).toBe(true));
  it("leaves plain numbers and text alone", () => { expect(csvCell(-5)).toBe('"-5"'); expect(csvCell("Blue pen")).toBe('"Blue pen"'); });
});

describe("zod 4 behaviour the forms rely on", () => {
  const num = z.coerce.number().min(0).max(1e9);
  it("coerces form strings to numbers", () => expect(num.parse("12.5")).toBe(12.5));
  it("rejects NaN, Infinity and out-of-range", () => { for (const v of ["abc", "Infinity", "-1", "1e12"]) expect(num.safeParse(v).success, v).toBe(false); });
  it("trims and validates email, strips unknown keys", () => { const s = z.object({ email: z.string().trim().email() }); expect(s.parse({ email: " a@b.co ", extra: 1 })).toEqual({ email: "a@b.co" }); expect(s.safeParse({ email: "nope" }).success).toBe(false); });
  it("reports the first failing field by name", () => { const r = z.object({ a: z.string().min(2), b: z.string().min(2) }).safeParse({ a: "x", b: "y" }); expect(!r.success && r.error.issues[0].path[0]).toBe("a"); });
});

describe("wiring that must not regress", () => {
  it("the idea detail page uses the self-contained save button", () => { const t = read("src/app/(app)/research/ideas/[slug]/page.tsx"); expect(t).toMatch(/<SaveIdea /); expect(t).not.toMatch(/<SaveButton /); });
  it("only one rate-limit implementation exists (no private copy in actions.ts)", () => { const t = read("src/app/actions.ts"); expect(t).not.toMatch(/hits\.clear\(\)/); expect(t).not.toMatch(/UPSTASH_REDIS_REST_URL/); expect(t).toMatch(/from "@\/lib\/ratelimit"/); });
  it("per-IP limits use clientIp(), not a raw X-Forwarded-For read", () => { for (const f of ["src/app/api/ai/public/route.ts", "src/app/api/pay/razorpay/webhook/[orgId]/route.ts"]) { const t = read(f); expect(t, f).toMatch(/clientIp\(req\.headers\)/); expect(t, f).not.toMatch(/get\("x-forwarded-for"\)/); } });
  it("the product export hides unit cost from order staff and uses the shared CSV writer", () => { const t = read("src/app/api/products/export/route.ts"); expect(t).toMatch(/ORDER_STAFF/); expect(t).toMatch(/csvCell/); });
  it("platform webhooks refuse oversized bodies before verifying", () => { for (const f of ["src/app/api/billing/razorpay/webhook/route.ts", "src/app/api/billing/stripe/webhook/route.ts"]) { const t = read(f); expect(t, f).toMatch(/413/); expect(t.indexOf("413"), f).toBeLessThan(t.search(/verify(RazorpayWebhook|StripeSignature)\(/)); } });
  it("outgoing webhooks have a hard overall deadline", () => expect(read("src/lib/webhooks.ts")).toMatch(/Gave up after 10 seconds/));
  it("the public health check is throttled and cached", () => { const t = read("src/app/api/health/route.ts"); expect(t).toMatch(/allow\(`health:/); expect(t).toMatch(/15_000/); });
  it("the plan-invoice email lookup can be scoped to the business", () => { expect(read("src/lib/docmail.ts")).toMatch(/orgId\?: string/); expect(read("src/app/(app)/invoices/doc-actions.ts")).toMatch(/emailPlanInvoice\([^)]*c\.orgId\)/); });
  it("the RLS script switches RLS on automatically for future tables and self-checks", () => { const t = read("supabase/rls-lockdown.sql"); expect(t).toMatch(/CREATE EVENT TRIGGER d2h_auto_rls/); expect(t).toMatch(/NOT rowsecurity/); });
});

describe("dependency audit gate", () => {
  it("every allowance has a reason and an expiry date in the future", () => {
    expect(existsSync("scripts/audit-gate.mjs")).toBe(true);
    const list = JSON.parse(read(".audit-allow.json")) as { id: string; reason: string; expires: string }[];
    const today = new Date().toISOString().slice(0, 10);
    for (const a of list) { expect(a.id).toMatch(/^GHSA-/); expect(a.reason.length).toBeGreaterThan(30); expect(a.expires > today, `${a.id} has expired. Re-check it`).toBe(true); }
  });
  it("Nodemailer, Zod and PostCSS stay on patched versions", () => {
    const pkg = JSON.parse(read("package.json"));
    expect(pkg.dependencies.nodemailer).toMatch(/\^1\d\./); expect(pkg.dependencies.zod).toMatch(/\^4\./); expect(pkg.overrides?.next?.postcss).toBeTruthy();
  });
});

describe("mobile layout, theme toggle and speed settings", () => {
  it("the sticky 'Create free account' bar is gone from every page", () => { expect(existsSync("src/components/StickyCta.tsx")).toBe(false); for (const f of ["src/app/page.tsx", "src/app/pricing/page.tsx"]) { const t = read(f); expect(t, f).not.toMatch(/StickyCta/); expect(t, f).not.toMatch(/pb-20 text-ink md:pb-0/); } });
  it("sign-in and sign-up (AuthCard) pin the theme toggle top-right with inline styles that no class can override", () => {
    const t = read("src/components/AuthCard.tsx");
    expect(t).toMatch(/position: "fixed"/); expect(t).toMatch(/right: "max\(0\.75rem/); expect(t).toMatch(/top: "max\(0\.75rem/); expect(t).toMatch(/left: "auto"/);
    for (const f of ["login", "register", "forgot", "reset", "verify", "mfa", "suspended"]) expect(read(`src/app/${f}/page.tsx`), f).toMatch(/AuthCard/);
  });
  it("only the two preference cookies are script-readable; every other cookie stays HttpOnly", () => {
    const a = read("src/app/prefs-actions.ts");
    expect(a).toMatch(/CONSENT_COOKIE, c, cookieOpts\(180 \* DAY, "\/", false\)/); expect(a).toMatch(/THEME_COOKIE, t, cookieOpts\(365 \* DAY, "\/", false\)/);
    expect(a).toMatch(/SAVED_COOKIE, next\.join\(","\), cookieOpts\(365 \* DAY, "\/research"\)/);
    expect(read("src/lib/prefs.ts")).toMatch(/httpOnly = true/);
  });
  it("the theme script is a fixed string (no user input) and only reads the cookie", () => { const t = read("src/components/ThemeScript.tsx"); expect(t).not.toMatch(/\$\{/); expect(t).not.toMatch(/document\.cookie\s*=/); });
  it("middleware still covers every page and API route (static pages did not remove the header-stripping layer)", () => { const t = read("src/middleware.ts"); expect(t).toMatch(/matcher: \["\/\(\(\?!_next\/static\|_next\/image\|favicon\.ico\)\.\*\)"\]/); expect(t).toMatch(/h\.delete\(k\)/); });
  it("Vercel functions run in Mumbai, next to the Supabase database", () => { const v = JSON.parse(read("vercel.json")); expect(v.regions).toEqual(["bom1"]); expect(v.crons?.length).toBeGreaterThan(0); expect(read(".env.example")).toMatch(/ap-south-1/); });
  it("the social-share card's logo is a flex box (the image renderer rejects multi-child boxes without it)", () => expect(read("src/lib/og.tsx")).toMatch(/display: "flex", alignItems: "center"/));
});
