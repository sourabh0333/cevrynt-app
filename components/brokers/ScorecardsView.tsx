"use client";

import { useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { profile as p, scorecards as t, startSelected, tierLabel, tierOf, type BrokerSort, type BrokerTone, type BrokerView } from "@/lib/copy/brokers";

type Delay = CSSProperties & { "--delay"?: string };

/*
 * Design .bcols: broker, score, fund rate, complete, fraud flags, funded.
 * The columns flex and the name truncates; "Complete" hides below 900px.
 */
const cols =
  "grid grid-cols-[minmax(0,1.5fr)_56px_minmax(0,1fr)_70px_70px_76px] items-center gap-2.5 max-[900px]:grid-cols-[minmax(0,1.5fr)_56px_minmax(0,1fr)_70px_76px] max-[900px]:[&>:nth-child(4)]:hidden";

type Tier = keyof typeof tierLabel;
const tierChip: Record<Tier, string> = {
  top: "bg-mint-bg text-teal-dark",
  good: "bg-page text-grey-text",
  watch: "bg-red-bg text-red-text",
  paused: "bg-page text-grey-text",
};
const scoreChip = (score: number) => (score >= 85 ? "bg-mint-bg text-teal-dark" : score >= 65 ? "bg-amber-bg text-amber-text" : "bg-red-bg text-red-text");
const noteBox: Record<BrokerTone, string> = { g: "bg-mint-light text-teal-dark", n: "bg-card text-grey-text", r: "bg-red-bg text-red-text" };

const sortBy: Record<BrokerSort, (a: BrokerView, b: BrokerView) => number> = {
  score: (a, b) => b.score - a.score,
  vol: (a, b) => b.volume - a.volume,
  flags: (a, b) => b.flags - a.flags,
};

/** The broker's initials on its gradient square (36px in the list, 46px in the detail). */
function Mark({ b, size }: { b: BrokerView; size: 36 | 46 }) {
  return (
    <span
      aria-hidden="true"
      className={`grid flex-none place-items-center font-bold text-white ${size === 46 ? "h-[46px] w-[46px] rounded-[15px] text-body" : "h-9 w-9 rounded-[12px] text-label-sm"}`}
      style={{ background: `linear-gradient(140deg, ${b.g[0]}, ${b.g[1]})` }}
    >
      {b.ini}
    </span>
  );
}

/**
 * "Broker scorecards" and the broker detail from design/Brokers.html and
 * its prototype. The switch sorts by score, funded volume or flags; clicking
 * a row updates the detail on the right. The list box matches the detail's
 * height and its rows scroll inside it under sticky headings; the detail
 * never scrolls. Pause marks the broker Paused in the list and the button
 * reads Resume. No hover. The brokers, with their fraud flags from Stacking
 * Watch and commission at Pricing's points, come from the data layer.
 */
export function ScorecardsView({ brokers }: { brokers: BrokerView[] }) {
  const [sort, setSort] = useState<BrokerSort>("score");
  const [sel, setSel] = useState(() => startSelected(brokers));
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  const list = [...brokers].sort(sortBy[sort]);
  const b = brokers.find((x) => x.id === sel) ?? brokers[0];
  const isP = !!paused[b.id];
  const maxWeek = Math.max(...b.weeks);
  const maxWhy = Math.max(...b.why.map((w) => w.count));

  return (
    <div className="flex flex-wrap items-stretch gap-3.5">
      <section aria-labelledby="h-list" className="flex min-w-0 flex-[999_1_640px] flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 pt-1">
          <div>
            <h2 id="h-list" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
            <span className="text-label text-hint">{t.subtitle}</span>
          </div>
          <SegmentedSwitch label={t.sortLabel} value={sort} onChange={(v) => setSort(v as BrokerSort)} options={t.sorts.map((s) => ({ value: s.key, label: s.label }))} />
        </div>
        <div className="scrollbar-thin -mx-1 h-0 min-h-[320px] flex-[1_1_0] overflow-x-hidden overflow-y-auto px-1">
          <div className="flex flex-col gap-1.5">
            <div className={`${cols} sticky top-0 z-[2] bg-card px-3 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
              {t.columns.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {list.map((r, i) => {
              const on = r.id === sel;
              const rate = Math.round((r.funded / r.sent) * 100);
              const tier: Tier = tierOf(r.score, !!paused[r.id]);
              return (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSel(r.id)}
                  className={`${cols} box-border w-full cursor-pointer rounded-[16px] border-0 bg-tile px-3 py-2.5 text-left text-ink ${on ? "shadow-[inset_0_0_0_1.5px_var(--color-teal)]" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <Mark b={r} size={36} />
                    <span className="min-w-0">
                      <b className="block truncate text-body-sm">{r.name}</b>
                      <span className={`mt-0.5 inline-block rounded-pill px-2 py-px text-[10.5px] font-semibold ${tierChip[tier]}`}>{tierLabel[tier]}</span>
                    </span>
                  </span>
                  <span className={`grid h-[30px] w-[42px] place-items-center rounded-[10px] text-body-sm font-bold ${scoreChip(r.score)}`}>{r.score}</span>
                  <span className="min-w-0">
                    <b className="text-[12.5px]">{rate}%</b>
                    <span className="text-[11.5px] text-hint"> · {r.funded}/{r.sent}</span>
                    <ProgressBar className="mt-1" value={Math.min(100, rate * 2.5)} height={5} track="line" delay={0.1 + i * 0.05} />
                  </span>
                  <b className="text-[12.5px]">{r.complete}%</b>
                  <span className={`justify-self-start text-[12.5px] font-bold ${r.flags ? "text-coral-text" : "text-teal-deep"}`}>{r.flags}</span>
                  <b className="font-heading text-[13.5px] tabular-nums tracking-[-0.03em]">{r.vol}</b>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* The detail sets the row's height; the list scrolls to match it. */}
      <aside
        aria-labelledby="h-prof"
        aria-live="polite"
        className="box-border flex min-w-0 max-w-full flex-[1_1_330px] flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)]"
      >
        <div className="flex items-center gap-3">
          <Mark b={b} size={46} />
          <span className="min-w-0">
            <h2 id="h-prof" className="m-0 font-heading text-[19px] leading-[1.15] font-semibold">{b.name}</h2>
            <span className="block truncate text-[11.5px] text-hint">{b.contact}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            [p.tiles.score, String(b.score)],
            [p.tiles.late, b.late],
            [p.tiles.reply, b.reply],
          ].map(([k, v]) => (
            <span key={k} className="rounded-tile bg-card p-2.5">
              <span className="block text-[10.5px] text-hint">{k}</span>
              <b className="font-heading text-[18px] tabular-nums tracking-[-0.03em]">{v}</b>
            </span>
          ))}
        </div>
        <span className="text-cap font-semibold uppercase text-hint">{p.weeks}</span>
        <div key={b.id} role="img" aria-label={p.weeksLabel(b.name)} className="flex h-[60px] items-end gap-1 px-0.5">
          {b.weeks.map((w, i) => (
            <span
              key={i}
              className={`anim-grow-y flex-1 rounded-t-[6px] rounded-b-[3px] ${b.t === "r" ? "bg-red-bar" : "bg-mint"}`}
              style={{ height: `${Math.round((w / maxWeek) * 100)}%`, "--delay": `${(0.2 + i * 0.07).toFixed(2)}s` } as Delay}
            />
          ))}
        </div>
        <div className={`rounded-[16px] px-3.5 py-3 text-[12.5px] ${noteBox[b.t]}`}>{b.note}</div>
        <span className="text-cap font-semibold uppercase text-hint">{p.why}</span>
        <div key={`why-${b.id}`} className="flex flex-col gap-1.5">
          {b.why.map((w, i) => (
            <div key={w.reason} className="text-label">
              <div className="flex justify-between">
                <span>{w.reason}</span>
                <b>{w.count}</b>
              </div>
              <ProgressBar className="mt-1" value={Math.round((w.count / maxWhy) * 100)} height={5} track="line" color={w.fraud ? "red" : "amber"} delay={0.3 + i * 0.08} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-label">
          <span className="rounded-tile bg-card p-2.5">
            <span className="block text-hint">{p.commission}</span>
            <b>{b.points}</b>
          </span>
          <span className="rounded-tile bg-card p-2.5">
            <span className="block text-hint">{p.owed}</span>
            <b className="font-heading tabular-nums tracking-[-0.03em]">{b.owed}</b>
          </span>
          <span className="col-span-2 rounded-tile bg-card p-2.5">
            <span className="block text-hint">{p.rights}</span>
            <b>{b.rights}</b>
          </span>
        </div>
        <div className="mt-auto flex gap-2">
          <Button className="h-[42px] flex-1 text-[12.5px]">{p.message}</Button>
          <button
            type="button"
            aria-pressed={isP}
            onClick={() => setPaused((x) => ({ ...x, [b.id]: !isP }))}
            className={`h-[42px] cursor-pointer rounded-pill border-0 px-4 text-[12.5px] font-semibold ${isP ? "bg-mint-bg text-teal-dark" : "bg-red-bg text-red-text"}`}
          >
            {isP ? p.resume : p.pause}
          </button>
        </div>
      </aside>
    </div>
  );
}
