import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { formatOffer, type OfferInput, type OfferResult } from "@/lib/offer-math";
import { merchantPays as t } from "@/lib/sample-data/deal-offer";

const tile = "rounded-tile bg-teal/7 px-3 py-2.5";
const num = "block font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]";

/** maxShare: the policy's debt limit (0.65), from the data layer */
type Props = { offer: OfferInput; result: OfferResult; maxShare: number; onUse: () => void };

/**
 * "The merchant pays" from design/Deal-Offer.html: the live result of the
 * builder on the mint card, worded by formatOffer so the disclosure shows
 * the same text. The debt-share meter grows in once and then eases as the
 * offer changes. "Use this offer" loads the figures into the disclosure
 * and the send card. No hover.
 */
export function MerchantPays({ offer, result: r, maxShare, onUse }: Props) {
  const f = formatOffer(offer, r);
  const barStyle: CSSProperties & { "--delay"?: string } = {
    width: `${Math.min(100, (r.share / maxShare) * 100).toFixed(1)}%`,
    "--delay": "0.2s",
  };
  return (
    <article
      aria-labelledby="h-live"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink"
    >
      <div className="flex items-center justify-between">
        <h2 id="h-live" className="m-0 font-sans text-body-sm font-semibold tracking-normal text-muted">{t.title}</h2>
        <span className={`rounded-pill px-2.5 py-1 text-label-sm font-semibold ${r.withinPolicy ? "bg-mint text-teal-dark" : "bg-red-light text-red-deep"}`}>
          {r.withinPolicy ? t.verdict.ok : t.verdict.over}
        </span>
      </div>
      <div aria-live="polite" className="contents">
        <b className="font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
          {f.payment}
          <span className="text-[15px] font-medium text-muted"> {f.per}</span>
        </b>
        <span className="text-[12.5px] text-muted">
          {f.count} · {t.total} {f.payback}
        </span>
        <span className="self-start rounded-pill bg-white/10 px-2.5 py-1 text-[11.5px] font-semibold text-muted">
          {offer.method === "split" ? t.collect.split(f.cardShare) : t.collect.ach}
        </span>
        <div className="rounded-[16px] border border-teal/7 bg-teal/7 p-3">
          <div className="flex justify-between text-label">
            <span className="text-muted">{t.share.label}</span>
            <b>{f.share}</b>
          </div>
          <div className="relative mt-2 h-2 rounded-[4px] bg-teal/7">
            <div className={`anim-grow-x h-full rounded-[4px] transition-[width] duration-500 ${r.withinPolicy ? "bg-mint" : "bg-red-light"}`} style={barStyle} />
            <span className="absolute top-[-4px] right-0 h-4 w-0.5 rounded-[1px] bg-red-light" />
          </div>
          <div className="mt-1.5 flex justify-between text-[10.5px] text-muted">
            <span>{t.share.zero}</span>
            <span>{t.share.max(maxShare)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <span className={tile}>
            <span className="text-label-sm text-muted">{t.tiles.net}</span>
            <b className={num}>{f.net}</b>
          </span>
          <span className={tile}>
            <span className="text-label-sm text-muted">{t.tiles.apr}</span>
            <b className={num}>{f.apr}</b>
          </span>
          <span className={tile}>
            <span className="text-label-sm text-muted">{t.tiles.commission}</span>
            <b className={num}>{f.commission}</b>
          </span>
          <span className={tile}>
            <span className="text-label-sm text-muted">{t.tiles.margin}</span>
            <b className={`${num} text-teal-deep`}>{f.margin}</b>
          </span>
        </div>
        <span className="text-[11.5px] text-muted">{t.renew(f.renewMonth)}</span>
      </div>
      <Button glow className="mt-auto h-[46px]" onClick={onUse}>
        {t.cta}
      </Button>
    </article>
  );
}
