import Link from "next/link";
import type { CSSProperties } from "react";
import { dealTabHref } from "@/lib/copy/deal";
import { timelineCopy as t } from "@/lib/copy/deal-summary";
import type { DealSummary, Id } from "@/lib/data/types";

const dot = {
  done: "bg-mint",
  attention: "bg-amber-light",
  upcoming: "box-border border-2 border-dot-ring",
};

/**
 * "Timeline" from design/Deal-Summary.html: the light mint gradient card
 * with the deal's events today, a mint or pale amber dot each, and a hollow
 * dot for what's coming (the funding call). Dots pop in, in order.
 * No hover.
 */
export function TimelineCard({ id, summary }: { id: Id; summary: DealSummary }) {
  return (
    <article
      aria-labelledby="h-time"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-center justify-between">
        <h2 id="h-time" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <Link href={dealTabHref(id, { path: "/activity" })} className="text-cap font-semibold uppercase text-teal-deep no-underline">
          {t.link}
        </Link>
      </div>
      <div className="flex flex-col">
        {summary.timeline.map((e, i) => {
          const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.12}s` };
          const upcoming = e.kind === "upcoming";
          return (
            <div key={e.text} className="grid grid-cols-[14px_1fr_auto] gap-2.5 py-2">
              <span className={`anim-pop mt-[5px] h-2.5 w-2.5 rounded-full ${dot[e.kind]}`} style={style} />
              <span className={`text-[12.5px] ${upcoming ? "text-muted" : ""}`}>{e.text}</span>
              <span className="font-mono text-label-sm text-muted">{t.time(e.at, upcoming)}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
