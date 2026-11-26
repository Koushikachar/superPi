import AppChrome from "@/components/AppChrome";
import { ctx } from "@/lib/ctx"; import { unreadCount } from "@/lib/notify"; import { aiReady } from "@/lib/ai";
export const metadata = { robots: { index: false, follow: false } }; // signed-in pages are never listed in search
/** Runs once per visit, not on every click: the sidebar, admin link and unread badge persist while only the page area changes. Each page still authorizes itself.
 *  ctx() signs people in, picks the active business and its role (the menus show only that role's sections). */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const c = await ctx(), unread = await unreadCount();
  return <AppChrome admin={c.op} role={c.role} unread={unread} ai={{ ready: aiReady() }}>{children}</AppChrome>;
}