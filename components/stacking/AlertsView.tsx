"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  alertsList as t,
  alertTabs,
  autoStep,
  detail as dt,
  kindGlyph,
  seenLabel,
  severityLabel,
  stageLabel,
  stageLine,
  type AlertTab,
  type StageKey,
} from "@/lib/copy/stacking";
import type { AlertKind, AlertSeverity, IsoDateTime } from "@/lib/data/types";
import type { AlertRow } from "@/lib/data/views/stacking";

/*
 * Design .acols: severity, merchant, what happened, seen, deal. Instead of
 * the design's 680px minimum the columns flex and text truncates; "Seen"
 * hides below 1100px and the deal chip below 800px.
 */
const cols =
  "grid grid-cols-[84px_minmax(0,1.3fr)_minmax(0,1.4fr)_84px_100px] items-center gap-3 max-[1100px]:grid-cols-[84px_minmax(0,1.3fr)_minmax(0,1.4fr)_100px] max-[1100px]:[&>:nth-child(4)]:hidden max-[800px]:grid-cols-[84px_minmax(0,1.3fr)_minmax(0,1.4fr)] max-[800px]:[&>:nth-child(5)]:hidden";

const sevChip: Record<AlertSeverity, string> = { high: "bg-red-bg text-red-text", medium: "bg-amber-bg text-amber-text" };
const stageChip: Record<StageKey, string> = {
  review: "bg-blue-bg text-blue-text",
  fund: "bg-red-bg text-red-text",
  funded: "bg-mint-bg text-teal-dark",
  renew: "bg-amber-bg text-amber-text",
};
const kindIcon: Record<AlertKind, string> = {
  ucc: "bg-red-bg text-red-text",
  debit: "bg-red-bg text-red-text",
  bank: "bg-amber-bg text-amber-text",
  duplicate: "bg-purple-bg text-purple-text",
  inquiry: "bg-blue-bg text-blue-text",
};

const inTab = (a: AlertRow, tab: AlertTab, done: Record<string, boolean>) =>
  tab === "all" ? !done[a.id] : tab === "done" ? !!done[a.id] : !done[a.id] && a.severity === tab;

/**
 * "Alerts" and the alert detail from design/Stacking.html and its
 * prototype. The list filters by All / High / Medium / Reviewed with live
 * counts; clicking a row updates the detail panel, which matches the
 * list's height with the "What happened" timeline filling the space and
 * the buttons at the bottom. The main action marks the alert reviewed and
 * moves it to the Reviewed filter; it then reads "Reopen alert". No hover.
 * The alerts, with their merchant and deal stage, come from the data layer.
 */
