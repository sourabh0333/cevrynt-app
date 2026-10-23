import { onlineCopy, publicRecordsCopy } from "@/lib/copy/deal-business";
import type { DealBusiness, IsoDateTime } from "@/lib/data/types";

/** "Public records" from design/Deal-Business.html: six categories on the sand card. */
export function PublicRecordsCard({ records, checkedAt }: { records: DealBusiness["publicRecords"]; checkedAt: IsoDateTime }) {
  const t = publicRecordsCopy;
  return (
    <article aria-labelledby="h-pub" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-pub" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{t.chip(records)}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{t.intro}</span>
      <div className="grid grid-cols-2 gap-2">
        {records.map((c) => (
          <span key={c.kind} className="rounded-[16px] bg-white/75 p-3">
            <b className="block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{c.count}</b>
            <span className="text-label text-muted">{t.label(c)}</span>
            {c.detail ? <span className="block text-label-sm text-hint">{c.detail}</span> : null}
          </span>
        ))}
      </div>
      <span className="mt-auto text-[11.5px] text-muted">{t.note(checkedAt)}</span>
    </article>
  );
}

/** "Online presence" from design/Deal-Business.html: four tiles on the light mint card. */
export function OnlinePresenceCard({ online }: { online: DealBusiness["online"] }) {
  const t = onlineCopy;
  return (
    <section
      aria-labelledby="h-web"
      className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-[22px] text-ink"
    >
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-web" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-muted">{t.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint/18 px-2.5 py-1 text-label-sm font-semibold text-teal-deep">{t.chip(online)}</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2.5">
        {t.tiles(online).map((tile) => (
          <span key={tile.label} className="rounded-[18px] border border-white/10 bg-teal/7 p-3.5">
            <span className="text-[11.5px] text-muted">{tile.label}</span>
            {tile.rating ? (
              <b className="block font-heading text-[22px] font-semibold tabular-nums tracking-[-0.03em]">
                {tile.rating}
                <span className="text-label font-medium text-muted">{tile.ratingNote}</span>
              </b>
            ) : (
              <b className="mt-0.5 block truncate text-body">{tile.value}</b>
            )}
            {tile.note ? <span className="text-[11.5px] text-muted">{tile.note}</span> : null}
          </span>
        ))}
      </div>
    </section>
  );
}
