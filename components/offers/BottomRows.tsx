import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { commissions, expiring, lostOffers, moneySent } from "@/lib/sample-data/offers";

const title = "m-0 font-heading text-[19px] font-semibold";

/** "Expiring soon" from design/Offers.html: three offers, Extend on the two due today, and Nudge brokers. */
export function ExpiringCard() {
  return (
    <article aria-labelledby="h-exp" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-exp" className={title}>{expiring.title}</h2>
        <span className="rounded-pill bg-card px-[9px] py-[3px] text-label-sm font-semibold text-amber-deep">{expiring.count}</span>
      </div>
      {expiring.offers.map((o) => (
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

/** "Broker commissions": the total owed on today's funded deals and the split by broker. */
export function CommissionsCard() {
  return (
    <article
      aria-labelledby="h-comm"
      className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-center justify-between">
        <h2 id="h-comm" className={title}>{commissions.title}</h2>
        <span className="rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-teal-deep">{commissions.chip}</span>
      </div>
      <b className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{commissions.total}</b>
      <span className="text-label text-muted">{commissions.note}</span>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {commissions.rows.map((r) => (
          <span key={r.broker} className="flex justify-between rounded-[12px] bg-teal/7 px-3 py-[9px]">
            <span>{r.broker}</span>
            <b>{r.amount}</b>
          </span>
        ))}
      </div>
    </article>
  );
}

const chip = { green: "bg-mint-bg text-teal-dark", blue: "bg-blue-bg text-blue-text" };

/** "Money sent today": each transfer with its amount, method, first payment date and trace reference. */
export function MoneySentCard() {
  return (
    <Card as="section" aria-labelledby="h-sent" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-sent" className="m-0 font-heading text-[20px] font-semibold">{moneySent.title}</h2>
          <div className="mt-[3px] text-label text-hint">{moneySent.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{moneySent.chip}</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 max-[760px]:grid-cols-1">
        {moneySent.transfers.map((x) => (
          <div key={x.name} className="flex flex-col gap-2.5 rounded-tile-lg bg-tile p-4">
            <div className="flex items-center justify-between gap-2">
              <b className="text-body">{x.name}</b>
              <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-[10.5px] font-semibold ${chip[x.tone]}`}>{x.status}</span>
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

/** "Offers that didn't fund": four reasons with their share bars, which grow in once. */
export function LostOffersCard() {
  return (
    <Card as="section" aria-labelledby="h-lost" padding={false} className="p-[22px]">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-lost" className="m-0 font-heading text-[20px] font-semibold">{lostOffers.title}</h2>
          <div className="mt-[3px] text-label text-hint">{lostOffers.subtitle}</div>
        </div>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold">{lostOffers.chip}</span>
      </div>
      <div className="grid grid-cols-4 gap-2 max-[980px]:grid-cols-2">
        {lostOffers.reasons.map((r, i) => (
          <div key={r.label} className="rounded-[18px] bg-tile p-3.5">
            <b className="block font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{r.count}</b>
            <span className="text-[12.5px]">{r.label}</span>
            <ProgressBar value={r.percent} color={r.color} height={6} track="line" delay={0.1 + i * 0.08} className="mt-2" />
          </div>
        ))}
      </div>
      <span className="text-[12.5px] text-muted">{lostOffers.note}</span>
    </Card>
  );
}
