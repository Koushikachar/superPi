import Link from "next/link";
// Fields need a border that shows on a white card: --edge is white in light mode, so use ink at low opacity instead.
export const inp = "min-h-11 w-full rounded-xl border border-ink/15 bg-white/80 px-3 py-2 text-base shadow-[inset_0_1px_2px_rgba(20,22,47,.06)] transition placeholder:text-ink/40 hover:border-ink/25 focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/15 dark:bg-white/[.06] dark:focus:bg-white/[.09] md:min-h-10 md:text-sm";
export const btn = "ghost-hit min-h-11 rounded-xl bg-gradient-to-b from-brandLight to-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(67,53,207,.4),inset_0_1px_0_rgba(255,255,255,.35)] transition hover:brightness-110 active:scale-[.98] disabled:opacity-50 md:min-h-0";
export const ghost = "ghost-hit min-h-10 rounded-xl border border-ink/15 bg-white/60 px-3 py-1 text-sm transition hover:border-ink/25 hover:bg-white dark:bg-white/[.06] dark:hover:bg-white/10 md:min-h-0";
export const Err = ({ e }: { e?: string }) => e ? <p role="alert" className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger backdrop-blur">{e}</p> : null;
export const Panel = ({ title, children }: { title: string; children: React.ReactNode }) =>
  <section className="glass p-5"><h2 className="mb-3 font-semibold">{title}</h2>{children}</section>;
/** Desktop: a normal table. Phones: each row becomes a card (first cell is the title, other cells are labelled values; forms and links span the full width). */
export function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (!rows.length) return <div className="glass p-6 text-center text-sm text-ink/70">{empty}</div>;
  return <>
    <div className="glass hidden overflow-hidden md:block"><div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className="bg-surface/40 text-left"><tr>{head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-medium text-ink/70">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-edge/60 transition hover:bg-surface/40">{r.map((c, j) => <td key={j} className="px-4 py-3">{c}</td>)}</tr>)}</tbody></table></div></div>
    <ul className="space-y-2.5 md:hidden">{rows.map((r, i) => <li key={i} className="glass p-4">
      <div className="font-semibold">{r[0]}</div>
      <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">{r.slice(1).map((c, j) => <div key={j} className={typeof c === "object" && c !== null ? "col-span-2" : "min-w-0"}>
        <dt className="text-xs text-ink/70">{head[j + 1]}</dt><dd className="break-words">{c}</dd></div>)}</dl></li>)}</ul></>;
}
export function Pager({ page, hasNext, params }: { page: number; hasNext: boolean; params?: Record<string, string | undefined> }) {
  const href = (p: number) => { const q = new URLSearchParams(); Object.entries(params ?? {}).forEach(([k, v]) => v && q.set(k, v)); q.set("page", String(p)); return `?${q}`; };
  if (page === 1 && !hasNext) return null;
  return <nav aria-label="Pagination" className="flex items-center justify-between text-sm">{page > 1 ? <Link href={href(page - 1)} className={ghost}>← Previous</Link> : <span />}
    <span className="text-ink/70">Page {page}</span>{hasNext ? <Link href={href(page + 1)} className={ghost}>Next →</Link> : <span />}</nav>;
}
