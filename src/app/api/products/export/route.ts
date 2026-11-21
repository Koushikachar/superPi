import { db } from "@/lib/db"; import { ctx } from "@/lib/ctx"; import { csvCell } from "@/lib/csv";
const cell = csvCell; // one shared, spreadsheet-safe cell writer (src/lib/csv.ts)
export async function GET() {
  const c = await ctx();
  const ps = await db.product.findMany({ where: { orgId: c.orgId }, orderBy: { sku: "asc" } });
  const costs = c.role !== "ORDER_STAFF"; // order staff can't export financial reports, so they don't get unit cost here either
  const csv = ["sku,name,hsn,price," + (costs ? "unit_cost," : "") + "reorder_at", ...ps.map(p => [p.sku, p.name, p.hsn, p.price, ...(costs ? [p.unitCost] : []), p.reorderAt].map(cell).join(","))].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=products.csv", "cache-control": "no-store" } });
}
