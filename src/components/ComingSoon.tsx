import Link from "next/link"; import { Mark } from "./Logo";
/** Shown in place of a feature that is on the way. The feature's own code stays in the repo; delete the route's layout.tsx to switch it back on. */
export default function ComingSoon({ title, lead, points }: { title: string; lead: string; points: string[] }) {
  return <section aria-labelledby="soon-h" className="relative mx-auto mt-6 max-w-2xl overflow-hidden rounded-3xl glass p-6 text-center animate-pop sm:p-10 md:mt-12">
    <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brandLight/30 blur-3xl" />
    <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-lavender shadow-[0_10px_30px_rgba(67,53,207,.25)] animate-float dark:bg-white/10"><Mark size={44} tone="auto" /></div>
    <p className="relative mt-6"><span className="soon-light">Coming soon</span></p>
    <h1 id="soon-h" className="relative mt-3 text-[28px] font-bold leading-tight tracking-tight md:text-4xl">{title}</h1>
    <p className="relative mx-auto mt-3 max-w-lg text-ink/70">{lead}</p>
    <ul className="relative mx-auto mt-6 grid max-w-md gap-2 text-left text-sm">{points.map((p) => <li key={p} className="flex items-start gap-3 rounded-xl border border-edge/60 bg-surface/50 px-4 py-3"><span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />{p}</li>)}</ul>
    <div className="relative mt-8 flex flex-wrap justify-center gap-3"><Link href="/dashboard" className="min-h-11 rounded-xl bg-gradient-to-b from-brandLight to-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(67,53,207,.4)] transition hover:brightness-110 active:scale-[.98]">Back to dashboard</Link>
      <Link href="/products" className="min-h-11 rounded-xl border border-edge/70 bg-surface/60 px-5 py-2.5 text-sm font-semibold transition hover:bg-surface/90">Manage products</Link></div>
  </section>;
}
