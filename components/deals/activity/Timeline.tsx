"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { eventKinds, timeline as t, type ActivityEvent, type EventKind } from "@/lib/sample-data/deal-activity";

type Filter = EventKind | "all";

/**
 * "Timeline" from design/Deal-Activity.html and its prototype: search,
 * the filter chips, and the events newest first. The box takes the height
 * of the column beside it and the events scroll inside it under the
 * sticky day label (layout rule 2). Rows stagger in once. No hover.
 */
export function Timeline({ events }: { events: ActivityEvent[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const rows = events.filter(
    (e) => (filter === "all" || e.kind === filter) && (!q || [e.title, e.detail, e.quote ?? ""].some((s) => s.toLowerCase().includes(q))),
  );

  return (
    <Card as="article" aria-labelledby="h-tl" padding={false} className="col-span-2 gap-3.5 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-tl" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-[38px] min-w-[200px] items-center gap-2 rounded-pill bg-tile px-3.5 text-hint">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              aria-label={t.search}
              placeholder={t.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-hint"
            />
          </label>
          <Link href={t.exportLink.href} className="text-label font-semibold text-teal no-underline">
            {t.exportLink.label}
          </Link>
        </div>
      </div>

      <div role="group" aria-label="Show" className="flex flex-wrap gap-1.5">
        {t.filters.map((f) => {
          const on = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.key)}
              className={`inline-flex h-[34px] cursor-pointer items-center gap-[7px] rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-tile text-grey-text"}`}
            >
              <span className={`h-[7px] w-[7px] rounded-full ${on && f.onDot ? f.onDot : f.dot}`} />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* flex-1 with a zero basis: fills the card's height and scrolls inside it */}
      <div className="scrollbar-thin -mx-1.5 h-0 min-h-[380px] flex-1 basis-0 overflow-y-auto px-1.5">
        <span className="sticky top-0 z-[2] block bg-card pt-1 pb-2 text-cap font-semibold uppercase text-hint">{t.day}</span>
        <div className="relative flex flex-col gap-1" aria-live="polite">
          <span aria-hidden="true" className="absolute top-2.5 bottom-2.5 left-[19px] w-0.5 bg-line" />
          {rows.map((e, i) => {
            const k = eventKinds[e.kind];
            const style: CSSProperties & { "--delay"?: string } = { "--delay": `${Math.min(i, 8) * 0.05}s` };
            return (
              <div key={`${e.time}-${e.title}`} className="anim-rise relative grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-3 py-2" style={style}>
                <span className={`relative z-[1] box-border grid h-10 w-10 place-items-center rounded-[13px] border-[3px] border-white text-[11.5px] font-bold ${k.icon}`}>{e.ini}</span>
                <div className={`min-w-0 rounded-[16px] px-3.5 py-3 ${e.fresh ? "bg-purple-bg" : "bg-tile"}`}>
                  <span className="flex flex-wrap items-center gap-2">
                    <b className="text-[13.5px]">{e.title}</b>
                    <span className={`rounded-pill px-2 py-0.5 text-[10.5px] font-semibold ${k.tag}`}>{k.label}</span>
                  </span>
                  <span className="mt-[3px] block text-[12.5px] text-muted">{e.detail}</span>
                  {e.quote ? <span className="mt-2 block rounded-[12px] border-l-[3px] border-amber bg-card px-3 py-2.5 text-[12.5px]">{e.quote}</span> : null}
                </div>
                <span className="pt-1 font-mono text-label-sm text-hint">{e.time}</span>
              </div>
            );
          })}
          {rows.length === 0 ? <div className="rounded-[18px] bg-tile p-6 text-center text-[12.5px] text-hint">{t.empty}</div> : null}
        </div>
      </div>
    </Card>
  );
}
