import { ImageResponse } from "next/og"; import { MARK_WHITE } from "./brand-mark";
/** 1200x630 social card in the brand colours (Deep Ink to Indigo). Each page's opengraph-image.tsx calls this with its own headline, so shared links show the right title. */
export function ogCard(headline: string, sub: string) {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#14162F 0%,#14162F 45%,#4335CF 100%)", color: "#fff" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 52, fontWeight: 800, letterSpacing: -1 }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={MARK_WHITE} height={64} alt="" />superpi</div>
    <div style={{ fontSize: headline.length > 28 ? 72 : 84, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>{headline}</div>
    <div style={{ fontSize: 32, color: "#E8E5FF" }}>{sub}</div></div>, { width: 1200, height: 630 });
}
