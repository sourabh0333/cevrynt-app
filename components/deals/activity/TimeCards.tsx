import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { accessLog, timeSpent as t } from "@/lib/sample-data/deal-activity";

/** "Where the time went": the four-segment bar (grows in once) and the stage tiles. */
export function TimeSpentCard() {
  const style: CSSProperties & { "--delay"?: string } = { "--delay": "0.2s" };
  return (
    <Card as="article" aria-labelledby="h-stage" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div>
        <h2 id="h-stage" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
      </div>
      <div role="img" aria-label="Time by stage" className="anim-grow-x flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]" style={style}>
        {t.segments.map((s) => (
          <span key={s.label} className={s.color} style={{ flex: s.flex }} />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {t.segments.map((s) => (
          <span key={s.label} className={`rounded-[16px] p-3 ${s.warn ? "bg-amber-tint" : "bg-tile"}`}>
            <span className={`flex items-center gap-1.5 text-[11.5px] ${s.warn ? "text-amber-mute" : "text-hint"}`}>
              <span className={`h-2 w-2 rounded-[2px] ${s.dot}`} />
              {s.label}
            </span>
            <b className={`font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em] ${s.warn ? "text-amber-deep" : ""}`}>{s.value}</b>
          </span>
        ))}
      </div>
      <span className="text-label text-muted">{t.note}</span>
    </Card>
  );
}

/** "Who opened it": the access list and the 7-year retention note. */
export function AccessCard() {
  return (
    <Card as="article" aria-labelledby="h-access" className="gap-2.5">
      <div className="flex items-center justify-between">
        <h2 id="h-access" className="m-0 font-heading text-[20px] font-semibold">{accessLog.title}</h2>
        <span className="rounded-pill bg-tile px-[9px] py-[3px] text-label-sm font-semibold">{accessLog.chip}</span>
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {accessLog.rows.map((r) => (
          <span key={r.who} className="flex justify-between gap-2 rounded-tile bg-tile px-3 py-2.5">
            <span>{r.who}</span>
            <span className="font-mono text-label-sm text-hint">{r.time}</span>
          </span>
        ))}
      </div>
      <span className="mt-auto text-[11.5px] text-hint">{accessLog.note}</span>
    </Card>
  );
}
