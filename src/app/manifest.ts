import type { MetadataRoute } from "next";
/** Lets people install Superpi on a phone or desktop from the browser menu ("Add to Home screen"). */
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Superpi", short_name: "Superpi", description: "Inventory management for ecommerce sellers", start_url: "/dashboard", display: "standalone", background_color: "#F8F8FD", theme_color: "#14162F",
    icons: [{ src: "/brand/pwa-192.png", sizes: "192x192", type: "image/png" }, { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png" }, { src: "/brand/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }] };
}
