import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { scoreBandLabel, scoreCardCopy as t } from "@/lib/copy/deal-summary";
import { scoreWeights, type WeightTone } from "@/lib/copy/policy";
import type { DealTabsData } from "@/lib/data/views/deal-tabs";

const stroke: Record<WeightTone, string> = {
  teal: "stroke-teal",
  "teal-mid": "stroke-teal-mid",
  amber: "stroke-amber",
  "mint-deep": "stroke-mint-deep",
  "teal-ink": "stroke-teal-ink",
};
const swatch: Record<WeightTone, string> = {
  teal: "bg-teal",
  "teal-mid": "bg-teal-mid",
  amber: "bg-amber",
  "mint-deep": "bg-mint-deep",
  "teal-ink": "bg-teal-ink",
};

// Ring geometry from the design: r 56 in a 150 box (circumference 351.86),
// one arc per part sized by its share of 100 points, with a 6-unit gap.
const CIRC = 351.86;
const GAP = 6;
const pct = (len: number) => (len / CIRC) * 100;

/**
 * "Underwriting score" from design/Deal-Summary.html: a five-part ring
 * (each part sweeps in, staggered), the score and band in the middle, the
 * five part rows, and the teal summary line. Each part is out of the
 * policy's weight for it (the same weights Settings › Policy shows), and
 * the line measures the score against the policy's approval line. No hover.
 */
export function ScoreCard({ data }: { data: DealTabsData }) {
  const { score } = data.summary;
  const { scoreWeights: weights, scoreBands } = data.policy;
  const parts = score.parts.map((p) => ({
    key: p.part,
    label: t.partLabel(p.part),
    value: p.points,
    max: weights.find((w) => w.part === p.part)?.points ?? 0,
    color: scoreWeights.parts[p.part].tone,
    warn: p.part === score.holdsBack,
  }));
  const tracks = parts.map((p) => (p.max / 100) * (CIRC - parts.length * GAP));
  const offsets = tracks.map((_, i) =>
    tracks.slice(0, i).reduce((sum, t) => sum + t + GAP, 0),
  );
  const aria = t.aria(score.total, parts.map((p) => ({ part: p.key, points: p.value, max: p.max })));

  return (
    <Card as="article" aria-labelledby="h-score" className="gap-3.5">
      <div className="flex items-center justify-between">
        <h2 id="h-score" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <Link href={t.link.href} className="text-label font-semibold text-teal no-underline">
          {t.link.label}
        </Link>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="relative h-[124px] w-[124px] flex-none">
          <svg role="img" aria-label={aria} width="124" height="124" viewBox="0 0 150 150">
            <g transform="rotate(-90 75 75)" fill="none" strokeWidth="14">
              {parts.map((p, i) => (
                <circle
                  key={`t-${p.label}`}
                  cx="75"
                  cy="75"
                  r="56"
                  pathLength={100}
                  className="stroke-ring-track"
                  strokeDasharray={`${pct(tracks[i])} 100`}
                  strokeDashoffset={-pct(offsets[i])}
                />
              ))}
              {parts.map((p, i) => {
                const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.12}s` };
                return (
                  <circle
                    key={p.label}
                    cx="75"
                    cy="75"
                    r="56"
                    pathLength={100}
                    className={`anim-ring ${stroke[p.color]}`}
                    style={style}
                    strokeDasharray={`${pct((p.value / p.max) * tracks[i])} 100`}
                    strokeDashoffset={-pct(offsets[i])}
                  />
                );
              })}
            </g>
          </svg>
          <div className="anim-pop absolute inset-0 grid place-items-center text-center">
            <span>
              <b className="block font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
                {score.total}
              </b>
              <span className="mt-1 inline-block rounded-pill bg-mint-bg px-2.5 py-[3px] text-[10.5px] font-semibold text-teal-dark">
                {scoreBandLabel(score.total, scoreBands)}
              </span>
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          {parts.map((p) => (
            <div
              key={p.label}
              className={`grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 rounded-[10px] px-[9px] py-[5px] ${
                p.warn ? "bg-amber-tint" : "bg-tile"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-[3px] ${swatch[p.color]}`} />
              <span className="truncate text-label">{p.label}</span>
              <b className={`font-heading text-body-sm tabular-nums tracking-[-0.03em] ${p.warn ? "text-amber-deep" : ""}`}>
                {p.value}
                <span className={`font-medium ${p.warn ? "text-amber-soft" : "text-hint-mute"}`}>/{p.max}</span>
              </b>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2.5 rounded-tile bg-teal px-3 py-[9px] text-label text-white">
        <span className="h-2 w-2 flex-none rounded-full bg-mint" />
        <span>{t.summary(score.total, scoreBands.approvalFrom, score.holdsBack)}</span>
      </div>
    </Card>
  );
}
