import Image from "next/image";
/** Superpi primary horizontal lockup. `tone="light"` is the version for dark surfaces (white wordmark, lavender mark).
 *  The PNGs are 550x128; width follows from the height so the layout never jumps while they load. */
export default function Logo({ tone = "auto", height = 28, className = "", priority = false }: { tone?: "dark" | "light" | "auto"; height?: number; className?: string; priority?: boolean }) {
  const w = Math.round((height * 550) / 128), common = { width: w, height, alt: "", priority, draggable: false } as const;
  return <span className={`inline-flex shrink-0 items-center ${className}`} style={{ height }}><span className="sr-only">Superpi</span>
    {tone !== "light" && <Image src="/brand/superpi-logo.png" {...common} className={`h-full w-auto ${tone === "auto" ? "dark:hidden" : ""}`} />}
    {tone !== "dark" && <Image src="/brand/superpi-logo-light.png" {...common} className={`h-full w-auto ${tone === "auto" ? "hidden dark:block" : ""}`} />}</span>;
}
/** The π shelf mark alone, for compact placements. `tone="light"` (lavender) is for dark surfaces; "auto" switches with the theme. */
export function Mark({ size = 28, className = "", tone = "dark" }: { size?: number; className?: string; tone?: "dark" | "light" | "auto" }) {
  const p = { width: Math.round(size * 130 / 128), height: size, alt: "Superpi", draggable: false } as const;
  if (tone === "auto") return <><Image src="/brand/superpi-mark.png" {...p} className={`dark:hidden ${className}`} /><Image src="/brand/superpi-mark-light.png" {...p} alt="" className={`hidden dark:block ${className}`} /></>;
  return <Image src={tone === "light" ? "/brand/superpi-mark-light.png" : "/brand/superpi-mark.png"} {...p} className={className} />;
}
