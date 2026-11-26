// Superpi launch rules: free plan limits, paused features, Google sign-in, sign-out wiping browser storage, and the rebrand.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
const read = (p: string) => readFileSync(p, "utf8");
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : []; });

const counts = { products: 0, members: 0, invites: 0, warehouses: 0 };
vi.mock("@/lib/db", () => ({ db: { product: { count: async () => counts.products }, membership: { count: async () => counts.members }, invitation: { count: async () => counts.invites }, warehouse: { count: async () => counts.warehouses } } }));
const signOut = vi.fn(async () => ({ error: null })), exchange = vi.fn(async (_c: string) => ({ error: null as null | { message: string } }));
vi.mock("@/lib/supabase", () => ({ sbServer: async () => ({ auth: { signOut, exchangeCodeForSession: exchange } }) }));

describe("free plan for everyone", () => {
  beforeEach(() => Object.assign(counts, { products: 0, members: 1, invites: 0, warehouses: 1 }));
  it("is 100 products, 1 owner + 2 members, 1 warehouse", async () => {
    const { PLANS } = await import("../src/lib/plans");
    expect(PLANS.FREE).toMatchObject({ products: 100, members: 3, locations: 1 });
  });
  it("every business gets the free limits, whatever plan was stored", async () => {
    const { usage, CURRENT_PLAN } = await import("../src/lib/plan");
    expect(CURRENT_PLAN).toBe("FREE"); expect((await usage("org1")).plan).toBe("FREE");
  });
  it("blocks the 101st product, the 4th person and a 2nd warehouse", async () => {
    const { checkLimit } = await import("../src/lib/plan");
    Object.assign(counts, { products: 99, members: 2, invites: 0, warehouses: 0 });
    expect(await checkLimit("o", "products", 1)).toBeNull(); expect(await checkLimit("o", "members", 1)).toBeNull(); expect(await checkLimit("o", "locations", 1)).toBeNull();
    Object.assign(counts, { products: 100, members: 2, invites: 1, warehouses: 1 });
    expect(await checkLimit("o", "products", 1)).toMatch(/100 products/);
    expect(await checkLimit("o", "members", 1)).toMatch(/1 owner and 2 members/);
    expect(await checkLimit("o", "locations", 1)).toMatch(/1 warehouse/);
  });
  it("a CSV import that would cross 100 is refused as a whole", async () => {
    const { checkLimit } = await import("../src/lib/plan");
    Object.assign(counts, { products: 95 }); expect(await checkLimit("o", "products", 6)).not.toBeNull(); expect(await checkLimit("o", "products", 5)).toBeNull();
  });
  it("only one owner: the owner role can't be handed out from Settings", () => {
    const a = read("src/app/actions.ts"), fn = a.slice(a.indexOf("export async function changeRole"), a.indexOf("export async function removeMember"));
    expect(fn).toMatch(/z\.enum\(\["INVENTORY_MANAGER", "ORDER_STAFF", "ACCOUNTANT", "ANALYST"\]\)/); expect(fn).not.toMatch(/ROLES5/);
  });
});

