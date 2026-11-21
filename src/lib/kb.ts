import { PLANS } from "./plans";
/** The only facts the website assistant may use. Built from the real plan table, so limits here can never drift from the pricing page. */
export function siteFacts() {
  const f = PLANS.FREE;
  return `Superpi is inventory management software for ecommerce sellers (web app, works on phones).
Features: stock ledger that is only added to, never edited; orders (confirm, dispatch, cancel) with reservations; GST invoices, credit notes and e-way bill JSON for the GST portal's bulk upload; customers and price lists; purchases, goods receipts, supplier bills; returns with inspection; kits (bundles) and variants (size, colour); batch and expiry tracking and serial numbers; reports (stock value, receivables and payables aging, GST summary, reorder suggestions); low-stock alerts; barcode field; CSV import and export; product pictures and a business assistant that answers questions about the business's own data and writes product descriptions.
Coming soon (not available yet): connections to Amazon, Flipkart, Meesho and Shopify, webhooks, automations and market research.
Plan: Free Forever for every seller: up to ${f.products} products, a team of ${f.members} (1 owner + ${f.members - 1} members), ${f.locations} warehouse${f.locations > 1 ? "s" : ""}. No card needed. There are no paid plans right now.
Start: create an account at /register (email, or continue with Google), name your business, add products.
Help or anything not covered here: the contact form at /contact. Legal: /privacy and /terms.`;
}
