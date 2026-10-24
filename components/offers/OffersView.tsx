import { PageActions } from "@/components/shell/PageActions";
import { expiringToday, offerStats, offersHeader, offersSections } from "@/lib/copy/offers";
import type { OffersData } from "@/lib/data/views/funding";
import { CommissionsCard, ExpiringCard, LostOffersCard, MoneySentCard } from "./BottomRows";
import { FundingQueue } from "./FundingQueue";
import { PipelineCard } from "./PipelineCard";
import { StatsRow } from "./StatsRow";

/**
 * Offers & funding from design/Offers.html, for the offers, queue and
 * releases in `data` (from the data layer): the header, the six stat
 * tiles, the "From offer to funded" stepper, the funding queue, then
 * expiring offers beside broker commissions, money sent today and the
 * offers that did not fund.
 */
export function OffersView({ data }: { data: OffersData }) {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{offersHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">
            {offersHeader.line(data.summary.inProgress, expiringToday(data.offers, data.now).length)}
          </span>
        </div>
        <PageActions />
      </header>
      <StatsRow stats={offerStats(data)} />
      <PipelineCard offers={data.offers} totals={data.summary.stageTotals} meId={data.meId} now={data.now} />
      <FundingQueue queue={data.queue} desk={data.desk} releaser={data.releaser} />
      <section aria-label={offersSections.bottom} className="grid grid-cols-2 items-stretch gap-3.5 max-[760px]:grid-cols-1">
        <ExpiringCard offers={data.offers} now={data.now} />
        <CommissionsCard offers={data.offers} points={data.brokerPoints} />
      </section>
      <MoneySentCard releases={data.releases} />
      <LostOffersCard summary={data.summary} />
    </>
  );
}
