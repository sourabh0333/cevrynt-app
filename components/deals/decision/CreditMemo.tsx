"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { memo as t, type PolicyRow } from "@/lib/copy/deal-decision";
import type { DecisionTabData } from "@/lib/data/views/deal-tabs";
import { computeOffer, formatOffer } from "@/lib/offer-math";

const tile = "rounded-[12px] bg-tile px-3 py-2.5";
const body = "text-body-sm leading-[1.6] text-ink-soft";

/**
 * "Credit memo" from design/Deal-Decision.html: the Sections menu on the
 * left, sticky while the memo scrolls, and the document with its seven
 * sections. Clicking a section jumps to it. Offer figures in the memo
 * come from the shared offer math. No hover.
 */
export function CreditMemo({ data, rules }: { data: DecisionTabData; rules: PolicyRow[] }) {
  const [active, setActive] = useState(t.sections[0].id);
  const r = data.recommended;
  const f = formatOffer(r, computeOffer(r, data.figures, data.offerPolicy));
  const { factor, term } = r;
  const { memo } = data.decision;
  const summary = t.summary({
    merchant: data.merchantName,
    requested: data.requested,
    f,
    factor,
    term,
    score: data.score,
    risk: data.risk,
    met: rules.filter((x) => x.met).length,
    total: rules.length,
  });

  const jump = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const sectionBody: Record<string, ReactNode> = {
    m1: (
      <>
        {summary.before}
        <b>{summary.bold}</b>
        {summary.after}
      </>
    ),
    m2: memo.sections.business,
    m3: memo.sections.cashFlow,
    m4: t.debt(data.positions, f, data.offerPolicy.maxShare),
    m5: memo.sections.risks,
    m6: t.recommendation(f, factor, term, r.freq, data.bank, data.openConditions),
    m7: memo.sections.exceptions,
  };

  return (
    <Card as="section" aria-labelledby="h-memo" padding={false} className="gap-4 p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-memo" className="m-0 font-heading text-[22px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-[12.5px] font-semibold text-ink">
            {t.actions.rewrite}
          </button>
          <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-3.5 text-[12.5px] font-semibold text-ink">
            {t.actions.share}
          </button>
          <Button className="h-10 px-4 text-[12.5px]">{t.actions.download}</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <nav
          aria-label={t.nav.label}
          className="scrollbar-none sticky top-0 z-[2] box-border flex max-h-[calc(100vh-64px)] max-w-[240px] flex-[1_1_200px] flex-col gap-1 self-start overflow-y-auto rounded-tile-lg bg-tile p-3 shadow-[0_12px_28px_-24px_rgba(15,21,19,.5)]"
        >
          <span className="px-2 pt-1 pb-2 text-cap font-semibold uppercase text-hint">{t.nav.caption}</span>
          {t.sections.map((sec, i) => {
            const on = sec.id === active;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                aria-current={on ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jump(sec.id);
                }}
                className={`rounded-[12px] px-2.5 py-[9px] text-[12.5px] no-underline ${on ? "bg-teal font-semibold text-white" : "text-ink"}`}
              >
                {String(i + 1).padStart(2, "0")} · {sec.nav}
              </a>
            );
          })}
          <span className="mt-2 rounded-[12px] bg-card p-2.5 text-[11.5px] text-muted">{t.nav.version(memo.version, memo.updatedAt, memo.updateNote)}</span>
        </nav>

        <div className="min-w-0 flex-[999_1_460px] rounded-[22px] bg-[radial-gradient(120%_100%_at_0%_0%,var(--color-paper),var(--color-paper-deep))] p-[18px]">
          <div className="flex flex-col gap-4 rounded-[12px] bg-card px-[30px] py-[26px] shadow-[0_18px_40px_-24px_rgba(15,21,19,.45)]">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b-[1.5px] border-ink pb-3">
              <span>
                <span className="text-cap font-semibold uppercase text-hint">{t.doc.caption}</span>
                <b className="block font-heading text-[22px] font-semibold">{data.merchantName}</b>
              </span>
              <span className="text-right font-mono text-[10.5px] text-hint">
                {data.id}
                <br />
                {t.doc.ref(data.funder, memo.createdAt)}
              </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-2">
              <span className={tile}>
                <span className="block text-[10.5px] text-hint">{t.doc.tiles.recommended}</span>
                <b className="font-heading text-[16px] font-semibold tabular-nums tracking-[-0.03em]">{f.amount}</b>
              </span>
              <span className={tile}>
                <span className="block text-[10.5px] text-hint">{t.doc.tiles.score}</span>
                <b className="font-heading text-[16px] font-semibold tabular-nums tracking-[-0.03em]">{data.score}</b>
              </span>
              <span className={tile}>
                <span className="block text-[10.5px] text-hint">{t.doc.tiles.revenue}</span>
                <b className="font-heading text-[16px] font-semibold tabular-nums tracking-[-0.03em]">{t.doc.revenue(data.figures.revenue)}</b>
              </span>
              <span className={tile}>
                <span className="block text-[10.5px] text-hint">{t.doc.tiles.share}</span>
                <b className="font-heading text-[16px] font-semibold tabular-nums tracking-[-0.03em]">{f.share}</b>
              </span>
              <span className={tile}>
                <span className="block text-[10.5px] text-hint">{t.doc.tiles.fraud}</span>
                <b className="text-body font-bold">{t.doc.fraud(data.risk)}</b>
              </span>
            </div>
            {t.sections.map((sec, i) => (
              <div key={sec.id} id={sec.id} className="flex scroll-mt-4 flex-col gap-1.5 border-b border-line pb-3.5">
                <span className="font-mono text-[10.5px] text-amber-deep">{String(i + 1).padStart(2, "0")}</span>
                <b className="font-heading text-[16px] font-semibold">{sec.title}</b>
                <span className={body}>{sectionBody[sec.id]}</span>
              </div>
            ))}
            <span className="text-label-sm text-hint">{t.doc.footer(data.me.name)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
