import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tick } from "@/components/deals/integrity/Tick";
import { owner } from "@/lib/sample-data/deal-business";

/**
 * The owner card for Elena Brooks from design/Deal-Business.html: the
 * identity chips and "+ Add owner", six identity checks (credit report
 * still waiting on the cream tile) and the related-business note that
 * links to the Integrity tab. No hover.
 */
export function OwnerCard() {
  return (
    <Card as="article" aria-labelledby="h-own" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span
            className="grid h-14 w-14 flex-none place-items-center rounded-[18px] text-[18px] font-bold text-sand-text"
            style={{ background: "linear-gradient(140deg, #E8C9A1, #C99A6B)" }}
          >
            {owner.initials}
          </span>
          <div>
            <span className="text-cap font-semibold uppercase text-hint">{owner.caption}</span>
            <h2 id="h-own" className="mt-0.5 mb-0 font-heading text-[22px] font-semibold">{owner.name}</h2>
            <span className="text-label text-hint">{owner.contact}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-[7px] rounded-pill bg-mint-bg px-3 py-1.5 text-label font-semibold text-teal-dark">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {owner.chips.verified}
          </span>
          <span className="inline-flex items-center rounded-pill bg-tile px-3 py-1.5 text-label font-semibold">{owner.chips.guarantee}</span>
          <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">
            {owner.addOwner}
          </button>
        </div>
      </div>
      <span className="-mt-1.5 text-label text-muted">{owner.note}</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
        {owner.checks.map((c) => (
          <div key={c.label} className={`flex items-start gap-2.5 rounded-[16px] p-3 ${c.done ? "bg-tile" : "bg-amber-tint"}`}>
            {c.done ? <Tick /> : <span aria-label="Waiting" className="box-border h-[22px] w-[22px] flex-none rounded-full border-2 border-ring-wait" />}
            <span className="min-w-0">
              <b className="block text-body-sm">{c.label}</b>
              <span className={`text-[11.5px] ${c.done ? "text-hint" : "text-amber-mute"}`}>{c.detail}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-amber-tint p-3.5">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-tile bg-card text-amber-deep">
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6" />
          </svg>
        </span>
        <span className="min-w-0 flex-[1_1_220px] text-[12.5px]">
          <b>{owner.related.title}</b>
          <span className="block text-amber-mute">{owner.related.text}</span>
        </span>
        <Link href={owner.related.link.href} className="whitespace-nowrap text-label font-semibold text-amber-deep no-underline">
          {owner.related.link.label}
        </Link>
      </div>
    </Card>
  );
}
