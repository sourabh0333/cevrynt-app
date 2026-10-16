"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { formatAmount, transactions, txCategories, type TxFilter } from "@/lib/sample-data/deal-cash-flow";

const tone = {
  green: "bg-mint-bg text-teal-dark",
  neutral: "bg-page text-grey-text",
  amber: "bg-amber-bg text-amber-text",
  purple: "bg-purple-bg text-purple-text",
};

// Flexible columns instead of the design's 820px minimum, so the list never
// scrolls sideways (layout rule 3). Balance and Source hide on narrow screens.
const grid = "grid grid-cols-[64px_minmax(0,1.6fr)_minmax(0,1fr)_100px_90px_56px] items-center gap-3 max-[1100px]:grid-cols-[64px_minmax(0,1.6fr)_minmax(0,1fr)_100px] max-[760px]:grid-cols-[64px_minmax(0,1fr)_96px]";
const hideMd = "max-[1100px]:hidden";
const hideSm = "max-[760px]:hidden";

/**
 * "Transactions" from design/Deal-CashFlow.html and its prototype: search
 * over description, note and amount, five filter chips with the full-file
 * counts, and the matching lines in a box that scrolls on its own under a
 * sticky heading row. Flagged lines sit on amber. No hover.
 */
export function TransactionsList() {
  const [filter, setFilter] = useState<TxFilter>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const rows = transactions.rows.filter((t) => {
    if (filter === "flag" ? !t.flag : filter !== "all" && t.kind !== filter) return false;
    if (!q) return true;
    return [t.desc, t.note, formatAmount(t.amount), String(Math.abs(t.amount))].some((s) => s.toLowerCase().includes(q));
  });
  const total = transactions.filters.find((f) => f.key === filter)?.count ?? "";

  return (
    <Card as="section" id="transactions" aria-labelledby="h-tx" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-tx" className="m-0 font-heading text-[20px] font-semibold">{transactions.title}</h2>
          <div className="mt-[3px] text-label text-hint">{transactions.hint}</div>
        </div>
        <label className="flex h-10 min-w-[240px] items-center gap-2 rounded-pill bg-tile px-3.5 text-hint">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            aria-label="Search transactions"
            placeholder={transactions.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-0 flex-1 border-0 bg-transparent text-body-sm text-ink outline-none placeholder:text-hint"
          />
        </label>
      </div>

      <div role="group" aria-label="Show" className="flex flex-wrap gap-1.5">
        {transactions.filters.map((f) => {
          const on = f.key === filter;
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.key)}
              className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-pill border-0 pr-2 pl-3.5 text-[12.5px] font-semibold ${
                on ? "bg-teal text-white" : "bg-tile text-grey-text"
              }`}
            >
              {f.label}
              <span className={`rounded-pill px-2 py-0.5 text-label-sm ${on ? "bg-teal/8" : "bg-card"}`}>{f.count}</span>
            </button>
          );
        })}
      </div>

      <div className="scrollbar-thin flex max-h-[460px] flex-col gap-1 overflow-y-auto">
        <div className={`${grid} sticky top-0 z-10 bg-card px-3 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {transactions.columns.map((c, i) => (
            <span key={c} className={`${i >= 3 ? "text-right" : ""} ${i === 4 ? hideMd : ""} ${i === 5 ? hideMd : ""} ${i === 2 ? hideSm : ""}`}>{c}</span>
          ))}
        </div>
        {rows.length === 0 ? (
          <div className="rounded-tile bg-tile p-5 text-center text-body-sm text-hint">No lines match. Try another word or filter.</div>
        ) : null}
        {rows.map((t) => {
          const cat = txCategories[t.category];
          return (
            <Link
              key={`${t.date}-${t.desc}`}
              href="#transactions"
              className={`${grid} rounded-tile px-3 py-2.5 text-ink no-underline ${t.flag ? "bg-amber-tint" : "bg-tile"}`}
            >
              <span className="font-mono text-label text-muted">{t.date}</span>
              <span className="min-w-0">
                <b className="block truncate text-body-sm">{t.desc}</b>
                <span className={`block truncate text-[11.5px] ${t.flag ? "font-semibold text-amber-deep" : "text-hint"}`}>{t.note}</span>
              </span>
              <span className={`${hideSm} justify-self-start whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${tone[cat.tone]}`}>{cat.label}</span>
              <b className={`text-right font-heading text-body font-semibold tabular-nums tracking-[-0.03em] ${t.amount < 0 ? "text-ink" : "text-teal-deep"}`}>
                {formatAmount(t.amount)}
              </b>
              <span className={`${hideMd} text-right font-heading text-body-sm tabular-nums tracking-[-0.03em] text-muted`}>{t.balance}</span>
              <span className={`${hideMd} text-right text-label font-semibold text-teal`}>{t.source}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-label text-hint">Showing {rows.length} of {total}</span>
        <div className="flex gap-1.5">
          <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">{transactions.actions.export}</button>
          <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-teal px-3 text-label font-semibold text-white">{transactions.actions.more}</button>
        </div>
      </div>
    </Card>
  );
}
