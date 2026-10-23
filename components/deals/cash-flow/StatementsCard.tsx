import Link from "next/link";
import { revenueMathCopy, statementsCopy as t } from "@/lib/copy/deal-cash-flow";
import type { DealCashFlow } from "@/lib/data/types";
import { monthName } from "@/lib/format";

/**
 * "Statements" from design/Deal-CashFlow.html: the deeper sand card with
 * the bank card tile, a tile per statement month (each links to its
 * transactions), the quality chips and the two actions. From the deal's
 * statements. No hover.
 */
export function StatementsCard({ cashFlow: cf }: { cashFlow: DealCashFlow }) {
  const { bank } = cf;
  const reconciled = cf.balancesMatch && cf.linesToReview === 0;
  return (
    <article aria-labelledby="h-stmt" className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-stmt" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">
          {reconciled ? t.reconciled : t.toCheck(cf.linesToReview)}
        </span>
      </div>

      <div className="relative flex flex-col gap-[18px] overflow-hidden rounded-[22px] border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[18px]">
        <span aria-hidden="true" className="absolute right-[-40px] bottom-[-60px] h-40 w-40 rounded-full border border-teal/7" />
        <div className="flex items-center justify-between">
          <span className="h-6 w-[34px] rounded-[6px] bg-[linear-gradient(135deg,#E8C9A1,#C99A6B)]" />
          <span className="text-label font-semibold text-muted">{bank.name}</span>
        </div>
        <span className="font-mono text-[17px] tracking-[0.12em]">{t.masked(bank.last4)}</span>
        <div className="flex items-end justify-between gap-2.5">
          <span>
            <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-muted">{t.holderCap}</span>
            <b className="block text-[12.5px]">{bank.holder}</b>
          </span>
          <span className="whitespace-nowrap rounded-pill bg-mint/20 px-[9px] py-[3px] text-[10.5px] font-semibold text-teal-deep">
            {bank.holderMatches ? t.match : t.noMatch}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-label text-grey-text">
          <span>{t.coverage.label}</span>
          <b>{t.coverage.value(cf.months.length)}</b>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {cf.months.map((m) => (
            <Link key={m.month} href={revenueMathCopy.transactionsHref} className="flex flex-col items-center gap-1.5 rounded-[16px] bg-white/70 px-1 py-2.5 text-ink no-underline">
              <span aria-label={t.monthAria} className="grid h-[22px] w-[22px] place-items-center rounded-full bg-teal text-white">
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              </span>
              <b className="text-[12.5px]">{monthName(m.month)}</b>
              <span className="text-[10.5px] text-hint">{t.pages(m.pages)}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {t.quality(cf.balancesMatch, cf.linesRead, cf.linesToReview).map((q) => (
          <span key={q} className="rounded-pill bg-white/70 px-2.5 py-1 text-label-sm">{q}</span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        <button type="button" className="h-10 flex-1 cursor-pointer whitespace-nowrap rounded-pill border-0 bg-teal px-3.5 text-label font-semibold text-white">
          {t.actions.primary}
        </button>
        <button type="button" className="h-10 cursor-pointer whitespace-nowrap rounded-pill border-0 bg-card px-3.5 text-label font-semibold text-ink">
          {t.actions.secondary}
        </button>
      </div>
    </article>
  );
}
