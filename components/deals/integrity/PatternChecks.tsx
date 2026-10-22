import Link from "next/link";
import type { CSSProperties } from "react";
import { patternChecks } from "@/lib/sample-data/deal-integrity";
import { Tick } from "./Tick";

type Delay = CSSProperties & { "--delay"?: string };

/**
 * The 58px ring on the teal tile: a mint arc for the clear checks and a
 * small amber arc for the explained one. Both sweep in once.
 */
function SplitRing({ clear, total }: { clear: number; total: number }) {
  const r = 23;
  const sw = 7;
  // The design leaves a small gap between the two arcs.
  const clearPct = (clear / total) * 100;
  const warnPct = 100 / total - 7;
  const warnStart = clearPct + 4;
  const d: Delay = { "--delay": "0.2s" };
  return (
    <span role="img" aria-label={`${clear} of ${total} checks clear`} className="relative grid h-[58px] w-[58px] flex-none place-items-center">
      <svg aria-hidden="true" width="58" height="58" viewBox="0 0 58 58" className="absolute inset-0">
        <circle cx="29" cy="29" r={r} fill="none" strokeWidth={sw} className="stroke-white/14" />
        <circle cx="29" cy="29" r={r} fill="none" strokeWidth={sw} pathLength={100} strokeLinecap="round" strokeDasharray={`${clearPct} 100`} transform="rotate(-90 29 29)" className="anim-ring stroke-mint" style={d} />
        <circle cx="29" cy="29" r={r} fill="none" strokeWidth={sw} pathLength={100} strokeLinecap="round" strokeDasharray={`${warnPct} 100`} strokeDashoffset={-warnStart} transform="rotate(-90 29 29)" className="anim-ring stroke-amber-light" style={d} />
      </svg>
      <b className="anim-pop relative font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]" style={d}>
        {clear}/{total}
      </b>
    </span>
  );
}

/** The round-dollar deposits meter: share found, the red flag line and the scale. */
function Meter({ percent, flagAt, max, flagLabel }: { percent: number; flagAt: number; max: number; flagLabel: string }) {
  const fill = (percent / max) * 100;
  const flag = (flagAt / max) * 100;
  const d: Delay = { width: `${fill}%`, "--delay": "0.3s" };
  return (
    <div className="pl-[38px]">
      <div role="img" aria-label={`${percent}% round-dollar deposits, flagged at ${flagAt}%`} className="relative h-1.5 rounded-[3px] bg-line">
        <div className="anim-grow-x h-full rounded-[3px] bg-teal" style={d} />
        <span className="absolute top-[-3px] h-3 w-0.5 rounded-[1px] bg-red" style={{ left: `${flag}%` }} />
      </div>
      <div className="relative mt-1 h-3.5 text-[10.5px] text-hint">
        <span className="absolute left-0">0%</span>
        <span className="absolute -translate-x-1/2 whitespace-nowrap text-coral-text" style={{ left: `${flag}%` }}>
          {flagLabel}
        </span>
        <span className="absolute right-0">{max}%</span>
      </div>
    </div>
  );
}

/**
 * "Pattern checks" from design/Deal-Integrity.html: six habits that often
 * come with fraud on the sand card. Five are clear; the jump before applying
 * is explained and links to the $12,000 transfer in Cash flow. No hover.
 */
export function PatternChecks() {
  const { summary } = patternChecks;
  return (
    <article aria-labelledby="h-pat" className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-pat" className="m-0 font-heading text-[20px] font-semibold">{patternChecks.title}</h2>
        <Link href={patternChecks.help.href} className="whitespace-nowrap text-label font-semibold text-teal-deep no-underline">
          {patternChecks.help.label}
        </Link>
      </div>
      <div className="flex items-center gap-3.5 rounded-tile-lg bg-teal p-3.5 text-white">
        <SplitRing clear={summary.clear} total={summary.total} />
        <span className="min-w-0">
          <b className="block text-body">{summary.title}</b>
          <span className="text-label text-cap-on-teal">{summary.subtitle}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        {patternChecks.checks.map((c) => {
          const warn = c.status === "explained";
          return (
            <div key={c.label} className={`flex flex-col gap-2 rounded-[16px] px-3 py-[11px] ${warn ? "bg-amber-tint" : "bg-white/78"}`}>
              <div className="flex items-center gap-2.5">
                {warn ? (
                  <span aria-label="Explained" className="grid h-7 w-7 flex-none place-items-center rounded-[10px] bg-amber text-body font-bold text-white">
                    !
                  </span>
                ) : (
                  <Tick shape="square" size={28} />
                )}
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-body-sm">{c.label}</b>
                  <span className="block truncate text-[11.5px] text-hint">{c.detail}</span>
                </span>
                <b className={`whitespace-nowrap text-[12.5px] ${warn ? "text-amber-deep" : "text-teal-deep"}`}>{c.result}</b>
              </div>
              {c.meter ? <Meter {...c.meter} /> : null}
              {c.link ? (
                <Link href={c.link.href} className="ml-[38px] text-[11.5px] font-semibold text-amber-deep no-underline">
                  {c.link.label}
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
