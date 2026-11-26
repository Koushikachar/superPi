import Link from "next/link";
import { Stat } from "@/components/Shell"; import { SalesChart, StatusChart } from "@/components/ChartsLazy"; import { Panel, Err } from "@/components/ui"; import { canOpen, seesSales, seesCosts } from "@/lib/access";
import { db } from "@/lib/db"; import { ctx } from "@/lib/ctx";
export const dynamic = "force-dynamic";
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const ICON = { box: "M12 3 3 7.5v9L12 21l9-4.5v-9L12 3zM3 7.5l9 4.5 9-4.5M12 12v9", rupee: "M6 4h12M6 9h12M9 4c4 0 6 2 6 5s-2 5-6 5H6l8 7", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2", bell: "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0" };
// How each stock movement reads in the activity list, and whether it adds to or takes from the shelf.
const MOVE: Record<string, [string, 1 | -1 | 0]> = { OPENING: ["Opening stock", 1], RECEIPT: ["Goods received", 1], RESERVE: ["Reserved", 0], RELEASE: ["Reservation released", 0], DISPATCH: ["Dispatched", -1], ADJUST: ["Adjusted", 0],
  DAMAGE: ["Set aside as damaged", -1], RETURN_RESTOCK: ["Return restocked", 1], TRANSFER_OUT: ["Transferred out", -1], TRANSFER_IN: ["Transferred in", 1], ASSEMBLY_IN: ["Assembled", 1], ASSEMBLY_OUT: ["Used in assembly", -1] };
const quick: [string, string, string][] = [["Add product", "/products", "M12 5v14M5 12h14"], ["New order", "/orders", "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6"], ["Receive goods", "/purchases", "M3 7h11v9H3zM14 10h4l3 3v3h-7"], ["Count stock", "/counts", "M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"]];

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string; e?: string }> }) {
  const c = await ctx(), orgId = c.orgId, { range, e } = await searchParams, ok = (h: string) => canOpen(c.role, h, c.op), money = seesSales(c.role) || c.op, costs = seesCosts(c.role) || c.op, days = [7, 30, 90].includes(Number(range)) ? Number(range) : 30;
  const since = new Date(Date.now() - days * 864e5), sold = { in: ["DISPATCHED", "DELIVERED"] as ("DISPATCHED" | "DELIVERED")[] };
  const [products, bal, byStatus, low, val, orders, top, mv] = await Promise.all([
    db.product.count({ where: { orgId, archived: false } }),
    db.stockBalance.aggregate({ where: { orgId }, _sum: { sellable: true, reserved: true } }),
    db.order.groupBy({ by: ["status"], where: { orgId, createdAt: { gte: since } }, _count: true }),
    db.$queryRaw<{ name: string; sku: string; avail: bigint; reorder: number; total: bigint }[]>`SELECT p.name, p.sku, COALESCE(SUM(b.sellable-b.reserved),0) avail, p."reorderAt" reorder, COUNT(*) OVER() total FROM "Product" p LEFT JOIN "StockBalance" b ON b."productId"=p.id
      WHERE p."orgId"=${orgId} AND p.archived=false GROUP BY p.id HAVING COALESCE(SUM(b.sellable-b.reserved),0) <= p."reorderAt" ORDER BY avail LIMIT 6`,
    db.$queryRaw<{ v: unknown }[]>`SELECT COALESCE(SUM(b.sellable * p."unitCost"),0) v FROM "StockBalance" b JOIN "Product" p ON p.id=b."productId" WHERE b."orgId"=${orgId}`,
    db.order.findMany({ where: { orgId, createdAt: { gte: since }, status: sold }, select: { createdAt: true, total: true } }),
    db.orderLine.groupBy({ by: ["productId"], where: { order: { orgId, createdAt: { gte: since }, status: sold } }, _sum: { qty: true }, orderBy: { _sum: { qty: "desc" } }, take: 5 }),
    db.stockMovement.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, productId: true, type: true, qty: true, createdAt: true } }),
  ]);
  const ids = [...new Set([...top.map((t) => t.productId), ...mv.map((m) => m.productId)])];
  const names: Record<string, string> = ids.length ? Object.fromEntries((await db.product.findMany({ where: { id: { in: ids }, orgId }, select: { id: true, name: true } })).map((p) => [p.id, p.name])) : {};
  const day = (d: Date) => d.toLocaleDateString("en-CA"), byDay = new Map<string, number>();
  orders.forEach((o) => byDay.set(day(o.createdAt), (byDay.get(day(o.createdAt)) ?? 0) + Number(o.total)));
  const series = Array.from({ length: days }, (_, i) => { const d = new Date(Date.now() - (days - 1 - i) * 864e5); return { d: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), v: byDay.get(day(d)) ?? 0 }; });
  const revenue = orders.reduce((s, o) => s + Number(o.total), 0), sellable = bal._sum.sellable ?? 0, reserved = bal._sum.reserved ?? 0, lowCount = Number(low[0]?.total ?? 0);
  const now = new Date(), hour = Number(now.toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" })), part = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const first = (c.user.name ?? "").trim().split(/\s+/)[0], topMax = Math.max(1, ...top.map((t) => t._sum.qty ?? 0));

  return <>
    <header className="animate-rise flex flex-wrap items-end justify-between gap-4 md:pr-14">
      <div><p className="text-sm text-ink/60">{now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" })} · {c.orgName}</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight md:text-4xl">Good {part}{first ? `, ${first}` : ""}</h1></div>
      <nav aria-label="Date range" className="glass flex gap-1 p-1">{[7, 30, 90].map((d) => <Link key={d} href={`/dashboard?range=${d}`} aria-current={d === days ? "true" : undefined} className={`rounded-xl px-3.5 py-1.5 text-sm transition ${d === days ? "bg-brand font-semibold text-white shadow-[0_4px_12px_rgba(67,53,207,.35)]" : "text-ink/70 hover:bg-surface/70"}`}>{d} days</Link>)}</nav>
    </header>

    <div className="stagger mt-5 space-y-5 md:mt-6 md:space-y-6">
      <Err e={e} />
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{quick.filter(([, h]) => ok(h)).map(([l, h, d]) => <Link key={l} href={h} className="glass flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:text-brand"><svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 text-brand dark:text-lavender" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>{l}</Link>)}</div>

      {products === 0 && <Link href="/products" className="relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl bg-navy p-6 text-white transition hover:-translate-y-0.5">
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/60 blur-3xl" />
        <span className="relative"><b className="block text-lg">Add your first product to start tracking stock.</b><span className="text-white/70">Superpi is free for up to 100 products.</span></span><span className="relative rounded-xl bg-white px-4 py-2 font-semibold text-navy">Add product</span></Link>}

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Stat label="Available to sell" value={(sellable - reserved).toLocaleString("en-IN")} hint={`${sellable} sellable − ${reserved} reserved`} icon={ICON.box} href={ok("/inventory") ? "/inventory" : undefined} />
        {costs ? <Stat label="Stock value at cost" value={inr(Number(val[0]?.v ?? 0))} hint="Sellable units × unit cost" icon={ICON.rupee} href={ok("/reports") ? "/reports" : undefined} />
          : <Stat label="Active products" value={products} hint="Products you can sell" icon={ICON.rupee} href={ok("/products") ? "/products" : undefined} />}
        {money ? <Stat label={`Sales, last ${days} days`} value={inr(revenue)} hint={`${orders.length} dispatched order${orders.length === 1 ? "" : "s"}, before returns`} icon={ICON.chart} href={ok("/orders") ? "/orders" : undefined} />
          : <Stat label={`Dispatched, last ${days} days`} value={orders.length} hint="Orders sent to customers" icon={ICON.chart} href={ok("/orders") ? "/orders" : undefined} />}
        <Stat label="Low-stock products" value={lowCount} tone={lowCount ? "warn" : "brand"} hint={`of ${products} active product${products === 1 ? "" : "s"}`} icon={ICON.bell} href={ok("/inventory") ? "/inventory" : undefined} /></div>

      <div className={`grid gap-4 ${money ? "lg:grid-cols-[1.4fr_1fr]" : ""}`}>
        {money && <Panel title="Sales over time"><p className="-mt-2 mb-3 text-xs text-ink/60">Dispatched order totals by order date</p>{orders.length ? <SalesChart data={series} /> : <Empty>No dispatched orders in the last {days} days.</Empty>}</Panel>}
        <Panel title="Orders by status"><p className="-mt-2 mb-3 text-xs text-ink/60">Orders created in this period</p>{byStatus.length ? <StatusChart data={byStatus.map((s) => ({ s: s.status.toLowerCase(), n: s._count }))} /> : <Empty>No orders in the last {days} days.</Empty>}</Panel></div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Needs reordering">{low.length ? <ul className="space-y-3">{low.map((l) => { const a = Number(l.avail), pct = Math.max(4, Math.min(100, Math.round((a / Math.max(1, l.reorder)) * 100)));
            return <li key={l.sku}><div className="flex items-baseline justify-between gap-3 text-sm"><span className="min-w-0 truncate font-medium">{l.name}</span><span className={`shrink-0 tabular-nums ${a <= 0 ? "font-semibold text-danger" : "text-ink/70"}`}>{a <= 0 ? "Out of stock" : `${a} unit${a === 1 ? "" : "s"} left`}</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lavender dark:bg-white/10"><div className={`h-full rounded-full ${a <= 0 ? "bg-danger" : "bg-turmeric"}`} style={{ width: `${a <= 0 ? 100 : pct}%` }} /></div></li>; })}
            {lowCount > low.length && <li><Link href="/inventory" className="text-sm text-brand underline">See all {lowCount}</Link></li>}</ul>
          : <Empty>Nothing is at or below its reorder level.</Empty>}</Panel>
        <Panel title="Best sellers">{top.length ? <ol className="space-y-3">{top.map((t, i) => { const q = t._sum.qty ?? 0; return <li key={t.productId} className="flex items-center gap-3">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${i === 0 ? "bg-brand text-white" : "bg-lavender text-brand dark:bg-white/10 dark:text-lavender"}`}>{i + 1}</span>
            <div className="min-w-0 flex-1"><div className="flex justify-between gap-2 text-sm"><span className="truncate font-medium">{names[t.productId] ?? "Deleted product"}</span><span className="shrink-0 tabular-nums text-ink/70">{q} sold</span></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-lavender dark:bg-white/10"><div className="h-full rounded-full bg-brand" style={{ width: `${Math.round((q / topMax) * 100)}%` }} /></div></div></li>; })}</ol>
          : <Empty>No sales in the last {days} days.</Empty>}</Panel>
        <Panel title="Recent activity">{mv.length ? <ul className="space-y-3">{mv.map((m) => { const [label, dir] = MOVE[m.type] ?? [m.type, 0], q = dir === 0 ? `${Math.abs(m.qty)}` : `${dir > 0 ? "+" : "−"}${Math.abs(m.qty)}`;
            return <li key={m.id} className="flex items-center gap-3 text-sm"><span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${dir > 0 ? "bg-emerald-500" : dir < 0 ? "bg-danger" : "bg-brandLight"}`} />
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{names[m.productId] ?? "Deleted product"}</p><p className="text-xs text-ink/60">{label} · {m.createdAt.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })}</p></div>
              <span className={`shrink-0 font-semibold tabular-nums ${dir > 0 ? "text-emerald-600 dark:text-emerald-400" : dir < 0 ? "text-danger" : "text-ink/70"}`}>{q}</span></li>; })}</ul>
          : <Empty>No stock activity yet.</Empty>}</Panel>
      </div>
    </div>
  </>;
}
const Empty = ({ children }: { children: React.ReactNode }) => <p className="grid min-h-32 place-items-center rounded-xl border border-dashed border-ink/15 px-4 text-center text-sm text-ink/60">{children}</p>;
