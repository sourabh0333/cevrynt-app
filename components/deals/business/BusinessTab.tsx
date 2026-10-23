import { businessSections } from "@/lib/copy/deal-business";
import type { BusinessTabData } from "@/lib/data/views/deal-tabs";
import { BusinessCard } from "./BusinessCard";
import { CrossCheckCard } from "./CrossCheckCard";
import { LocationCard } from "./LocationCard";
import { OwnerCard } from "./OwnerCard";
import { OnlinePresenceCard, PublicRecordsCard } from "./RecordsCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Business & owners tab from design/Deal-Business.html, for the deal
 * in `data` (from the data layer).
 * Row 1: the business (two columns) and its location.
 * Row 2: does everything agree, each fact by 5 sources.
 * Row 3: the owner (two columns) and public records.
 * Row 4: online presence.
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function BusinessTab({ data }: { data: BusinessTabData }) {
  const { business: b } = data;
  const owner = b.owners[0];
  return (
    <>
      <section aria-label={businessSections.business} className={row}>
        <BusinessCard business={b} industryAllowed={data.industryAllowed} now={data.now} />
        <LocationCard address={b.address} />
      </section>
      <CrossCheckCard rows={b.crossCheck} owner={owner?.name ?? ""} />
      <section aria-label={businessSections.owner} className={row}>
        {owner ? <OwnerCard id={data.id} owner={owner} totalShare={b.owners.reduce((s, o) => s + o.share, 0)} related={b.related} /> : null}
        <PublicRecordsCard records={b.publicRecords} checkedAt={b.recordsCheckedAt} />
      </section>
      <OnlinePresenceCard online={b.online} />
    </>
  );
}