describe("paused and removed areas", () => {
  for (const r of ["research", "integrations", "webhooks", "automations"]) it(`${r} shows "coming soon"`, () => expect(read(`src/app/(app)/${r}/layout.tsx`)).toMatch(/ComingSoon/));
  for (const r of ["intelligence", "subscription"]) it(`${r} redirects away`, () => expect(read(`src/app/(app)/${r}/layout.tsx`)).toMatch(/redirect\(/));
  it("the business assistant is back (chat bubble + /assistant), product intelligence (PI) stays hidden", () => {
    expect(existsSync("src/app/(app)/assistant/layout.tsx")).toBe(false); const c = read("src/components/AppChrome.tsx");
    expect(c).toMatch(/<ChatWidget mode="app"/); expect(c).not.toMatch(/PiButton|\/intelligence/);
  });
  it("Settings has no exchange rates, sample data or online payments", () => { const s = read("src/app/(app)/settings/page.tsx"); for (const x of ["setRate", "loadSample", "saveGateway", "Exchange rates", "Razorpay"]) expect(s.includes(x), x).toBe(false); });
  it("the daily job sends no plan-renewal emails", () => expect(read("src/app/api/cron/daily/route.ts")).not.toMatch(/from "\.\.\/billing\/route"/));
});

describe("Google sign-in and first-time setup", () => {
  it("login and register both offer Google", () => { for (const p of ["src/app/login/page.tsx", "src/app/register/page.tsx"]) expect(read(p)).toMatch(/<GoogleButton from=/); });
  it("Google returns through the callback and lands on the dashboard (or onboarding when there is no business yet)", () => {
    const a = read("src/app/actions.ts"); expect(a).toMatch(/provider: "google"/); expect(a).toMatch(/auth\/callback\?next=\/dashboard/);
    expect(read("src/lib/ctx.ts")).toMatch(/if \(!ms\.length\) redirect\("\/onboarding"\)/);
  });
  it("the CSP lets the sign-in form go to Supabase and Google", () => { const c = read("next.config.js"); expect(c).toMatch(/form-action 'self' https:\/\/\*\.supabase\.co https:\/\/accounts\.google\.com/); });
  it("onboarding welcomes new people and asks them to create their organization", () => { const o = read("src/app/onboarding/page.tsx"); expect(o).toMatch(/Welcome to Superpi/); expect(o).toMatch(/Create organization/); expect(o).toMatch(/name="age"/); });
  it("callback: exchanges the code and only follows same-site paths", async () => {
    const { GET } = await import("../src/app/auth/callback/route");
    let r = await GET(new Request("http://x.test/auth/callback?code=abc&next=/dashboard")); expect(r.headers.get("location")).toBe("http://x.test/dashboard"); expect(exchange).toHaveBeenCalledWith("abc");
    r = await GET(new Request("http://x.test/auth/callback?code=abc&next=//evil.com")); expect(r.headers.get("location")).toBe("http://x.test/onboarding");
    r = await GET(new Request("http://x.test/auth/callback?error=access_denied")); expect(r.headers.get("location")).toMatch(/\/login\?e=Google%20sign-in%20was%20cancelled/);
    exchange.mockResolvedValueOnce({ error: { message: "bad" } }); r = await GET(new Request("http://x.test/auth/callback?code=old")); expect(r.headers.get("location")).toMatch(/\/login\?e=/);
  });
});

describe("Google sign-in that lands on the home page", () => {
  it("forwards /?code=… to /auth/callback so the sign-in finishes (Supabase Site URL fallback)", async () => {
    const { NextRequest } = await import("next/server"), { middleware } = await import("../src/middleware");
    const r = await middleware(new NextRequest("https://www.superpi.tech/?code=d47b6b80-d2f7"));
    expect(r.status).toBe(307); const to = new URL(r.headers.get("location")!);
    expect(to.origin + to.pathname).toBe("https://www.superpi.tech/auth/callback"); expect(to.searchParams.get("code")).toBe("d47b6b80-d2f7"); expect(to.searchParams.get("next")).toBe("/dashboard");
    const c = await middleware(new NextRequest("https://www.superpi.tech/?error=access_denied&error_description=cancelled"));
    expect(new URL(c.headers.get("location")!).searchParams.get("error")).toBe("access_denied");
  });
  it("the assistant no longer shows which AI provider answers", () => { expect(read("src/components/AssistantChat.tsx")).not.toMatch(/AI: \{via\}/); });
});

describe("team roles only open their own sections", () => {
  it("owner and platform operators open everything", async () => {
    const { canOpen } = await import("../src/lib/access");
    for (const p of ["/invoices/abc", "/bills", "/warehouses", "/research", "/admin"]) { expect(canOpen("OWNER", p), p).toBe(true); expect(canOpen("ANALYST", p, true), p).toBe(true); }
  });
  it("each staff role gets its sections and is refused the rest", async () => {
    const { canOpen } = await import("../src/lib/access");
    const yes: [string, string][] = [["ORDER_STAFF", "/orders/123"], ["ORDER_STAFF", "/customers"], ["ACCOUNTANT", "/invoices/x"], ["ACCOUNTANT", "/bills"], ["INVENTORY_MANAGER", "/purchases"], ["ANALYST", "/reports"]];
    const no: [string, string][] = [["ORDER_STAFF", "/invoices"], ["ORDER_STAFF", "/bills"], ["ORDER_STAFF", "/warehouses"], ["ACCOUNTANT", "/orders"], ["ACCOUNTANT", "/counts"], ["ANALYST", "/orders"], ["ANALYST", "/customers"], ["INVENTORY_MANAGER", "/invoices"], ["INVENTORY_MANAGER", "/bills"], ["ORDER_STAFF", "/research"], ["ORDER_STAFF", "/admin"]];
    for (const [r, p] of yes) expect(canOpen(r, p), `${r} ${p}`).toBe(true);
    for (const [r, p] of no) expect(canOpen(r, p), `${r} ${p}`).toBe(false);
  });
  it("everyone keeps their dashboard, alerts, own settings and the assistant; an unknown role gets only those", async () => {
    const { canOpen } = await import("../src/lib/access");
    for (const r of ["ORDER_STAFF", "ACCOUNTANT", "ANALYST", "INVENTORY_MANAGER", "SOMETHING_NEW"]) for (const p of ["/dashboard", "/notifications", "/settings", "/security", "/assistant"]) expect(canOpen(r, p), `${r} ${p}`).toBe(true);
    expect(canOpen("SOMETHING_NEW", "/products")).toBe(false);
  });
  it("money on the dashboard follows the assistant's rules", async () => {
    const { seesSales, seesCosts } = await import("../src/lib/access");
    expect(seesSales("ACCOUNTANT")).toBe(true); expect(seesSales("ORDER_STAFF")).toBe(false); expect(seesSales("INVENTORY_MANAGER")).toBe(false);
    expect(seesCosts("ORDER_STAFF")).toBe(false); expect(seesCosts("INVENTORY_MANAGER")).toBe(true);
  });
  it("the server enforces it: ctx() checks the page path set by middleware (never by the client), and menus use the same table", () => {
    expect(read("src/lib/ctx.ts")).toMatch(/canOpen\(m\.role, path, op\)/); const mw = read("src/middleware.ts");
    expect(mw).toMatch(/"x-d2h-path"\]\.forEach\(\(k\) => h\.delete\(k\)\)/); expect(mw).toMatch(/h\.set\("x-d2h-path", req\.nextUrl\.pathname\)/);
    expect(read("src/components/AppChrome.tsx")).toMatch(/canOpen\(role, h, admin\)/);
  });
});

