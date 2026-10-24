import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { commissionsCopy, expiringCopy as expiring, lostCopy, moneySentCopy as moneySent } from "@/lib/copy/offers";
import type { FundingSummary, IsoDateTime, PipelineOffer, Release } from "@/lib/data/types";
import { money } from "@/lib/format";

const title = "m-0 font-heading text-[19px] font-semibold";

/** "Expiring soon" from design/Offers.html: offers still out with an end date, soonest first, Extend on the ones due today, and Nudge brokers. */
export function ExpiringCard({ offers, now }: { offers: PipelineOffer[]; now: IsoDateTime }) {
  const list = offers
    .filter((o) => o.stage === "sent" && o.expiresAt)
    .sort((a, b) => a.expiresAt!.localeCompare(b.expiresAt!))
    .map((o) => {
      const today = expiring.when(o.expiresAt!, now).startsWith("Today");
      return { name: o.merchant, detail: expiring.detail(o), when: expiring.when(o.expiresAt!, now), today };
    });
  return (
    <article aria-labelledby="h-exp" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-exp" className={title}>{expiring.title}</h2>
        <span className="rounded-pill bg-card px-[9px] py-[3px] text-label-sm font-semibold text-amber-deep">{list.length}</span>
      </div>
      {list.map((o) => (
        <div key={o.name} className="flex items-center gap-2.5 rounded-tile bg-white/75 px-3 py-[11px]">
          <span className="min-w-0 flex-1">
            <b className="block truncate text-body-sm">{o.name}</b>
            <span className="text-[11.5px] text-hint">{o.detail}</span>
          </span>
          {o.today ? (
            <span className="flex flex-col items-end gap-1">
              <b className="whitespace-nowrap text-label text-coral-text">{o.when}</b>
              <button type="button" className="h-[26px] cursor-pointer rounded-pill border-0 bg-cream px-2.5 text-label-sm font-semibold text-ink">
                {expiring.extend}
              </button>
            </span>
          ) : (
            <b className="whitespace-nowrap text-label text-amber-text">{o.when}</b>
          )}
        </div>
      ))}
      <Button className="mt-auto h-[38px] w-full text-[12.5px]">{expiring.nudge}</Button>
    </article>
  );
}

/** "Broker commissions": what's owed on today's funded deals at Pricing's broker points, and the split by broker. */
export function CommissionsCard({ offers, points }: { offers: PipelineOffer[]; points: number }) {
  const commissions = commissionsCopy;
  const rows = commissions.rows(offers.filter((o) => o.stage === "funded"), points);
  return (
    <article
      aria-labelledby="h-comm"
      className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-center justify-between">
        <h2 id="h-comm" className={title}>{commissions.title}</h2>
        <span className="rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-teal-deep">{commissions.chip}</span>
      </div>
      <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{money(rows.reduce((n, r) => n + r.amount, 0))}</b>
      <span className="text-label text-muted">{commissions.note}</span>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {rows.map((r) => (
          <span key={r.broker} className="flex justify-between rounded-[12px] bg-teal/7 px-3 py-[9px]">
            <span>{r.broker}</span>
            <b>{money(r.amount)}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

const chip = { green: "bg-mint-bg text-teal-dark", blue: "bg-blue-bg text-blue-text", red: "bg-red-bg text-red-text" };

/** "Money sent today": each transfer with its amount, method, first payment date and trace reference. */
export function MoneySentCard({ releases }: { releases: (Release & { releasedBy: string })[] }) {
  const transfers = releases.map((r) => ({
    name: r.merchant,
    ...moneySent.status(r),
    amount: money(r.amount),
    method: moneySent.method(r),
    first: moneySent.first(r),
    ref: moneySent.ref(r, r.releasedBy),
  }));
  return (
    <Card as="section" aria-labelledby="h-sent" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-sent" className="m-0 font-heading text-[20px] font-semibold">{moneySent.title}</h2>
          <div className="mt-[3px] text-label text-hint">{moneySent.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{moneySent.chip(releases.filter((r) => r.status === "returned").length)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 max-[760px]:grid-cols-1">
        {transfers.map((x) => (
          <div key={x.name} className="flex flex-col gap-2.5 rounded-tile-lg bg-tile p-4">
            <div className="flex items-center justify-between gap-2">
              <b className="text-body">{x.name}</b>
              <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-[10.5px] font-semibold ${chip[x.tone]}`}>{x.text}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-label">
              <span>
                <span className="block text-label-sm text-hint">{moneySent.labels.amount}</span>
                <b className="font-heading font-semibold tabular-nums tracking-[-0.03em]">{x.amount}</b>
              </span>
              <span>
                <span className="block text-label-sm text-hint">{moneySent.labels.method}</span>
                <b>{x.method}</b>
              </span>
              <span>
                <span className="block text-label-sm text-hint">{moneySent.labels.first}</span>
                <b>{x.first}</b>
              </span>
            </div>
            <span className="truncate font-mono text-label-sm text-hint">{x.ref}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** "Offers that didn't fund": the reasons with their share bars, which grow in once. */
export function LostOffersCard({ summary }: { summary: FundingSummary }) {
  const lostOffers = lostCopy;
  const lost = summary.lost.reduce((n, r) => n + r.count, 0);
  const reasons = summary.lost.map((r) => ({ count: r.count, ...lostOffers.reason(r.reason), percent: lostOffers.percent(r.count, lost) }));
  return (
    <Card as="section" aria-labelledby="h-lost" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-lost" className="m-0 font-heading text-[20px] font-semibold">{lostOffers.title}</h2>
          <div className="mt-[3px] text-label text-hint">{lostOffers.subtitle(lost, summary.approved)}</div>
        </div>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold">{lostOffers.chip(lost, summary.approved)}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 max-[980px]:grid-cols-2">
        {reasons.map((r, i) => (
          <div key={r.label} className="rounded-[18px] bg-tile p-3.5">
            <b className="block font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{r.count}</b>
            <span className="text-[12.5px]">{r.label}</span>
            <ProgressBar value={r.percent} color={r.color} height={6} track="line" delay={0.1 + i * 0.08} className="mt-2" />
          </div>
        ))}
      </div>
      <span className="text-[12.5px] text-muted">{lostOffers.note(summary.medianMinutesToOffer)}</span>
    </Card>
  );
}
