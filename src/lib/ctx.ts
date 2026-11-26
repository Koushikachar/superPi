import { cache } from "react";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getUser, isAdminEmail } from "./auth"; import { canOpen } from "./access";
/** Active org = the "org" cookie if the user is a member, else their first active non-operator membership. Suspended orgs lock out everyone except platform operators.
 *  Every app page calls this, so it is also where a role's section access is enforced on the server (see lib/access.ts). */
export const ctx = cache(async () => {
  const user = await getUser();
  if (!user) redirect("/login");
  const ms = user.memberships; // loaded with the user: no extra query
  if (!ms.length) redirect("/onboarding");
  const pick = (await cookies()).get("org")?.value, live = ms.filter((x) => !x.org.suspended);
  const m = ms.find((x) => x.orgId === pick) ?? live.find((x) => x.role !== "PLATFORM_OPERATOR") ?? live[0] ?? ms[0];
  const op = ms.some((x) => x.role === "PLATFORM_OPERATOR") || isAdminEmail(user.email);
  if (m.org.suspended && !op) redirect("/suspended");
  const path = (await headers()).get("x-d2h-path") ?? ""; // set by middleware, never by the client
  if (path && !canOpen(m.role, path, op)) redirect(`/dashboard?e=${encodeURIComponent("Your role doesn't include that section. Ask the owner if you need it.")}`);
  return { user, orgId: m.orgId, orgName: m.org.name, role: m.role, op, orgs: ms.map((x) => ({ id: x.orgId, name: x.org.name })) };
});
