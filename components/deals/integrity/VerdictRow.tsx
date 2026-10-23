import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { checkedCopy, integritySections, verdictCopy } from "@/lib/copy/deal-integrity";
import type { IntegrityTabData } from "@/lib/data/views/deal-tabs";

const title = "m-0 font-heading text-[20px] font-semibold";

/**
 * Row 1 of design/Deal-Integrity.html: the verdict on the mint card (the
 * integrity part of the score, out of the policy's weight for it, the
 * fraud risk chip and headline) across two columns, and "What was checked"
 * with its three tiles. The ring sweeps in once.
 */
export function VerdictRow({ data }: { data: IntegrityTabData }) {
  const { integrity, score } = data;
  const toReview = integrity.evidence.filter((e) => e.needsReview).length;
  const tiles = [
    { value: String(integrity.documents.length), label: checkedCopy.tiles.documents },
    { value: data.linesRead.toLocaleString("en-US"), label: checkedCopy.tiles.lines },
    { value: String(toReview), label: checkedCopy.tiles.review, attention: toReview > 0 },
  ];
  return (
    <section aria-label={integritySections.verdict} className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-verdict"
        className="col-span-2 box-border flex min-w-0 flex-wrap items-center gap-[22px] rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink max-[980px]:col-span-1"
      >
        <Ring value={score.outOf ? (score.points / score.outOf) * 100 : 0} size={120} stroke={12} color="teal" track="teal" ariaLabel={verdictCopy.ringLabel(score.points, score.outOf)}>
          <b className="block font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-ink">{score.points}</b>
          <span className="text-label-sm text-muted">{verdictCopy.of(score.outOf)}</span>
        </Ring>
        <div className="flex min-w-0 flex-1 basis-[260px] flex-col gap-2">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-[5px] text-[11.5px] font-semibold">
            <span className="h-[7px] w-[7px] rounded-full bg-mint" />
            {verdictCopy.risk(integrity.risk)}
          </span>
          <h2 id="h-verdict" className="m-0 font-heading text-[26px] leading-[1.15] font-semibold">
            {integrity.headline}
          </h2>
          <span className="text-body-sm text-muted">{integrity.summary}</span>
        </div>
      </article>

      <Card as="article" aria-labelledby="h-sig" className="gap-2.5">
        <h2 id="h-sig" className={title}>{checkedCopy.title}</h2>
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((t) => (
            <span key={t.label} className={`rounded-[16px] p-3 ${t.attention ? "bg-amber-tint" : "bg-tile"}`}>
              <b className={`block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${t.attention ? "text-amber-deep" : ""}`}>{t.value}</b>
              <span className={`text-label-sm ${t.attention ? "text-amber-mute" : "text-hint"}`}>{t.label}</span>
            </span>
          ))}
        </div>
        <span className="mt-auto text-label text-muted">{checkedCopy.note(integrity.checkSeconds)}</span>
      </Card>
    </section>
  );
}
