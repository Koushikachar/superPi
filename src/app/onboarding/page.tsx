import Link from "next/link"; import { redirect } from "next/navigation";
import SubmitButton from "@/components/SubmitButton"; import AuthCard from "@/components/AuthCard";
import { createOrg } from "../actions"; import { getUser } from "@/lib/auth";
import { Err, inp, btn } from "@/components/ui";
export const metadata = { title: "Set up your business", description: "Create your organization in Superpi.", robots: { index: false, follow: false } };
/** First stop after a new sign-up (email or Google): a welcome, then the business is created with a Main warehouse and the person as its owner. */
export default async function Onboarding({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams, u = await getUser(); if (!u) redirect("/login");
  const first = (u.name ?? "").trim().split(/\s+/)[0], returning = u.memberships.length > 0;
  return <AuthCard title={returning ? "Create another organization" : `Welcome to Superpi${first ? `, ${first}` : ""}!`} sub={returning ? "Each organization has its own products, stock and team." : "Your account is ready. Let's create your organization to start tracking stock."}>
    {!returning && <ol className="mb-5 grid gap-2 text-sm">{[["1", "Name your business", true], ["2", "Add your first product", false], ["3", "Invite up to 2 teammates", false]].map(([n, t, now]) =>
      <li key={n as string} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${now ? "bg-lavender text-brand dark:bg-white/10 dark:text-lavender" : "text-ink/60"}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${now ? "bg-brand text-white" : "border border-ink/20"}`}>{n}</span>{t}</li>)}</ol>}
    <Err e={e} />
    <form action={createOrg} className="mt-3 space-y-3">
      <label className="block text-sm">Business name<input name="name" required minLength={2} maxLength={80} autoComplete="organization" placeholder="e.g. Sharma Textiles" className={inp} autoFocus /></label>
      <label className="flex items-start gap-2 text-sm"><input name="age" type="checkbox" required className="mt-1" /><span>I am 18 or older and using Superpi for a business.</span></label>
      <SubmitButton className={`${btn} w-full`} pendingText="Creating your organization">Create organization</SubmitButton></form>
    <p className="mt-4 text-xs text-ink/60">We'll also set up a Main warehouse. Free Forever for up to 100 products.</p>
    {returning && <p className="mt-3 text-sm"><Link href="/dashboard" className="text-brand underline">← Back to dashboard</Link></p>}
  </AuthCard>;
}
