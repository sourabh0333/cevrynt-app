import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal activity · Cevrynt" };

// Activity, from design/Deal-Activity.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="activity" />;
}
