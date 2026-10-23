import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { disclosureFor, harborFigures, type OfferInput, type OfferPolicy } from "@/lib/offer-math";
import { disclosure as t, sendOffer } from "@/lib/sample-data/deal-offer";

const cell = "rounded-[12px] bg-tile p-3";
const cap = "block text-label-sm text-hint";
const big = "font-heading text-[18px] font-semibold tabular-nums tracking-[-0.03em]";

/**
 * "Cost disclosure" from design/Deal-Offer.html: the Maine template filled
 * in from the chosen offer through disclosureFor, so every figure matches
 * the builder. No hover.
 */
export function DisclosureCard({ offer, policy }: { offer: OfferInput; policy: OfferPolicy }) {
  const d = disclosureFor(offer, harborFigures, policy);
  const f = d.figures;
  const L = t.doc.labels;
  return (
    <Card as="article" aria-labelledby="h-disc" padding={false} className="col-span-2 gap-3.5 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-disc" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <Link href={t.link.href} className="text-label font-semibold text-teal no-underline">
          {t.link.label}
        </Link>
      </div>
      <div className="rounded-[22px] bg-[radial-gradient(120%_100%_at_0%_0%,var(--color-paper),var(--color-paper-deep))] p-[18px]">
        <div className="flex flex-col gap-3 rounded-[12px] bg-card px-[22px] py-5 shadow-[0_18px_40px_-24px_rgba(15,21,19,.45)]" aria-live="polite">
          <div className="flex items-end justify-between gap-2.5 border-b-[1.5px] border-ink pb-2.5">
            <b className="font-heading text-[16px] font-semibold">{t.doc.title}</b>
            <span className="font-mono text-[10.5px] text-hint">{t.doc.ref}</span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
            <span className={cell}>
              <span className={cap}>{L.amount}</span>
              <b className={big}>{f.amount}</b>
              <span className={cap}>{L.receive(f.net)}</span>
            </span>
            <span className={cell}>
              <span className={cap}>{L.charge}</span>
              <b className={big}>{f.charge}</b>
              <span className={cap}>{L.total(f.payback)}</span>
            </span>
            <span className={cell}>
              <span className={cap}>{L.apr}</span>
              <b className={big}>{f.apr}</b>
              <span className={cap}>{L.aprNote}</span>
            </span>
            <span className={cell}>
              <span className={cap}>{L.term}</span>
              <b className={big}>{f.term}</b>
              <span className={cap}>{f.count}</span>
            </span>
            <span className={cell}>
              <span className={cap}>{L.payment}</span>
              <b className={big}>
                {f.payment} {f.per}
              </b>
              <span className={cap}>{L.paymentNote(f.hold)}</span>
            </span>
            <span className={cell}>
              <span className={cap}>{L.early}</span>
              <b className="text-body font-bold">{L.earlyValue}</b>
              <span className={cap}>{L.earlyNote}</span>
            </span>
          </div>
          <span className="text-label-sm text-hint">
            {d.feeLine} {d.payoffLine ? `${d.payoffLine} ` : ""}
            {t.doc.brokerLine(f.commission)} {t.doc.reconcileLine}
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2.5 rounded-tile bg-tile px-3.5 py-3 text-label text-muted">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-px flex-none text-hint">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <span>{t.notice}</span>
      </div>
    </Card>
  );
}

/**
 * "Send the offer": what goes out, who gets it, and the approval rule.
 * Above the underwriter's approval limit ($45K) the senior must sign off first.
 */
export function SendCard({ needsSenior, withinPolicy, approvalLimit }: { needsSenior: boolean; withinPolicy: boolean; approvalLimit: number }) {
  return (
    <article aria-labelledby="h-send" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card-deep p-5 text-ink">
      <h2 id="h-send" className="m-0 font-heading text-[20px] font-semibold">{sendOffer.title}</h2>
      <span className="text-[12.5px] text-grey-text">{sendOffer.intro}</span>
      <div className="flex flex-col gap-1.5">
        {sendOffer.items.map((i) => (
          <span key={i.label} className="flex items-center gap-2.5 rounded-tile bg-white/75 px-3 py-2.5 text-[12.5px]">
            <span className="font-mono text-label-sm text-amber-deep">{i.kind}</span>
            {i.label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[sendOffer.to, sendOffer.expires].map((x) => (
          <span key={x.label} className="rounded-tile bg-white/75 px-3 py-2.5">
            <span className="block text-label-sm text-hint">{x.label}</span>
            <b className="text-[12.5px]">{x.value}</b>
          </span>
        ))}
      </div>
      <div aria-live="polite" className={`rounded-tile px-3 py-2.5 text-label ${needsSenior ? "bg-amber-tint text-amber-mute" : "bg-white/75 text-grey-text"}`}>
        {needsSenior ? sendOffer.approval.senior(approvalLimit) : sendOffer.approval.ok}
      </div>
      <button
        type="button"
        aria-disabled={!withinPolicy}
        className={`mt-auto h-[46px] rounded-pill border-0 text-body-sm font-semibold ${withinPolicy ? "cursor-pointer bg-teal text-white" : "bg-line text-hint-soft"}`}
      >
        {needsSenior ? sendOffer.button.senior : sendOffer.button.ok}
      </button>
    </article>
  );
}
