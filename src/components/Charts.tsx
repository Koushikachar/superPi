"use client";
import { memo } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
// Brand palette (Indigo family). Status bars always sit above their text label, so colour is never the only cue.
const grid = "rgba(67,53,207,.12)", axis = { fontSize: 11, fill: "currentColor", opacity: 0.65 };
const tip = { contentStyle: { borderRadius: 12, border: "1px solid rgba(67,53,207,.2)", background: "rgb(var(--panel))", color: "rgb(var(--ink))", fontSize: 12 }, cursor: { fill: "rgba(67,53,207,.06)" } };
const STATUS: Record<string, string> = { draft: "#C9C2FF", confirmed: "#8B80F0", backordered: "#F2A93B", packed: "#6457E8", dispatched: "#4335CF", delivered: "#2D2391", cancelled: "#C2410C", returned: "#94A3B8" };
const inr = (v: unknown) => `₹${Number(v).toLocaleString("en-IN")}`;
export const SalesChart = memo(function SalesChart({ data }: { data: { d: string; v: number }[] }) {
  return <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
    <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6457E8" stopOpacity={0.35} /><stop offset="100%" stopColor="#6457E8" stopOpacity={0.02} /></linearGradient></defs>
    <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} /><XAxis dataKey="d" tick={axis} tickLine={false} axisLine={false} minTickGap={24} /><YAxis tick={axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
    <Tooltip {...tip} formatter={(v) => [inr(v), "Sales"]} /><Area type="monotone" dataKey="v" stroke="#4335CF" strokeWidth={2.5} fill="url(#salesFill)" animationDuration={700} /></AreaChart></ResponsiveContainer></div>;
});
export const StatusChart = memo(function StatusChart({ data }: { data: { s: string; n: number }[] }) {
  return <div className="h-56 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
    <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} /><XAxis dataKey="s" tick={axis} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} width={32} />
    <Tooltip {...tip} formatter={(v) => [v as number, "Orders"]} /><Bar dataKey="n" radius={[8, 8, 0, 0]} maxBarSize={72} animationDuration={600}>{data.map((d) => <Cell key={d.s} fill={STATUS[d.s] ?? "#6457E8"} />)}</Bar></BarChart></ResponsiveContainer></div>;
});
