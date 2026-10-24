import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { byIndustry, byState, repeatMerchants, type SliceColor, type StateColor } from "@/lib/copy/merchants";
import { activeCount } from "@/lib/copy/funded";
import type { MerchantsData } from "@/lib/data/views/merchants";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const title = "m-0 font-heading text-[19px] font-semibold";

const slice: Record<SliceColor, { stroke: string; dot: string }> = {
  "teal-ink": { stroke: "stroke-teal-ink", dot: "bg-teal-ink" },
  sand: { stroke: "stroke-sand-stripe", dot: "bg-sand-stripe" },
  teal: { stroke: "stroke-teal", dot: "bg-teal" },
  "teal-soft": { stroke: "stroke-teal-soft", dot: "bg-teal-soft" },
  mint: { stroke: "stroke-mint", dot: "bg-mint" },
};

/**
 * "By industry" from design/Merchants.html: the five-slice ring (each arc
 * sweeps in, one after the other), the legend and the industry limit check.
 */
export function IndustryCard({ data }: { data: MerchantsData }) {
  const slices = byIndustry.slices(data.book);
  const limit = byIndustry.limit(data.book, data.concentration);
  // where each arc starts, as a share of the ring
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((sum, s) => sum + s.percent, 0));
  return (
    <article aria-labelledby="h-ind" className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg bg-card p-5 text-ink">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-ind" className={title}>{byIndustry.title}</h2>
          <span className="text-label opacity-75">{byIndustry.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{byIndustry.total(data.funded.outstanding)}</span>
      </div>
      <div className="flex flex-1 items-center gap-[18px]">
        <svg
          role="img"
          aria-label={slices.map((s) => `${s.label} ${s.percent}%`).join(", ")}
          width="104"
          height="104"
          viewBox="0 0 104 104"
          className="flex-none"
        >
          {slices.map((s, i) => {
            const start = starts[i];
            return (
              <circle
                key={s.label}
                cx="52"
                cy="52"
                r="40"
                fill="none"
                strokeWidth="16"
                pathLength={100}
                strokeDasharray={`${s.percent - 1} 100`}
                strokeDashoffset={-start}
                transform="rotate(-90 52 52)"
                className={`anim-ring ${slice[s.color].stroke}`}
                style={d(0.1 + i * 0.12)}
              />
            );
          })}
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
          {slices.map((s) => (
            <span key={s.label} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 text-[12.5px]">
              <span className={`h-2.5 w-2.5 rounded-[3px] ${slice[s.color].dot}`} />
              <span className="truncate">{s.label}</span>
              <b className="font-heading font-semibold tabular-nums tracking-[-0.03em]">{s.percent}%</b>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 rounded-tile bg-tile px-3 py-2.5 text-label">
        <span>{limit.label}</span>
        <b className="text-teal-deep">{limit.result}</b>
      </div>
    </article>
  );
}

const stateColor: Record<StateColor, { tile: string; bar: string }> = {
  "teal-ink": { tile: "bg-teal-ink text-white", bar: "bg-teal-ink" },
  teal: { tile: "bg-teal text-white", bar: "bg-teal" },
  "teal-mid": { tile: "bg-teal-mid text-white", bar: "bg-teal-mid" },
  "teal-soft": { tile: "bg-teal-soft text-white", bar: "bg-teal-soft" },
  mint: { tile: "bg-mint text-ink", bar: "bg-mint" },
};

/** "By state": the five states ranked, with bars that grow in. */
export function StateCard({ data }: { data: MerchantsData }) {
  return (
    <article aria-labelledby="h-geo" className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg bg-cream p-5 text-ink">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-geo" className={title}>{byState.title}</h2>
          <span className="text-label opacity-75">{byState.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-card px-2.5 py-1 text-label-sm font-semibold text-grey-text">{byState.chip(activeCount(data.funded))}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        {byState.states(data.book).map((s, i) => (
          <div key={s.code} className="grid grid-cols-[34px_minmax(0,1fr)_30px] items-center gap-2.5">
            <span className={`grid h-[26px] place-items-center rounded-[8px] font-mono text-[10.5px] font-medium ${stateColor[s.color].tile}`}>{s.code}</span>
            <span className="min-w-0">
              <span className="block truncate text-label text-grey-text">{s.name}</span>
              <span className="mt-[3px] block h-1.5 rounded-[3px] bg-white/70">
                <span className={`anim-grow-x block h-1.5 rounded-[3px] ${stateColor[s.color].bar}`} style={{ width: `${s.percent}%`, ...d(0.1 + i * 0.07) }} />
              </span>
            </span>
            <b className="text-right font-heading text-body font-semibold tabular-nums tracking-[-0.03em]">{s.count}</b>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 rounded-tile bg-white/70 px-3 py-2.5 text-label">
        <span>{byState.note.label}</span>
        <b>{byState.note.result}</b>
      </div>
    </article>
  );
}

/** "Repeat merchants": late payments on a first advance vs a repeat one, and the two facts. */
export function RepeatCard({ data }: { data: MerchantsData }) {
  const t = repeatMerchants;
  const r = data.book.repeat;
  const [first, repeat] = [t.first(r), t.repeat(r)];
  return (
    <article
      aria-labelledby="h-rep"
      className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-rep" className={title}>{t.title}</h2>
          <span className="text-label opacity-75">{t.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-mint/18 px-2.5 py-1 text-label-sm font-semibold text-teal-deep">{t.chip(r)}</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className="flex flex-col justify-between gap-2.5 rounded-[18px] bg-teal/7 p-3.5">
          <span className="text-[11.5px] text-muted">
            {first.label[0]}
            <br />
            {first.label[1]}
          </span>
          <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{first.value}</b>
          <span className="block h-1.5 rounded-[3px] bg-teal/18" />
        </div>
        <div className="flex flex-col justify-between gap-2.5 rounded-[18px] border border-mint/30 bg-mint/14 p-3.5">
          <span className="text-[11.5px] text-teal-deep">
            {repeat.label[0]}
            <br />
            {repeat.label[1]}
          </span>
          <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{repeat.value}</b>
          <span className="block h-1.5 rounded-[3px] bg-white/10">
            <span className="anim-grow-x block h-1.5 rounded-[3px] bg-mint" style={{ width: `${repeat.barPercent}%`, ...d(0.2) }} />
          </span>
        </div>
        {t.facts(r).map((f) => (
          <div key={f.label} className="rounded-[16px] bg-teal/7 px-3.5 py-3">
            <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{f.value}</b>
            <span className="text-label-sm text-muted">{f.label}</span>
          </div>
        ))}
      </div>
      <Button href={t.cta.href} glow className="h-10 w-full text-[12.5px]">
        {t.cta.label(data.readyCount)}
      </Button>
    </article>
  );
}
