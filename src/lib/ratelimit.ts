/** Per-instance fallback counters (used only when Upstash is not configured). Each entry remembers its own window so expired ones can be purged first. */
const hits = new Map<string, { t: number[]; ms: number; max: number }>();
/** True if this call is within the limit. Uses Upstash Redis when configured (shared across servers), otherwise per-instance memory. */
export async function allow(key: string, max: number, ms: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL, tok = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && tok) { try { const r: any = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${tok}` }, body: JSON.stringify([["INCR", `rl:${key}`], ["PEXPIRE", `rl:${key}`, ms, "NX"]]) }).then((x) => x.json()); const n = Number(r?.[0]?.result); if (!Number.isNaN(n)) return n <= max; } catch { /* fall back */ } }
  const now = Date.now(), arr = (hits.get(key)?.t ?? []).filter((t) => now - t < ms); if (arr.length >= max) return false;
  arr.push(now); hits.delete(key); hits.set(key, { t: arr, ms, max }); // re-insert: Map order = least recently used first
  if (hits.size > 5000) { // 1) drop entries whose window has passed; 2) then entries that are not blocking anyone, least recently used first; 3) only as a last resort the oldest of the rest. Never clear everything: that would let a visitor reset their own limit with 5000 junk keys.
    for (const [k, v] of hits) if (now - v.t[v.t.length - 1] >= v.ms) hits.delete(k);
    if (hits.size > 4000) for (const [k, v] of hits) { if (v.t.length >= v.max) continue; hits.delete(k); if (hits.size <= 4000) break; } // keys that are at their limit (someone is currently being blocked) are kept, so junk keys cannot flush an attacker's counter
    if (hits.size > 4000) for (const k of hits.keys()) { hits.delete(k); if (hits.size <= 4000) break; } // last resort: oldest first
  } // This fallback is still per server instance and can be outrun by a flood of live keys: set UPSTASH_REDIS_REST_URL / _TOKEN in production so limits are shared and not held in memory.
  return true;
}
/** The caller's address for rate limits. TRUSTED_IP_HEADER (e.g. "cf-connecting-ip" behind Cloudflare, "x-real-ip" behind your own proxy) wins when set; on Vercel the platform's own header is used; otherwise the first X-Forwarded-For entry.
 *  Only set TRUSTED_IP_HEADER to a header your proxy always overwrites: a header a visitor can send themselves lets them dodge every per-IP limit. */
export function clientIp(h: Pick<Headers, "get">): string {
  const pick = (n?: string) => (n ? h.get(n)?.split(",")[0].trim() || "" : "");
  return pick(process.env.TRUSTED_IP_HEADER?.toLowerCase()) || pick("x-vercel-forwarded-for") || pick("x-forwarded-for") || pick("x-real-ip") || "unknown";
}
/** AI spend guard, one place for every AI endpoint: a short burst limit and a daily cap per business, so one account (or one stolen API key) cannot drain the AI quota. Raise or lower the daily cap with AI_DAILY_LIMIT. */
export async function aiAllowed(orgId: string): Promise<boolean> {
  const day = Number(process.env.AI_DAILY_LIMIT) > 0 ? Math.floor(Number(process.env.AI_DAILY_LIMIT)) : 300;
  return (await allow(`ai:${orgId}`, 20, 60_000)) && (await allow(`aid:${orgId}`, day, 86_400_000));
}
