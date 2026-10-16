import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal offer and disclosures · Cevrynt" };

// Offer and disclosures, from design/Deal-Offer.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="offer" />;
}
