import { GlanceRow } from "./GlanceRow";
import { PositionCard } from "./PositionCard";
import { ScenarioCard } from "./ScenarioCard";
import { HowWeLookedCard, OtherDebtCard, StackingCard, StatedVsFoundCard } from "./SideCards";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Positions & debt tab from design/Deal-Positions.html.
 * Row 1: debt at a glance (three tiles).
 * Row 2: the Kingsway position (two columns) and the stacking check.
 * Row 3: stated vs found (two columns) and how we looked.
 * Row 4: the payoff scenario (two columns) and other debt checked.
 * Fixed 3-column grids that stack on narrow screens; cards in a row
 * stretch to the same height.
 */
export function PositionsTab() {
  return (
    <>
      <GlanceRow />
      <section aria-label="The position and stacking check" className={row}>
        <PositionCard />
        <StackingCard />
      </section>
      <section aria-label="Stated versus found and how we looked" className={row}>
        <StatedVsFoundCard />
        <HowWeLookedCard />
      </section>
      <section aria-label="Payoff scenario and other debt" className={row}>
        <ScenarioCard />
        <OtherDebtCard />
      </section>
    </>
  );
}