export function AlertsView({ alerts, now }: { alerts: AlertRow[]; now: IsoDateTime }) {
  const [tab, setTab] = useState<AlertTab>("all");
  const [sel, setSel] = useState(alerts[0]?.id ?? "");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const rows = alerts.filter((a) => inTab(a, tab, done));
  const d = alerts.find((a) => a.id === sel) ?? alerts[0];
  const isDone = !!done[d.id];
  const auto = autoStep[d.stage.key];
  const seen = seenLabel(d.seenAt, now);
  const steps: { title: string; sub: string; state: "done" | "now" }[] = [
    { title: dt.found.title, sub: seen + dt.found.by, state: "done" },
    { title: auto[0], sub: auto[1], state: "done" },
    { title: isDone ? dt.review.done[0] : dt.review.open[0], sub: isDone ? dt.review.done[1] : dt.review.open[1], state: isDone ? "done" : "now" },
  ];

  return (
    <div className="flex flex-wrap items-stretch gap-3.5">
      <section aria-labelledby="h-feed" className="flex min-w-0 flex-[999_1_640px] flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 pt-1">
          <h2 id="h-feed" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div role="group" aria-label={t.showLabel} className="flex flex-wrap gap-1.5">
            {alertTabs.map((x) => {
              const on = x.key === tab;
              const count = alerts.filter((a) => inTab(a, x.key, done)).length;
              return (
                <button
                  key={x.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTab(x.key)}
                  className={`inline-flex h-[34px] cursor-pointer items-center gap-2 rounded-pill border-0 pr-1.5 pl-3 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-tile text-grey-text"}`}
                >
                  {x.label}
                  <span className={`rounded-pill px-[7px] py-0.5 text-label-sm ${on ? "bg-white/20" : "bg-card"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className={`${cols} px-3 pb-0.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
            {t.columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {rows.map((a) => {
            const on = a.id === sel;
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSel(a.id)}
                className={`${cols} box-border w-full cursor-pointer rounded-[16px] border-0 bg-tile px-3 py-2.5 text-left text-ink ${on ? "shadow-[inset_0_0_0_1.5px_var(--color-teal)]" : ""}`}
              >
                <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${sevChip[a.severity]}`}>{severityLabel[a.severity]}</span>
                <span className="min-w-0">
                  <b className="block truncate text-body-sm">{a.merchant}</b>
                  <span className="block truncate text-[11.5px] text-hint">{stageLine(a.stage)}</span>
                </span>
                <span className="flex min-w-0 items-center gap-2">
                  <span className={`grid h-[26px] w-[26px] flex-none place-items-center rounded-[9px] text-label-sm font-bold ${kindIcon[a.kind]}`}>{kindGlyph[a.kind]}</span>
                  <span className="truncate text-[12.5px]">{a.summary}</span>
                </span>
                <span className="text-[11.5px] text-hint">{seenLabel(a.seenAt, now)}</span>
                <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${stageChip[a.stage.key]}`}>{stageLabel[a.stage.key]}</span>
              </button>
            );
          })}
          {rows.length === 0 ? <div className="rounded-[18px] bg-tile p-7 text-center text-[12.5px] text-hint">{t.empty}</div> : null}
        </div>
      </section>

      {/* The detail stretches to the list's height; the timeline takes the extra space and the buttons sit at the bottom. */}
      <aside
        aria-labelledby="h-det"
        aria-live="polite"
        className="box-border flex min-w-0 max-w-full flex-[1_1_330px] flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)]"
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${sevChip[d.severity]}`}>
            {severityLabel[d.severity]} · {isDone ? dt.status.done : dt.status.open}
          </span>
          <span className="text-[11.5px] text-hint">{seen}</span>
        </div>
        <div>
          <h2 id="h-det" className="m-0 font-heading text-[20px] leading-[1.2] font-semibold">{d.summary}</h2>
          <span className="text-[12.5px] text-muted">
            {d.merchant} · {stageLine(d.stage)}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-[18px] bg-card p-3.5">
          <span className="text-cap font-semibold uppercase text-hint">{dt.evidence}</span>
          {d.facts.map(([k, v]) => (
            <span key={k} className="flex justify-between gap-2.5 text-[12.5px]">
              <span className="text-muted">{k}</span>
              <b className="text-right">{v}</b>
            </span>
          ))}
        </div>
        <div className="rounded-[16px] bg-mint-light px-3.5 py-3 text-[12.5px] text-teal-dark">
          <b className="mb-0.5 block">{dt.suggest}</b>
          {d.advice}
        </div>
        <div className="flex flex-1 flex-col px-0.5 py-1">
          <span className="mb-2 text-cap font-semibold uppercase text-hint">{dt.timeline}</span>
          {steps.map((s, i) => (
            <div key={s.title} className="grid min-h-11 flex-1 grid-cols-[22px_minmax(0,1fr)] gap-2.5">
              <span className="flex flex-col items-center">
                <span className={`box-border h-3.5 w-3.5 flex-none rounded-full ${s.state === "done" ? "bg-teal" : "border-[3px] border-amber bg-tile"}`} />
                <span className={`mt-1 w-0.5 flex-1 ${i < steps.length - 1 ? "bg-mint-border" : "bg-transparent"}`} />
              </span>
              <span className="pb-2.5 text-[12.5px]">
                <b className="block">{s.title}</b>
                <span className="text-[11.5px] text-hint">{s.sub}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap gap-2">
          {isDone ? (
            <button type="button" onClick={() => setDone((x) => ({ ...x, [d.id]: false }))} className="h-[42px] flex-1 cursor-pointer rounded-pill border-0 bg-mint-bg px-3.5 text-[12.5px] font-semibold text-teal-dark">
              {dt.reopen}
            </button>
          ) : (
            <Button onClick={() => setDone((x) => ({ ...x, [d.id]: true }))} className="h-[42px] flex-1 px-3.5 text-[12.5px]">
              {d.action}
            </Button>
          )}
          <button type="button" className="h-[42px] cursor-pointer rounded-pill border-0 bg-card px-3.5 text-[12.5px] font-semibold text-ink">
            {dt.openDeal}
          </button>
        </div>
      </aside>
    </div>
  );
}
