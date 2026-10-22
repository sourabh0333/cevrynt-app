"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { PageActions } from "@/components/shell/PageActions";
import {
  comingFeatures,
  comingHeader as ch,
  comingHero as hero,
  ideaBox,
  laneCount,
  lanes,
  roadmap as rm,
  shipped,
  spotlight as sp,
  type Lane,
} from "@/lib/sample-data/coming";

type RingVars = CSSProperties & { "--p"?: string; "--lane"?: string; "--delay"?: string };

const laneColor: Record<Lane, string> = { now: "var(--color-teal)", next: "var(--color-blue)", later: "var(--color-grey-dot)" };
const laneOn: Record<Lane, string> = { now: "bg-teal", next: "bg-blue", later: "bg-grey-dot" };
const laneBorder: Record<Lane, string> = { now: "border-teal", next: "border-blue", later: "border-grey-dot" };
const laneChip: Record<Lane, string> = { now: "bg-mint-bg text-teal-dark", next: "bg-blue-bg text-blue-text", later: "bg-page text-grey-text" };

const duo = "grid grid-cols-2 gap-1 @max-[760px]:grid-cols-1";

/**
 * What's coming from design/Coming.html and its prototype. The counters,
 * stage counts and "10 features in total" are counted from the feature list
 * (the sidebar's "10 new" reads it too). Switching stage selects that
 * stage's first feature; Vote adds one vote, Join early access toggles the
 * feature onto the list. Progress rings sweep in. No hover.
 */
