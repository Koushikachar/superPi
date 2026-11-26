/** Which app sections each team role may open. ONE table used by the menu (what people see) and by ctx() on the server (what they
 *  can open by typing the address). Saving and deleting are still checked separately inside every server action (guard()).
 *  Matches the role descriptions in Settings → Team. The owner and platform operators can open everything. */
const SHARED = ["/dashboard", "/notifications", "/settings", "/security", "/assistant"]; // everyone: their home, alerts, own account, the assistant
export const ROLE_SECTIONS: Record<string, string[]> = {
  INVENTORY_MANAGER: ["/products", "/inventory", "/warehouses", "/assembly", "/kits", "/traceability", "/counts", "/orders", "/returns", "/purchases", "/receipts", "/suppliers", "/analytics", "/reports"],
  ORDER_STAFF: ["/orders", "/customers", "/returns", "/products", "/inventory"],
  ACCOUNTANT: ["/invoices", "/credit-notes", "/customers", "/bills", "/suppliers", "/purchases", "/receipts", "/reports", "/analytics"],
  ANALYST: ["/analytics", "/reports", "/inventory", "/products"],
};
/** Can someone with this role open this path? `op` = platform operator. Unknown roles get only the shared pages (deny by default). */
export function canOpen(role: string, path: string, op = false): boolean {
  if (op || role === "OWNER" || role === "PLATFORM_OPERATOR" || !path.startsWith("/") || path.startsWith("/api/")) return true;
  const top = "/" + (path.split(/[?#]/)[0].split("/")[1] ?? "");
  return SHARED.includes(top) || (ROLE_SECTIONS[role] ?? []).includes(top);
}
/** Money on the dashboard (sales, stock value): the same split the Business Assistant uses. */
export const seesSales = (role: string) => ["OWNER", "ACCOUNTANT", "ANALYST", "PLATFORM_OPERATOR"].includes(role);
export const seesCosts = (role: string) => role !== "ORDER_STAFF";
