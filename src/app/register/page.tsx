import SubmitButton from "@/components/SubmitButton";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { signUp } from "../actions";
import AuthCard from "@/components/AuthCard"; import GoogleButton from "@/components/GoogleButton";
import Turnstile from "@/components/Turnstile";
import PasswordPair from "@/components/PasswordPair";
import { Err, inp, btn } from "@/components/ui";
export const metadata = pageMeta({ title: "Create your free account", description: "Create a free Superpi account and start tracking stock, orders and GST invoices for your business in minutes.", path: "/register" });
export default async function Register({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  if (await getUser()) redirect("/dashboard"); // already signed in
  return <AuthCard title="Create your account" sub="Free Forever for up to 100 products. No card needed."><Err e={e} />
    <div className="mt-3"><GoogleButton from="register" /></div>
    <p className="-mt-2 mb-3 text-xs text-ink/60">With email, we'll send you a 6-digit code to verify your address.</p>
    <form action={signUp} className="space-y-3">
      <label className="block text-sm">Your name<input name="name" required minLength={2} maxLength={100} placeholder="Asha Rao" className={inp} autoComplete="name" /></label>
      <label className="block text-sm">Work email<input name="email" type="email" required placeholder="you@yourshop.com" className={inp} autoComplete="email" inputMode="email" /></label>
      <PasswordPair />
      <label className="flex items-start gap-2 text-sm"><input name="age" type="checkbox" required className="mt-1" /><span>I confirm I am 18 or older and using Superpi for a business.</span></label>
      <Turnstile /><SubmitButton className={`${btn} w-full`} pendingText="Creating account">Create account</SubmitButton></form>
    <p className="mt-4 text-xs text-ink/70">By creating an account you agree to the <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.</p>
    <p className="mt-3 text-sm text-ink/70">Already registered? <Link href="/login" className="font-semibold text-brand underline">Sign in</Link></p></AuthCard>;
}
