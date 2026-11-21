// CI gate: fails on any High/Critical advisory in production dependencies, except advisories listed in .audit-allow.json.
// Each allowance needs a reason and an expiry date; once it expires the gate fails again, so nothing is ignored forever.
// Usage: node scripts/audit-gate.mjs
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const raw = (() => { try { return execFileSync("npm", ["audit", "--omit=dev", "--json"], { encoding: "utf8", maxBuffer: 64e6 }); } catch (e) { return e.stdout ?? ""; } })();
let report; try { report = JSON.parse(raw); } catch { console.error("Could not read `npm audit` output (registry unreachable?). Failing closed."); process.exit(2); }

const allow = existsSync(".audit-allow.json") ? JSON.parse(readFileSync(".audit-allow.json", "utf8")) : [];
const today = new Date().toISOString().slice(0, 10), granted = new Map();
for (const a of allow) {
  if (!a.id || !a.reason || !a.expires) { console.error(`.audit-allow.json: every entry needs id, reason and expires (${JSON.stringify(a)})`); process.exit(2); }
  if (a.expires < today) console.error(`Allowance for ${a.id} expired on ${a.expires}. Re-check it.`); else granted.set(a.id, a);
}

const seen = new Map(); // advisory id -> { title, severity, package }
for (const [name, v] of Object.entries(report.vulnerabilities ?? {})) for (const via of v.via ?? []) if (typeof via === "object" && via.url) seen.set(via.url.split("/").pop(), { title: via.title, severity: via.severity, name: via.name ?? name });

const bad = [], waived = [];
for (const [id, a] of seen) { if (!["high", "critical"].includes(a.severity)) continue; (granted.has(id) ? waived : bad).push({ id, ...a }); }
for (const w of waived) console.log(`allowed until ${granted.get(w.id).expires}: ${w.id} ${w.name}: ${w.title}\n   reason: ${granted.get(w.id).reason}`);
if (bad.length) { console.error(`\n${bad.length} high/critical advisory(ies) in production dependencies:`); for (const b of bad) console.error(` - ${b.id} [${b.severity}] ${b.name}: ${b.title}`); process.exit(1); }
console.log(`audit gate passed (${seen.size} advisories seen, ${waived.length} allowed, 0 blocking)`);
