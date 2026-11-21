"use client";
import { useOptimistic, useTransition } from "react";
/** An on/off switch that flips the instant you tap it, while the server catches up. If the server refuses, it flips back by itself. */
export default function OptimisticToggle({ id, active, action, label }: { id: string; active: boolean; action: (fd: FormData) => Promise<void>; label: string }) {
  const [on, setOn] = useOptimistic(active), [pending, start] = useTransition();
  return <button type="button" role="switch" aria-checked={on} aria-label={label} disabled={pending} onClick={() => start(async () => { setOn(!on); const fd = new FormData(); fd.set("id", id); await action(fd); })}
    className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-edge/70 transition-colors before:absolute before:-inset-2 before:content-[''] disabled:opacity-70" style={{ background: on ? "#4335CF" : "rgba(20,22,47,.25)" }}>
    <span aria-hidden className="absolute left-0.5 rounded-full bg-white shadow transition-transform" style={{ width: 22, height: 22, transform: `translateX(${on ? 22 : 0}px)` }} /></button>;
}
