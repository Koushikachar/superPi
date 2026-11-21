"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TransitionLink, { ViewTransitionGate } from "./TransitionLink"; import CommandMenu, { openCommandMenu } from "./CommandMenu"; import CreateMenu from "./CreateMenu"; import { leaveLayer } from "./useBackClose"; import Sheet from "./Sheet"; import ThemeToggle from "./ThemeToggle"; import LiveForms from "./LiveForms"; import Logo from "./Logo"; import ChatWidget from "./ChatLazy"; import type { Cmd } from "@/lib/cmdk";

/** Sidebar sections. Items in SOON are on the way: they open a "coming soon" page and carry a glowing chip. */
const SECTIONS: [string, string[]][] = [["", ["Dashboard", "Notifications"]], ["Stock", ["Products", "Inventory", "Warehouses", "Assembly", "Batches & serials", "Counts"]],
  ["Sales", ["Orders", "Invoices", "Customers", "Returns"]], ["Buying", ["Purchases", "Receipts", "Supplier bills", "Suppliers"]], ["Insights", ["Analytics", "Reports"]],
  ["Coming soon", ["Research", "Integrations", "Webhooks", "Automations"]], ["", ["Settings"]]];
const SOON = new Set(["Research", "Integrations", "Webhooks", "Automations"]);
const nav = SECTIONS.flatMap(([, items]) => items);
// Menu label -> route, where they differ. "Supplier bills" = what you owe suppliers.
const ROUTE: Record<string, string> = { Dashboard: "/dashboard", "Supplier bills": "/bills", "Batches & serials": "/traceability" };
const href = (n: string) => ROUTE[n] ?? `/${n.toLowerCase()}`;
const Icon = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
const tabs: [string, string, string][] = [["Home", "Dashboard", "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"], ["Stock", "Inventory", "M12 3 3 7.5v9L12 21l9-4.5v-9L12 3zM3 7.5l9 4.5 9-4.5M12 12v9"],
  ["Orders", "Orders", "M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6"], ["Alerts", "Notifications", "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0"]];
const tabbed = new Set(tabs.map(([, n]) => n));
const quick: [string, string][] = [["New order", "/orders"], ["Add product", "/products"], ["Adjust stock", "/inventory"], ["Count stock", "/counts"], ["Receive goods", "/purchases"]];
const KEYS: Record<string, string> = { Dashboard: "g d", Products: "g p", Inventory: "g i", Orders: "g o", Invoices: "g v", Customers: "g c", Purchases: "g u", Reports: "g r", Notifications: "g n", Settings: "g s" };
const commands: Cmd[] = [...quick.map(([l, h]): Cmd => ({ id: `q:${l}`, label: l, href: h, group: "Create" })), { id: "n:assistant", label: "Business assistant", href: "/assistant", group: "Go to" }, ...nav.filter((n) => !SOON.has(n)).map((n): Cmd => ({ id: `n:${n}`, label: n, href: href(n), group: "Go to", keys: KEYS[n] }))];
const Kbd = ({ k }: { k: string }) => <span className="ml-2 hidden gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:[@media(pointer:fine)]:inline-flex">{k.split(" ").map((x) => <kbd key={x} className="rounded border border-white/25 px-1 font-mono text-[10px] text-white/70">{x}</kbd>)}</span>;
const badge = (n: number, cls = "") => n > 0 ? <span className={`rounded-full bg-turmeric px-1.5 text-xs font-semibold text-navy ${cls}`}>{n}</span> : null;

