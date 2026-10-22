import { Card } from "@/components/ui/Card";
import { documentChecks } from "@/lib/sample-data/deal-integrity";
import { Dash, Tick } from "./Tick";

// Flexible columns instead of the design's 720px minimum, so the table never
// scrolls sideways (layout rule 3). The last two tests hide on narrow screens.
const grid = "grid grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))] items-center gap-2.5 max-[640px]:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]";
const hide = (i: number) => (i >= 3 ? "max-[640px]:hidden" : "");

/**
 * "Document checks" from design/Deal-Integrity.html: seven documents, each
 * tested five ways. A teal tick is a pass; a grey dash means the test does
 * not apply to that file. No hover.
 */
export function DocumentChecks() {
  return (
    <Card as="section" aria-labelledby="h-docs" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-docs" className="m-0 font-heading text-[20px] font-semibold">{documentChecks.title}</h2>
          <div className="mt-[3px] text-label text-hint">{documentChecks.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{documentChecks.chip}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${grid} px-3.5 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {documentChecks.columns.map((c, i) => (
            <span key={c} className={`${i === 0 ? "" : "truncate text-center"} ${hide(i - 1)}`}>{c}</span>
          ))}
        </div>
        {documentChecks.rows.map((r) => (
          <div key={r.name} className={`${grid} rounded-[16px] bg-tile px-3.5 py-2.5`}>
            <span className="min-w-0">
              <b className="block truncate text-body-sm">{r.name}</b>
              <span className="block truncate text-[11.5px] text-hint">{r.detail}</span>
            </span>
            {r.tests.map((t, i) => (
              <span key={i} className={`flex justify-center ${hide(i)}`}>
                {t === "pass" ? <Tick /> : <Dash />}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
