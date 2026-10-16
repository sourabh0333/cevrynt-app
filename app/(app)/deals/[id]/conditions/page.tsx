import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal conditions and stips · Cevrynt" };

// Conditions and stips, from design/Deal-Conditions.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="conditions" />;
}
