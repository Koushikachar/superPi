import { db } from "@/lib/db"; import { getUser, isOperator } from "@/lib/auth"; import { mailConfigured, verifyMail } from "@/lib/mail"; import { allow, clientIp } from "@/lib/ratelimit";
export const dynamic = "force-dynamic";
/** Open /api/health to see why pages fail. Reports pass/fail and Prisma error codes only: never secrets or messages. */
let pub: { at: number; ok: boolean } | null = null; // what anonymous callers see; refreshed at most every 15 s so this open endpoint cannot be used to hammer the database
export async function GET(req: Request) {
  const u0 = await getUser().catch(() => null), op = !!u0 && (await isOperator(u0));
  if (!op) { // anonymous / ordinary users: a cheap cached yes-or-no (uptime monitors keep working)
    if (!(await allow(`health:${clientIp(req.headers)}`, 30, 60_000))) return Response.json({ ok: false, error: "Too many requests" }, { status: 429 });
    if (pub && Date.now() - pub.at < 15_000) return Response.json({ ok: pub.ok }, { status: pub.ok ? 200 : 503 });
  }
  const missingEnv = ["DATABASE_URL", "DIRECT_URL", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_URL"].filter((k) => !process.env[k]);
  const checks: Record<string, string> = {};
  const probe = async (name: string, f: () => Promise<unknown>) => { try { await f(); checks[name] = "ok"; } catch (e: any) { checks[name] = e?.code ? `failed (${e.code})` : "failed"; } };
  await probe("database connection", () => db.$queryRaw`SELECT 1`);
  await probe("organizations (plan)", () => db.organization.findFirst({ select: { id: true, plan: true } }));
  await probe("orders (payment status)", () => db.order.findFirst({ select: { id: true, paymentStatus: true } }));
  await probe("purchase lines (rejected)", () => db.purchaseOrderLine.findFirst({ select: { id: true, rejected: true } }));
  await probe("goods receipts", () => db.goodsReceipt.findFirst({ select: { id: true } }));
  await probe("notifications", () => db.notification.findFirst({ select: { id: true } }));
  await probe("subscriptions", () => db.subscription.findFirst({ select: { id: true } }));
  await probe("subscription payments", () => db.subscriptionPayment.findFirst({ select: { id: true } }));
  await probe("credit notes", () => db.creditNote.findFirst({ select: { id: true } }));
  await probe("price lists", () => db.priceList.findFirst({ select: { id: true } }));
  await probe("stock transfers", () => db.stockTransfer.findFirst({ select: { id: true } }));
  await probe("kits", () => db.kitComponent.findFirst({ select: { id: true } }));
  await probe("batches", () => db.batch.findFirst({ select: { id: true } }));
  await probe("serial numbers", () => db.serialNumber.findFirst({ select: { id: true } }));
  await probe("payment gateways", () => db.paymentGateway.findFirst({ select: { id: true } }));
  await probe("contact messages", () => db.contactMessage.findFirst({ select: { id: true } }));
  await probe("bills", () => db.bill.findFirst({ select: { id: true } }));
  await probe("invitations", () => db.invitation.findFirst({ select: { id: true } }));
  const ok = !missingEnv.length && Object.values(checks).every((v) => v === "ok");
  if (!op) { pub = { at: Date.now(), ok }; return Response.json({ ok }, { status: ok ? 200 : 503 }); } // details are for platform operators only
  checks["email (SMTP login)"] = mailConfigured() ? ((await verifyMail()).ok ? "ok" : "failed") : "not configured"; // informational: never affects "ok"
  return Response.json({ ok, missingEnv, checks, hint: ok ? undefined : "P2021 = table missing and P2022 = column missing: migrate this database. Missing env names must be added to the host's environment variables." }, { status: ok ? 200 : 503 });
}
