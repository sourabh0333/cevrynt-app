"use client";

import { useState, type CSSProperties } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import {
  channelCard,
  dealsUsed as countDeals,
  included,
  invoices,
  meterChip,
  overage as overageFor,
  payment as paymentFor,
  planHeader,
  planSections,
  plans,
  spendLimitRange,
  usage as usageFor,
  usageByChannel as byChannel,
} from "@/lib/copy/plan";
import type { PlanData } from "@/lib/data/views/settings";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

/* The four live channels, darkest first, as on the design's stacked bar. */
const channelFill = ["bg-teal-ink", "bg-teal", "bg-teal-soft", "bg-mint"];
const stripes = "bg-[repeating-linear-gradient(135deg,var(--color-amber-light)_0_5px,var(--color-amber-stripe)_5px_10px)]";
const pct = (a: number, b: number) => Math.round((a / b) * 100);
const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function Meter({ label, chip, value, unit, bar, hint, i }: { label: string; chip: string; value: string | number; unit: string; bar: number; hint: string; i: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-tile-lg bg-tile p-4">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-label text-muted">{label}</span>
        <span className="text-label-sm font-bold text-teal">{chip}</span>
      </span>
      <b className="font-heading text-[22px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
        {value}
        <span className="font-sans text-label font-medium text-hint">{unit}</span>
      </b>
      <ProgressBar value={bar} height={8} track="line" delay={0.2 + i * 0.08} aria-label={`${label}: ${chip}`} />
      <span className="text-[11.5px] text-hint">{hint}</span>
    </div>
  );
}

/**
 * Settings → Plan & usage from design/Settings-Plan.html and its prototype.
 * The spend limit slider grows the striped "extra deals" part of the usage
 * bar; Monthly / Yearly lowers the plan prices by the yearly discount. The
 * plan, Intake's monthly channel counts and the team's seats come from the
 * data layer; the cost per deal is worked out from them, as Reports does.
 * No hover.
 */
