import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { dealTabHref } from "@/lib/copy/deal";
import { howWeLookedCopy, otherDebtCopy, stackingCopy, statedVsFoundCopy } from "@/lib/copy/deal-positions";
import type { DealPositions, Id } from "@/lib/data/types";

const title = "m-0 font-heading text-[20px] font-semibold";

function Tick() {
  return (
    <span aria-label={stackingCopy.clear} className="grid h-5 w-5 flex-none place-items-center rounded-full bg-teal text-white">
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

/** "Stacking check": the deal's checks on the sand card and the Keep watching link. */
export function StackingCard({ positions }: { positions: DealPositions }) {
  const t = stackingCopy;
  return (
    <article aria-labelledby="h-stack" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-stack" className={title}>{t.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.chip(positions.stackingSigns)}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{t.intro}</span>
      <div className="flex flex-col gap-1.5">
        {positions.stacking.map((c) => (
          <span key={c.label} className="flex items-center gap-2.5 rounded-tile bg-white/70 px-3 py-2.5 text-[12.5px]">
            {c.done ? <Tick /> : <span aria-label={t.waiting} className="box-border h-5 w-5 flex-none rounded-full border-2 border-ring-wait" />}
            <span className="flex-1">
              {c.label}
              {c.detail ? <span className="block text-label-sm text-hint">{c.detail}</span> : null}
            </span>
            <b className={c.done ? "" : "text-hint"}>{c.result}</b>
          </span>
        ))}
      </div>
      <Link href={t.cta.href} className="mt-auto grid h-10 place-items-center rounded-pill bg-teal text-[12.5px] font-semibold text-white no-underline">
        {t.cta.label}
      </Link>
    </article>
  );
}

// Flexible columns instead of the design's 560px minimum: no sideways scroll.
const vsGrid = "grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_80px] items-center gap-3";

/** "What the merchant told you vs what we found": the deal's question rows and how many match. */
export function StatedVsFoundCard({ positions }: { positions: DealPositions }) {
  const t = statedVsFoundCopy;
  const rows = positions.statedVsFound;
  const matched = rows.filter((r) => r.result !== "mismatch").length;
  return (
    <Card as="article" aria-labelledby="h-vs" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-vs" className={title}>{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{t.chip(matched, rows.length)}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${vsGrid} px-3.5 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {t.columns.map((c, i) => (
            <span key={c} className={i === 3 ? "text-right" : ""}>{c}</span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.question} className={`${vsGrid} rounded-[16px] bg-tile px-3.5 py-3 text-body-sm`}>
            <span className="truncate text-muted">{r.question}</span>
            <b className={`truncate ${r.numeric ? "font-heading tabular-nums tracking-[-0.03em]" : ""}`}>{r.stated}</b>
            <b className={`truncate ${r.numeric ? "font-heading tabular-nums tracking-[-0.03em]" : ""}`}>{r.found}</b>
            <span className="justify-self-end rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">{t.result[r.result]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** "How we looked": the recurring payees checked, and how many are advances. The split bar grows in. */
export function HowWeLookedCard({ id, positions }: { id: Id; positions: DealPositions }) {
  const t = howWeLookedCopy;
  const groups = positions.recurringPayees;
  const total = groups.reduce((s, g) => s + g.count, 0);
  const advance = groups.filter((g) => g.advance).reduce((s, g) => s + g.count, 0);
  const style: CSSProperties & { "--delay"?: string } = { "--delay": "0.2s" };
  return (
    <article aria-labelledby="h-how" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-how" className={title}>{t.title}</h2>
        <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{total}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{t.intro}</span>
      <div role="img" aria-label={t.aria(advance, total)} className="anim-grow-x flex h-3 gap-0.5 overflow-hidden rounded-[6px]" style={style}>
        <span className="bg-purple" style={{ flex: advance }} />
        <span className="bg-ink/18" style={{ flex: total - advance }} />
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {groups.map((g) => (
          <span key={g.label} className="flex justify-between rounded-[12px] bg-white/70 px-3 py-[9px]">
            <span className="inline-flex items-center gap-2">
              {g.advance ? <span className="h-[9px] w-[9px] rounded-[3px] bg-purple" /> : null}
              {g.label}
            </span>
            <b>{g.count}</b>
          </span>
        ))}
      </div>
      <Link href={`${dealTabHref(id, { path: "/cash-flow" })}#transactions`} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {t.link}
      </Link>
    </article>
  );
}

/** "Other debt checked": the debt categories looked for, and the card-autopay note. */
export function OtherDebtCard({ positions }: { positions: DealPositions }) {
  const t = otherDebtCopy;
  const found = positions.otherDebt.filter((c) => c.found).length;
  return (
    <Card as="article" aria-labelledby="h-other" className="gap-2.5">
      <div className="flex items-center justify-between">
        <h2 id="h-other" className={title}>{t.title}</h2>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{found ? t.found(found) : t.none}</span>
      </div>
      <span className="text-[12.5px] text-muted">{t.intro}</span>
      <div className="grid grid-cols-2 gap-1.5">
        {positions.otherDebt.map((c) => (
          <span key={c.category} className="rounded-tile bg-tile px-3 py-2.5 text-[12.5px]">
            {c.category}
            <b className="block text-teal-deep">{t.result(c.found)}</b>
          </span>
        ))}
      </div>
      <span className="mt-auto rounded-tile bg-amber-tint px-3 py-2.5 text-label text-amber-mute">{t.note(positions.cardAutopay)}</span>
    </Card>
  );
}
