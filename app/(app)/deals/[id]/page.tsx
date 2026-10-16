import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal summary · Cevrynt" };

// Deal summary, from design/Deal-Summary.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="summary" />;
}
