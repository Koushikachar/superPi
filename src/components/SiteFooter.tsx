import Link from "next/link"; import CookieSettings from "./CookieSettings"; import { LEGAL } from "@/lib/legal";
export default function SiteFooter() {
  return <footer className="mx-auto max-w-6xl px-6 py-8 text-sm text-ink/70">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span>© {new Date().getFullYear()} {LEGAL.product} · {LEGAL.tagline}</span>
      <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer"><Link href="/" className="underline">Home</Link><Link href="/about" className="underline">About</Link><Link href="/pricing" className="underline">Pricing</Link><Link href="/contact" className="underline">Contact</Link><Link href="/privacy" className="underline">Privacy</Link><Link href="/terms" className="underline">Terms</Link><Link href="/login" className="underline">Sign in</Link><CookieSettings /></nav></div>
    <p className="mt-4 text-xs text-ink/55">{LEGAL.product} is founded and operated by {LEGAL.company} · CIN {LEGAL.cin} · {LEGAL.address}</p></footer>;
}
