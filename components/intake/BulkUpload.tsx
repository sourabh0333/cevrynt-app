import Link from "next/link";
import { bulkCopy as c, folderRow } from "@/lib/copy/intake";
import type { BulkData } from "@/lib/data/views/intake";
import { BulkOptions } from "./BulkOptions";
import { FolderPreview } from "./FolderPreview";

type Tone = "light" | "mint" | "cream" | "stone";
const tileTone: Record<Tone, { box: string; text: string; cap: string }> = {
  light: { box: "border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]", text: "text-ink", cap: "text-muted" },
  mint: { box: "bg-mint-bg", text: "text-teal-dark", cap: "text-teal-dark" },
  cream: { box: "bg-cream", text: "text-amber-dark", cap: "text-amber-dark" },
  stone: { box: "bg-card-stone", text: "text-ink", cap: "text-ink" },
};

/**
 * Bulk folder ZIP, from design/Intake-Bulk.html, for the ZIP in `data` (from
 * the data layer). The counts, the summary and the Create card are worked
 * out from the folder rows; statement counts are out of the policy's
 * required months.
 */
export function BulkUpload({ data }: { data: BulkData }) {
  const { bulk } = data;
  const rows = bulk.folders.map((f) => folderRow(f, data.policy));
  const ready = rows.filter((r) => r.result.kind === "chip" && r.result.label === "Ready").length;
  const attention = rows.filter((r) => r.attention).length;
  const declined = rows.filter((r) => r.result.kind === "chip" && r.result.label === "Declined").length;
  const summary: { value: number; label: string; tone: Tone }[] = [
    { value: rows.length, label: c.summary.folders, tone: "light" },
    { value: ready, label: c.summary.ready, tone: "mint" },
    { value: attention, label: c.summary.attention, tone: "cream" },
    { value: declined, label: c.summary.declined, tone: "stone" },
  ];
  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={c.back.href} className="inline-flex items-center gap-1.5 text-cap font-semibold uppercase text-muted no-underline">
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {c.back.label}
          </Link>
          <h1 className="mt-2 mb-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            {c.title}
          </h1>
        </div>
        <span className="max-w-[360px] text-[12.5px] text-hint">{c.note}</span>
      </header>

      {/* Drop strip */}
      <section
        aria-label={c.uploaded}
        className="flex flex-wrap items-center gap-3.5 rounded-[26px] border-[1.5px] border-dashed border-line-dashed bg-tile px-4 py-3.5 text-ink"
      >
        <span className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-ink text-mint">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </span>
        <span className="min-w-0 flex-[1_1_240px]">
          <b className="block truncate font-mono text-[13.5px]">{bulk.file.name}</b>
          <span className="text-[11.5px] text-hint">{c.fileMeta(bulk)}</span>
        </span>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
          {c.another}
        </button>
      </section>

      {/* Summary */}
      {/* Fixed 4 → 2 columns so the tiles never wrap as 3 + 1 (layout rule 5). */}
      <section aria-label={c.summary.label} className="grid grid-cols-4 gap-3.5 max-[820px]:grid-cols-2">
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
        <FolderPreview rows={rows} />
        <aside className="flex min-w-0 max-w-full flex-[1_1_300px] flex-col gap-3.5">
          <BulkOptions options={bulk.options} />
          <article className="flex flex-1 flex-col gap-2.5 rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink">
            <span className="text-cap font-semibold uppercase text-muted">{c.create.cap}</span>
            <b className="font-heading text-[22px] font-semibold">{c.create.title(ready)}</b>
            <span className="text-[12.5px] text-muted">{c.create.text(ready, attention)}</span>
            <Link
              href={c.create.href}
              className="mt-auto grid h-[50px] place-items-center rounded-pill bg-teal text-[13.5px] font-semibold text-white no-underline shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
            >
              {c.create.cta(ready)}
            </Link>
          </article>
        </aside>
      </div>

      {/* Earlier batch */}
      <section aria-labelledby="h-earlier" className="flex flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
        <div className="flex flex-wrap items-end justify-between gap-2.5">
          <div>
            <h2 id="h-earlier" className="m-0 font-heading text-[19px] font-semibold">{c.earlier.title}</h2>
            <p className="mt-[3px] mb-0 text-[12.5px] text-hint">
              <span className="font-mono">{bulk.earlier.file}</span> · {c.earlier.meta(bulk.earlier)}
            </p>
          </div>
          <Link href={c.earlier.link.href} className="text-cap font-semibold uppercase text-teal no-underline">
            {c.earlier.link.label}
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2">
          {c.earlier.steps(bulk.earlier).map((s) => (
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
