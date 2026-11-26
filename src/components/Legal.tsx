import Link from "next/link"; import SiteFooter from "./SiteFooter"; import Breadcrumbs from "./Breadcrumbs"; import PublicHeader from "./PublicHeader"; import { LEGAL } from "@/lib/legal";
/** Section heading, list and table-of-contents helpers shared by the Privacy and Terms pages. */
export const H = ({ id, children }: { id?: string; children: React.ReactNode }) => <h2 id={id} className="scroll-mt-24 pt-4 text-lg font-bold text-ink">{children}</h2>;
export const H3 = ({ children }: { children: React.ReactNode }) => <h3 className="pt-2 font-semibold text-ink">{children}</h3>;
export const UL = ({ items }: { items: React.ReactNode[] }) => <ul className="list-disc space-y-1 pl-5 marker:text-brand">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
export const OL = ({ items }: { items: React.ReactNode[] }) => <ol className="list-decimal space-y-1 pl-5 marker:font-semibold marker:text-brand">{items.map((x, i) => <li key={i}>{x}</li>)}</ol>;
export const Mail = ({ to }: { to: string }) => <a href={`mailto:${to}`} className="font-medium text-brand underline">{to}</a>;
/** A defined term followed by its explanation, e.g. "AI Technology Providers: …". */
export const DT = ({ t, children }: { t: string; children: React.ReactNode }) => <p><b className="text-ink">{t}:</b> {children}</p>;
export default function Legal({ title, path, toc, children }: { title: string; path: string; toc?: [string, string][]; children: React.ReactNode }) {
  return <div className="text-ink"><PublicHeader />
    <main className="mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6"><Breadcrumbs trail={[{ name: title, path }]} />
      <h1 className="mt-3 text-[32px] font-bold leading-tight tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-ink/65">Effective date: {LEGAL.effective} · Last updated: {LEGAL.updated}</p>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        {toc && <nav aria-label="On this page" className="glass hidden p-4 text-sm lg:sticky lg:top-24 lg:block"><p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/50">On this page</p>
          <ol className="space-y-1.5">{toc.map(([id, l]) => <li key={id}><a href={`#${id}`} className="text-ink/70 transition-colors hover:text-brand">{l}</a></li>)}</ol></nav>}
        <article className={`glass space-y-3 p-6 text-[15px] leading-relaxed text-ink/80 md:p-10 ${toc ? "" : "lg:col-span-2"}`}>{children}
          <p className="border-t border-edge/60 pt-6 text-sm text-ink/60">{LEGAL.product} — founded and operated by {LEGAL.company}. Questions? <Link href="/contact" className="text-brand underline">Contact us</Link>.</p></article>
      </div></main><SiteFooter /></div>;
}
