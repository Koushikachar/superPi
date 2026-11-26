import Link from "next/link";
import SubmitButton from "@/components/SubmitButton"; import TeamRow from "@/components/TeamRow";
import { Err, inp, btn, ghost } from "@/components/ui";
import { db } from "@/lib/db"; import { usage } from "@/lib/plan"; import { ctx } from "@/lib/ctx"; import { inviteStaff, setOrg, changeRole, removeMember, cancelInvite, updateOrgProfile, setLowStockAlerts, setBackorders } from "@/app/actions";
import { STATES } from "@/lib/gst";
const STAFF_ROLES = ["INVENTORY_MANAGER", "ORDER_STAFF", "ACCOUNTANT", "ANALYST"] as const;
const ROLE_LABEL: Record<string, string> = { OWNER: "Owner", INVENTORY_MANAGER: "Inventory manager", ORDER_STAFF: "Order staff", ACCOUNTANT: "Accountant", ANALYST: "Analyst" };
const ROLE_HINT: Record<string, string> = { INVENTORY_MANAGER: "Products, stock, purchases and orders", ORDER_STAFF: "Orders and customers", ACCOUNTANT: "Invoices, bills and payments", ANALYST: "Read-only reports" };
const ICON = { plan: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", team: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8",
  biz: "M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M9 17h6", bell: "M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 0 0 4 0", orgs: "M4 6h16M4 12h16M4 18h10" };
