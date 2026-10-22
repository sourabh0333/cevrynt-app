import { ApplicationSignals } from "./ApplicationSignals";
import { DocumentChecks } from "./DocumentChecks";
import { EvidenceCard } from "./EvidenceCard";
import { PatternChecks } from "./PatternChecks";
import { LiveBankCard, ReviewCard } from "./ReviewRow";
import { VerdictRow } from "./VerdictRow";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Integrity tab from design/Deal-Integrity.html.
 * Row 1: the verdict (two columns) and what was checked.
 * Row 2: document checks, 7 documents by 5 tests.
 * Row 3: evidence (two columns) and pattern checks.
 * Row 4: application signals.
 * Row 5: live bank data and your review (two columns).
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function IntegrityTab() {
  return (
    <>
      <VerdictRow />
      <DocumentChecks />
      <section aria-label="Evidence and pattern checks" className={row}>
        <EvidenceCard />
        <PatternChecks />
      </section>
      <ApplicationSignals />
      <section aria-label="Live bank data and your review" className={row}>
        <LiveBankCard />
        <ReviewCard />
      </section>
    </>
  );
}
