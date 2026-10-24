"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Switch } from "@/components/ui/Switch";
import {
  approval,
  neverOffer,
  offered,
  reachOut,
  readyPanel as rp,
  renewalRulesHeader as hd,
  renewalRulesSections,
  whoIsReady as wr,
} from "@/lib/copy/renewal-rules";
import type { RenewalRulesData } from "@/lib/data/views/renewals";
import { autoApproveCount, isReady, notReadyReason, readiness, renewalRuleRanges, type RenewalRules } from "@/lib/renewal-rules";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const h2 = "m-0 font-heading text-[19px] font-semibold";

/**
 * Settings → Renewal rules from design/Settings-Renewals.html and its
 * prototype. The four sliders and the stacking switch feed the shared
 * readiness check (lib/renewal-rules.ts): the funnel, the ready count, the
 * merchant list and the change vs the saved rules all update live. The
 * merchants are every live advance, the same ones Merchants and Renewals
 * count, so the saved rules give the Renewals page's ready count. No
 * hover. The saved settings and the renewal price terms from Pricing come
 * from the data layer (props); edits stay local until saving exists.
 */
export function RenewalRulesView({ data }: { data: RenewalRulesData }) {
  const { settings } = data;
  const offerTiles = offered.tiles(data.terms, settings.terms);
  const outreachSteps = reachOut.steps(settings.outreach);
  const line = settings.rules.paid;
  const [rules, setRules] = useState<RenewalRules>(settings.rules);
  const [auto, setAuto] = useState(settings.autoApprove.on);
  const [cap, setCap] = useState(settings.autoApprove.upTo / 1000);
  const [steps, setSteps] = useState<boolean[]>(() => settings.outreach.map((s) => s.on));

  const { pool, ready, funnel, diff } = readiness(data.merchants, rules, settings.rules);
  const list = pool.slice(0, rp.listSize);
  const change = diff === 0 ? rp.change.same : diff > 0 ? rp.change.more(diff) : rp.change.fewer(Math.abs(diff));
  const changeBox = diff === 0 ? "bg-card text-grey-text" : diff > 0 ? "bg-amber-tint text-amber-mute" : "bg-blue-bg text-blue-text";

  return (
    <>
      <section
        aria-labelledby="h-rr"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="h-rr" className="m-0 font-heading text-[24px] font-semibold">{hd.title}</h2>
          <span className="text-[12.5px] text-grey-text">{hd.text}</span>
        </div>
        <Link href={hd.open.href} className="inline-flex h-[42px] items-center rounded-pill bg-tile px-4 text-[12.5px] font-semibold text-ink no-underline">
          {hd.open.label}
        </Link>
      </section>

      {/* Rules beside the live result: equal heights, the funnel takes the spare room. */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-el" className="box-border flex min-w-0 flex-[999_1_420px] flex-col gap-2.5 rounded-card-lg bg-card p-5 text-ink">
          <div>
            <h2 id="h-el" className={h2}>{wr.title}</h2>
            <span className="text-label text-hint">{wr.subtitle}</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2">
            {wr.sliders.map((s) => {
              const range = renewalRuleRanges[s.key];
              const txt = wr.text[s.key](rules[s.key]);
              return (
                <div key={s.key} className="flex flex-col gap-1.5 rounded-[18px] bg-tile p-3.5">
                  <div className="flex items-baseline justify-between gap-2 text-[12.5px]">
                    <label htmlFor={`r-${s.key}`}>{s.label}</label>
                    <b className="font-heading text-[16px] tabular-nums tracking-[-0.03em]">{txt}</b>
                  </div>
                  <input
                    id={`r-${s.key}`}
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={rules[s.key]}
                    aria-valuetext={txt}
                    onChange={(e) => setRules((r) => ({ ...r, [s.key]: Number(e.target.value) }))}
                    className="w-full cursor-pointer accent-teal"
                  />
                </div>
              );
            })}
          </div>
          <label className="flex cursor-pointer items-center justify-between gap-2.5 rounded-[16px] bg-tile px-3.5 py-3 text-[12.5px]">
            <span className="min-w-0">
              <b className="block">{wr.noStack.title}</b>
              <span className="text-[11.5px] text-hint">{wr.noStack.hint}</span>
            </span>
            <input
              type="checkbox"
              checked={rules.noStack}
              onChange={() => setRules((r) => ({ ...r, noStack: !r.noStack }))}
              className="m-0 h-5 w-5 flex-none cursor-pointer accent-teal"
            />
          </label>

          <div className="flex min-h-0 flex-auto flex-col gap-2.5 rounded-tile-lg bg-tile p-4">
            <div className="flex items-baseline justify-between gap-2">
              <b className="text-[13.5px]">{wr.funnelTitle}</b>
              <span className="text-[11.5px] text-hint">{wr.funnelHint}</span>
            </div>
            <div className="flex flex-auto flex-col justify-between gap-1.5" aria-live="polite">
              {funnel.map((f, i) => {
                const last = i === funnel.length - 1;
                return (
                  <div key={i} className="grid grid-cols-[minmax(0,150px)_minmax(0,1fr)_54px] items-center gap-3">
                    <span className="truncate text-label text-grey-text">{f.label}</span>
                    <span className="relative h-[26px] overflow-hidden rounded-[8px] bg-card">
                      <span
                        className={`anim-grow-x absolute inset-y-0 left-0 box-border flex min-w-[30px] items-center rounded-[8px] pl-2.5 transition-[width] duration-250 motion-reduce:transition-none ${last ? "bg-teal" : "bg-[linear-gradient(90deg,var(--color-teal-soft),var(--color-mint))]"}`}
                        style={{ width: `${Math.max(8, Math.round((f.count / pool.length) * 100))}%`, ...d(0.2 + i * 0.08) }}
                      >
                        <b className="font-heading text-label tabular-nums text-white">{f.count}</b>
                      </span>
                    </span>
                    <span
                      className={`justify-self-end rounded-pill px-2 py-[3px] text-label-sm font-bold ${f.drop ? "bg-red-bg text-red-text" : i ? "bg-card text-hint-soft" : ""}`}
                    >
                      {f.drop ? `−${f.drop}` : i ? "0" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside
          aria-labelledby="h-who"
          aria-live="polite"
          className="box-border flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)]"
        >
          <div className="flex items-baseline justify-between">
            <h2 id="h-who" className="m-0 font-heading text-card-title font-semibold">{rp.title}</h2>
            <b className="font-heading text-[28px] font-semibold tabular-nums tracking-[-0.03em] text-teal-deep">{ready.length}</b>
          </div>
          <div role="img" aria-label={rp.of(ready.length, pool.length)} className="anim-grow-x flex h-2.5 gap-0.5 overflow-hidden rounded-[5px]" style={d(0.3)}>
            <span className="bg-teal transition-[flex-grow] duration-250" style={{ flexGrow: ready.length }} />
            <span className="bg-line-strong transition-[flex-grow] duration-250" style={{ flexGrow: pool.length - ready.length }} />
          </div>
          <span className="text-[11.5px] text-hint">{rp.of(ready.length, pool.length)}</span>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {list.map((m) => {
              const ok = isReady(m, rules);
              return (
                <li key={m.name} className={`flex items-center justify-between gap-2 rounded-[12px] px-2.5 py-2 text-[12.5px] ${ok ? "bg-mint-light" : "bg-card"}`}>
                  <span className="min-w-0 truncate">{m.name}</span>
                  <span className={`whitespace-nowrap rounded-pill px-2 py-0.5 text-[10.5px] font-bold ${ok ? "bg-teal text-white" : "bg-tile text-hint"}`}>
                    {ok ? rp.ready : notReadyReason(m, rules)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className={`mt-auto rounded-tile px-3 py-2.5 text-label ${changeBox}`}>{change}</div>
        </aside>
      </div>

      <div className="@container flex flex-col gap-3.5">
        <section aria-labelledby="h-def" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
          <div className="flex flex-wrap items-end justify-between gap-2.5">
            <div>
              <h2 id="h-def" className={h2}>{offered.title}</h2>
              <span className="text-label text-hint">{offered.subtitle}</span>
            </div>
            <Link href={offered.link.href} className="text-label font-semibold text-teal no-underline">
              {offered.link.label}
            </Link>
          </div>
          {/* Six tiles as 6, 3 + 3 or 2 + 2 + 2, never a ragged row. */}
          <div className="grid grid-cols-6 gap-2 @max-[1000px]:grid-cols-3 @max-[480px]:grid-cols-2">
            {offerTiles.map((t) => (
              <div key={t.label} className={`flex min-w-0 flex-col gap-1 rounded-tile-lg p-4 ${t.hero ? "bg-teal text-white" : "bg-tile"}`}>
                <span className={`text-[11.5px] ${t.hero ? "text-mint-soft" : "text-hint"}`}>{t.label}</span>
                <b className="font-heading text-[22px] leading-[1.15] font-semibold tabular-nums tracking-[-0.03em]">{t.value}</b>
                <span className={`text-[11.5px] ${t.hero ? "text-mint-soft" : "text-hint"}`}>{t.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          aria-label={renewalRulesSections.approval}
          className="box-border grid min-w-0 grid-cols-3 gap-1 rounded-card-lg border border-line bg-tile p-2 text-ink @max-[760px]:grid-cols-1"
        >
          <div className="flex min-w-0 flex-col gap-2.5 rounded-card bg-mint-card p-4">
            <div className="flex items-start justify-between gap-2.5">
              <div>
                <h2 className="m-0 font-heading text-card-title-sm font-semibold">{approval.auto.title}</h2>
                <span className="text-label text-grey-text">{approval.auto.text}</span>
              </div>
              <input
                type="checkbox"
                aria-label={approval.auto.aria}
                checked={auto}
                onChange={() => setAuto((a) => !a)}
                className="m-0 h-[22px] w-[22px] flex-none cursor-pointer accent-teal"
              />
            </div>
            <div className={`flex flex-col gap-1 rounded-[16px] bg-tile p-3 ${auto ? "" : "pointer-events-none opacity-45"}`}>
              <span className="flex justify-between text-[12.5px]">
                <label htmlFor="r-cap">{approval.auto.capLabel}</label>
                <b className="font-heading text-[16px] tabular-nums tracking-[-0.03em]">{approval.auto.capValue(cap)}</b>
              </span>
              <input
                id="r-cap"
                type="range"
                min={approval.auto.cap.min}
                max={approval.auto.cap.max}
                step={approval.auto.cap.step}
                value={cap}
                disabled={!auto}
                aria-valuetext={approval.auto.capValue(cap)}
                onChange={(e) => setCap(Number(e.target.value))}
                className="w-full cursor-pointer accent-teal"
              />
              <span className="text-[11.5px] text-hint">{approval.auto.capHint}</span>
            </div>
            <span className="text-label font-semibold text-teal-deep" aria-live="polite">
              {auto ? approval.auto.note(autoApproveCount(ready.length, cap), ready.length) : approval.auto.off}
            </span>
          </div>

          <div className="flex min-w-0 flex-col gap-2.5 border-l border-line p-4 @max-[760px]:border-l-0">
            <div>
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{approval.checks.title}</h2>
              <span className="text-label text-hint">{approval.checks.text}</span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {approval.checks.items.map((c) => (
                <li key={c.title} className="flex items-start gap-2.5 text-[12.5px]">
                  <span aria-hidden="true" className="grid h-5 w-5 flex-none place-items-center rounded-full bg-teal text-label-sm font-bold text-white">
                    ✓
                  </span>
                  <span>
                    <b className="block">{c.title}</b>
                    <span className="text-[11.5px] text-hint">{c.hint}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-1 border-l border-line p-4 @max-[760px]:border-l-0">
            <div className="mb-1.5">
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{approval.limits.title}</h2>
              <span className="text-label text-hint">{approval.limits.text}</span>
            </div>
            {approval.limits.rows(settings.limits).map((l) => (
              <span key={l.label} className="flex justify-between gap-2 border-b border-line py-[9px] text-[12.5px]">
                <span>{l.label}</span>
                <b className="text-right">{l.value}</b>
              </span>
            ))}
          </div>
        </section>

        <section aria-labelledby="h-out" className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg border border-line bg-tile p-5 text-ink">
          <div className="flex flex-wrap items-end justify-between gap-2.5">
            <div>
              <h2 id="h-out" className={h2}>{reachOut.title}</h2>
              <span className="text-label text-hint">{reachOut.subtitle}</span>
            </div>
            <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
              {reachOut.add}
            </button>
          </div>
          <div className="px-3.5 pt-[30px] pb-2">
            <div
              role="img"
              aria-label={reachOut.trackLabel(settings.outreach)}
              className="relative h-2.5 rounded-[5px]"
              style={{ background: `linear-gradient(90deg, var(--color-line-strong) 0%, var(--color-line-strong) ${line}%, var(--color-mint) ${line}%, var(--color-teal) 100%)` }}
            >
              {outreachSteps.map((s, i) => (
                <span key={s.at}>
                  {/* Outer span places the marker; the inner one pops in, so the transforms never clash. */}
                  <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.at}%` }}>
                    <span
                      className={`anim-pop block box-border h-[18px] w-[18px] rounded-full border-4 bg-tile ${steps[i] ? "border-teal" : "border-line-dashed"}`}
                      style={d(0.2 + i * 0.12)}
                    />
                  </span>
                  <span
                    className={`absolute -top-[22px] -translate-x-1/2 font-heading text-label font-bold tabular-nums ${steps[i] ? "text-teal-deep" : "text-hint"}`}
                    style={{ left: `${s.at}%` }}
                  >
                    {s.at}%
                  </span>
                </span>
              ))}
            </div>
            <div className="mt-2.5 flex justify-between text-label-sm text-hint">
              <span>{reachOut.ends.start}</span>
              <span className="font-semibold text-teal-deep">{reachOut.ends.line(line)}</span>
              <span>{reachOut.ends.end}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 rounded-[22px] bg-card p-2.5 @max-[760px]:grid-cols-2 @max-[400px]:grid-cols-1">
            {outreachSteps.map((s, i) => (
              <div key={s.at} className={`flex min-w-0 flex-col gap-2 rounded-[18px] bg-tile p-3.5 ${steps[i] ? "" : "text-hint"}`}>
                <span className="flex items-center justify-between">
                  <b className={`font-heading text-card-title tabular-nums tracking-[-0.03em] ${steps[i] ? "text-teal-deep" : ""}`}>{s.at}%</b>
                  <Switch size="sm" checked={steps[i]} onChange={(v) => setSteps((x) => x.map((y, j) => (j === i ? v : y)))} label={reachOut.switchLabel(s.at, s.title)} />
                </span>
                <b className="text-body-sm leading-[1.3]">{s.title}</b>
                <span className="mt-auto flex flex-wrap gap-1.5">
                  <span className="rounded-pill bg-mint-light px-2 py-0.5 text-[10.5px] font-bold text-teal-dark">{s.who}</span>
                  <span className="rounded-pill bg-card px-2 py-0.5 text-[10.5px] text-muted">{s.via}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="h-stop" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-red-bg p-5 text-ink">
          <div>
            <h2 id="h-stop" className={h2}>{neverOffer.title}</h2>
            <span className="text-label text-red-deep">{neverOffer.subtitle}</span>
          </div>
          <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 @max-[640px]:grid-cols-1">
            {neverOffer.items.map((n) => (
              <li key={n.title} className="flex items-start gap-3 rounded-[18px] bg-white/85 p-3.5">
                <span aria-hidden="true" className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[10px] bg-red text-body font-bold text-white">
                  ×
                </span>
                <span className="text-[12.5px]">
                  <b className="block">{n.title}</b>
                  <span className="text-red-deep">{n.hint}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
