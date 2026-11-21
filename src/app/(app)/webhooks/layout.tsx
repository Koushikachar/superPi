import ComingSoon from "@/components/ComingSoon";
export const metadata = { title: "Webhooks (coming soon)" };
/** Webhooks are on the way. Delete this file to switch the section back on. */
export default function WebhooksSoon() {
  return <ComingSoon title="Webhooks" lead="Send stock and order events to your own systems the moment they happen." points={["Signed requests you can verify", "Automatic retries when your server is down", "A delivery log for every event"]} />;
}
