"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "./Toaster";
/** Actions report back with ?ok=… or ?e=… in the address. This shows that message as a toast and then removes it from the
 *  address through the router. Why: while a page's address still carried ?ok=…, the NEXT save on that page (e.g. Cancel invite
 *  right after Send invitation) took ~25 s and its result never appeared. From a clean address the same save works. Mount once. */
export default function FlashMessages() {
  const router = useRouter(), path = usePathname(), params = useSearchParams(), toast = useToast(), shown = useRef("");
  useEffect(() => {
    const ok = params.get("ok"), e = params.get("e"); if (!ok && !e) return;
    const key = `${path}|${ok}|${e}`; if (shown.current === key) return; shown.current = key;
    if (e) toast(e, { tone: "err", ms: 7000 }); else if (ok) toast(ok, { ms: 5000 });
    const rest = new URLSearchParams(params); rest.delete("ok"); rest.delete("e");
    router.replace(`${path}${rest.size ? `?${rest}` : ""}`, { scroll: false });
  }, [params, path, router, toast]);
  return null;
}
