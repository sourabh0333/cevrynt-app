import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { earlyPayoffCard as t, offerHistory } from "@/lib/copy/deal-offer";
import type { DealOffer, Pricing } from "@/lib/data/types";
import { earlyPayoff, money, type OfferInput } from "@/lib/offer-math";

/** "Early payoff discount": Pricing's tiers and the full term, from the shared math. */
export function EarlyPayoffCard({ offer, table, owner }: { offer: OfferInput; table: Pricing["earlyPayoff"]; owner: { name: string; subject: string } | null }) {
  const tiers = earlyPayoff(offer, table);
  return (
    <Card as="article" aria-labelledby="h-early" padding={false} className="col-span-2 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-early" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          {owner ? <div className="mt-[3px] text-label text-hint">{t.subtitle(owner)}</div> : null}
        </div>
        <Link href={t.link.href} className="text-label font-semibold text-teal no-underline">
          {t.link.label}
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2" aria-live="polite">
        {tiers.map((tier) => {
          const full = tier.days === null;
          return (
            <div key={tier.days ?? "full"} className={`flex flex-col gap-1 rounded-[18px] p-3.5 ${full ? "bg-tile" : "bg-mint-light"}`}>
              <span className="text-[11.5px] text-hint">{full ? t.fullTerm : t.within(tier.days!)}</span>
              <b className="font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em]">{money(tier.total)}</b>
              <span className={`text-[11.5px] font-semibold ${full ? "text-hint" : "text-teal-deep"}`}>{full ? t.noDiscount : t.saves(money(tier.saves))}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/** "Offer history": the deal's rounds so far and the empty slot for counter-offers. */
export function OfferHistoryCard({ history }: { history: DealOffer["history"] }) {
  return (
    <article aria-labelledby="h-hist" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-hist" className="m-0 font-heading text-[20px] font-semibold">{offerHistory.title}</h2>
      {history.map((e) => (
        <div key={`${e.kind}-${e.at}`} className="flex gap-2.5 rounded-tile bg-white/75 px-3 py-[11px] text-[12.5px]">
          <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${offerHistory.tone(e) === "teal" ? "bg-teal" : "bg-grey-dot"}`} />
          <span>
            <b>{offerHistory.eventTitle[e.kind](e)}</b>
            <span className="block text-[11.5px] text-hint">{offerHistory.note(e)}</span>
          </span>
        </div>
      ))}
      <div className="flex gap-2.5 rounded-tile border-[1.5px] border-dashed border-line-dashed px-3 py-[11px] text-[12.5px] text-muted">
        <span className="mt-1.5 box-border h-2 w-2 flex-none rounded-full border-2 border-grey-dot" />
        <span>{offerHistory.empty}</span>
      </div>
    </article>
  );
}
