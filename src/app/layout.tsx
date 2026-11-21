import "./globals.css";
import ThemeScript from "@/components/ThemeScript"; import ConsentProvider from "@/components/ConsentProvider";
import CookieNotice from "@/components/CookieNotice"; import { ToastProvider } from "@/components/Toaster"; import Analytics from "@/components/Analytics";
import { sans } from "@/lib/fonts";
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#14162F" };
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Superpi: inventory management for ecommerce sellers", template: "%s · Superpi" },
  description: "Superpi is an inventory management tool for ecommerce sellers. Track stock, orders, purchases and returns with a full audit trail.",
  openGraph: { title: "Superpi: know what's in stock", description: "Manage your ecommerce inventory in one place with Superpi.", type: "website", siteName: "Superpi" },
  twitter: { card: "summary_large_image" },
  // Google Search Console: paste the token from "HTML tag" verification into NEXT_PUBLIC_GSC_VERIFICATION.
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } } : {}),
};
/** No request data is read here (no cookies, no headers), so public pages can be built once and served from the CDN. The saved theme is applied by a tiny script in <head> before the first paint, and the cookie banner reads its cookie after load. */
export default function Root({ children }: { children: React.ReactNode }) {
  return <html lang="en-IN" suppressHydrationWarning><head><ThemeScript /></head><body className={`${sans.variable} font-sans`}><ConsentProvider><ToastProvider>{children}</ToastProvider><CookieNotice /><Analytics /></ConsentProvider></body></html>;
}
