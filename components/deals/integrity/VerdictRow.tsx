import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { verdict, whatWasChecked } from "@/lib/sample-data/deal-integrity";

const title = "m-0 font-heading text-[20px] font-semibold";

/**
 * Row 1 of design/Deal-Integrity.html: the verdict on the mint card
 * (16 of 20 ring, fraud risk chip, headline) across two columns, and
 * "What was checked" with its three tiles. The ring sweeps in once.
 */
export function VerdictRow() {
  return (
    <section aria-label="Integrity verdict" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article
        aria-labelledby="h-verdict"
        className="col-span-2 box-border flex min-w-0 flex-wrap items-center gap-[22px] rounded-card-lg border border-mint-border bg-mint-card p-[22px] text-ink max-[980px]:col-span-1"
      >
        <Ring value={(verdict.score / verdict.outOf) * 100} size={120} stroke={12} color="teal" track="teal" ariaLabel={`Integrity ${verdict.score} of ${verdict.outOf}`}>
          <b className="block font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em] text-ink">{verdict.score}</b>
          <span className="text-label-sm text-muted">of {verdict.outOf}</span>
        </Ring>
        <div className="flex min-w-0 flex-1 basis-[260px] flex-col gap-2">
          <span className="inline-flex items-center gap-[7px] self-start rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-[5px] text-[11.5px] font-semibold">
            <span className="h-[7px] w-[7px] rounded-full bg-mint" />
            {verdict.risk}
          </span>
          <h2 id="h-verdict" className="m-0 font-heading text-[26px] leading-[1.15] font-semibold">
            {verdict.title}
          </h2>
          <span className="text-body-sm text-muted">{verdict.text}</span>
        </div>
      </article>

      <Card as="article" aria-labelledby="h-sig" className="gap-2.5">
        <h2 id="h-sig" className={title}>{whatWasChecked.title}</h2>
        <div className="grid grid-cols-3 gap-2">
          {whatWasChecked.tiles.map((t) => (
            <span key={t.label} className={`rounded-[16px] p-3 ${t.attention ? "bg-amber-tint" : "bg-tile"}`}>
              <b className={`block font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${t.attention ? "text-amber-deep" : ""}`}>{t.value}</b>
              <span className={`text-label-sm ${t.attention ? "text-amber-mute" : "text-hint"}`}>{t.label}</span>
            </span>
          ))}
        </div>
        <span className="mt-auto text-label text-muted">{whatWasChecked.note}</span>
      </Card>
    </section>
  );
}