describe("invitations and recovery", () => {
  it("invite links never read 'undefined/…' when NEXT_PUBLIC_SITE_URL is missing", () => { const a = read("src/app/actions.ts"); expect(a).toMatch(/const link = `\$\{await SITE\(\)\}\/invite\//); expect(a).not.toMatch(/\$\{process\.env\.NEXT_PUBLIC_SITE_URL\}\/invite/); });
  it("cancelling an invite, removing a member or changing a role says so", () => { const a = read("src/app/actions.ts"); for (const m of ["Invitation cancelled", "Team member removed", "Role changed to"]) expect(a, m).toContain(m); });
  it("after a new deploy, a stale tab reloads itself instead of showing an error", () => { const e = read("src/app/error.tsx"); expect(e).toMatch(/ChunkLoadError/); expect(e).toMatch(/location\.replace/); expect(e).not.toMatch(/localStorage|sessionStorage/); });
  it("serves a real favicon.ico (16/32/48 px)", () => { const b = readFileSync("src/app/favicon.ico"); expect(b.readUInt16LE(2)).toBe(1); expect(b.readUInt16LE(4)).toBe(3); expect([b[6], b[22], b[38]]).toEqual([16, 32, 48]); });
});

describe("sign-out leaves nothing in the browser", () => {
  it("ends the session and sends Clear-Site-Data for storage and cache", async () => {
    const { POST } = await import("../src/app/auth/signout/route");
    const r = await POST(new Request("http://x.test/auth/signout", { method: "POST", headers: { origin: "http://x.test", host: "x.test" } }));
    expect(r.status).toBe(303); expect(r.headers.get("location")).toBe("http://x.test/login"); expect(r.headers.get("clear-site-data")).toBe('"cache", "storage"'); expect(signOut).toHaveBeenCalled();
  });
  it("refuses a sign-out posted from another site", async () => {
    const { POST } = await import("../src/app/auth/signout/route"); signOut.mockClear();
    const r = await POST(new Request("http://x.test/auth/signout", { method: "POST", headers: { origin: "https://evil.example", host: "x.test" } }));
    expect(r.status).toBe(403); expect(signOut).not.toHaveBeenCalled();
  });
  it("every sign-out button posts to that route", () => { for (const p of ["src/app/(app)/settings/page.tsx", "src/app/mfa/page.tsx", "src/app/suspended/page.tsx"]) expect(read(p)).toMatch(/action="\/auth\/signout" method="post"/); });
});

describe("assistant tells the truth about the plan", () => {
  it("answers price, team, warehouse and integration questions with the free plan only", async () => {
    const { siteAnswer } = await import("../src/lib/localanswer"), { siteFacts } = await import("../src/lib/kb");
    for (const q of ["how much does it cost?", "how many team members?", "can I add warehouses?", "do you have webhooks or shopify?", "does it make GST invoices?"]) {
      const a = siteAnswer(q); expect(a, q).not.toMatch(/Growth|Scale|Razorpay|payment link|₹999|Stripe/);
    }
    expect(siteAnswer("how much does it cost?")).toMatch(/Free Forever.*100 products/);
    expect(siteAnswer("integrations?")).toMatch(/coming soon/);
    expect(siteFacts()).not.toMatch(/Growth|Scale|Razorpay|Stripe/); expect(siteFacts()).toMatch(/no paid plans/);
  });
});

describe("visitor chat on the home page", () => {
  it("answers 6 questions a day per visitor, then asks them to sign in (other visitors unaffected)", async () => {
    const { POST } = await import("../src/app/api/ai/public/route"), { VISITOR_CHAT_LIMIT } = await import("../src/lib/chatinput");
    const ask = (ip: string) => POST(new Request("http://x.test/api/ai/public", { method: "POST", headers: { "x-forwarded-for": ip, "content-type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: "Is it free?" }] }) }));
    expect(VISITOR_CHAT_LIMIT).toBe(6);
    for (let i = 0; i < 6; i++) { const r = await ask("203.0.113.7"); expect(r.status, `question ${i + 1}`).toBe(200); expect((await r.json()).reply).toBeTruthy(); }
    const blocked = await ask("203.0.113.7"), j = await blocked.json();
    expect(blocked.status).toBe(429); expect(j.limit).toBe(true); expect(j.error).toMatch(/sign in/i);
    expect((await ask("198.51.100.9")).status).toBe(200);
  });
  it("an empty request does not use up a question", async () => {
    const { POST } = await import("../src/app/api/ai/public/route");
    for (let i = 0; i < 10; i++) expect((await POST(new Request("http://x.test/api/ai/public", { method: "POST", headers: { "x-forwarded-for": "192.0.2.50" }, body: "{}" }))).status).toBe(400);
    expect((await POST(new Request("http://x.test/api/ai/public", { method: "POST", headers: { "x-forwarded-for": "192.0.2.50" }, body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }) }))).status).toBe(200);
  });
  it("the home page shows the assistant, with the limit wired into the chat box", () => {
    expect(read("src/app/page.tsx")).toMatch(/<ChatWidget mode="public" \/>/); expect(read("src/components/ChatWidget.tsx")).toMatch(/limit=\{VISITOR_CHAT_LIMIT\}/);
  });
});

describe("Superpi brand", () => {
  it("the product is Superpi everywhere; Direct2Hub appears only as the legal company name", () => { expect(walk("src").filter((f) => /Direct2Hub(?! Private Limited)|Direct<span/.test(read(f)))).toEqual([]); });
  it("About, Contact, Privacy and Terms carry the real company details", async () => {
    const { LEGAL, legalReady } = await import("../src/lib/legal");
    expect(LEGAL).toMatchObject({ company: "Direct2Hub Private Limited", cin: "U46901KA2026PTC231623", email: "contact@superpi.space", support: "support@superpi.space" }); expect(legalReady).toBe(true);
    for (const p of ["src/app/about/page.tsx", "src/app/contact/page.tsx", "src/app/privacy/page.tsx", "src/app/terms/page.tsx"]) expect(existsSync(p), p).toBe(true);
    expect(read("src/app/contact/page.tsx")).toMatch(/name="subject"/); expect(read("src/app/sitemap.ts")).toMatch(/"\/about"/);
  });
  it("brand assets exist", () => { for (const p of ["public/brand/superpi-logo.png", "public/brand/superpi-logo-light.png", "public/brand/superpi-mark.png", "public/brand/pwa-512.png", "src/app/icon.png", "src/fonts/noto-sans-latin-wght-normal.woff2"]) expect(existsSync(p), p).toBe(true); });
  it("uses the brand book colours", () => { const t = read("tailwind.config.ts"); for (const c of ["#14162F", "#4335CF", "#E8E5FF", "#F8F8FD"]) expect(t.includes(c), c).toBe(true); });
  it("the home page draws its screens in HTML: no old screenshots, no pricing button", () => { const h = read("src/app/page.tsx"); expect(h).not.toMatch(/\/images\//); expect(h).not.toMatch(/See pricing/); expect(existsSync("public/images/reports.webp")).toBe(false); });
});
