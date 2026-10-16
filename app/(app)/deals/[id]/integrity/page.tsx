import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal integrity · Cevrynt" };

// Integrity, from design/Deal-Integrity.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="integrity" />;
}
