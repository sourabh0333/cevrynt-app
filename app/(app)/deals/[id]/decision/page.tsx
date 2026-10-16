import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal decision and memo · Cevrynt" };

// Decision and memo, from design/Deal-Decision.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="decision" />;
}
