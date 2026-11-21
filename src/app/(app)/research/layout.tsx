import ComingSoon from "@/components/ComingSoon";
export const metadata = { title: "Research (coming soon)" };
/** Research is on the way. Delete this file to switch the section back on. */
export default function ResearchSoon() {
  return <ComingSoon title="Market research" lead="See what is selling, where and when, so you can plan stock before the season starts." points={["Product ideas with seasonal demand", "Buyer regions and return patterns", "A margin calculator that includes GST and fees"]} />;
}
