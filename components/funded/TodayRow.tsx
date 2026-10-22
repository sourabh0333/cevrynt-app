import type { CSSProperties } from "react";
import { fundedStats, today } from "@/lib/sample-data/funded";

type Delay = CSSProperties & { "--delay"?: string };

const tileTone = {
  cleared: { box: "bg-teal/7", label: "text-muted", value: "", dot: "bg-mint" },
  pending: { box: "bg-teal/7", label: "text-muted", value: "", dot: "bg-white/40" },
  returned: { box: "border border-red-light/30 bg-red-light/14", label: "text-coral-text", value: "text-coral-text", dot: "bg-red-light" },
};

const statTone = {
  grey: { box: "bg-card", label: "text-hint", note: "text-hint" },
  red: { box: "bg-red-bg", label: "text-red-text", note: "text-red-text" },
  cream: { box: "bg-cream", label: "text-amber-mute", note: "text-amber-deep" },
};

/**
 * Row 1 of design/Funded.html: "Today's payments" on the mint card (two
 * columns) with the cleared / pending / returned bar that grows in, and
 * the four stat tiles in a 2×2 grid beside it.
 */
export function TodayRow() {
  const { cleared, pending, returned } = today.segments;
  const barStyle: Delay = { "--delay": "0.2s" };
  return (
    <section aria-label="Today's payments and the book at a glance" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-today"
        className="col-span-2 box-border flex min-w-0 flex-col gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink max-[980px]:col-span-1"
      >
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div>
            <h2 id="h-today" className="m-0 font-heading text-[22px] font-semibold">{today.title}</h2>
            <span className="text-[12.5px] text-muted">{today.subtitle}</span>
          </div>
          <span className="rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-[5px] text-[11.5px] font-semibold">{today.chip}</span>
        </div>
        <div className="flex flex-wrap items-end gap-[22px]">
          <span>
            <span className="block text-label text-muted">{today.collectedLabel}</span>
            <b className="font-heading text-[34px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{today.collected}</b>
          </span>
          <span className="pb-1.5 text-body-sm text-muted">{today.expected}</span>
        </div>
        <div role="img" aria-label="Cleared, pending and returned today" className="anim-grow-x flex h-3.5 gap-[3px] overflow-hidden rounded-[7px]" style={barStyle}>
          <span className="bg-mint" style={{ flex: cleared }} />
          <span className="bg-white/30" style={{ flex: pending }} />
          <span className="bg-red-light" style={{ flex: returned }} />
        </div>
        <div className="grid grid-cols-3 gap-2 max-[640px]:grid-cols-1">
          {today.tiles.map((t) => {
            const tone = tileTone[t.tone];
            return (
              <span key={t.label} className={`rounded-[16px] p-3 ${tone.box}`}>
                <span className={`flex items-center gap-1.5 text-[11.5px] ${tone.label}`}>
                  <span className={`h-2 w-2 rounded-[2px] ${tone.dot}`} />
                  {t.label}
                </span>
                <b className={`block font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em] ${tone.value}`}>{t.value}</b>
              </span>
            );
          })}
        </div>
      </article>

      <div className="grid grid-cols-2 gap-3.5">
        {fundedStats.map((s) => {
          const tone = statTone[s.tone];
          return (
            <article key={s.label} className={`box-border flex min-w-0 flex-col gap-1.5 rounded-[26px] p-[18px] text-ink ${tone.box}`}>
              <span className={`text-label ${tone.label}`}>{s.label}</span>
              <b className="font-heading text-[28px] leading-[1.1] font-semibold tabular-nums tracking-[-0.03em]">{s.value}</b>
              <span className={`text-[11.5px] ${s.noteTone === "good" ? "font-semibold text-teal-deep" : s.noteTone === "warn" ? "font-semibold text-amber-deep" : tone.note}`}>{s.note}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
