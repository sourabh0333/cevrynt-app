import type { CSSProperties } from "react";
import { hero } from "@/lib/sample-data/renewals";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const stepTone = {
  dashed: { box: "border border-dashed border-teal/7", n: "text-muted", count: "", label: "text-muted", bar: "bg-teal/7" },
  now: { box: "bg-card text-ink shadow-[0_14px_30px_-18px_rgba(0,0,0,.6)]", n: "text-hint", count: "", label: "font-semibold text-teal", bar: "bg-card" },
  plain: { box: "bg-teal/7", n: "text-muted", count: "", label: "text-muted", bar: "bg-teal/18" },
  done: { box: "border border-mint/30 bg-mint/16", n: "text-teal-deep", count: "text-teal-deep", label: "text-muted", bar: "bg-mint" },
};

/**
 * Row 1 of design/Renewals.html: the $402K statement with its rising
 * line (draws in, fill fades, the end dot pops) and the five-step renewal
 * journey with its bar. The "Offer sent" count follows the offer panel.
 */
export function RenewalsHero({ sentCount }: { sentCount: number }) {
  const pts = hero.points;
  const line = "M" + pts.map(([x, y]) => `${x} ${y}`).join(" L");
  const area = `${line} L${pts[pts.length - 1][0]} 70 L${pts[0][0]} 70Z`;
  const [ex, ey] = pts[pts.length - 1];
  const steps = hero.journey.steps;
  // The bar's segments share the steps' tones, except "accepted" which is the pale white strip.
  const barTone = ["bg-teal/7", "bg-card", "bg-teal/18", "bg-white/50", "bg-mint"];

  return (
    <section
      aria-labelledby="h-pot"
      className="flex flex-wrap gap-2.5 rounded-[32px] border border-mint-border bg-mint-card p-2.5 text-ink"
    >
      <div className="flex max-w-[420px] flex-[1_1_300px] flex-col gap-2.5 rounded-card border border-teal/7 bg-[radial-gradient(120%_100%_at_0%_0%,rgba(143,217,195,.3),rgba(143,217,195,0)_60%),rgba(14,107,92,.07)] p-[22px]">
        <h2 id="h-pot" className="m-0 font-sans text-body-sm font-semibold tracking-normal text-muted">{hero.title}</h2>
        <b className="font-heading text-[40px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{hero.value}</b>
        <span className="text-[12.5px] text-muted">{hero.text}</span>
        <svg role="img" aria-label={hero.chartLabel} viewBox="0 0 300 70" className="mt-auto h-[70px] w-full">
          <path d={area} className="anim-fade fill-mint/16" />
          <path d={line} pathLength={1} fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="anim-draw stroke-teal" />
          <circle cx={ex} cy={ey} r="4" className="anim-pop-svg fill-teal" style={d(1.4)} />
        </svg>
        <span className="text-[11.5px] text-muted">{hero.caption}</span>
      </div>

      <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4 rounded-card border border-teal/7 bg-teal/7 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <b className="text-body">{hero.journey.title}</b>
          <span className="text-label text-muted">{hero.journey.note}</span>
        </div>
        <div className="grid flex-1 grid-cols-5 items-stretch gap-2 max-[760px]:grid-cols-3 max-[480px]:grid-cols-2">
          {steps.map((s) => {
            const t = stepTone[s.tone];
            return (
              <div key={s.n} className={`flex flex-col justify-between gap-2.5 rounded-[18px] p-3.5 ${t.box}`}>
                <span className={`font-mono text-[10.5px] ${t.n}`}>{s.n}</span>
                <b className={`font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${t.count}`}>{s.count === "sent" ? sentCount : s.count}</b>
                <span className={`text-label ${t.label}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
        <div className="flex h-2 gap-1.5" role="img" aria-label="Merchants at each step of the renewal journey">
          {steps.map((s, i) => (
            <span key={s.n} className={`anim-grow-x rounded-[4px] ${barTone[i]}`} style={{ flex: s.count === "sent" ? sentCount : s.flex, ...d(0.1 + i * 0.08) }} />
          ))}
        </div>
      </div>
    </section>
  );
}
