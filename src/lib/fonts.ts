import localFont from "next/font/local";

/** Noto Sans (brand book: Bold for headlines, Regular for body and UI). Self-hosted, so no visitor data goes to a font CDN. */
export const sans = localFont({
    src: "../fonts/noto-sans-latin-wght-normal.woff2",
    weight: "100 900",
    display: "swap",
    variable: "--font-sans",
    fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
});

