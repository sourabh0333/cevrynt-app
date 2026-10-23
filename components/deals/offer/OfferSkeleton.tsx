import { Skeleton, SkeletonPage } from "@/components/ui/Skeleton";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

/**
 * The Offer & disclosures tab while the deal's offer loads: static grey
 * blocks in the shape of the builder beside what the merchant pays, the
 * presets heading and its three cards, early payoff beside the offer
 * history, and the disclosure beside the send card, at the heights the
 * real ones take (1440 wide), so nothing jumps when the content fades in.
 */
export function OfferSkeleton() {
  return (
    <SkeletonPage>
      <div className={row}>
        <Skeleton className={`h-[498px] rounded-card-lg ${span2}`} />
        <Skeleton className="h-[498px] rounded-card-lg" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-[52px] w-[320px] max-w-full rounded-tile" />
        <div className={row}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[205px] rounded-[26px]" />
          ))}
        </div>
      </div>
      {["h-[273px]", "h-[503px]"].map((h) => (
        <div key={h} className={row}>
          <Skeleton className={`${h} rounded-card-lg ${span2}`} />
          <Skeleton className={`${h} rounded-card-lg`} />
        </div>
      ))}
    </SkeletonPage>
  );
}
