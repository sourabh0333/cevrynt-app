import Link from "next/link";
import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { howWeLooked, otherDebt, stackingCheck, statedVsFound } from "@/lib/sample-data/deal-positions";

const title = "m-0 font-heading text-[20px] font-semibold";

function Tick() {
  return (
    <span aria-label="Clear" className="grid h-5 w-5 flex-none place-items-center rounded-full bg-teal text-white">
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

/** "Stacking check": five checks on the sand card and the Keep watching link. */
export function StackingCard() {
  return (
    <article aria-labelledby="h-stack" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-stack" className={title}>{stackingCheck.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{stackingCheck.chip}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{stackingCheck.intro}</span>
      <div className="flex flex-col gap-1.5">
        {stackingCheck.checks.map((c) => (
          <span key={c.label} className="flex items-center gap-2.5 rounded-tile bg-white/70 px-3 py-2.5 text-[12.5px]">
            {c.done ? <Tick /> : <span aria-label="Waiting" className="box-border h-5 w-5 flex-none rounded-full border-2 border-ring-wait" />}
            <span className="flex-1">
              {c.label}
              {c.detail ? <span className="block text-label-sm text-hint">{c.detail}</span> : null}
            </span>
            <b className={c.done ? "" : "text-hint"}>{c.result}</b>
          </span>
        ))}
      </div>
      <Link href={stackingCheck.cta.href} className="mt-auto grid h-10 place-items-center rounded-pill bg-teal text-[12.5px] font-semibold text-white no-underline">
        {stackingCheck.cta.label}
      </Link>
    </article>
  );
}

// Flexible columns instead of the design's 560px minimum: no sideways scroll.
const vsGrid = "grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_80px] items-center gap-3";

/** "What the merchant told you vs what we found": four question rows, 4 of 4 match. */
export function StatedVsFoundCard() {
  return (
    <Card as="article" aria-labelledby="h-vs" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-vs" className={title}>{statedVsFound.title}</h2>
          <div className="mt-[3px] text-label text-hint">{statedVsFound.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{statedVsFound.chip}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${vsGrid} px-3.5 pb-1 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {statedVsFound.columns.map((c, i) => (
            <span key={c} className={i === 3 ? "text-right" : ""}>{c}</span>
          ))}
        </div>
        {statedVsFound.rows.map((r) => (
          <div key={r.question} className={`${vsGrid} rounded-[16px] bg-tile px-3.5 py-3 text-body-sm`}>
            <span className="truncate text-muted">{r.question}</span>
            <b className={`truncate ${r.num ? "font-heading tabular-nums tracking-[-0.03em]" : ""}`}>{r.stated}</b>
            <b className={`truncate ${r.num ? "font-heading tabular-nums tracking-[-0.03em]" : ""}`}>{r.found}</b>
            <span className="justify-self-end rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">{r.result}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** "How we looked": 14 recurring payees, one of them the advance. The split bar grows in. */
export function HowWeLookedCard() {
  const advance = howWeLooked.groups.find((g) => g.advance)?.count ?? 0;
  const style: CSSProperties & { "--delay"?: string } = { "--delay": "0.2s" };
  return (
    <article aria-labelledby="h-how" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-how" className={title}>{howWeLooked.title}</h2>
        <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{howWeLooked.total}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{howWeLooked.intro}</span>
      <div role="img" aria-label={`${advance} of ${howWeLooked.total} recurring payees is an advance`} className="anim-grow-x flex h-3 gap-0.5 overflow-hidden rounded-[6px]" style={style}>
        <span className="bg-purple" style={{ flex: advance }} />
        <span className="bg-ink/18" style={{ flex: howWeLooked.total - advance }} />
      </div>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {howWeLooked.groups.map((g) => (
          <span key={g.label} className="flex justify-between rounded-[12px] bg-white/70 px-3 py-[9px]">
            <span className="inline-flex items-center gap-2">
              {g.advance ? <span className="h-[9px] w-[9px] rounded-[3px] bg-purple" /> : null}
              {g.label}
            </span>
            <b>{g.count}</b>
          </span>
        ))}
      </div>
      <Link href={howWeLooked.link.href} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {howWeLooked.link.label}
      </Link>
    </article>
  );
}

/** "Other debt checked": six categories, none found, and the card-autopay note. */
export function OtherDebtCard() {
  return (
    <Card as="article" aria-labelledby="h-other" className="gap-2.5">
      <div className="flex items-center justify-between">
        <h2 id="h-other" className={title}>{otherDebt.title}</h2>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{otherDebt.chip}</span>
      </div>
      <span className="text-[12.5px] text-muted">{otherDebt.intro}</span>
      <div className="grid grid-cols-2 gap-1.5">
        {otherDebt.categories.map((c) => (
          <span key={c.label} className="rounded-tile bg-tile px-3 py-2.5 text-[12.5px]">
            {c.label}
            <b className="block text-teal-deep">{c.result}</b>
          </span>
        ))}
      </div>
      <span className="mt-auto rounded-tile bg-amber-tint px-3 py-2.5 text-label text-amber-mute">{otherDebt.note}</span>
    </Card>
  );
}
