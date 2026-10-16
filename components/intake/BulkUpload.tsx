import Link from "next/link";
import { bulkUpload, createCard, earlierBatch, summary, type SummaryTile } from "@/lib/sample-data/intake-bulk";
import { BulkOptions } from "./BulkOptions";
import { FolderPreview } from "./FolderPreview";

const tileTone: Record<SummaryTile["tone"], { box: string; text: string; cap: string }> = {
  light: { box: "border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]", text: "text-ink", cap: "text-muted" },
  mint: { box: "bg-mint-bg", text: "text-teal-dark", cap: "text-teal-dark" },
  cream: { box: "bg-cream", text: "text-amber-dark", cap: "text-amber-dark" },
  stone: { box: "bg-card-stone", text: "text-ink", cap: "text-ink" },
};

/** Bulk folder ZIP, from design/Intake-Bulk.html. */
export function BulkUpload() {
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/intake" className="inline-flex items-center gap-1.5 text-cap font-semibold uppercase text-muted no-underline">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to intake
          </Link>
          <h1 className="mt-2 mb-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            Bulk folder ZIP
          </h1>
        </div>
        <span className="max-w-[360px] text-[12.5px] text-hint">{bulkUpload.note}</span>
      </header>

      {/* Drop strip */}
      <section
        aria-label="Uploaded ZIP"
        className="flex flex-wrap items-center gap-3.5 rounded-[26px] border-[1.5px] border-dashed border-line-dashed bg-tile px-4 py-3.5 text-ink"
      >
        <span className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-ink text-mint">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </span>
        <span className="min-w-0 flex-[1_1_240px]">
          <b className="block truncate font-mono text-[13.5px]">{bulkUpload.file.name}</b>
          <span className="text-[11.5px] text-hint">{bulkUpload.file.meta}</span>
        </span>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
          Upload a different ZIP
        </button>
      </section>

      {/* Summary */}
      {/* Fixed 4 → 2 columns so the tiles never wrap as 3 + 1 (layout rule 5). */}
      <section aria-label="Summary" className="grid grid-cols-4 gap-3.5 max-[820px]:grid-cols-2">
        {summary.map((t) => {
          const tone = tileTone[t.tone];
          return (
            <div key={t.label} className={`rounded-[28px] p-5 ${tone.box}`}>
              <div className={`font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em] ${tone.text}`}>{t.value}</div>
              <div className={`mt-2 text-cap font-semibold uppercase ${tone.cap}`}>{t.label}</div>
            </div>
          );
        })}
      </section>

      {/* Preview + options: both columns stretch to the same height (layout rule 1). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <FolderPreview />
        <aside className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <BulkOptions />
          <article className="flex flex-1 flex-col gap-2.5 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
            <span className="text-cap font-semibold uppercase text-muted">{createCard.cap}</span>
            <b className="font-heading text-[22px] font-semibold">{createCard.title}</b>
            <span className="text-[12.5px] text-muted">{createCard.text}</span>
            <Link
              href={createCard.href}
              className="mt-auto grid h-[50px] place-items-center rounded-pill bg-teal text-[13.5px] font-semibold text-white no-underline shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
            >
              {createCard.cta}
            </Link>
          </article>
        </aside>
      </div>

      {/* Earlier batch */}
      <section aria-labelledby="h-earlier" className="flex flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-earlier" className="m-0 font-heading text-[19px] font-semibold">{earlierBatch.title}</h2>
            <p className="mt-[3px] mb-0 text-[12.5px] text-hint">
              <span className="font-mono">{earlierBatch.file}</span> · {earlierBatch.meta}
            </p>
          </div>
          <Link href={earlierBatch.href} className="text-cap font-semibold uppercase text-teal no-underline">
            See all batches
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
          {earlierBatch.steps.map((s) => (
            <div key={s.n} className={`rounded-[16px] px-3.5 py-3 ${s.done ? "bg-teal text-white" : "bg-mint-bg"}`}>
              <span className={`font-mono text-label-sm ${s.done ? "text-mint-soft" : "text-teal-deep"}`}>{s.n}</span>
              <b className={`block text-body-sm ${s.done ? "" : "text-teal-dark"}`}>{s.label}</b>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
