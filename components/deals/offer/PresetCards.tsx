import { computeOffer, money, moneyShort, percent, recommendedOffer, sameOffer, type OfferInput } from "@/lib/offer-math";
import { presets } from "@/lib/sample-data/deal-offer";

/**
 * "Three ways to offer it" from design/Deal-Offer.html and its prototype:
 * three preset cards, each with its amount, daily payment and share of
 * revenue from the shared offer math. Picking one loads it into the
 * builder; the one that matches the builder shows as chosen. No hover.
 */
export function PresetCards({ offer, onPick }: { offer: OfferInput; onPick: (patch: Partial<OfferInput>) => void }) {
  return (
    <section aria-labelledby="h-opts" className="flex flex-col gap-3">
      <div className="px-1 pt-1">
        <h2 id="h-opts" className="m-0 font-heading text-[20px] font-semibold">{presets.title}</h2>
        <div className="mt-[3px] text-label text-hint">{presets.subtitle}</div>
      </div>
      <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
        {presets.items.map((p) => {
          const on = sameOffer(offer, p.offer);
          const input = { ...recommendedOffer, ...p.offer };
          const r = computeOffer(input);
          const cells = [
            [presets.tiles.amount, moneyShort(input.amount)],
            [presets.tiles.daily, money(r.daily)],
            [presets.tiles.share, percent(r.share)],
          ];
          return (
            <button
              key={p.name}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(p.offer)}
              className={`flex cursor-pointer flex-col items-start gap-2.5 rounded-[26px] border-2 bg-card p-[18px] text-left text-ink ${on ? "border-ink" : "border-transparent"}`}
            >
              <span className="flex w-full items-center justify-between">
                <span className={`rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${on ? "bg-teal text-white" : "bg-tile text-grey-text"}`}>{p.tag}</span>
                <span className={`box-border h-[18px] w-[18px] rounded-full ${on ? "border-[6px] border-ink" : "border-2 border-line-dashed"}`} />
              </span>
              <b className="font-heading text-[18px] font-semibold">{p.name}</b>
              <span className="text-[12.5px] text-muted">{p.why}</span>
              <span className="grid w-full grid-cols-3 gap-1.5">
                {cells.map(([label, value]) => (
                  <span key={label} className="rounded-[12px] bg-tile px-2.5 py-2">
                    <span className="block text-[10.5px] text-hint">{label}</span>
                    <b className="font-heading text-body font-semibold tabular-nums tracking-[-0.03em]">{value}</b>
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
