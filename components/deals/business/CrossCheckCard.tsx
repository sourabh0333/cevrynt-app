import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { crossCheck } from "@/lib/sample-data/deal-business";

const legendDot = { teal: "bg-teal", amber: "bg-amber", stone: "bg-line-dashed" };

// Flexible columns instead of the design's 820px minimum, so the matrix never
// scrolls sideways (layout rule 3). Credit bureau hides below 1100px and
// Web & maps below 760px.
const grid = "grid grid-cols-[minmax(0,1fr)_repeat(5,minmax(0,1fr))] items-center gap-2 max-[1100px]:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,1fr))] max-[760px]:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,1fr))]";
const hide = (col: number) => (col === 4 ? "max-[1100px]:hidden" : col === 3 ? "max-[760px]:hidden" : "");

/**
 * "Does everything agree?" from design/Deal-Business.html: six facts
 * checked across five sources. Matching cells sit on light mint with a
 * teal dot (the dots pop in with a slight stagger); sources with nothing
 * to show are white hints. No hover.
 */
export function CrossCheckCard() {
  return (
    <Card as="section" aria-labelledby="h-x" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-x" className="m-0 font-heading text-[20px] font-semibold">{crossCheck.title}</h2>
          <div className="mt-[3px] text-label text-hint">{crossCheck.subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-3 text-[11.5px] text-muted">
          {crossCheck.legend.map((l) => (
            <span key={l.label} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${legendDot[l.tone]}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${grid} pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {crossCheck.columns.map((c, i) => (
            <span key={c} className={`truncate ${hide(i - 1)}`}>{c}</span>
          ))}
        </div>
        {crossCheck.rows.map((r, ri) => (
          <div key={r.fact} className={grid}>
            <b className="truncate text-body-sm">{r.fact}</b>
            {r.cells.map((cell, ci) => {
              const style: CSSProperties & { "--delay"?: string } = { "--delay": `${0.1 + ri * 0.06 + ci * 0.04}s` };
              return cell.match ? (
                <span key={ci} className={`flex min-w-0 items-center gap-1.5 rounded-[12px] bg-mint-light px-2.5 py-[9px] text-label ${hide(ci)}`}>
                  <span className="anim-pop h-2 w-2 flex-none rounded-full bg-teal" style={style} />
                  <span className="truncate">{cell.value}</span>
                </span>
              ) : (
                <span key={ci} className={`truncate rounded-[12px] bg-tile px-2.5 py-[9px] text-label text-hint-soft ${hide(ci)}`}>{cell.value}</span>
              );
            })}
          </div>
        ))}
      </div>
      <span className="text-[12.5px] text-muted">{crossCheck.note}</span>
    </Card>
  );
}