export function PlanView({ data }: { data: PlanData }) {
  const { plan } = data;
  const dealsUsed = countDeals(data.month);
  const usageByChannel = byChannel(data.month);
  const usage = usageFor(plan, dealsUsed, data.seats, data.now);
  const ph = planHeader(plan, dealsUsed);
  const ov = overageFor(plan);
  const payment = paymentFor(plan);
  const [warn, setWarn] = useState(plan.warn.on);
  const [yearly, setYearly] = useState(false);
  const [cap, setCap] = useState(plan.spendLimit);
  const price = (n: number) => usd(yearly ? n * (1 - plan.yearlyDiscount) : n);
  const left = plan.current.deals - dealsUsed;
  const extraDeals = Math.round(cap / plan.extraDeal);
  const maxDay = Math.max(...usage.perDay.days);
  const u = ov.used(dealsUsed, left);

  return (
    <>
      <section
        aria-labelledby="h-plan"
        className="box-border flex flex-wrap items-center justify-between gap-4 rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink"
      >
        <div className="flex flex-col gap-1.5">
          <span className="self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-semibold text-teal-deep">{ph.chip}</span>
          <h2 id="h-plan" className="m-0 font-heading text-[24px] font-semibold">{ph.price}</h2>
          <span className="text-[12.5px] text-grey-text">{ph.text}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
            {ph.compare}
          </button>
          <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-teal px-4 text-[12.5px] font-semibold text-white">
            {ph.talk}
          </button>
        </div>
      </section>

      <section aria-labelledby="h-use" className="@container box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-use" className="m-0 font-heading text-[19px] font-semibold">{usage.title}</h2>
            <span className="text-label text-hint">{usage.subtitle}</span>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-label">
            <input type="checkbox" checked={warn} onChange={() => setWarn((w) => !w)} className="m-0 h-[18px] w-[18px] cursor-pointer accent-teal" />
            {usage.warn}
          </label>
        </div>
        {/* Four meters: 4 across, 2 + 2 when narrower, never 3 + 1. */}
        <div className="grid grid-cols-4 gap-2 @max-[820px]:grid-cols-2 @max-[420px]:grid-cols-1">
          <Meter i={0} label={usage.deals.label} chip={meterChip(usage.deals.used, usage.deals.of)} value={usage.deals.used} unit={` of ${usage.deals.of}`} bar={pct(usage.deals.used, usage.deals.of)} hint={usage.deals.hint} />
          <div className="flex min-w-0 flex-col gap-2 rounded-tile-lg bg-mint-card p-4 shadow-[inset_0_0_0_1px_var(--color-mint-border)]">
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-label text-grey-text">{usage.pages.label}</span>
              <span className="text-label-sm font-bold text-teal-deep">{usage.pages.chip}</span>
            </span>
            <b className="font-heading text-[22px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
              {usage.pages.value}
              <span className="font-sans text-label font-medium text-muted">{usage.pages.unit}</span>
            </b>
            <span className="text-[11.5px] text-grey-text">{usage.pages.text}</span>
            <span className="text-[11.5px] text-teal-deep">{usage.pages.hint}</span>
          </div>
          <Meter i={2} label={usage.seats.label} chip={meterChip(usage.seats.used, usage.seats.of)} value={usage.seats.used} unit={` of ${usage.seats.of}`} bar={pct(usage.seats.used, usage.seats.of)} hint={usage.seats.hint} />
          <Meter i={3} label={usage.link.label} chip={usage.link.chip} value={usage.link.value} unit={usage.link.unit} bar={usage.link.bar} hint={usage.link.hint} />
        </div>
        <div className="flex flex-wrap items-stretch gap-[18px] rounded-tile-lg bg-tile p-4">
          <div className="flex flex-[1_1_180px] flex-col justify-center gap-1">
            <span className="text-label text-muted">{usage.perDay.label}</span>
            <b className="font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{usage.perDay.avg}</b>
            <span className="text-[11.5px] text-hint">{usage.perDay.hint}</span>
          </div>
          <div role="img" aria-label={usage.perDay.aria} className="flex h-[90px] min-w-0 flex-[3_1_360px] items-end gap-1.5">
            {usage.perDay.days.map((n, i) => (
              <span key={i} className="flex h-full flex-1 flex-col justify-end">
                <span
                  className={`anim-grow-y block rounded-t-[6px] rounded-b-[2px] ${i === usage.perDay.days.length - 1 ? "bg-teal" : "bg-mint"}`}
                  style={{ height: `${pct(n, maxDay)}%`, ...d(0.2 + i * 0.05) }}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="h-inc" className="@container box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-inc" className="m-0 font-heading text-[19px] font-semibold">{included.title}</h2>
            <span className="text-label text-grey-text">{included.text}</span>
          </div>
          <span className="rounded-pill bg-tile px-[11px] py-[5px] text-[11.5px] font-bold text-teal-deep">{included.chip(plan, dealsUsed)}</span>
        </div>
        {/* Five tiles in one row; stacked when narrow so there is never a ragged 3 + 2. */}
        <ul className="m-0 grid list-none grid-cols-5 gap-2 p-0 @max-[700px]:grid-cols-1">
          {included.items.map((it) => (
            <li key={it.title} className="flex min-w-0 flex-col gap-1.5 rounded-[18px] bg-tile p-3.5">
              <span aria-hidden="true" className="grid h-[26px] w-[26px] place-items-center rounded-full bg-teal text-label font-bold text-white">
                ✓
              </span>
              <b className="text-body-sm">{it.title}</b>
              <span className="text-[11.5px] text-hint">{it.hint}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label={planSections.overage}
        className="@container box-border grid min-w-0 grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 text-ink @max-[640px]:grid-cols-1"
      >
        <div className="flex min-w-0 flex-col gap-3.5 rounded-card bg-card p-[18px]">
          <div className="flex items-start justify-between gap-2.5">
            <div>
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{ov.title}</h2>
              <span className="text-label text-hint">{ov.text}</span>
            </div>
            <span className="text-right">
              <b className="block font-heading text-[22px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{ov.price}</b>
              <span className="text-[11.5px] text-hint">{ov.priceNote}</span>
            </span>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[18px] bg-tile p-3.5">
            <div
              role="img"
              aria-label={ov.barLabel(dealsUsed, left, cap)}
              className="anim-grow-x flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]"
              style={d(0.3)}
            >
              <span className="bg-teal" style={{ flexGrow: dealsUsed }} />
              <span className="bg-mint-soft" style={{ flexGrow: left }} />
              {cap ? <span className={`${stripes} transition-[flex-grow] duration-250 motion-reduce:transition-none`} style={{ flexGrow: extraDeals }} /> : null}
            </div>
            <div className="flex flex-wrap justify-between gap-x-2 text-label-sm text-hint">
              <span>
                <b className="text-teal-deep">{u.used}</b>
                {u.left}
              </span>
              <span>{ov.extra(cap)}</span>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-2 text-[12.5px]">
              <label htmlFor="cap">{ov.capLabel}</label>
              <b className="font-heading text-[16px] tabular-nums tracking-[-0.03em]">{ov.capText(cap)}</b>
            </div>
            <input
              id="cap"
              type="range"
              min={spendLimitRange.min}
              max={spendLimitRange.max}
              step={spendLimitRange.step}
              value={cap}
              aria-valuetext={ov.capText(cap)}
              onChange={(e) => setCap(Number(e.target.value))}
              className="w-full cursor-pointer accent-teal"
            />
            <span className="text-[11.5px] text-hint" aria-live="polite">
              {ov.note(cap)}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3.5 p-[18px]">
          <div className="flex items-start justify-between gap-2.5">
            <div>
              <h2 className="m-0 font-heading text-card-title-sm font-semibold">{channelCard.title(dealsUsed)}</h2>
              <span className="text-label text-hint">{channelCard.text}</span>
            </div>
            <b className="font-heading text-[22px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{dealsUsed}</b>
          </div>
          <div
            role="img"
            aria-label={usageByChannel.map((c) => `${c.channel} ${c.deals}`).join(", ")}
            className="anim-grow-x flex h-3.5 gap-0.5 overflow-hidden rounded-[7px]"
            style={d(0.3)}
          >
            {usageByChannel.map((c, i) => (
              <span key={c.channel} className={channelFill[i]} style={{ flexGrow: c.deals }} />
            ))}
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-1.5 p-0 @max-[420px]:grid-cols-1">
            {usageByChannel.map((c, i) => (
              <li key={c.channel} className="grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-2 rounded-[12px] bg-card px-2.5 py-2 text-[12.5px]">
                <span className={`h-2.5 w-2.5 rounded-[3px] ${channelFill[i]}`} />
                <span className="truncate">{c.channel}</span>
                <b className="font-heading tabular-nums tracking-[-0.03em]">{c.deals}</b>
              </li>
            ))}
          </ul>
          <span className="mt-auto text-[11.5px] text-hint">{channelCard.note}</span>
        </div>
      </section>

      <section aria-labelledby="h-plans" className="@container box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-plans" className="m-0 font-heading text-[19px] font-semibold">{plans.title}</h2>
            <span className="text-label text-hint">{plans.text}</span>
          </div>
          <SegmentedSwitch label={plans.periodLabel} track="grey" value={yearly ? "yearly" : "monthly"} onChange={(v) => setYearly(v === "yearly")} options={plans.period} />
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-[26px] bg-card p-2 @max-[700px]:grid-cols-1">
          {plans.tiers(plan).map((t) => (
            <div
              key={t.name}
              className={`flex min-w-0 flex-col gap-2.5 rounded-[22px] bg-tile p-[18px] ${t.current ? "shadow-[inset_0_0_0_2px_var(--color-teal)]" : ""}`}
            >
              <span className="flex items-center justify-between">
                <b className="font-heading text-card-title-sm">{t.name}</b>
                {t.current ? <span className="rounded-pill bg-teal px-2 py-0.5 text-[10.5px] font-bold text-white">{plans.current}</span> : null}
              </span>
              <b className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]" aria-live="polite">
                {price(t.monthly)}
                <span className="font-sans text-label font-medium text-hint">{plans.perMonth}</span>
              </b>
              <span className="text-label text-muted">{t.deals}</span>
              <ul className="m-0 flex list-none flex-col gap-1.5 border-t border-line p-0 pt-2">
                {plans.features.map((f, i) => (
                  <li key={f} className="flex items-center gap-2 text-label">
                    <span aria-hidden="true" className={`grid h-4 w-4 flex-none place-items-center rounded-full text-[9px] font-bold text-white ${t.features[i] ? "bg-teal" : "bg-line-strong"}`}>
                      {t.features[i] ? "✓" : ""}
                    </span>
                    <span className={t.features[i] ? "text-ink" : "text-grey-dot"}>
                      {f}
                      {t.features[i] ? null : <span className="sr-only">{plans.notIncluded}</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid">
                {t.current ? (
                  <span className="grid h-[38px] place-items-center rounded-pill bg-mint-bg text-[12.5px] font-semibold text-teal-dark">{plans.yourPlan}</span>
                ) : (
                  <button
                    type="button"
                    className={`h-[38px] cursor-pointer rounded-pill border-0 text-[12.5px] font-semibold ${t.primary ? "bg-teal text-white" : "bg-card text-ink"}`}
                  >
                    {t.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label={planSections.billing} className="@container box-border grid min-w-0 grid-cols-3 gap-1 rounded-card-lg border border-line bg-tile p-2 text-ink @max-[700px]:grid-cols-1">
        <div className="col-span-2 flex min-w-0 flex-col gap-2 p-4 @max-[700px]:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="m-0 font-heading text-card-title-sm font-semibold">{invoices.title}</h2>
            <span className="text-label font-semibold text-teal">{invoices.all}</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[18px] bg-card p-2">
            {invoices.rows(plan).map((r) => (
              <div key={r.month} className="grid grid-cols-[minmax(0,1fr)_100px_80px_60px] items-center gap-2.5 rounded-tile bg-tile px-3 py-2.5 text-[12.5px] @max-[420px]:grid-cols-[minmax(0,1fr)_72px_56px_40px]">
                <span className="truncate">{r.month}</span>
                <b className="font-heading tabular-nums tracking-[-0.03em]">{r.amount}</b>
                <span className="justify-self-start rounded-pill bg-mint-bg px-2 py-0.5 text-[10.5px] font-bold text-teal-dark">{r.status}</span>
                <span className="justify-self-end text-label font-semibold text-teal">{invoices.pdf}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2.5 border-l border-line p-4 @max-[700px]:border-l-0">
          <h2 className="m-0 font-heading text-card-title-sm font-semibold">{payment.title}</h2>
          <div className="flex flex-col gap-3.5 rounded-[18px] bg-[linear-gradient(140deg,var(--color-teal),var(--color-teal-mid))] p-4 text-white">
            <span aria-hidden="true" className="h-[22px] w-[30px] rounded-[5px] bg-[linear-gradient(135deg,var(--color-sand),var(--color-amber-soft))]" />
            <span className="font-mono text-body tracking-[0.1em]">{payment.card}</span>
            <span className="text-[11.5px] text-mint-soft">{payment.cardNote}</span>
          </div>
          <span className="text-[11.5px] text-hint">{payment.billingEmail}</span>
          <button type="button" className="mt-auto h-9 cursor-pointer rounded-pill border-0 bg-card text-label font-semibold text-ink">
            {payment.update}
          </button>
        </div>
      </section>
    </>
  );
}
