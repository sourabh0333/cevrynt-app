import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tick } from "@/components/deals/integrity/Tick";
import { dealTabHref } from "@/lib/copy/deal";
import { nameInitials, ownerCopy as t } from "@/lib/copy/deal-business";
import type { DealBusiness, Id } from "@/lib/data/types";

type Owner = DealBusiness["owners"][number];

/**
 * The owner card from design/Deal-Business.html: the identity chips and
 * "+ Add owner", the owner's identity checks (any still waiting on the
 * cream tile) and the related-business note that links to the Integrity
 * tab. No hover.
 */
export function OwnerCard({ id, owner, totalShare, related }: { id: Id; owner: Owner; totalShare: number; related: DealBusiness["related"] }) {
  return (
    <Card as="article" aria-labelledby="h-own" padding={false} className="col-span-2 gap-4 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span
            className="grid h-14 w-14 flex-none place-items-center rounded-[18px] text-[18px] font-bold text-sand-text"
            style={{ background: "linear-gradient(140deg, #E8C9A1, #C99A6B)" }}
          >
            {nameInitials(owner.name)}
          </span>
          <div>
            <span className="text-cap font-semibold uppercase text-hint">{t.caption(owner.share)}</span>
            <h2 id="h-own" className="mt-0.5 mb-0 font-heading text-[22px] font-semibold">{owner.name}</h2>
            <span className="text-label text-hint">{t.contact(owner.email, owner.phone)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-[7px] rounded-pill bg-mint-bg px-3 py-1.5 text-label font-semibold text-teal-dark">
            <span className="h-[7px] w-[7px] rounded-full bg-teal" />
            {owner.identityVerified ? t.chips.verified : t.chips.unverified}
          </span>
          {owner.guarantor ? <span className="inline-flex items-center rounded-pill bg-tile px-3 py-1.5 text-label font-semibold">{t.chips.guarantee}</span> : null}
          <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">
            {t.addOwner}
          </button>
        </div>
      </div>
      <span className="-mt-1.5 text-label text-muted">{t.note(totalShare)}</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
        {owner.checks.map((c) => (
          <div key={c.label} className={`flex items-start gap-2.5 rounded-[16px] p-3 ${c.done ? "bg-tile" : "bg-amber-tint"}`}>
            {c.done ? <Tick /> : <span aria-label={t.waiting} className="box-border h-[22px] w-[22px] flex-none rounded-full border-2 border-ring-wait" />}
            <span className="min-w-0">
              <b className="block text-body-sm">{c.label}</b>
              <span className={`text-[11.5px] ${c.done ? "text-hint" : "text-amber-mute"}`}>{c.detail}</span>
            </span>
          </div>
        ))}
      </div>
      {related ? (
        <div className="flex flex-wrap items-center gap-3 rounded-[18px] bg-amber-tint p-3.5">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-tile bg-card text-amber-deep">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6" />
            </svg>
          </span>
          <span className="min-w-0 flex-[1_1_220px] text-[12.5px]">
            <b>{t.related.title(related.name)}</b>
            <span className="block text-amber-mute">{t.related.text(related)}</span>
          </span>
          <Link href={dealTabHref(id, { path: "/integrity" })} className="whitespace-nowrap text-label font-semibold text-amber-deep no-underline">
            {t.related.link}
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
