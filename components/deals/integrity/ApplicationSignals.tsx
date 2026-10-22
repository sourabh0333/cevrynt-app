import { Card } from "@/components/ui/Card";
import { applicationSignals } from "@/lib/sample-data/deal-integrity";
import { Tick } from "./Tick";

/**
 * "Application signals" from design/Deal-Integrity.html: five checks on how
 * the application reached you and who sent it, each on a white tile.
 */
export function ApplicationSignals() {
  return (
    <Card as="section" aria-labelledby="h-app" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-app" className="m-0 font-heading text-[20px] font-semibold">{applicationSignals.title}</h2>
          <div className="mt-[3px] text-label text-hint">{applicationSignals.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{applicationSignals.chip}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {applicationSignals.signals.map((s) => (
          <div key={s.label} className="flex items-start gap-2.5 rounded-[18px] bg-tile p-3.5">
            <Tick size={26} />
            <span className="min-w-0">
              <b className="block text-body-sm">{s.label}</b>
              <span className="text-label text-hint">{s.detail}</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
