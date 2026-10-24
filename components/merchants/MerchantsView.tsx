"use client";

import { useState } from "react";
import { PageActions } from "@/components/shell/PageActions";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { activeCount } from "@/lib/copy/funded";
import {
  inSegment,
  merchantList as t,
  merchantsHeader,
  merchantView,
  merchantsSections,
  preview as pv,
  relationships,
  segments as segmentsFor,
  type HistoryTone,
  type MerchantView,
  type Segment,
} from "@/lib/copy/merchants";
import type { Relationship } from "@/lib/data/types";
import type { MerchantsData } from "@/lib/data/views/merchants";
import { BiggestBalancesCard, OwnerGroupsCard } from "./ConcentrationRow";
import { IndustryCard, RepeatCard, StateCard } from "./MixRow";
import { StatsRow } from "./StatsRow";

/*
 * Design .mcols: merchant, relationship, deals, balance, health, last activity.
 * Under 1100px the last-activity column hides (design media query).
 * No horizontal scroll: columns flex and names truncate.
 */
const cols =
  "grid grid-cols-[minmax(0,1.5fr)_112px_84px_minmax(0,1fr)_44px_74px] items-center gap-2.5 max-[1100px]:grid-cols-[minmax(0,1.5fr)_112px_84px_minmax(0,1fr)_44px] max-[1100px]:[&>:nth-child(6)]:hidden";

const relChip: Record<Relationship, string> = {
  active: "bg-mint-bg text-teal-dark",
  new: "bg-mint-bg text-teal-dark",
  renew: "bg-amber-bg text-amber-text",
  review: "bg-blue-bg text-blue-text",
  watch: "bg-red-bg text-red-text",
  declined: "bg-page text-grey-text",
};

const historyDot: Record<HistoryTone, string> = { g: "bg-teal", d: "bg-grey-dot", a: "bg-amber", r: "bg-red" };

const healthClass = (h: number) =>
  !h ? "bg-tile text-grey-dot" : h >= 80 ? "bg-mint-bg text-teal-dark" : h >= 65 ? "bg-amber-bg text-amber-text" : "bg-red-bg text-red-text";

function Avatar({ m, size }: { m: MerchantView; size: 36 | 48 }) {
  return (
    <span
      className={`grid flex-none place-items-center font-bold text-white ${size === 48 ? "h-12 w-12 rounded-[16px] text-[15px]" : "h-9 w-9 rounded-[12px] text-label-sm"}`}
      style={{ background: `linear-gradient(140deg, ${m.g[0]}, ${m.g[1]})` }}
    >
      {m.ini}
    </span>
  );
}

/**
 * Merchants from design/Merchants.html and its prototype: the header, the
 * five stat tiles, the "All merchants" list beside the preview column, the
 * portfolio mix (industry, state, repeat merchants) and the concentration
 * row (biggest balances, owner groups). The list matches the column's
 * height and scrolls inside it under sticky headings (layout rule 2);
 * clicking a row updates the preview. Bars and the ring animate in once.
 * No hover. The merchants, the book and the balances come from the data
 * layer (props); the filter, search and selection are local.
 */
