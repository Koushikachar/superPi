import Link from "next/link";
import PublicHeader from "@/components/PublicHeader"; import ChatWidget from "@/components/ChatLazy"; import SiteFooter from "@/components/SiteFooter"; import JsonLd from "@/components/JsonLd"; import { Mark } from "@/components/Logo";
import { organizationLd, pageMeta } from "@/lib/seo";
export const metadata = pageMeta({ title: "Superpi: inventory management for ecommerce sellers", absoluteTitle: true, path: "/", description: "Know what's in stock. Manage your ecommerce inventory in one place with Superpi. Free Forever for up to 100 products." });

/* Everything on this page is server-rendered HTML with CSS-only motion: no client JavaScript and no screenshots to download.
   The "product screens" are drawn in markup with example data, so they stay sharp, follow light/dark mode and never go out of date. */
const I = ({ d }: { d: string }) => <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const ICON = {
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3zM9 12l2 2 4-4",
  ledger: "M5 4h14v16H5zM9 8h6M9 12h6M9 16h4",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6",
  team: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  bell: "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
};
const bars = [38, 52, 44, 70, 58, 84, 66, 92, 76, 100, 81, 88];
const ledger: [string, string, string, string][] = [["21 Nov", "Goods received", "PO-0031", "+100"], ["22 Nov", "Reserved", "Order #1042", "25 held"], ["22 Nov", "Dispatched", "Order #1042", "−25"], ["23 Nov", "Return inspected", "RET-0007", "2 set aside"], ["24 Nov", "Reserved", "Order #1043", "12 held"]];
const tone = (c: string) => c.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : c.startsWith("−") ? "text-danger" : c.includes("aside") ? "text-ink/60" : "text-brand";

