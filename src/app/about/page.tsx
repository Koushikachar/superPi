import Link from "next/link";
import PublicHeader from "@/components/PublicHeader"; import SiteFooter from "@/components/SiteFooter"; import Breadcrumbs from "@/components/Breadcrumbs"; import JsonLd from "@/components/JsonLd"; import { Mark } from "@/components/Logo";
import { pageMeta, siteUrl } from "@/lib/seo"; import { LEGAL } from "@/lib/legal";
export const metadata = pageMeta({ title: "About Superpi", description: "Superpi is an AI-powered inventory management platform founded and operated by Direct2Hub Private Limited. Free Forever for up to 100 products.", path: "/about" });
const I = ({ d }: { d: string }) => <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const offers: [string, string, string][] = [
  ["Inventory Management", "Maintain organized product information, manage inventory records, track stock quantities, and access inventory-related information from one platform. Superpi is built to reduce the complexity of everyday inventory management.", "M12 3 3 7.5v9L12 21l9-4.5v-9L12 3zM3 7.5l9 4.5 9-4.5M12 12v9"],
  ["Business AI Assistant", "Superpi's Business AI Assistant helps users understand their own business and inventory information. Using relevant data available within a user's account, the assistant can answer inventory-related questions, explain business information, and help users make more informed operational decisions. Rather than providing only generic responses, Superpi aims to make AI assistance relevant to each user's actual business records.", "M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"],
  ["Simple and Accessible Experience", "We believe business software should make work easier, not more complicated. Superpi focuses on a straightforward user experience that makes managing inventory practical for both new and experienced business owners.", "M5 12l5 5L20 7"],
];
const values: [string, string][] = [["Simplicity", "We strive to make business management straightforward and efficient."], ["Accessibility", "We believe useful technology should be available to businesses at different stages of growth."], ["Innovation", "We focus on building practical features that solve real business challenges."], ["Transparency", "We aim to communicate clearly about our products, capabilities, and limitations."], ["Customer Focus", "We value user feedback and continuous improvement."]];
export default function About() {
  return <div className="overflow-x-clip text-ink">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "About Superpi", url: `${siteUrl()}/about`, about: { "@type": "Organization", name: LEGAL.company, brand: LEGAL.product } }} />
    <PublicHeader />
    <main>
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6"><div aria-hidden className="dot-grid pointer-events-none absolute inset-0 -z-10" />
        <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div className="animate-rise"><p><span className="soon-light">About Superpi</span></p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">Your Inventory.<br /><span className="text-gradient">Smarter Than Ever.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">Superpi is an AI-powered inventory management platform designed to help businesses organize their products, manage stock, and make smarter business decisions.</p></div>
          <div className="glass-dark relative overflow-hidden p-8 animate-pop"><div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/50 blur-3xl" />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/10 animate-float"><Mark size={32} tone="light" /></div>
            <p className="relative mt-5 text-white/80">Founded and operated by <b className="text-white">{LEGAL.company}</b>, Superpi was created with a clear purpose: to make modern inventory management technology simple, accessible, and useful for businesses of all sizes.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><div className="glass grid gap-8 p-6 md:grid-cols-2 md:p-10">
        <div><h2 className="text-[28px] font-bold leading-tight md:text-3xl">What Is Superpi?</h2>
          <p className="mt-4 text-ink/75">Superpi is a cloud-based inventory management platform with integrated AI assistance.</p>
          <p className="mt-3 text-ink/75">It is designed for ecommerce sellers, retailers, shop owners, entrepreneurs, and growing businesses looking for a simpler way to manage their products and stock information.</p>
          <p className="mt-3 text-ink/75">Our platform helps users centralize their inventory records and access useful information about their own business.</p></div>
        <div className="space-y-3 text-ink/75"><p>We understand that managing inventory is an essential part of running a successful product-based business. From maintaining accurate stock records to understanding inventory performance, everyday operations can quickly become complicated.</p>
          <p>Superpi brings inventory management and an intelligent Business AI Assistant together in one platform, helping business owners manage their inventory with greater clarity, confidence, and efficiency.</p></div>
      </div></section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><p className="text-sm font-semibold uppercase tracking-wider text-brand">What Superpi offers</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{offers.map(([t, d, ic]) => <div key={t} className="glass lift p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lavender text-brand dark:bg-white/10 dark:text-lavender"><I d={ic} /></span><h3 className="mt-5 text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-ink/70">{d}</p></div>)}</div></section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-12"><div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand/50 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="text-[28px] font-bold md:text-4xl">Free Forever — Up to 100 Products</h2>
          <p className="mt-3 max-w-2xl text-white/75">Every business deserves access to useful management tools. That&apos;s why Superpi offers a Free Forever plan supporting up to 100 products, subject to the features and usage limits published for the plan.</p>
          <p className="mt-2 max-w-2xl text-white/75">Our goal is to make inventory management more accessible without requiring users to begin with a paid subscription.</p></div>
          <Link href="/register" className="rounded-xl bg-white px-7 py-3.5 text-center font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-lavender">Get started free</Link></div></div></section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-2">
        <div className="glass p-6 md:p-8"><p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Mission</p><p className="mt-3 text-lg leading-relaxed">To simplify inventory management and empower businesses with accessible, intelligent technology that helps them stay organized, understand their operations, and make informed decisions.</p></div>
        <div className="glass p-6 md:p-8"><p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Vision</p><p className="mt-3 text-lg leading-relaxed">To become a trusted business management platform that combines practical software with artificial intelligence, enabling businesses to manage operations more intelligently as they grow.</p></div></section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><h2 className="text-[28px] font-bold md:text-4xl">Our Values</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{values.map(([t, d], i) => <div key={t} className="glass lift p-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white">{i + 1}</span><h3 className="mt-3 font-bold">{t}</h3><p className="mt-1 text-sm text-ink/70">{d}</p></div>)}</div></section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><div className="glass grid gap-6 p-6 md:grid-cols-[1fr_1fr] md:p-10">
        <div><h2 className="text-[28px] font-bold md:text-3xl">Founded by {LEGAL.company}</h2>
          <p className="mt-4 text-ink/75">Superpi is a technology product founded and operated by {LEGAL.company}, an Indian company developing business-focused technology solutions.</p>
          <p className="mt-3 text-ink/75">Our objective is to help entrepreneurs and businesses use modern software and AI tools to simplify everyday operations.</p></div>
        <dl className="grid content-start gap-3 rounded-2xl border border-edge/60 bg-lavender/30 p-5 text-sm dark:bg-white/5">
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Company</dt><dd className="font-medium">{LEGAL.company}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">CIN</dt><dd className="font-medium">{LEGAL.cin}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Registered office</dt><dd>{LEGAL.address}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Email</dt><dd><a href={`mailto:${LEGAL.email}`} className="text-brand underline">{LEGAL.email}</a></dd></div></dl>
      </div></section>

      <section className="mx-auto max-w-6xl px-4 pb-12 text-center sm:px-6"><h2 className="text-[28px] font-bold md:text-4xl">Start Managing Smarter</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/70">Whether you&apos;re organizing your first products or managing an expanding inventory, Superpi is here to make inventory management simpler.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/register" className="rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow-[0_8px_24px_rgba(67,53,207,.35)] transition hover:-translate-y-0.5 hover:bg-brandDark">Get started free</Link><Link href="/contact" className="glass px-6 py-3 font-medium transition-colors hover:bg-surface/70">Contact us</Link></div>
        <p className="mt-8 text-sm font-semibold text-ink/60">Superpi — {LEGAL.tagline}</p></section>
    </main><SiteFooter /></div>;
}
