import { integritySections } from "@/lib/copy/deal-integrity";
import type { IntegrityTabData } from "@/lib/data/views/deal-tabs";
import { ApplicationSignals } from "./ApplicationSignals";
import { DocumentChecks } from "./DocumentChecks";
import { EvidenceCard } from "./EvidenceCard";
import { PatternChecks } from "./PatternChecks";
import { LiveBankCard, ReviewCard } from "./ReviewRow";
import { VerdictRow } from "./VerdictRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Integrity tab from design/Deal-Integrity.html, for the deal in `data`
 * (from the data layer).
 * Row 1: the verdict (two columns) and what was checked.
 * Row 2: document checks, each document by 5 tests.
 * Row 3: evidence (two columns) and pattern checks.
 * Row 4: application signals.
 * Row 5: live bank data and your review (two columns).
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function IntegrityTab({ data }: { data: IntegrityTabData }) {
  const { integrity } = data;
  return (
    <>
      <VerdictRow data={data} />
      <DocumentChecks documents={integrity.documents} />
      <section aria-label={integritySections.evidence} className={row}>
        <EvidenceCard items={integrity.evidence} product={integrity.statementProduct} bank={data.bank} pages={data.pages} />
        <PatternChecks id={data.id} patterns={integrity.patterns} relatedTransfer={data.relatedTransfer} />
      </section>
      <ApplicationSignals signals={integrity.signals} />
      <section aria-label={integritySections.review} className={row}>
        <LiveBankCard owner={data.owner} connected={integrity.liveBankConnected} />
        <ReviewCard review={integrity.review} reviewer={data.reviewer} />
      </section>
    </>
  );
}