export function ComingView() {
  const [stage, setStage] = useState<Lane>(rm.start.stage);
  const [sel, setSel] = useState(rm.start.feature);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [joined, setJoined] = useState<Record<string, boolean>>(() => Object.fromEntries(rm.joined.map((id) => [id, true])));

  const votes = (id: string, base: number) => base + (voted[id] ? 1 : 0);
  const items = comingFeatures.filter((f) => f.lane === stage);
  const totalVotes = comingFeatures.reduce((s, f) => s + votes(f.id, f.votes), 0);
  const f = comingFeatures.find((x) => x.id === sel) ?? comingFeatures[0];
  const lane = lanes.find((l) => l.key === f.lane)!;
  const isV = !!voted[f.id];
  const isJ = !!joined[f.id];

  const pickStage = (k: Lane) => {
    setStage(k);
    const first = comingFeatures.find((x) => x.lane === k);
    if (first) setSel(first.id);
  };

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{ch.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{ch.line}</span>
        </div>
        <PageActions />
      </header>

      <div className="@container flex flex-col gap-3.5">
        <section aria-labelledby="h-road" className={`${duo} box-border min-w-0 rounded-card-lg border border-line bg-tile p-2 text-ink`}>
          <div className="flex min-w-0 flex-col justify-center gap-2.5 rounded-card bg-mint-card p-[22px]">
            <span className="self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-semibold text-teal-deep">{hero.chip}</span>
            <h2 id="h-road" className="m-0 font-heading text-[26px] leading-[1.15] font-semibold">{hero.title}</h2>
            <span className="text-body-sm text-grey-text">{hero.text}</span>
          </div>
          <div className="grid content-center grid-cols-3 gap-2 p-3.5">
            {lanes.map((l, i) => (
              <span key={l.key} className={`min-w-0 rounded-[18px] p-4 ${i === 0 ? "bg-teal text-white" : "bg-card"}`}>
                <b className="block font-heading text-[28px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{laneCount(l.key)}</b>
                <span className={`text-label ${i === 0 ? "text-mint-soft" : "text-muted"}`}>{l.title}</span>
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="h-lanes" className={`${duo} box-border min-w-0 items-stretch rounded-card-lg border border-line bg-tile p-2 text-ink`}>
          <div className="flex min-w-0 flex-col gap-3.5 rounded-card bg-card p-[18px]">
            <div>
              <h2 id="h-lanes" className="m-0 font-heading text-[19px] font-semibold">{rm.title}</h2>
              <span className="text-label text-hint">{lanes.find((l) => l.key === stage)!.when}</span>
            </div>
            <div role="group" aria-label={rm.stageLabel} className="grid grid-cols-3 gap-1 rounded-[16px] bg-tile p-1">
              {lanes.map((l) => {
                const on = l.key === stage;
                return (
                  <button
                    key={l.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickStage(l.key)}
                    className={`inline-flex h-[38px] min-w-0 cursor-pointer items-center justify-center gap-[7px] rounded-[12px] border-0 px-1.5 text-[12.5px] font-semibold ${on ? `${laneOn[l.key]} text-white` : "bg-transparent text-grey-text"}`}
                  >
                    <span className={`h-[7px] w-[7px] flex-none rounded-full ${on ? "bg-white" : laneOn[l.key]}`} />
                    <span className="truncate">{l.title}</span>
                    <span className={`rounded-pill px-[7px] py-px text-[10.5px] ${on ? "bg-white/22" : "bg-card"}`}>{laneCount(l.key)}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {items.map((it, i) => {
                const on = it.id === sel;
                const ring: RingVars = { "--p": `${it.prog}%`, "--lane": laneColor[it.lane], "--delay": `${0.2 + i * 0.1}s` };
                return (
                  <button
                    key={it.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSel(it.id)}
                    className={`box-border flex w-full cursor-pointer items-center gap-3 rounded-[18px] border-2 bg-tile px-3.5 py-3 text-left text-ink ${on ? `${laneBorder[it.lane]} shadow-[0_12px_26px_-20px_rgba(15,21,19,.6)]` : "border-transparent"}`}
                  >
                    <span
                      role="img"
                      aria-label={`${it.prog}% built`}
                      className="anim-conic grid h-10 w-10 flex-none place-items-center rounded-full bg-[conic-gradient(var(--lane)_var(--p),var(--color-line)_0)]"
                      style={ring}
                    >
                      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-tile font-mono text-[10px] font-medium">
                        {it.prog}%
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className="block text-[13.5px]">{it.name}</b>
                      <span className="block truncate text-label text-hint">{it.short}</span>
                    </span>
                    <span className={`flex-none rounded-pill px-2.5 py-1 text-label-sm font-bold ${voted[it.id] ? "bg-teal text-white" : "bg-card text-grey-text"}`}>
                      ▲ {votes(it.id, it.votes)}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-strong pt-2.5 text-label text-muted">
              <span>{rm.total}</span>
              <span aria-live="polite">{rm.votes(totalVotes)}</span>
            </div>
          </div>

          <div aria-live="polite" className="flex min-w-0 flex-col gap-3 py-[18px] pr-[18px] pl-[22px] @max-[760px]:px-[18px]">
            <div className="flex items-center justify-between gap-2">
              <span className={`rounded-pill px-2.5 py-1 text-label-sm font-bold ${laneChip[f.lane]}`}>{lane.title}</span>
              <span className="text-[11.5px] text-hint">{f.eta}</span>
            </div>
            <h2 className="m-0 font-heading text-card-title-lg leading-[1.2] font-semibold">{f.name}</h2>
            <span className="text-body-sm text-grey-text">{f.long}</span>
            <div className="rounded-[16px] bg-card px-3.5 py-3 text-[12.5px]">
              <b className="mb-0.5 block">{sp.why}</b>
              <span className="text-muted">{f.why}</span>
            </div>
            <span className="text-cap font-semibold uppercase text-hint">{sp.can}</span>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {f.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[12.5px]">
                  <span aria-hidden="true" className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-mint-bg text-[10px] font-bold text-teal-dark">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={isV}
                onClick={() => setVoted((v) => ({ ...v, [f.id]: !isV }))}
                className={`h-[42px] cursor-pointer rounded-pill border-0 px-4 text-[12.5px] font-semibold ${isV ? "bg-mint-bg text-teal-dark" : "bg-card text-ink"}`}
              >
                {isV ? sp.voted(f.votes + 1) : sp.vote(f.votes)}
              </button>
              <button
                type="button"
                aria-pressed={isJ}
                onClick={() => setJoined((j) => ({ ...j, [f.id]: !isJ }))}
                className={`h-[42px] flex-1 cursor-pointer whitespace-nowrap rounded-pill border-0 px-4 text-[12.5px] font-semibold ${isJ ? "bg-mint-bg text-teal-dark" : "bg-teal text-white"}`}
              >
                {isJ ? sp.joined : sp.join}
              </button>
            </div>
          </div>
        </section>

        <section aria-label="Recently shipped and ideas" className={`${duo} box-border min-w-0 rounded-card-lg border border-line bg-tile p-2 text-ink`}>
          <div className="flex min-w-0 flex-col gap-2.5 p-4">
            <div>
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{shipped.title}</h2>
              <span className="text-label text-hint">{shipped.text}</span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {shipped.items.map((s) => (
                <li key={s.name}>
                  <Link href={s.href} className="flex items-center justify-between gap-2.5 rounded-tile bg-card px-3 py-[11px] text-[12.5px] text-ink no-underline">
                    <span className="min-w-0">
                      <b>{s.name}</b>
                      <span className="text-[11.5px] text-hint"> · {s.hint}</span>
                    </span>
                    <span className="flex-none font-mono text-label-sm text-hint">{s.when}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex min-w-0 flex-col gap-2.5 rounded-card bg-cream p-4">
            <div>
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{ideaBox.title}</h2>
              <span className="text-label text-amber-mute">{ideaBox.text}</span>
            </div>
            <textarea
              aria-label={ideaBox.label}
              rows={3}
              placeholder={ideaBox.placeholder}
              className="box-border resize-y rounded-[16px] border-0 bg-tile px-3.5 py-3 text-body-sm text-ink outline-none placeholder:text-hint focus-visible:ring-2 focus-visible:ring-teal"
            />
            <button type="button" className="h-[38px] cursor-pointer self-start rounded-pill border-0 bg-teal px-4 text-[12.5px] font-semibold text-white">
              {ideaBox.send}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