export function MerchantsView({ data }: { data: MerchantsData }) {
  const merchants = data.rows.map((r) => merchantView(r, data.now));
  const active = activeCount(data.funded);
  const segments = segmentsFor({ book: data.book, active, readyCount: data.readyCount });
  const [seg, setSeg] = useState<Segment>("all");
  const [sel, setSel] = useState(merchants[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const rows = merchants.filter(
    (m) => inSegment(m, seg) && (!q || [m.name, m.owner, m.industry].some((s) => s.toLowerCase().includes(q))),
  );
  const p = merchants.find((m) => m.id === sel) ?? merchants[0];

  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{merchantsHeader.title}</h1>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{merchantsHeader.line(data.book.total, active)}</span>
        </div>
        <PageActions />
      </header>

      <StatsRow data={data} />

      {/* List + preview: both stretch; the list scrolls inside (layout rules 1 and 2). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-list" className="flex min-w-0 flex-[999_1_640px] flex-col gap-3 rounded-card-lg bg-card p-[18px] text-ink">
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 pt-1">
            <h2 id="h-list" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
            <label className="flex h-[38px] min-w-[220px] items-center gap-2 rounded-pill bg-tile px-3.5 text-hint">
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                aria-label={t.search.label}
                placeholder={t.search.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-hint"
              />
            </label>
          </div>

          {/* One line of chips that scrolls sideways with no scrollbar (layout rule 4). */}
          <div role="group" aria-label={t.showLabel} className="scrollbar-none flex flex-nowrap gap-1.5 overflow-x-auto overflow-y-hidden px-1 pb-0.5">
            {segments.map((g) => {
              const on = g.key === seg;
              return (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSeg(g.key)}
                  className={`inline-flex h-[34px] flex-none cursor-pointer items-center gap-2 rounded-pill border-0 pr-1.5 pl-3 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-tile text-grey-text"}`}
                >
                  {g.label}
                  <span className={`rounded-pill px-[7px] py-0.5 text-label-sm ${on ? "bg-teal/8" : "bg-card"}`}>{g.count}</span>
                </button>
              );
            })}
          </div>

          <div className="scrollbar-thin -mx-1 h-0 min-h-[360px] flex-[1_1_0] overflow-x-hidden overflow-y-auto px-1">
            <div className="flex flex-col gap-1">
              <div className={`${cols} sticky top-0 z-[2] bg-card px-3 py-1.5 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
                {t.columns.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              {rows.map((m, i) => {
                const on = m.id === sel;
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSel(m.id)}
                    className={`${cols} box-border w-full cursor-pointer rounded-[16px] border-0 px-3 py-[9px] text-left text-ink ${on ? "bg-tile shadow-[inset_0_0_0_1.5px_var(--color-ink)]" : "bg-transparent"}`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <Avatar m={m} size={36} />
                      <span className="min-w-0">
                        <b className="block truncate text-body-sm">{m.name}</b>
                        <span className="block truncate text-[11.5px] text-hint">
                          {m.industry} · {m.state}
                        </span>
                      </span>
                    </span>
                    <span className={`justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${relChip[m.rel]}`}>{relationships[m.rel]}</span>
                    <span className="text-[12.5px]">
                      <b>{m.deals}</b>
                    </span>
                    <span className="min-w-0">
                      <b className="block font-heading text-[13.5px] font-semibold tabular-nums tracking-[-0.03em]">{m.balance}</b>
                      <ProgressBar value={m.paid} height={5} track="line" color={m.paid >= 50 ? "teal" : "teal-soft"} delay={0.1 + i * 0.05} className="mt-1" />
                    </span>
                    <span className={`grid h-7 w-10 place-items-center rounded-[10px] text-[12.5px] font-bold ${healthClass(m.health)}`}>{m.health ? m.health : pv.none}</span>
                    <span className="text-[11.5px] text-hint">{m.last}</span>
                  </button>
                );
              })}
              {rows.length === 0 ? (
                <div className="rounded-[18px] bg-tile p-7 text-center">
                  <b className="text-[13.5px]">{seg === "blocked" ? t.blocked.title(data.book.blocked) : t.empty}</b>
                  {seg === "blocked" ? <p className="mt-1 mb-0 text-[11.5px] text-hint">{t.blocked.text}</p> : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1">
            <span className="text-label text-hint">{t.showing(rows.length, data.book.total)}</span>
            <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">
              {t.export}
            </button>
          </div>
        </section>

        <aside aria-labelledby="h-pv" className="flex min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5" aria-live="polite">
          <article className="box-border flex flex-col gap-3 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
            <div className="flex items-center gap-3">
              <Avatar m={p} size={48} />
              <span className="min-w-0">
                <h2 id="h-pv" className="m-0 font-heading text-[20px] leading-[1.15] font-semibold">{p.name}</h2>
                <span className="text-label text-muted">
                  {p.industry} · {p.state} · {pv.labels.owner} {p.owner}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <span className="rounded-tile bg-white/10 px-3 py-2.5">
                <span className="text-label-sm text-muted">{pv.labels.funded}</span>
                <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{p.funded}</b>
              </span>
              <span className="rounded-tile bg-white/10 px-3 py-2.5">
                <span className="text-label-sm text-muted">{pv.labels.health}</span>
                <b className="block font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]">{p.health ? `${p.health}${pv.outOf}` : pv.none}</b>
              </span>
            </div>
            <span className="text-[12.5px] text-muted">{p.note}</span>
            <div className="flex gap-2">
              <Button href="#" glow className="flex-1">
                {pv.open}
              </Button>
              <Button href={pv.newDealHref} variant="outline">
                <span className="text-[16px] leading-none">+</span>
                {pv.newDeal}
              </Button>
            </div>
          </article>

          {/* flex-1: the history card stretches so both columns end on the same line. */}
          <article className="box-border flex flex-1 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
            <b className="font-heading text-[17px] font-semibold">{pv.history}</b>
            {p.history.map((h) => (
              <div key={h.title} className="flex items-start gap-2.5 rounded-tile bg-white/75 px-3 py-[11px]">
                <span className={`mt-[5px] h-[9px] w-[9px] flex-none rounded-full ${historyDot[h.tone]}`} />
                <span className="min-w-0 flex-1">
                  <b className="block text-body-sm">{h.title}</b>
                  <span className="text-[11.5px] text-muted">{h.detail}</span>
                </span>
                <span className="font-mono text-label-sm text-hint">{h.year}</span>
              </div>
            ))}
          </article>
        </aside>
      </div>

      <section aria-label={merchantsSections.mix} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <IndustryCard data={data} />
        <StateCard data={data} />
        <RepeatCard data={data} />
      </section>
      <section aria-label={merchantsSections.concentration} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        <BiggestBalancesCard data={data} />
        <OwnerGroupsCard data={data} />
      </section>
    </>
  );
}
