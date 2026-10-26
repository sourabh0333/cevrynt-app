"use client";

import Link from "next/link";
import { useState } from "react";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import {
  auditEntryView,
  auditHeader as ah,
  auditSections,
  categoryLabel,
  dealRecord,
  entryDetail as ed,
  entryLife,
  entryNumber,
  instantAlerts as ia,
  legalHolds as lh,
  logFilters as lf,
  sealFor,
  type AuditActor,
} from "@/lib/copy/audit";
import type { AuditCategory } from "@/lib/data/types";
import type { AuditData } from "@/lib/data/views/settings";

const catChip: Record<AuditCategory, string> = {
  money: "bg-mint-bg text-teal-dark",
  policy: "bg-purple-bg text-purple-text",
  decision: "bg-blue-bg text-blue-text",
  access: "bg-red-bg text-red-text",
  data: "bg-amber-bg text-amber-text",
  settings: "bg-page text-grey-text",
};
const catDot: Record<AuditCategory, string> = {
  money: "bg-teal",
  policy: "bg-purple",
  decision: "bg-blue",
  access: "bg-red",
  data: "bg-amber",
  settings: "bg-grey-dot",
};
const avatarFill = { blue: "bg-blue-bg text-ink", sand: "bg-sand text-ink", red: "bg-red-bg text-ink", cream: "bg-cream text-ink", teal: "bg-teal text-white", line: "bg-line text-ink" };

function ActorMark({ who: a, size }: { who: AuditActor; size: 30 | 36 }) {
  return (
    <span
      aria-hidden="true"
      className={`grid flex-none place-items-center rounded-full font-bold ${avatarFill[a.avatar]} ${size === 36 ? "h-9 w-9 text-label" : "h-[30px] w-[30px] text-[10.5px]"}`}
    >
      {a.key}
    </span>
  );
}

