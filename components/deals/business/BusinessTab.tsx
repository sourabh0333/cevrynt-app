import { BusinessCard } from "./BusinessCard";
import { CrossCheckCard } from "./CrossCheckCard";
import { LocationCard } from "./LocationCard";
import { OwnerCard } from "./OwnerCard";
import { OnlinePresenceCard, PublicRecordsCard } from "./RecordsCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Business & owners tab from design/Deal-Business.html.
 * Row 1: the business (two columns) and its location.
 * Row 2: does everything agree, 6 facts by 5 sources.
 * Row 3: the owner (two columns) and public records.
 * Row 4: online presence.
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function BusinessTab() {
  return (
    <>
      <section aria-label="The business and its location" className={row}>
        <BusinessCard />
        <LocationCard />
      </section>
      <CrossCheckCard />
      <section aria-label="Owner and public records" className={row}>
        <OwnerCard />
        <PublicRecordsCard />
      </section>
      <OnlinePresenceCard />
    </>
  );
}
