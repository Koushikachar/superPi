export default { darkMode: "class", content: ["./src/**/*.{ts,tsx}"], theme: { extend: {
  // Superpi brand book: Deep Ink #14162F, Indigo #4335CF, Soft Lavender #E8E5FF, Paper #F8F8FD.
  // ink / surface / edge follow the light-or-dark theme (see the variables in globals.css). navy (Deep Ink) never changes: it is the colour of the sidebar, tab bar and other always-dark panels.
  // turmeric is kept as the amber *status* colour (warnings, low stock); it is always paired with a label.
  colors: { ink: "rgb(var(--ink) / <alpha-value>)", surface: "rgb(var(--surface) / <alpha-value>)", edge: "rgb(var(--edge) / <alpha-value>)", navy: "#14162F", mist: "#F8F8FD", paper: "#F8F8FD", lavender: "#E8E5FF", line: "rgba(67,53,207,.16)",
    brand: "#4335CF", brandDark: "#3428A8", brandLight: "#6457E8", turmeric: "#F2A93B", danger: "#C2410C" },
  fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
  keyframes: {
    rise: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
    fade: { from: { opacity: "0" }, to: { opacity: "1" } },
    pop: { "0%": { opacity: "0", transform: "scale(.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
    glow: { "0%,100%": { boxShadow: "0 0 0 0 rgba(100,87,232,.55), 0 0 8px 0 rgba(100,87,232,.35)" }, "50%": { boxShadow: "0 0 0 4px rgba(100,87,232,0), 0 0 16px 2px rgba(164,155,255,.55)" } },
    float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
    shimmer: { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } } },
  animation: { rise: "rise .3s cubic-bezier(.2,.8,.2,1) both", fade: "fade .25s ease-out both", pop: "pop .22s cubic-bezier(.2,.8,.2,1) both", glow: "glow 2.4s ease-in-out infinite", float: "float 5s ease-in-out infinite", shimmer: "shimmer 2.2s linear infinite" } } } };
