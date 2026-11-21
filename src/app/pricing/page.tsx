import Link from "next/link"; import SiteFooter from "@/components/SiteFooter"; import Breadcrumbs from "@/components/Breadcrumbs"; import JsonLd from "@/components/JsonLd"; import { pageMeta, siteUrl } from "@/lib/seo";
import PublicHeader from "@/components/PublicHeader";
import { PLANS } from "@/lib/plans";
export const metadata = pageMeta({ title: "Pricing", description: "Superpi is Free Forever for up to 100 products, with a team of three. Inventory management for ecommerce sellers, with no card needed.", path: "/pricing" });
const included = ["Stock that never oversells, with a full ledger", "Sales orders, GST invoices and credit notes", "Purchase orders, goods receipts and supplier bills", "Returns inspection (restock or set aside damaged)", "Customer price lists", "Delivery challan, shipping and tracking details", "Reports: stock value, aging, GST summary, reorder suggestions", "CSV import and export, team roles and an audit trail"];
const faq = [
  ["Is it really free?", "Yes. Superpi is free for every seller during launch, for up to 100 products. No card is needed to sign up."],
  ["Who can be on my team?", "You, as the owner, plus two members. Give each one a role: inventory manager, order staff, accountant or analyst. You can change roles or remove someone at any time in Settings → Team."],
  ["What happens at 100 products?", "You can keep using everything you already have. To add another product, archive one you no longer sell. Archived products keep their history."],
  ["Will paid plans come later?", "Larger plans are planned. We will tell you before anything changes, and your free plan stays free."]];
export default function Pricing() {
  const p = PLANS.FREE;
  return <div className="text-ink"><JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Superpi", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: siteUrl(), offers: [{ "@type": "Offer", name: "Free Forever", price: 0, priceCurrency: "INR", url: `${siteUrl()}/pricing`, availability: "https://schema.org/InStock" }] }} />
    <PublicHeader current="pricing" />
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6"><Breadcrumbs trail={[{ name: "Pricing", path: "/pricing" }]} />
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_420px]">
        <div className="animate-rise"><h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">Free Forever for up to {p.products} products.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/70">Every feature, no card, no trial clock. Manage your inventory with a small team and keep every stock movement on record.</p></div>
        <section aria-labelledby="plan-h" className="glass relative overflow-hidden p-6 ring-2 ring-brand animate-pop md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandLight/30 blur-3xl" />
          <div className="relative flex items-center justify-between"><h2 id="plan-h" className="text-xl font-bold">Free Forever</h2><span className="soon-light">Launch offer</span></div>
          <p className="relative mt-3 text-5xl font-bold tabular-nums">₹0<span className="text-base font-normal text-ink/70"> / forever</span></p>
          <ul className="relative mt-6 space-y-2.5 text-sm">{[`${p.products} products`, `${p.members} people: 1 owner + ${p.members - 1} members`, `${p.locations} ${p.locations === 1 ? "location" : "locations"} (warehouse)`, "Every feature included"].map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="font-bold text-brand">✓</span>{x}</li>)}</ul>
          <Link href="/register" className="relative mt-7 block rounded-xl bg-brand px-5 py-3 text-center font-semibold text-white shadow-[0_6px_20px_rgba(67,53,207,.35)] transition hover:bg-brandDark active:scale-[.98]">Get started</Link>
          <p className="relative mt-2 text-center text-xs text-ink/70">No card needed</p></section>
      </div>
      <section className="glass mt-12 p-6 md:p-8"><h2 className="text-xl font-bold">Everything included</h2><ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">{included.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="text-brand">✓</span>{x}</li>)}</ul></section>
      <section className="mt-12"><h2 className="text-xl font-bold">Questions</h2><dl className="glass mt-4 divide-y divide-edge/70">{faq.map(([q, a]) => <div key={q} className="p-5"><dt className="font-semibold">{q}</dt><dd className="mt-1 text-sm text-ink/70">{a}</dd></div>)}</dl>
        <p className="mt-4 text-sm text-ink/70">Something else? <Link href="/contact" className="text-brand underline">Contact us</Link>.</p></section>
    </main><SiteFooter /></div>;
}
