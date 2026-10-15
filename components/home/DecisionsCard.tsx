import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Decisions } from "@/lib/sample-data/home";

const stroke = { teal: "stroke-teal", amber: "stroke-amber", red: "stroke-red" };
const dot = { teal: "bg-teal", amber: "bg-amber", red: "bg-red" };
const radii = [86, 68, 50];

/**
 * "Today's decisions" from design/Main.html: three concentric rings
 * (186 view box, 11px stroke) that sweep in one after another, the total
 * pops in the middle, and the legend fades up.
 */
export function DecisionsCard({ data }: { data: Decisions }) {
  const summary = `${data.total} decisions: ${data.segments
    .map((s) => `${s.percent}% ${s.label.toLowerCase()}`)
    .join(", ")}`;

  return (
    <Card as="article" aria-labelledby="h-ring" className="min-h-[310px] gap-1.5">
      <SectionHeader
        title="Today's decisions"
        titleId="h-ring"
        action={
          <button
            type="button"
            aria-label="More options"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-[10px] border-0 bg-transparent"
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" className="fill-ink">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </button>
        }
      />

      <div className="relative grid flex-1 place-items-center">
        <svg role="img" aria-label={summary} width="180" height="180" viewBox="0 0 186 186">
          {data.segments.map((s, i) => {
            const r = radii[i];
            const style: CSSProperties & { "--delay"?: string } = { "--delay": `${i * 0.25}s` };
            return (
              <g key={s.label}>
                <circle cx="93" cy="93" r={r} fill="none" className="stroke-ring-track" strokeWidth="11" />
                <circle
                  cx="93"
                  cy="93"
                  r={r}
                  fill="none"
                  pathLength={100}
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={`${s.percent} 100`}
                  transform="rotate(-90 93 93)"
                  className={`anim-ring ${stroke[s.color]}`}
                  style={style}
                />
              </g>
            );
          })}
        </svg>
        <div className="anim-pop absolute text-center">
          <b className="block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
            {data.total}
          </b>
          <span className="text-cap font-semibold uppercase text-hint">Decisions</span>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        {data.segments.map((s, i) => {
          const style: CSSProperties & { "--delay"?: string } = { "--delay": `${0.9 + i * 0.15}s` };
          return (
            <div key={s.label} className="anim-rise" style={style}>
              <span className="flex items-center gap-1.5 font-semibold">
                <span className={`h-2 w-2 rounded-full ${dot[s.color]}`} />
                {s.percent}%
              </span>
              <span className="text-cap font-semibold uppercase text-hint">{s.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
