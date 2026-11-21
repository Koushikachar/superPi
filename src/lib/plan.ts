import { db } from "./db"; import { PLANS } from "./plans";
export { PLANS };
/** For now every business is on the same free plan (100 products, a team of 3: 1 owner + 2 members), whatever plan was set before.
 *  When paid plans return, read `organization.plan` and the subscription here again (see git history / the backup). */
export const CURRENT_PLAN = "FREE";
export async function usage(orgId: string) {
  const [products, members, invites, locations] = await Promise.all([db.product.count({ where: { orgId, archived: false } }),
    db.membership.count({ where: { orgId } }), db.invitation.count({ where: { orgId, usedAt: null, expiresAt: { gt: new Date() } } }), db.warehouse.count({ where: { orgId } })]);
  return { plan: CURRENT_PLAN, ...PLANS[CURRENT_PLAN], productCount: products, memberCount: members + invites, locationCount: locations };
}
export async function checkLimit(orgId: string, kind: "products" | "members" | "locations", adding: number) {
  const u = await usage(orgId);
  if (kind === "products" && u.productCount + adding > u.products) return `Superpi is free for up to ${u.products} products. Archive a product you no longer sell to add another.`;
  if (kind === "members" && u.memberCount + adding > u.members) return `Your team can have ${u.members} people: 1 owner and ${u.members - 1} members (pending invitations count). Remove someone in Settings → Team to invite another.`;
  if (kind === "locations" && u.locationCount + adding > u.locations) return `Superpi is free for up to ${u.locations} warehouse${u.locations === 1 ? "" : "s"}.`;
  return null;
}
