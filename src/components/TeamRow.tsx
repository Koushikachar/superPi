"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toaster";
type Run = (id: string) => Promise<{ ok: boolean; message: string }>;
/** A team row (member or pending invite) with an optimistic Remove / Cancel button: the row fades at once, the save runs in the
 *  background, then a toast confirms and the row is gone for good (this component remembers it, so a slow or stale refresh can't
 *  bring it back). If the save fails, the row comes back and the reason is shown. Rows without an action just render. */
export default function TeamRow({ children, className = "", action }: { children: React.ReactNode; className?: string; action?: { id: string; run: Run; label: string; confirm?: string; className?: string } }) {
  const router = useRouter(), toast = useToast(), [state, setState] = useState<"idle" | "busy" | "gone">("idle");
  if (state === "gone") return null;
  const click = async () => {
    if (!action || state === "busy" || (action.confirm && !window.confirm(action.confirm))) return;
    setState("busy");
    try {
      const r = await action.run(action.id);
      if (r.ok) { setState("gone"); toast(r.message); router.refresh(); } else { setState("idle"); toast(r.message, { tone: "err" }); }
    } catch { setState("idle"); toast("That didn't go through. Check your connection and try again.", { tone: "err" }); }
  };
  return <li className={`${className} transition-opacity duration-300 ${state === "busy" ? "pointer-events-none opacity-40" : ""}`} aria-busy={state === "busy" || undefined}>
    {children}
    {action && <button type="button" onClick={click} disabled={state === "busy"} className={action.className}>
      {state === "busy" ? <span className="inline-flex items-center gap-2"><span aria-hidden className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin" />Working…</span> : action.label}</button>}
  </li>;
}