/** Persistent app frame. It lives in the shared layout, so clicking a link swaps only the page area; the active item updates instantly from the URL. */
export default function AppChrome({ admin, unread, ai, children }: { admin: boolean; unread: number; ai?: { ready: boolean; via: string }; children: React.ReactNode }) {
  const path = usePathname() ?? "";
  const active = path.startsWith("/admin") ? "Admin" : nav.find((n) => path === href(n) || path.startsWith(href(n) + "/")) ?? "";
  const inMore = (active !== "" && !tabbed.has(active)) || active === "Admin", [moreOpen, setMore] = useState(false), [quickOpen, setQuick] = useState(false), closeAll = () => { setMore(false); setQuick(false); }, go = () => { leaveLayer(); closeAll(); }; // go: a link inside a sheet was chosen, so the sheet closes without undoing the navigation
  return (
    <div className="min-h-dvh print:block md:grid md:grid-cols-[256px_minmax(0,1fr)] md:gap-4 md:p-4">
      <header className="mx-4 mt-4 flex items-center justify-between md:hidden print:hidden" style={{ paddingTop: "env(safe-area-inset-top)" }}><TransitionLink href="/dashboard" aria-label="Superpi home"><Logo height={26} priority /></TransitionLink><div className="flex items-center gap-2"><ThemeToggle /><button type="button" onClick={openCommandMenu} aria-label="Search" className="relative grid h-11 w-11 place-items-center rounded-xl border border-edge/70 bg-surface/60 backdrop-blur transition active:scale-95"><Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5" /></button></div></header><ViewTransitionGate /><LiveForms /><CommandMenu commands={commands} />
      <aside style={{ viewTransitionName: "d2h-side" }} className="print:hidden glass-dark hidden p-5 md:sticky md:top-4 md:flex md:h-[calc(100dvh-2rem)] md:flex-col md:overflow-y-auto">
        <Link href="/dashboard" aria-label="Superpi home" className="px-1"><Logo tone="light" height={30} priority /></Link>
        <button type="button" onClick={openCommandMenu} className="mt-5 flex min-h-10 w-full items-center justify-between rounded-xl border border-white/15 bg-white/[.06] px-3 py-2 text-sm text-white/70 transition hover:bg-white/[.12]"><span>Search…</span><span className="flex gap-1"><kbd className="rounded border border-white/25 px-1 font-mono text-[10px]">Ctrl</kbd><kbd className="rounded border border-white/25 px-1 font-mono text-[10px]">K</kbd></span></button>
        <div className="mt-3"><CreateMenu label="Create" items={quick} /></div>
        <nav aria-label="Main" className="mt-3 flex flex-col">
          {SECTIONS.map(([title, items], si) => <div key={si} className="mt-3 flex flex-col gap-0.5 first:mt-1">
            {title && <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/40">{title}</p>}
            {items.map((n) => <TransitionLink key={n} href={href(n)} aria-current={active === n ? "page" : undefined} className={`group relative flex items-center justify-between whitespace-nowrap rounded-xl px-3 py-1.5 text-sm transition ${active === n ? "bg-brand font-semibold text-white shadow-[0_6px_18px_rgba(67,53,207,.45)]" : SOON.has(n) ? "text-white/55 hover:bg-white/[.08]" : "text-white/75 hover:bg-white/[.08] hover:text-white"}`}>
              <span className="flex items-center">{n}{KEYS[n] && <Kbd k={KEYS[n]} />}</span>{n === "Notifications" && badge(unread, "ml-2")}{SOON.has(n) && <span className="soon">Soon</span>}</TransitionLink>)}</div>)}
          {admin && <Link href="/admin" className={`mt-4 whitespace-nowrap rounded-xl border border-lavender/40 px-3 py-2 text-sm text-lavender transition hover:bg-white/[.08] ${active === "Admin" ? "bg-white/10" : ""}`}>Platform admin</Link>}
        </nav>
      </aside>
      <ChatWidget mode="app" ready={!!ai?.ready} via={ai?.via} />
      <main className="relative min-w-0 print:p-0 p-4 pb-40 md:p-2 md:pb-2"><div className="absolute right-2 top-2 z-20 hidden items-center gap-2 md:flex print:hidden"><ThemeToggle /></div>{children}</main>

      <button type="button" aria-label="Quick actions" aria-haspopup="dialog" onClick={() => { setMore(false); setQuick(true); }} className="fixed right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-brandLight to-brand text-3xl leading-none text-white shadow-[0_8px_24px_rgba(67,53,207,.5)] transition active:scale-95 md:hidden print:hidden" style={{ bottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}><span aria-hidden>+</span></button>
      <Sheet open={quickOpen} onClose={() => setQuick(false)} title="Quick actions"><p className="px-3 pb-1 pt-1 text-xs uppercase tracking-wide text-white/60">Quick actions</p>{quick.map(([l, h]) => <TransitionLink key={l} href={h} replace onClick={go} className="flex min-h-12 items-center rounded-xl px-3 text-base hover:bg-white/10">{l}</TransitionLink>)}</Sheet>
      <Sheet open={moreOpen} onClose={() => setMore(false)} title="More">{SECTIONS.map(([title, items], si) => { const left = items.filter((n) => !tabbed.has(n)); return left.length ? <div key={si} className="mb-2">
          {title && <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-white/45">{title}</p>}
          <div className="grid grid-cols-2 gap-1">{left.map((n) => <TransitionLink key={n} href={href(n)} replace onClick={go} className={`flex min-h-12 items-center justify-between gap-2 rounded-xl px-3 text-base ${active === n ? "bg-brand font-semibold" : SOON.has(n) ? "text-white/60 hover:bg-white/10" : "hover:bg-white/10"}`}>{n}{SOON.has(n) && <span className="soon">Soon</span>}</TransitionLink>)}</div></div> : null; })}
        {admin && <Link href="/admin" replace onClick={go} className="mt-1 flex min-h-12 items-center justify-center rounded-xl border border-lavender/40 text-lavender">Platform admin</Link>}</Sheet>
      <nav aria-label="Main" className="glass-dark print:hidden fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 items-stretch px-1.5 pt-1.5 md:hidden" style={{ paddingBottom: "calc(.375rem + env(safe-area-inset-bottom))", viewTransitionName: "d2h-tabbar" }}>
        {tabs.map(([l, n, d]) => <TransitionLink key={l} href={href(n)} aria-current={active === n ? "page" : undefined} className={`relative flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] transition ${active === n ? "bg-brand font-semibold text-white" : "text-white/70"}`}><Icon d={d} />{l}
          {n === "Notifications" && badge(unread, "absolute right-2.5 top-0 !px-1 text-[10px]")}</TransitionLink>)}
        <button type="button" aria-haspopup="dialog" onClick={() => { setQuick(false); setMore(true); }} className={`relative flex min-h-12 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] transition ${inMore ? "bg-brand font-semibold text-white" : "text-white/70"}`}><Icon d="M5 12h.01M12 12h.01M19 12h.01" />More</button>
      </nav>
    </div>
  );
}
