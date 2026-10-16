import { DealPlaceholder } from "@/components/deals/DealPlaceholder";

export const metadata = { title: "Deal cash flow · Cevrynt" };

// Deal cash flow, from design/Deal-CashFlow.html. Content arrives in its own step.
export default function Page() {
  return <DealPlaceholder tab="cash-flow" />;
}
