import { Shell } from "@/components/Shell"; import AssistantChat from "@/components/AssistantChat";
import { ctx } from "@/lib/ctx"; import { aiReady } from "@/lib/ai";
export const dynamic = "force-dynamic";
export default async function Assistant() { const c = await ctx(); return <Shell title="Business assistant" active="Assistant" admin={c.op}><AssistantChat ready={aiReady()} /></Shell>; }
