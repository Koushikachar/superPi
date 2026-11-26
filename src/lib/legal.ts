/** The company behind Superpi, as published on the About, Contact, Privacy and Terms pages. ONE place for these details:
 *  pages, emails, the organization schema for search engines and documents all read them from here.
 *  These are the published legal details, so they are fixed here rather than read from environment variables (older .env files set
 *  different, outdated values that would have overridden the published text). Change them here when the company details change. */
export const LEGAL = {
  product: "Superpi",
  tagline: "Your Inventory. Smarter Than Ever.",
  company: "Direct2Hub Private Limited",
  cin: "U46901KA2026PTC231623",
  email: "contact@superpi.space",
  support: "support@superpi.space",
  address: "Shop No. 39-07 & 30-B, P.V.S. Complex, Kundapura, Udupi – 576201, Karnataka, India",
  website: "https://superpi.space",
  effective: "23 November 2026",
  updated: "23 November 2026",
};
/** True once real company details are set (they are now built in), so pages don't show the "before launch" placeholder note. */
export const legalReady = !LEGAL.company.startsWith("[") && !LEGAL.email.startsWith("[");
