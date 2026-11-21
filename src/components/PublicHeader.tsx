import Link from "next/link";
import ThemeToggle from "./ThemeToggle"; import Logo from "./Logo";
/** The top bar of every public page. Built to fit a 320px phone: nothing wraps or runs off the edge, the secondary links appear from 640px up, and the buttons keep a 40px+ touch size. */
export default function PublicHeader({ current }: { current?: "pricing" | "contact" }) {
  const link = "rounded-lg px-2 py-2 transition-colors hover:text-brand";
  return <header className="glass sticky top-3 z-10 mx-3 mt-3 flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-4 md:mx-auto md:px-6 md:py-3">
    <Link href="/" aria-label="Superpi home" className="shrink-0"><Logo height={24} priority className="min-[380px]:!h-[26px] md:!h-[30px]" /></Link>
    <nav aria-label="Site" className="flex min-w-0 items-center gap-0.5 whitespace-nowrap text-sm min-[380px]:gap-1 md:gap-3">
      <Link href="/#how" className={`${link} hidden md:block`}>How it works</Link>
      {current !== "pricing" && <Link href="/pricing" className={`${link} hidden min-[420px]:block`}>Pricing</Link>}
      {current !== "contact" && <Link href="/contact" className={`${link} hidden sm:block`}>Contact</Link>}
      <Link href="/login" className={link}>Sign in</Link>
      <Link href="/register" className="rounded-xl bg-brand px-3 py-2 font-semibold text-white shadow-[0_4px_14px_rgba(67,53,207,.35)] transition hover:bg-brandDark active:scale-[.98] md:px-4"><span className="sm:hidden">Sign up</span><span className="hidden sm:inline">Get started</span></Link>
      <ThemeToggle className="!h-10 !w-10" />
    </nav></header>;
}
