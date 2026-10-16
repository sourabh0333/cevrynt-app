import Link from "next/link";
import type { CSSProperties } from "react";
import { whatNeedsALook } from "@/lib/sample-data/deal";

const dot = { amber: "bg-amber", red: "bg-red" };

/**
 * "What needs a look" from design/Deal-Summary.html: the cream card with
 * the flagged items (each a link into the tab that explains it) and the
 * chips of what was checked and found clear. The dots pop in. No hover.
 */
export function LookCard() {
  return (
    <article aria-labelledby="h-look" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-cream p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-look" className="m-0 font-heading text-[20px] font-semibold">{whatNeedsALook.title}</h2>
        <span className="rounded-pill bg-card px-2.5 py-1 text-label-sm font-semibold text-amber-text">{whatNeedsALook.count}</span>
      </div>

      {whatNeedsALook.items.map((item, i) => {
        const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.15}s` };
        return (
          <Link key={item.title} href={item.href} className="flex gap-2.5 rounded-[16px] bg-white/75 px-3.5 py-3 text-ink no-underline">
            <span className={`anim-pop mt-1.5 h-2 w-2 flex-none rounded-full ${dot[item.tone]}`} style={style} />
            <span>
              <b className="text-body-sm">{item.title}</b>
              <span className="block text-[11.5px] text-muted">{item.detail}</span>
            </span>
          </Link>
        );
      })}

      <span className="mt-1.5 text-cap font-semibold uppercase text-amber-mute">{whatNeedsALook.clearCap}</span>
      <div className="flex flex-wrap gap-1.5">
        {whatNeedsALook.clear.map((c) => (
          <span key={c} className="rounded-pill bg-white/60 px-2.5 py-[5px] text-[11.5px]">{c}</span>
        ))}
      </div>
    </article>
  );
}
