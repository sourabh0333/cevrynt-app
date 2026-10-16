import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal positions and debt · Cevrynt" };

// Positions and debt, from design/Deal-Positions.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="positions" />;
}
