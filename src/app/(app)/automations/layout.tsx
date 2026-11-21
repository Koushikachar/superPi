import ComingSoon from "@/components/ComingSoon";
export const metadata = { title: "Automations (coming soon)" };
/** Automations are on the way. Delete this file to switch the section back on. */
export default function AutomationsSoon() {
  return <ComingSoon title="Automations" lead="Let routine stock tasks run by themselves, with rules you set once." points={["Reorder reminders when stock runs low", "Alerts when an order waits too long", "Daily summaries for your team"]} />;
}
