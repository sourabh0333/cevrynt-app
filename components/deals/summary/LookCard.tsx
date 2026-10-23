import Link from "next/link";
import type { CSSProperties } from "react";
import { dealTabHref, dealTabs } from "@/lib/copy/deal";
import { lookCopy as t } from "@/lib/copy/deal-summary";
import type { DealSummary, Id } from "@/lib/data/types";

const dot = { amber: "bg-amber", red: "bg-red" };

/**
 * "What needs a look" from design/Deal-Summary.html: the cream card with
 * the deal's flagged findings (each a link into the tab that explains it)
 * and the chips of what was checked and found clear. The dots pop in.
 * No hover.
 */
export function LookCard({ id, summary }: { id: Id; summary: DealSummary }) {
  return (
    <article aria-labelledby="h-look" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-cream p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-look" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-card px-2.5 py-1 text-label-sm font-semibold text-amber-text">{t.count(summary.findings.length)}</span>
      </div>

      {summary.findings.map((item, i) => {
        const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.15}s` };
        const tab = dealTabs.find((x) => x.key === item.tab) ?? dealTabs[0];
        return (
          <Link key={item.title} href={dealTabHref(id, tab)} className="flex gap-2.5 rounded-[16px] bg-white/75 px-3.5 py-3 text-ink no-underline">
            <span className={`anim-pop mt-1.5 h-2 w-2 flex-none rounded-full ${dot[item.tone]}`} style={style} />
            <span>
              <b className="text-body-sm">{item.title}</b>
              <span className="block text-[11.5px] text-muted">{item.detail}</span>
            </span>
          </Link>
        );
      })}

      <span className="mt-1.5 text-cap font-semibold uppercase text-amber-mute">{t.clearCap}</span>
      <div className="flex flex-wrap gap-1.5">
        {summary.clear.map((c) => (
          <span key={c} className="rounded-pill bg-white/60 px-2.5 py-[5px] text-[11.5px]">{c}</span>
        ))}
      </div>
    </article>
  );
}
