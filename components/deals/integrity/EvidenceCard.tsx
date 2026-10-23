"use client";

import { useState, type CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { evidenceCopy as t } from "@/lib/copy/deal-integrity";
import type { DealCashFlow, EvidenceItem, YearMonth } from "@/lib/data/types";

type HighlightStyle = CSSProperties & { "--hi"?: string };

type TagTone = "amber" | "grey" | "mint";
const tagTone: Record<TagTone, string> = {
  amber: "bg-amber-light/18 text-amber-deep",
  grey: "bg-page text-muted",
  mint: "bg-mint/16 text-teal-deep",
};

// Flexible columns instead of the design's 470px minimum: no sideways scroll.
const lineGrid = "grid grid-cols-[44px_minmax(0,1fr)_80px_84px] gap-2.5 font-mono";

type Props = {
  items: EvidenceItem[];
  /** the statement product, as printed on the page */
  product: string;
  bank: DealCashFlow["bank"];
  /** pages per statement month, for "p. 3 of 7" */
  pages: Record<YearMonth, number>;
};

/**
 * "Evidence" from design/Deal-Integrity.html and its prototype: a switcher
 * over the deal's evidence items, the statement page with the exact line
 * highlighted, and the insight panel with the effect on true revenue. Items
 * that need the underwriter's review are amber. No hover.
 */
export function EvidenceCard({ items, product, bank, pages }: Props) {
  const [pick, setPick] = useState(0);
  const cur = items[pick] ?? items[0];
  if (!cur) return null;
  const tone = cur.needsReview ? "amber" : "grey";
  const tag: TagTone = cur.outcome === "none" ? "mint" : tone;

  return (
    <Card as="article" aria-labelledby="h-ev" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="h-ev" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <div role="group" aria-label={t.switcherLabel} className="flex flex-wrap gap-1 rounded-pill bg-tile p-1">
          {items.map((it, i) => {
            const on = i === pick;
            return (
              <button
                key={it.title}
                type="button"
                aria-pressed={on}
                onClick={() => setPick(i)}
                className={`inline-flex h-[34px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill border-0 px-3.5 text-[12.5px] font-semibold ${on ? "bg-teal text-white" : "bg-transparent text-grey-text"}`}
              >
                <span className={`h-2 w-2 flex-none rounded-full ${it.needsReview ? "bg-amber" : "bg-grey-dot"}`} />
                {it.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-3.5">
        {/* Statement page on the desk */}
        <div className="min-w-0 flex-[999_1_420px] rounded-[22px] bg-[radial-gradient(120%_100%_at_0%_0%,var(--color-paper),var(--color-paper-deep))] p-[18px]">
          <div className="relative rounded-[12px] bg-card px-5 pt-[18px] pb-3.5 shadow-[0_1px_0_rgba(15,21,19,.04),0_18px_40px_-22px_rgba(15,21,19,.45)]">
            <span aria-hidden="true" className="absolute top-[-10px] right-[18px] rounded-pill bg-teal px-2.5 py-1 font-mono text-[10.5px] font-semibold text-white">
              {t.page(cur, pages[cur.month] ?? 0)}
            </span>
            <div className="flex items-end justify-between gap-2.5 border-b-[1.5px] border-ink pb-2.5">
              <span className="min-w-0">
                <b className="block text-body-sm">{product}</b>
                <span className="block truncate font-mono text-[10.5px] text-hint">{t.statement.account(bank.last4, bank.holder)}</span>
              </span>
              <span className="flex-none font-mono text-[10.5px] text-hint">{t.statement.section}</span>
            </div>
            <div className={`${lineGrid} px-2.5 pt-2 pb-1.5 text-[9.5px] tracking-[0.06em] text-hint-soft`}>
              {t.statement.columns.map((c, i) => (
                <span key={c} className={i >= 2 ? "text-right" : ""}>{c}</span>
              ))}
            </div>
            <div aria-live="polite">
              {cur.lines.map((l, i) => {
                const hi = i === cur.highlight;
                const hiStyle: HighlightStyle | undefined = hi ? { "--hi": tone === "amber" ? "var(--color-amber)" : "var(--color-ink)" } : undefined;
                const shown = t.line(l);
                return (
                  <div
                    key={`${pick}-${i}`}
                    className={`${lineGrid} px-2.5 py-2 text-label-sm ${
                      hi
                        ? `rounded-[10px] bg-amber-paper font-semibold text-ink shadow-[inset_4px_0_0_var(--hi),0_0_0_1.5px_rgba(217,138,43,.35)]`
                        : "border-b border-line-faint text-grey-text"
                    }`}
                    style={hiStyle}
                  >
                    <span>{shown.date}</span>
                    <span className="truncate">{l.description}</span>
                    <span className="text-right">{shown.amount}</span>
                    <span className="text-right">{shown.balance}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between border-t border-dashed border-line-soft pt-2 font-mono text-[10px]">
              <span className="text-hint-soft">{t.lineOf(cur.line, cur.lineCount)}</span>
              <span className="text-teal-deep">{t.statement.footer}</span>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="flex min-w-0 flex-[1_1_230px] flex-col gap-3 rounded-[22px] border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[18px] text-ink">
          <span className={`self-start rounded-pill px-2.5 py-1 text-label-sm font-semibold ${tagTone[tag]}`}>{t.tag[cur.outcome]}</span>
          <b className="font-heading text-[18px] leading-[1.2] font-semibold">{cur.title}</b>
          <span className="text-[12.5px] text-muted">{cur.why}</span>
          <div className="rounded-[16px] border border-teal/7 bg-teal/7 px-3.5 py-3">
            <span className="text-[11.5px] text-muted">{t.impactLabel[cur.impact.kind]}</span>
            <b className="block font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{t.impact(cur.impact.amount)}</b>
          </div>
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" className="h-[38px] flex-1 cursor-pointer whitespace-nowrap rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
              {t.actions.open}
            </button>
            <button type="button" className="h-[38px] cursor-pointer whitespace-nowrap rounded-pill border border-teal/7 bg-transparent px-3 text-label font-semibold text-ink">
              {t.actions.note}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
