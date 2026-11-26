"use client";
import { useEffect } from "react";
import { btn, ghost } from "@/components/ui";
// After a new deploy, a tab opened earlier asks for script files that no longer exist. That is not a real error: a fresh load fixes it.
const STALE = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed|server action|Failed to find Server Action/i;
const KEY = "superpi-reloaded";
export default function ErrorPage({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  const stale = STALE.test(`${error?.name} ${error?.message}`);
  // Reload once automatically for a stale deploy. The marker lives in the URL (no browser storage), so a page that really is broken can't loop.
  useEffect(() => { if (!stale) return; const u = new URL(location.href); if (u.searchParams.has(KEY)) return; u.searchParams.set(KEY, "1"); location.replace(u.toString()); }, [stale]);
  return <main className="grid min-h-dvh place-items-center p-6"><div className="glass max-w-md p-8 text-center animate-pop">
    <h1 className="text-xl font-bold">{stale ? "Superpi was just updated" : "Something went wrong"}</h1>
    <p className="mt-2 text-sm text-ink/70">{stale ? "Loading the newest version…" : "This page couldn't load. Reloading usually fixes it. If it keeps happening, please contact us."}</p>
    {error.digest && <p className="mt-3 text-xs text-ink/70">Reference: {error.digest}</p>}
    <div className="mt-5 flex justify-center gap-2"><button onClick={() => location.reload()} className={btn}>Reload page</button><a href="/dashboard" className={`${ghost} inline-flex items-center`}>Go to dashboard</a></div></div></main>;
}