/** A tiny lock icon for the legal-hold card. */
function Lock({ size }: { size: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-amber-deep">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/**
 * Settings → Audit log from design/Settings-Audit.html and its prototype.
 * Category chips (with counts), the person picker and search filter the
 * entries; clicking one updates the detail beside it, with BEFORE → AFTER
 * for changes and the entry's seal. The log box matches the detail's height
 * and its entries scroll inside it. No hover. The entries come from the data
 * layer, each worded from the release, policy draft, sign-in, invite or deal
 * it is about.
 */
export function AuditView({ data }: { data: AuditData }) {
  const auditEntries = data.rows.map(auditEntryView);
  const people = lf.people(data.people);
  const alertItems = ia.items(data.log);
  const holds = lh.holds(data);
  const [cat, setCat] = useState<"all" | AuditCategory>("all");
  const [sel, setSel] = useState(auditEntries[0]?.id ?? "");
  const [range, setRange] = useState("today");
  const [who, setWho] = useState("all");
  const [q, setQ] = useState("");
  const [alerts, setAlerts] = useState<boolean[]>(() => alertItems.map((a) => a.on));

  const query = q.trim().toLowerCase();
  const matches = (e: (typeof auditEntries)[number]) =>
    (who === "all" || e.actor.key === who) && (!query || `${e.what} ${e.object} ${e.actor.name}`.toLowerCase().includes(query));
  const base = auditEntries.filter(matches);
  const rows = base.filter((e) => cat === "all" || e.category === cat);
  const d = auditEntries.find((e) => e.id === sel) ?? auditEntries[0];
  const n = entryNumber(data.log, auditEntries.indexOf(d));

  return (
    <div className="@container flex flex-col gap-3.5">
      <section aria-labelledby="h-au" className="box-border grid min-w-0 grid-cols-2 gap-1 rounded-card-lg border border-line bg-tile p-2 text-ink @max-[700px]:grid-cols-1">
        <div className="flex min-w-0 flex-col justify-center gap-2 rounded-card bg-mint-card p-5">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill bg-tile px-[11px] py-1 text-[11.5px] font-semibold text-teal-deep">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {ah.sealed(data.log, data.now)}
          </span>
          <h2 id="h-au" className="m-0 font-heading text-[22px] font-semibold">{ah.title}</h2>
          <span className="text-[12.5px] text-grey-text">{ah.text}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <button type="button" className="h-[38px] cursor-pointer rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
              {ah.export}
            </button>
            <button type="button" className="h-[38px] cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-label font-semibold text-ink">
              {ah.monthly}
            </button>
          </div>
        </div>
        <div className="grid content-center grid-cols-2 gap-2 p-3">
          {ah.stats(data).map((s) => (
            <span key={s.label} className={`min-w-0 rounded-[18px] p-3.5 ${s.alert ? "bg-red-bg" : "bg-tile"}`}>
              <b className={`block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${s.alert ? "text-red-text" : "text-ink"}`}>{s.value}</b>
              <span className="text-[11.5px] text-muted">{s.label}</span>
            </span>
          ))}
        </div>
      </section>

      {/* The log stretches to the detail's height and its entries scroll inside it. */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-log" className="box-border flex min-w-0 flex-[999_1_460px] flex-col gap-3 rounded-card-lg bg-card p-4 text-ink">
          <h2 id="h-log" className="sr-only">{lf.title}</h2>
          <div className="flex flex-wrap gap-2">
            <label className="box-border flex h-11 min-w-0 flex-[1_1_240px] items-center gap-2 rounded-pill bg-tile px-4">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="flex-none stroke-hint">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                aria-label={lf.searchLabel}
                placeholder={lf.searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-body-sm text-ink outline-none placeholder:text-hint"
              />
            </label>
            <label className="box-border flex h-11 items-center gap-2 rounded-pill bg-tile pr-1.5 pl-3.5">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="flex-none stroke-hint">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
              </svg>
              <select
                aria-label={lf.personLabel}
                value={who}
                onChange={(e) => setWho(e.target.value)}
                className="h-10 cursor-pointer border-0 bg-transparent pr-1.5 text-[12.5px] font-semibold text-ink outline-none"
              >
                <option value="all">{lf.everyone}</option>
                {people.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.key === "C" ? lf.automatic : p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div role="group" aria-label={lf.categoryLabel} className="scrollbar-none flex min-w-0 flex-[1_1_320px] gap-0.5 overflow-x-auto rounded-[16px] bg-tile p-1">
              {lf.categories.map((c) => {
                const on = c.key === cat;
                const count = c.key === "all" ? base.length : base.filter((e) => e.category === c.key).length;
                return (
                  <button
                    key={c.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setCat(c.key)}
                    className={`inline-flex h-[34px] flex-none cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-[12px] border-0 pr-2.5 pl-3 text-[12.5px] font-semibold ${on ? "bg-ink text-white" : "bg-transparent text-muted"}`}
                  >
                    <span className={`h-[7px] w-[7px] rounded-full ${c.key === "all" ? (on ? "bg-white" : "bg-ink") : catDot[c.key]}`} />
                    {c.label}
                    <span className={`rounded-pill px-[7px] py-px text-[10.5px] ${on ? "bg-white/20 text-white" : "bg-card text-hint"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <SegmentedSwitch variant="soft" label={lf.rangeLabel} value={range} onChange={setRange} options={lf.ranges} />
          </div>
          <div className="scrollbar-thin -mx-1 flex h-0 min-h-[300px] flex-[1_1_0] flex-col gap-1.5 overflow-y-auto px-1">
            {rows.map((e) => {
              const on = e.id === sel;
              return (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSel(e.id)}
                  className={`box-border flex w-full flex-none cursor-pointer items-center gap-2.5 rounded-[16px] border-0 bg-tile px-3 py-2.5 text-left text-ink ${on ? "shadow-[inset_0_0_0_1.5px_var(--color-teal)]" : ""}`}
                >
                  <span className="w-[42px] flex-none font-mono text-[11.5px] text-hint">{e.time}</span>
                  <ActorMark who={e.actor} size={30} />
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-body-sm">{e.what}</b>
                    <span className="block truncate text-[11.5px] text-hint">
                      {e.actor.name} · {e.object}
                    </span>
                  </span>
                  <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-[10.5px] font-bold ${catChip[e.category]}`}>{categoryLabel[e.category]}</span>
                </button>
              );
            })}
            {rows.length === 0 ? <div className="rounded-[16px] bg-tile p-6 text-center text-[12.5px] text-hint">{lf.empty}</div> : null}
          </div>
        </section>

        <aside
          aria-labelledby="h-det"
          aria-live="polite"
          className="box-border flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3 rounded-card-lg border border-line bg-tile p-5 text-ink shadow-[0_18px_40px_-30px_rgba(15,21,19,.35)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-[10.5px] font-bold ${catChip[d.category]}`}>{categoryLabel[d.category]}</span>
            <span className="font-mono text-label-sm text-hint">#{n.toLocaleString("en-US")}</span>
          </div>
          <h2 id="h-det" className="m-0 font-heading text-card-title leading-[1.25] font-semibold">{d.what}</h2>
          <div className="flex items-center gap-2.5">
            <ActorMark who={d.actor} size={36} />
            <span className="min-w-0 text-[12.5px]">
              <b className="block">{d.actor.name}</b>
              <span className="text-[11.5px] text-hint">
                {ed.day(d.at, data.now)} {d.time} · {d.where}
              </span>
            </span>
          </div>
          {d.before ? (
            <div className="grid grid-cols-2 gap-1.5">
              <span className="min-w-0 rounded-tile bg-red-bg p-3">
                <span className="block text-[10.5px] font-bold text-red-text">{ed.before}</span>
                <b className="text-body-sm">{d.before}</b>
              </span>
              <span className="min-w-0 rounded-tile bg-mint-light p-3">
                <span className="block text-[10.5px] font-bold text-teal-deep">{ed.after}</span>
                <b className="text-body-sm">{d.after}</b>
              </span>
            </div>
          ) : null}
          <span className="text-[12.5px] text-grey-text">{d.note}</span>
          <div className="mt-auto flex flex-col gap-1 rounded-tile bg-card p-3">
            <span className="text-label-sm text-hint">{ed.seal}</span>
            <span className="break-all font-mono text-label-sm">{sealFor(n)}</span>
            <span className="text-[11.5px] text-hint">{ed.sealNote}</span>
          </div>
          <Link href={d.link.href} className="grid h-10 place-items-center rounded-pill bg-card text-[12.5px] font-semibold text-ink no-underline">
            {d.link.label}
          </Link>
        </aside>
      </div>

      <section aria-label={auditSections.more} className="grid grid-cols-3 gap-3.5 @max-[760px]:grid-cols-1">
        <article className="box-border flex min-w-0 flex-col gap-1.5 rounded-[28px] border border-line bg-tile p-[18px] text-ink">
          <div className="mb-1 flex items-center gap-2.5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-mint-light">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-teal">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="m-0 font-heading text-[16px] font-semibold">{ia.title}</h2>
              <span className="text-[11.5px] text-hint">{ia.sub(data.log)}</span>
            </div>
          </div>
          {alertItems.map((a, i) => (
            <label key={a.title} className="flex cursor-pointer items-center gap-2.5 border-b border-line-faint py-2.5">
              <span className={`h-2 w-2 flex-none rounded-full ${alerts[i] ? "bg-teal" : "bg-line-dash-soft"}`} />
              <span className="min-w-0 flex-1 text-[12.5px]">
                <b>{a.title}</b>
                <span className="text-[11.5px] text-hint"> · {a.hint}</span>
              </span>
              <input
                type="checkbox"
                role="switch"
                checked={alerts[i]}
                onChange={() => setAlerts((x) => x.map((v, j) => (j === i ? !v : v)))}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`relative h-[18px] w-8 flex-none rounded-pill transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-mint ${alerts[i] ? "bg-teal" : "bg-line-dash-soft"}`}
              >
                <span className={`absolute top-[3px] left-[3px] h-3 w-3 rounded-full bg-tile transition-transform duration-150 motion-reduce:transition-none ${alerts[i] ? "translate-x-3.5" : ""}`} />
              </span>
            </label>
          ))}
        </article>

        <article className="box-border flex min-w-0 flex-col gap-2.5 rounded-[28px] bg-cream p-[18px] text-ink">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-tile">
              <Lock size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="m-0 font-heading text-[16px] font-semibold">{lh.title}</h2>
              <span className="text-[11.5px] text-amber-mute">{lh.sub}</span>
            </div>
            <b className="font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em]">{holds.length}</b>
          </div>
          {holds.map((h) => (
            <div key={h.tag} className="overflow-hidden rounded-[18px] bg-tile shadow-[0_10px_24px_-20px_rgba(107,75,31,.6)]">
              <div className="flex items-center gap-3 p-3.5">
                <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full bg-[repeating-linear-gradient(135deg,var(--color-amber-light)_0_4px,var(--color-rate-6)_4px_8px)]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-tile">
                    <Lock size={15} />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <b className="block text-[13.5px] leading-[1.25]">{h.merchant}</b>
                  <span className="block font-mono text-label-sm text-amber-deep">{h.tag}</span>
                </span>
                <span className="text-right">
                  <b className="block font-heading text-card-title leading-none tabular-nums tracking-[-0.03em]">{h.days}</b>
                  <span className="text-[10.5px] text-hint">{lh.daysLabel}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 border-t border-dashed border-amber-stripe/40">
                <span className="border-r border-dashed border-amber-stripe/40 px-3.5 py-[9px] text-[11.5px] text-hint">
                  {lh.placedBy} <b className="text-ink">{h.placedBy}</b> · {h.placedOn}
                </span>
                <span className="px-3.5 py-[9px] text-[11.5px] text-hint">
                  <b className="text-ink">{h.records}</b> {lh.recordsKept}
                </span>
              </div>
            </div>
          ))}
          <button type="button" className="mt-auto h-[38px] cursor-pointer rounded-pill border-0 bg-white/70 text-label font-semibold text-ink">
            {lh.add}
          </button>
        </article>

        <article className="box-border flex min-w-0 flex-col gap-2.5 rounded-[28px] border border-mint-border bg-mint-card p-[18px] text-ink">
          <div aria-hidden="true" className="relative h-[70px]">
            <span className="absolute top-3.5 left-6 h-[54px] w-[54px] -rotate-8 rounded-[10px] bg-tile shadow-[0_6px_14px_-10px_rgba(15,21,19,.5)]" />
            <span className="absolute top-2 left-11 h-[54px] w-[54px] rotate-4 rounded-[10px] bg-tile shadow-[0_6px_14px_-10px_rgba(15,21,19,.5)]" />
            <span className="absolute top-0.5 left-[66px] grid h-[60px] w-[54px] place-items-center rounded-[10px] bg-teal text-[10px] font-bold text-white shadow-[0_10px_20px_-10px_rgba(14,107,92,.8)]">
              {dealRecord.sealed}
            </span>
          </div>
          <div>
            <h2 className="m-0 font-heading text-[16px] font-semibold">{dealRecord.title}</h2>
            <span className="text-label text-grey-text">{dealRecord.text}</span>
          </div>
          <div className="mt-auto flex gap-1.5">
            <input
              aria-label={dealRecord.inputLabel}
              placeholder={dealRecord.inputLabel}
              className="h-[38px] min-w-0 flex-1 rounded-pill border-0 bg-tile px-3 text-[12.5px] text-ink outline-none placeholder:text-hint focus-visible:ring-2 focus-visible:ring-teal"
            />
            <button type="button" className="h-[38px] cursor-pointer whitespace-nowrap rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
              {dealRecord.build}
            </button>
          </div>
        </article>
      </section>

      <section aria-labelledby="h-life" className="box-border flex min-w-0 flex-col gap-4 rounded-card-lg bg-card p-[22px] text-ink">
        <div>
          <h2 id="h-life" className="m-0 font-heading text-card-title font-semibold">{entryLife.title}</h2>
          <span className="text-label text-hint">{entryLife.text}</span>
        </div>
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute top-[17px] right-[12.5%] left-[25px] h-0.5 bg-[linear-gradient(90deg,var(--color-teal)_0%,var(--color-teal)_60%,var(--color-line-dashed)_100%)] @max-[520px]:hidden"
          />
          <ol className="m-0 grid list-none grid-cols-4 gap-2.5 p-0 @max-[520px]:grid-cols-2 @max-[520px]:gap-y-4">
            {entryLife.steps.map((s, i) => (
              <li key={s.title} className="relative flex min-w-0 flex-col gap-2 px-2">
                <span
                  className={`relative z-[1] box-border grid h-[34px] w-[34px] place-items-center rounded-full font-heading text-body-sm font-bold shadow-[0_0_0_4px_var(--color-card)] ${
                    s.tone === "done" ? "bg-teal text-white" : s.tone === "now" ? "bg-mint text-teal-dark" : "border-[1.5px] border-dashed border-grey-dot bg-tile text-grey-text"
                  }`}
                >
                  {i + 1}
                </span>
                <b className="text-[13.5px]">{s.title}</b>
                <span className="text-label text-hint">{s.hint}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
