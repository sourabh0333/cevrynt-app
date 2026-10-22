import { PageActions } from "@/components/shell/PageActions";
import { offersHeader } from "@/lib/sample-data/offers";
import { FundingQueue } from "./FundingQueue";
import { PipelineCard } from "./PipelineCard";
import { StatsRow } from "./StatsRow";

/**
 * Offers & funding from design/Offers.html. This step holds the top half:
 * the header, the six stat tiles, the "From offer to funded" stepper and
 * the funding queue. Expiring soon, broker commissions, money sent today
 * and why offers were lost come in the next step.
 */
export function OffersView() {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{offersHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{offersHeader.line}</span>
        </div>
        <PageActions />
      </header>
      <StatsRow />
      <PipelineCard />
      <FundingQueue />
    </>
  );
}
