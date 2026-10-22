import type { CSSProperties } from "react";
import { Ring } from "@/components/ui/Ring";
import { conditionsTotal, runway } from "@/lib/sample-data/deal-conditions";
import type { Derived, StepState } from "./derive";

type Delay = CSSProperties & { "--delay"?: string };

const seg: Record<StepState, string> = { done: "bg-mint", now: "bg-white", next: "bg-teal/8" };
const card: Record<StepState, string> = {
  done: "border border-mint/28 bg-mint/14",
  now: "bg-card text-ink shadow-[0_14px_30px_-18px_rgba(0,0,0,.6)]",
  next: "border border-dashed border-white/20",
};
const dot: Record<StepState, string> = {
  done: "bg-mint text-teal-dark",
  now: "bg-teal shadow-[0_0_0_4px_rgba(14,107,92,.18)]",
  next: "box-border border-[1.5px] border-white/30",
};
const sub: Record<StepState, string> = { done: "text-teal-deep", now: "font-semibold text-teal", next: "text-muted" };

/**
 * The funding runway from design/Deal-Conditions.html: the status panel
 * (chip, the met-of-8 ring, counts and the call to action) and the
 * "Road to funding" grid of six steps. The ring sweeps and the segments
 * grow in once; both follow the board as conditions change. No hover.
 */
export function RunwayHero({ d }: { d: Derived }) {
  const { allMet, metCount } = d;
  return (
    <section
      aria-labelledby="h-run"
      className="flex flex-wrap gap-2.5 rounded-[32px] border border-mint-border bg-mint-card p-2.5 text-ink"
    >
      <div className="flex max-w-[420px] flex-[1_1_300px] flex-col gap-3.5 rounded-card border border-teal/7 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(143,217,195,.28),rgba(143,217,195,0)_60%),rgba(14,107,92,.07)] p-5">
        <span
          className={`inline-flex self-start rounded-pill px-3 py-[5px] text-[11.5px] font-semibold ${
            allMet ? "bg-mint text-teal-dark" : "border border-amber-light/35 bg-amber-light/18 text-amber-deep"
          }`}
        >
          {allMet ? runway.met.chip : runway.hold.chip}
        </span>
        <div className="flex items-center gap-4">
          <Ring value={(metCount / conditionsTotal) * 100} size={92} stroke={9} color="teal" track="teal" ariaLabel={`${metCount} of ${conditionsTotal} conditions met`}>
            <b className="font-heading text-[26px] font-semibold tabular-nums tracking-[-0.03em] text-ink">
              {metCount}
              <span className="text-body text-muted">/{conditionsTotal}</span>
            </b>
          </Ring>
          <div className="min-w-0">
            <h2 id="h-run" className="m-0 font-heading text-[26px] leading-[1.1] font-semibold">
              {allMet ? runway.headline.met : runway.headline.left(conditionsTotal - metCount)}
            </h2>
            <span className="mt-1 block text-[12.5px] text-muted">{allMet ? runway.subline.met : runway.subline.left}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5" aria-live="polite">
          {[
            [d.doneCount, runway.counts.done],
            [d.waivedCount, runway.counts.waived],
            [d.leftCount, runway.counts.left],
          ].map(([n, label]) => (
            <span key={label} className="rounded-tile bg-teal/7 px-2.5 py-[9px]">
              <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{n}</b>
              <span className="text-label-sm text-muted">{label}</span>
            </span>
          ))}
        </div>
        <button
          type="button"
          className={`mt-auto h-[42px] cursor-pointer rounded-pill text-[12.5px] font-semibold text-ink ${allMet ? "border-0 bg-card" : "border border-teal/8 bg-teal/8"}`}
        >
          {allMet ? runway.met.cta : runway.hold.cta}
        </button>
      </div>

      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4 rounded-card border border-teal/7 bg-teal/7 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <b className="text-body">{runway.title}</b>
          <span className="text-label text-muted">{d.nowStep ? runway.next(d.nowStep.title) : runway.allDone}</span>
        </div>
        <div className="flex h-2 gap-1.5" role="img" aria-label={`${d.steps.filter((s) => s.state === "done").length} of ${d.steps.length} steps done`}>
          {d.steps.map((s, i) => {
            const style: Delay = { "--delay": `${0.1 + i * 0.08}s` };
            return <span key={s.n} className={`anim-grow-x flex-1 rounded-[4px] ${seg[s.state]}`} style={style} />;
          })}
        </div>
        <div className="grid flex-1 auto-rows-fr grid-cols-3 gap-2 max-[760px]:grid-cols-2">
          {d.steps.map((s) => (
            <div key={s.n} className={`box-border flex min-h-[96px] flex-col justify-between gap-1.5 rounded-[18px] p-3.5 ${card[s.state]}`}>
              <span className="flex items-center justify-between">
                <span className={`font-mono text-[10.5px] ${s.state === "now" ? "text-hint" : "text-muted"}`}>{s.n}</span>
                <span className={`grid h-5 w-5 place-items-center rounded-full text-label-sm font-bold ${dot[s.state]}`}>{s.state === "done" ? "✓" : ""}</span>
              </span>
              <b className="text-body-sm leading-[1.25]">{s.title}</b>
              <span className={`text-[11.5px] ${sub[s.state]}`}>{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
