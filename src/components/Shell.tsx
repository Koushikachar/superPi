import Link from "next/link";
/** Page body helper. The sidebar/tab bar live in the shared (app) layout (AppChrome), so navigating only swaps this part. */
export function Shell({ title, children }: { title: string; active?: string; admin?: boolean; children: React.ReactNode }) {
  return <><h1 className="animate-rise text-[28px] font-bold leading-tight tracking-tight md:text-4xl">{title}</h1><div className="stagger mt-4 space-y-5 md:mt-6 md:space-y-6">{children}</div></>;
}
/** A number card. `icon` is an SVG path; `href` makes the whole card a link. */
export function Stat({ label, value, hint, tone = "brand", icon, href }: { label: string; value: string | number; hint?: string; tone?: "brand" | "warn"; icon?: string; href?: string }) {
  const body = <>
    <div className="flex items-start justify-between gap-3"><span className="text-sm text-ink/70">{label}</span>
      {icon ? <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone === "warn" ? "bg-turmeric/20 text-[#B4690E] dark:text-turmeric" : "bg-lavender text-brand dark:bg-white/10 dark:text-lavender"}`}><svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg></span>
        : <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${tone === "warn" ? "bg-turmeric" : "bg-brand"}`} />}</div>
    <div className="mt-2 break-words text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">{value}</div>
    {hint && <div className="mt-1 text-xs text-ink/70">{hint}</div>}</>;
  return href ? <Link href={href} className="glass lift block p-4 md:p-5">{body}</Link> : <div className="glass lift p-4 md:p-5">{body}</div>;
}
