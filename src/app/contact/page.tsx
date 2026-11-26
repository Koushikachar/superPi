import Link from "next/link"; import SiteFooter from "@/components/SiteFooter"; import Breadcrumbs from "@/components/Breadcrumbs"; import JsonLd from "@/components/JsonLd"; import Turnstile from "@/components/Turnstile"; import SubmitButton from "@/components/SubmitButton";
import PublicHeader from "@/components/PublicHeader";
import { pageMeta, siteUrl } from "@/lib/seo"; import { LEGAL } from "@/lib/legal"; import { submitContact } from "@/app/actions"; import { inp } from "@/components/ui";
export const metadata = pageMeta({ title: "Contact us", description: "Questions about Superpi, your account or the Business AI Assistant? Email contact@superpi.space or support@superpi.space, or use the contact form.", path: "/contact" });
const Icon = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
const channels: { t: string; d: string; mail: string; ic: string }[] = [
  { t: "General Inquiries", d: "Have questions about Superpi, our platform, or available features?", mail: LEGAL.email, ic: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12z" },
  { t: "Customer & Technical Support", d: "Need assistance with account access, inventory management, technical issues, or the Business AI Assistant? Please describe your issue and include relevant details. Never share your password.", mail: LEGAL.support, ic: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { t: "Business & Partnership Inquiries", d: "Interested in business collaborations, partnerships, or other professional opportunities involving Superpi?", mail: LEGAL.email, ic: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8" },
  { t: "Privacy & Account Deletion Requests", d: "For personal data inquiries, privacy concerns, or account deletion requests. We may request identity verification before processing certain account-related requests.", mail: LEGAL.support, ic: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v11H5z" },
];
export default async function Contact({ searchParams }: { searchParams: Promise<{ sent?: string; e?: string }> }) {
  const { sent, e } = await searchParams;
  return <div className="text-ink"><JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Superpi", url: `${siteUrl()}/contact` }} />
    <PublicHeader current="contact" />
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6"><Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
      <div className="animate-rise"><p className="mt-4"><span className="soon-light">Superpi Support</span></p>
        <h1 className="mt-4 text-[32px] font-bold leading-tight tracking-tight md:text-5xl">Have Questions? We&apos;re Here to Help.</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink/70">Whether you need assistance with inventory management, your account, or our Business AI Assistant, we&apos;re here to help make your experience with Superpi easier.</p></div>

      <h2 className="mt-10 text-xl font-bold">Get in Touch</h2>
      <div className="stagger mt-4 grid gap-4 sm:grid-cols-2">{channels.map((c) => <div key={c.t} className="glass lift flex gap-4 p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-lavender text-brand dark:bg-white/10 dark:text-lavender"><Icon d={c.ic} /></span>
        <div className="min-w-0"><h3 className="font-semibold">{c.t}</h3><p className="mt-1 text-sm text-ink/70">{c.d}</p><a href={`mailto:${c.mail}`} className="mt-2 inline-block break-all font-semibold text-brand underline">{c.mail}</a></div></div>)}</div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section aria-labelledby="form-h">
          <h2 id="form-h" className="text-xl font-bold">Send Us a Message</h2><p className="mt-1 text-sm text-ink/70">Have a question, suggestion, or technical issue? Our team will review your inquiry and respond through the appropriate support channel.</p>
          {sent ? <div role="status" className="glass mt-4 space-y-3 p-6 animate-pop md:p-8"><div className="grid h-12 w-12 place-items-center rounded-full bg-brand/15 text-brand"><Icon d="M5 12l5 5L20 7" /></div><h3 className="text-xl font-semibold text-brand">Thanks, we&apos;ve got your message.</h3><p className="text-sm text-ink/70">We&apos;ll reply to the email address you gave. While you wait, you can <Link href="/register" className="text-brand underline">create your free account</Link>.</p></div>
            : <form action={submitContact} className="glass relative mt-4 space-y-4 p-6 md:p-8">
              {e && <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{e}</p>}
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Full Name<input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Asha Rao" className={inp} /></label>
                <label className="text-sm font-medium">Email Address<input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@yourshop.com" className={inp} /></label></div>
              <label className="block text-sm font-medium">Subject<input name="subject" required minLength={3} maxLength={120} placeholder="e.g. Help importing my products" className={inp} /></label>
              <label className="block text-sm font-medium">Message<textarea name="message" required minLength={10} maxLength={2000} rows={6} placeholder="Tell us what you need. Please don't include passwords or payment details." className={`${inp} resize-y`} /></label>
              <div aria-hidden className="sr-only"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <Turnstile /><SubmitButton pendingText="Sending…" className="min-h-11 w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brandDark sm:w-auto">Send message</SubmitButton>
              <p className="text-xs text-ink/70">Please avoid submitting passwords, payment credentials, or unnecessary confidential information through the contact form. We use your details only to reply. See our <Link href="/privacy" className="underline">privacy policy</Link>.</p></form>}
        </section>
        <aside className="space-y-4" aria-label="Our company">
          <section className="glass p-5 text-sm"><h2 className="text-base font-bold">Our Company</h2>
            <dl className="mt-3 space-y-2.5"><div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Product</dt><dd className="font-medium">{LEGAL.product}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Founded and operated by</dt><dd className="font-medium">{LEGAL.company}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">CIN</dt><dd className="font-medium">{LEGAL.cin}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Registered Office</dt><dd>{LEGAL.address}.</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">Website</dt><dd><a href={LEGAL.website} className="text-brand underline">{LEGAL.website}</a></dd></div></dl></section>
          <section className="glass p-5 text-sm"><h2 className="text-base font-bold">Your Feedback Matters</h2><p className="mt-2 text-ink/70">At Superpi, we believe good software starts with understanding real business needs. We welcome your questions, feedback, and suggestions as we continue developing the platform.</p>
            <p className="mt-3 font-semibold text-ink/60">Superpi — {LEGAL.tagline}</p></section></aside>
      </div>
    </main><SiteFooter /></div>;
}