const Meter = ({ label, used, max }: { label: string; used: number; max: number }) => { const pct = Math.min(100, Math.round((used / max) * 100));
  return <div><div className="flex justify-between text-sm"><span>{label}</span><span className="tabular-nums text-ink/70">{used} of {max}</span></div>
    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-lavender dark:bg-white/10" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={used}><div className={`h-full rounded-full transition-[width] duration-700 ${pct >= 90 ? "bg-turmeric" : "bg-brand"}`} style={{ width: `${pct}%` }} /></div></div>; };
const initial = (s: string) => (s.trim()[0] ?? "?").toUpperCase();
/** One titled block of settings, with an icon and a one-line description. `id` is the anchor the section menu jumps to. */
const Section = ({ id, icon, title, desc, aside, children }: { id: string; icon: string; title: string; desc: string; aside?: React.ReactNode; children: React.ReactNode }) =>
  <section id={id} aria-labelledby={`${id}-h`} className="glass scroll-mt-6 p-5 md:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lavender text-brand dark:bg-white/10 dark:text-lavender"><svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg></span>
      <div><h2 id={`${id}-h`} className="font-semibold">{title}</h2><p className="text-sm text-ink/65">{desc}</p></div></div>{aside}</div>
    <div className="mt-5">{children}</div></section>;

export const dynamic = "force-dynamic";
export default async function Settings({ searchParams }: { searchParams: Promise<{ e?: string; ok?: string }> }) {
  const c = await ctx(), { e, ok } = await searchParams, isOwner = c.role === "OWNER";
  const [u, org, staff, pend] = await Promise.all([usage(c.orgId), db.organization.findUnique({ where: { id: c.orgId }, select: { gstin: true, state: true, address: true, lowStockEmails: true, alertEmail: true, backorders: true } }),
    db.membership.findMany({ where: { orgId: c.orgId }, select: { id: true, role: true, userId: true, user: { select: { email: true, name: true } } }, orderBy: { role: "asc" } }),
    db.invitation.findMany({ where: { orgId: c.orgId, usedAt: null, expiresAt: { gt: new Date() } }, select: { id: true, email: true, role: true, expiresAt: true } })]);
  const owners = staff.filter((s) => s.role === "OWNER"), members = staff.filter((s) => s.role !== "OWNER"), seatsLeft = Math.max(0, u.members - u.memberCount), me = c.user.name || c.user.email;
  const menu: [string, string][] = [["plan", "Plan"], ["team", "Team"], ...(isOwner ? [["business", "Business details"], ["alerts", "Alerts & orders"]] as [string, string][] : []), ["orgs", "Organizations"]];
  return <>
    <h1 className="animate-rise text-[28px] font-bold leading-tight tracking-tight md:text-4xl">Settings</h1>
    <div className="mt-4 space-y-3 md:mt-6"><Err e={e} />{ok && <p role="status" className="animate-pop rounded-xl bg-brand/10 px-4 py-2 text-sm text-brand">{ok}</p>}</div>

    {/* Profile header */}
    <div className="relative mt-4 overflow-hidden rounded-2xl bg-navy p-5 text-white animate-rise md:mt-6 md:p-6">
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/60 blur-3xl" />
      <div className="relative flex flex-wrap items-center gap-4">
        <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brandLight to-brand text-xl font-bold shadow-[0_8px_24px_rgba(67,53,207,.5)]">{initial(me)}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-lg font-semibold">{me}</p><p className="truncate text-sm text-white/65">{c.user.email} · {ROLE_LABEL[c.role] ?? c.role} at {c.orgName}</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/security" className="rounded-xl border border-white/20 px-3 py-2 text-sm transition hover:bg-white/10">Two-step sign-in</Link>
          <form action="/auth/signout" method="post"><SubmitButton className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:bg-lavender">Sign out</SubmitButton></form></div></div></div>

    <div className="mt-5 grid gap-5 md:mt-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start">
      <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto [scrollbar-width:none] lg:sticky lg:top-4 lg:flex-col">{menu.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-xl px-3 py-2 text-sm text-ink/70 transition hover:bg-surface/70 hover:text-brand">{l}</a>)}</nav>
      <div className="stagger min-w-0 space-y-5">
        <Section id="plan" icon={ICON.plan} title="Your plan" desc="Free for every seller during launch." aside={<span className="rounded-full bg-lavender px-3 py-1 text-sm font-semibold text-brand dark:bg-white/10 dark:text-lavender">Free Forever</span>}>
          <div className="grid gap-5 sm:grid-cols-3"><Meter label="Products" used={u.productCount} max={u.products} /><Meter label="Team seats" used={u.memberCount} max={u.members} /><Meter label="Warehouses" used={u.locationCount} max={u.locations} /></div>
          {u.productCount >= u.products && <p className="mt-4 text-sm text-ink/70">You've reached {u.products} products. Archive a product you no longer sell to add another.</p>}</Section>

        <Section id="team" icon={ICON.team} title="Team" desc={`1 owner and up to ${u.members - 1} members. Invitations count as seats.`} aside={<span className="rounded-full border border-edge/70 px-3 py-1 text-xs font-semibold"><b className="text-brand">{seatsLeft}</b> seat{seatsLeft === 1 ? "" : "s"} left</span>}>
          <ul className="divide-y divide-edge/60">
            {[...owners, ...members].map((s) => { const self = s.userId === c.user.id, name = s.user.name || s.user.email; const canRemove = isOwner && s.role !== "OWNER";
              return <TeamRow key={s.id} className="flex flex-wrap items-center gap-3 py-3 first:pt-0" action={canRemove ? { id: s.id, run: removeMember, label: "Remove", confirm: `Remove ${name} from ${c.orgName}? They lose access straight away.`, className: `${ghost} text-danger` } : undefined}>
              <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${s.role === "OWNER" ? "bg-brand text-white" : "bg-lavender text-brand dark:bg-white/10 dark:text-lavender"}`}>{initial(name)}</span>
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{name}{self && <span className="ml-2 text-xs font-normal text-ink/60">(you)</span>}</p><p className="truncate text-xs text-ink/70">{s.user.name ? s.user.email : ROLE_HINT[s.role] ?? ""}</p></div>
              {s.role === "OWNER" || !isOwner ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.role === "OWNER" ? "bg-brand/10 text-brand" : "border border-edge/70"}`}>{ROLE_LABEL[s.role]}</span>
                : <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto"><form action={changeRole} className="flex items-center gap-2"><input type="hidden" name="id" value={s.id} /><label className="sr-only" htmlFor={`r-${s.id}`}>Role for {name}</label>
                    <select id={`r-${s.id}`} name="role" defaultValue={s.role} className={`${inp} !w-auto`}>{STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select><SubmitButton className={ghost}>Save</SubmitButton></form></div>}
            </TeamRow>; })}
            {pend.map((i) => <TeamRow key={i.id} className="flex flex-wrap items-center gap-3 py-3" action={isOwner ? { id: i.id, run: cancelInvite, label: "Cancel invite", className: ghost } : undefined}>
              <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-brand/50 text-sm font-bold text-brand">{initial(i.email)}</span>
              <div className="min-w-0 flex-1"><p className="truncate font-medium">{i.email}</p><p className="text-xs text-ink/70">Invited as {ROLE_LABEL[i.role]} · expires {i.expiresAt.toLocaleDateString("en-IN")}</p></div>
              <span className="rounded-full bg-turmeric/20 px-3 py-1 text-xs font-semibold">Pending</span></TeamRow>)}
          </ul>
          {isOwner && (seatsLeft > 0 ? <form action={inviteStaff} className="mt-4 grid gap-3 rounded-2xl border border-dashed border-brand/30 bg-lavender/30 p-4 dark:bg-white/[.03] sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <label className="text-sm">Invite by email<input name="email" type="email" required autoComplete="off" placeholder="name@yourshop.com" className={inp} /></label>
              <label className="text-sm">Role<select name="role" className={inp}>{STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></label>
              <SubmitButton className={btn}>Send invitation</SubmitButton></form>
            : <p className="mt-4 rounded-xl bg-lavender/60 px-4 py-3 text-sm dark:bg-white/5">All {u.members} seats are taken. Remove a member or cancel an invitation to invite someone else.</p>)}
        </Section>

        {isOwner && <Section id="business" icon={ICON.biz} title="Business details" desc="Printed on your invoices, challans and purchase orders.">
          <form action={updateOrgProfile} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">GSTIN<input name="gstin" defaultValue={org?.gstin ?? ""} maxLength={15} placeholder="29ABCDE1234F1Z5" className={inp} /></label>
            <label className="text-sm">State<select name="state" defaultValue={org?.state ?? ""} className={inp}><option value="">Not set</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label className="text-sm sm:col-span-2">Address<input name="address" defaultValue={org?.address ?? ""} className={inp} /></label><div><SubmitButton className={btn}>Save details</SubmitButton></div></form></Section>}

        {isOwner && <Section id="alerts" icon={ICON.bell} title="Alerts & orders" desc="How Superpi tells you about low stock and handles short orders.">
          <div className="grid gap-5 md:grid-cols-2">
            <form action={setLowStockAlerts} className="grid content-start gap-3 rounded-2xl border border-edge/60 bg-surface/40 p-4"><p className="font-medium">Low-stock emails</p>
              <label className="flex items-start gap-2 text-sm"><input type="checkbox" name="lowStockEmails" defaultChecked={org?.lowStockEmails ?? true} className="mt-0.5" />Email owners and inventory managers when a product runs low. In-app alerts always stay on.</label>
              <label className="text-sm">Also send to (optional)<input name="alertEmail" type="email" defaultValue={org?.alertEmail ?? ""} placeholder="purchasing@yourshop.com" className={inp} /></label><div><SubmitButton className={btn}>Save</SubmitButton></div></form>
            <form action={setBackorders} className="grid content-start gap-3 rounded-2xl border border-edge/60 bg-surface/40 p-4 text-sm"><p className="text-base font-medium">Backorders</p>
              <label className="flex items-start gap-2"><input type="checkbox" name="backorders" defaultChecked={org?.backorders ?? false} className="mt-0.5" />Let an order be confirmed when stock is short. It waits, holding no stock, and is filled automatically, oldest first, when goods arrive.</label><div><SubmitButton className={btn}>Save</SubmitButton></div></form>
          </div></Section>}

        <Section id="orgs" icon={ICON.orgs} title="Your organizations" desc="Switch between businesses you belong to.">
          <div className="flex flex-wrap gap-2">{c.orgs.map((o) => o.id === c.orgId ? <span key={o.id} className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-sm text-white"><span aria-hidden className="h-2 w-2 rounded-full bg-emerald-300" />{o.name}</span> :
            <form key={o.id} action={setOrg}><input type="hidden" name="id" value={o.id} /><SubmitButton className={ghost}>{o.name}</SubmitButton></form>)}<Link href="/onboarding" className={`${ghost} inline-flex items-center`}>+ Create another</Link></div></Section>
      </div>
    </div></>;
}
