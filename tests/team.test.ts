// Team changes answer with a result (no redirect), so Settings can update the row at once and show a toast.
import { describe, it, expect, vi, beforeEach } from "vitest";
const me = { user: { id: "u-owner" }, orgId: "org-1", orgName: "Shop", role: "OWNER", op: false, orgs: [] } as any;
const state = { c: me, invites: [] as { id: string; orgId: string; usedAt: Date | null }[], members: [] as { id: string; orgId: string; userId: string }[], audit: [] as string[] };
vi.mock("@/lib/ctx", () => ({ ctx: async () => state.c }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("@/lib/db", () => ({ db: {
  invitation: { deleteMany: async ({ where }: any) => { const before = state.invites.length; state.invites = state.invites.filter((i) => !(i.id === where.id && i.orgId === where.orgId && i.usedAt === null)); return { count: before - state.invites.length }; } },
  membership: { findFirst: async ({ where }: any) => state.members.find((m) => m.id === where.id && m.orgId === where.orgId) ?? null, delete: async ({ where }: any) => { state.members = state.members.filter((m) => m.id !== where.id); } },
  auditLog: { create: async ({ data }: any) => { state.audit.push(data.action); } },
  $transaction: async (ops: Promise<unknown>[]) => Promise.all(ops),
} }));
beforeEach(() => { state.c = me; state.audit = []; state.invites = [{ id: "inv-1", orgId: "org-1", usedAt: null }, { id: "inv-other", orgId: "org-2", usedAt: null }]; state.members = [{ id: "m-owner", orgId: "org-1", userId: "u-owner" }, { id: "m-staff", orgId: "org-1", userId: "u-staff" }, { id: "m-elsewhere", orgId: "org-2", userId: "u-x" }]; });

describe("cancel invite", () => {
  it("removes the pending invite and says so", async () => {
    const { cancelInvite } = await import("../src/app/actions");
    const r = await cancelInvite("inv-1"); expect(r).toEqual({ ok: true, message: expect.stringContaining("Invitation cancelled") });
    expect(state.invites.map((i) => i.id)).toEqual(["inv-other"]); expect(state.audit).toEqual(["staff.invite_cancelled"]);
  });
  it("can't touch another business's invite, and a second cancel is a clear no-op", async () => {
    const { cancelInvite } = await import("../src/app/actions");
    expect((await cancelInvite("inv-other")).ok).toBe(false); expect(state.invites).toHaveLength(2);
    await cancelInvite("inv-1"); const again = await cancelInvite("inv-1"); expect(again.ok).toBe(false); expect(again.message).toMatch(/already used or cancelled/);
  });
  it("only the owner may cancel", async () => {
    const { cancelInvite } = await import("../src/app/actions"); state.c = { ...me, role: "ORDER_STAFF" };
    expect(await cancelInvite("inv-1")).toEqual({ ok: false, message: "Only the owner can manage the team." }); expect(state.invites).toHaveLength(2);
  });
});
describe("remove member", () => {
  it("removes a team member and frees the seat", async () => {
    const { removeMember } = await import("../src/app/actions");
    expect((await removeMember("m-staff")).ok).toBe(true); expect(state.members.map((m) => m.id)).toEqual(["m-owner", "m-elsewhere"]); expect(state.audit).toEqual(["staff.removed"]);
  });
  it("refuses to remove the owner themself, someone from another business, or when not the owner", async () => {
    const { removeMember } = await import("../src/app/actions");
    expect((await removeMember("m-owner")).message).toMatch(/can't remove yourself/);
    expect((await removeMember("m-elsewhere")).ok).toBe(false);
    state.c = { ...me, role: "ACCOUNTANT" }; expect((await removeMember("m-staff")).ok).toBe(false);
    expect(state.members).toHaveLength(3);
  });
});
