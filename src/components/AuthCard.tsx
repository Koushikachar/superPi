import Link from "next/link"; import ThemeToggle from "./ThemeToggle"; import Logo, { Mark } from "./Logo";
/** Shared frame for sign-in, sign-up, password reset, verify and two-step pages.
 *  Phones: a top bar (brand left, light/dark switch right) with a gap above the card.
 *  Desktop (md and up): no bar. The brand is in the left panel and the switch floats at the top right. */
export default function AuthCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return <main className="grid min-h-dvh md:grid-cols-[1fr_1.1fr] md:gap-4 md:p-4">
    {/* desktop: floating switch, top right (inline styles so no stylesheet rule can move it) */}
    <div className="hidden md:block" style={{ position: "fixed", top: "max(0.75rem, env(safe-area-inset-top))", right: "max(0.75rem, env(safe-area-inset-right))", left: "auto", zIndex: 30 }}><ThemeToggle className="!h-10 !w-10" /></div>
    <aside className="glass-dark relative hidden overflow-hidden p-12 md:flex md:flex-col md:justify-between">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand/40 blur-3xl" />
      <Link href="/" aria-label="Superpi home" className="relative"><Logo tone="light" height={34} priority /></Link>
      <div className="relative"><div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/10 animate-float"><Mark size={36} tone="light" /></div>
        <p className="max-w-sm text-4xl font-bold leading-tight">Know what&rsquo;s in stock.</p>
        <p className="mt-4 max-w-sm text-white/70">Manage your ecommerce inventory in one place. Keep product and stock records organised as your catalogue grows.</p></div>
      <p className="relative text-sm text-white/60">Free Forever for up to 100 products.</p></aside>
    <section className="flex min-h-dvh flex-col px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))] md:min-h-0 md:p-6">
      {/* phones: top bar */}
      <header className="glass sticky top-3 z-20 mx-auto flex w-full max-w-sm items-center justify-between gap-3 px-4 py-2 md:hidden">
        <Link href="/" aria-label="Superpi home"><Logo height={24} priority /></Link>
        <ThemeToggle className="!h-10 !w-10" />
      </header>
      <div className="mt-6 flex flex-1 items-start justify-center md:mt-0 md:items-center">
        <div className="glass w-full max-w-sm p-8 animate-pop">
          <h1 className="text-[28px] font-bold leading-tight">{title}</h1>{sub && <p className="mt-1 text-sm text-ink/70">{sub}</p>}<div className="mt-6">{children}</div>
          <p className="mt-6 text-xs text-ink/70"><Link href="/privacy" className="underline">Privacy</Link> · <Link href="/terms" className="underline">Terms</Link></p></div></div></section></main>;
}