/** The hero "product screen": a mini dashboard with a low-stock alert floating over it. */
function HeroScreen() {
  return <div className="relative mx-auto w-full max-w-[560px]" role="img" aria-label="Superpi dashboard showing 721 units available, ₹40,722 in sales, a rising sales chart and a low-stock alert for Black T-shirt, 3 units left">
    <div aria-hidden className="absolute -inset-10 -z-10 rounded-full bg-brand/25 blur-3xl" />
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy text-white shadow-[0_30px_80px_rgba(20,22,47,.45)] animate-pop">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3"><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" /><span className="ml-3 text-xs text-white/50">superpi · Dashboard</span></div>
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[120px_1fr]">
        <div className="space-y-1.5 border-r border-white/10 p-2.5 text-[11px] text-white/60 sm:p-3">{["Dashboard", "Products", "Inventory", "Orders", "Invoices"].map((n, i) => <div key={n} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${i === 0 ? "bg-brand text-white" : ""}`}><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" /><span className="hidden sm:inline">{n}</span></div>)}</div>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2.5">{[["Available to sell", "721", "735 − 14 reserved"], ["Sales, 30 days", "₹40,722", "8 dispatched orders"]].map(([l, v, h]) => <div key={l} className="rounded-xl bg-white/[.06] p-3"><p className="text-[10px] text-white/55 sm:text-[11px]">{l}</p><p className="mt-1 text-xl font-bold tabular-nums sm:text-2xl">{v}</p><p className="text-[10px] text-white/45">{h}</p></div>)}</div>
          <div className="mt-3 rounded-xl bg-white/[.06] p-3"><div className="flex items-center justify-between text-[11px] text-white/55"><span>Sales over time</span><span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">▲ 18%</span></div>
            <div className="mt-3 flex h-24 items-end gap-1.5 sm:h-28">{bars.map((h, i) => <span key={i} className="bar-grow flex-1 rounded-t-md bg-gradient-to-t from-brand to-brandLight" style={{ height: `${h}%`, animationDelay: `${300 + i * 55}ms` }} />)}</div></div>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-6 left-2 flex items-center gap-3 rounded-2xl border border-edge/70 bg-surface/90 px-4 py-3 text-sm shadow-[0_16px_40px_rgba(20,22,47,.18)] backdrop-blur animate-float sm:-left-8" style={{ animationDelay: "1s" }}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-turmeric/20 text-[#B4690E] dark:text-turmeric"><I d={ICON.bell} /></span><span><b className="block">Low-stock alert</b><span className="text-ink/70">Black T-shirt · 3 units left</span></span></div>
    <div className="absolute -right-2 -top-5 hidden items-center gap-2 rounded-full border border-edge/70 bg-surface/90 px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur animate-float sm:flex" style={{ animationDelay: "2.2s" }}><span className="h-2 w-2 rounded-full bg-emerald-500" />Order #1043 reserved</div>
  </div>;
}

/** The stock history "screen" (replaces the old screenshots). */
function LedgerScreen() {
  return <div className="glass overflow-hidden p-0" role="img" aria-label="Stock history for Black T-shirt size M: 100 received, 25 reserved and dispatched for order 1042, 2 set aside after a return inspection, 12 reserved for order 1043; 63 available to sell">
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-edge/60 p-5"><div><p className="text-xs text-ink/60">Black T-shirt · M · SKU TS-BLK-M</p><p className="mt-1"><span className="text-4xl font-bold tabular-nums text-brand">63</span> <span className="text-sm text-ink/70">available to sell</span></p></div>
      <div className="w-full max-w-[220px]"><div className="flex h-2.5 overflow-hidden rounded-full bg-lavender dark:bg-white/10"><span className="bg-brand" style={{ width: "84%" }} /><span className="bg-brandLight/50" style={{ width: "16%" }} /></div><div className="mt-1 flex justify-between text-[11px] text-ink/60"><span>75 sellable</span><span>12 reserved</span></div></div></div>
    <ul className="row-in divide-y divide-edge/60 text-sm">{ledger.map(([d, m, r, c]) => <li key={d + m + r} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-5 py-3 sm:grid-cols-[64px_1fr_120px_110px]"><span className="text-xs text-ink/60">{d}</span><span className="font-medium">{m}<span className="block text-xs font-normal text-ink/55 sm:hidden">{r}</span></span><span className="hidden text-ink/60 sm:block">{r}</span><span className={`text-right font-semibold tabular-nums ${tone(c)}`}>{c}</span></li>)}</ul>
    <p className="border-t border-edge/60 px-5 py-2.5 text-[11px] text-ink/50">Example data. Every row is permanent: entries are added, never edited.</p></div>;
}

const features: { t: string; d: string; i: keyof typeof ICON; wide?: boolean; dark?: boolean }[] = [
  { t: "Never oversell", d: "Confirming an order reserves stock in one step. Two people can't promise the same last unit.", i: "shield", wide: true, dark: true },
  { t: "A trail for every unit", d: "Receipts, reservations, dispatches and returns go into a ledger that is only ever added to.", i: "ledger" },
  { t: "Receive what arrives", d: "Count goods in against a purchase order, partial deliveries included.", i: "truck" },
  { t: "Returns inspected first", d: "Restock the good ones, set damaged ones aside. Nothing becomes sellable by accident.", i: "undo" },
  { t: "GST invoices", d: "CGST, SGST or IGST worked out, a PDF to send, and payments recorded as they arrive.", i: "receipt" },
  { t: "Low-stock alerts", d: "Set a reorder level per product. Superpi tells you before a best-seller runs out.", i: "bell" },
  { t: "A team of three", d: "Invite two teammates as managers, order staff, accountants or analysts.", i: "team" },
];
const steps = [["Add your products", "Type them in or import a CSV. Set a reorder level for each."], ["Take orders", "Confirming reserves the stock, so what's left is what you can sell."], ["Ship and reorder", "Dispatch, invoice and see what to buy next from the alerts."]];

export default function Home() {
  return (
    <div className="overflow-x-clip text-ink"><JsonLd data={organizationLd()} />
      <PublicHeader />

      <section className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-24 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="animate-rise">
          <p><span className="soon-light">Free Forever · up to 100 products</span></p>
          <h1 className="mt-6 text-[44px] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">Know what&rsquo;s<br /><span className="text-gradient">in stock.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">Manage your ecommerce inventory in one place with Superpi. Keep product and stock records organised as your catalogue grows.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" className="group inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 font-semibold text-white shadow-[0_10px_30px_rgba(67,53,207,.4)] transition hover:-translate-y-0.5 hover:bg-brandDark active:translate-y-0">Get started free<span aria-hidden className="transition-transform group-hover:translate-x-1">→</span></Link>
            <Link href="/login" className="glass px-6 py-3.5 font-medium transition-colors hover:bg-surface/70">Sign in</Link></div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">{["No card needed", "Sign up with Google", "Works on your phone"].map((x) => <li key={x} className="flex items-center gap-2"><span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-lavender text-[11px] font-bold text-brand dark:bg-white/10 dark:text-lavender">✓</span>{x}</li>)}</ul>
        </div>
        <HeroScreen />
      </section>

      <section aria-label="Marketplaces" className="mx-auto max-w-6xl px-4 sm:px-6"><div className="glass flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-5 text-center">
        <span className="text-sm text-ink/60">For sellers on</span>{["Amazon", "Flipkart", "Meesho", "Shopify"].map((m) => <span key={m} className="text-lg font-bold tracking-tight text-ink/70">{m}</span>)}<span className="soon-light">Sync coming soon</span></div></section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-brand">Everything for everyday stock work</p><h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-5xl">Done carefully, so you don&rsquo;t have to.</h2></div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map((f) => <div key={f.t} className={`lift rounded-2xl p-6 ${f.wide ? "lg:col-span-2" : ""} ${f.dark ? "glass-dark" : "glass"}`}>
          <span className={`grid h-11 w-11 place-items-center rounded-xl ${f.dark ? "bg-white/10 text-lavender" : "bg-lavender text-brand dark:bg-white/10 dark:text-lavender"}`}><I d={ICON[f.i]} /></span>
          <h3 className="mt-5 text-lg font-bold">{f.t}</h3><p className={`mt-2 text-sm leading-relaxed ${f.dark ? "text-white/70" : "text-ink/70"}`}>{f.d}</p></div>)}</div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 sm:px-6 lg:grid-cols-[.9fr_1.1fr]">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-brand">Stock history</p><h2 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-5xl">See where every unit went.</h2>
          <p className="mt-4 max-w-md text-lg text-ink/70">Every receipt, reservation, dispatch and return is written down with its date and reference. When the numbers look wrong, the answer is one tap away.</p>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">{[["0", "units oversold"], ["100%", "movements logged"], ["1 tap", "to the reason"]].map(([v, l]) => <div key={l} className="glass p-4"><dt className="sr-only">{l}</dt><dd><span className="block text-2xl font-bold text-brand">{v}</span><span className="text-xs text-ink/60">{l}</span></dd></div>)}</dl></div>
        <LedgerScreen />
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="text-center text-[32px] font-bold tracking-tight md:text-5xl">Up and running in minutes</h2>
        <ol className="relative mt-14 grid gap-6 md:grid-cols-3"><span aria-hidden className="absolute left-[16%] right-[16%] top-6 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block" />
          {steps.map(([t, d], i) => <li key={t} className="relative text-center"><span className="relative mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand text-lg font-bold text-white shadow-[0_8px_24px_rgba(67,53,207,.35)]">{i + 1}</span><h3 className="mt-5 text-lg font-bold">{t}</h3><p className="mx-auto mt-2 max-w-xs text-ink/70">{d}</p></li>)}</ol>
      </section>

      <section className="relative mx-3 mb-10 max-w-6xl overflow-hidden rounded-3xl bg-navy text-white md:mx-auto">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/60 blur-3xl" /><div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brandLight/30 blur-3xl" />
        <div className="relative grid items-center gap-8 px-6 py-16 sm:px-12 md:grid-cols-[1fr_auto]">
          <div><div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 animate-float"><Mark size={32} tone="light" /></div>
            <p className="max-w-xl text-[32px] font-bold leading-tight md:text-4xl">Add your first product to start tracking stock.</p>
            <p className="mt-3 text-white/70">Free Forever for up to 100 products, with a team of three. No card needed.</p></div>
          <div className="flex flex-wrap gap-3"><Link href="/register" className="rounded-xl bg-white px-7 py-3.5 font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-lavender">Get started free</Link><Link href="/contact" className="rounded-xl border border-white/25 px-7 py-3.5 font-medium transition hover:bg-white/10">Talk to us</Link></div></div>
      </section>
      <SiteFooter /><ChatWidget mode="public" />
    </div>
  );
}
