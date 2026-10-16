import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal business and owners · Cevrynt" };

// Business and owners, from design/Deal-Business.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="business" />;
}
