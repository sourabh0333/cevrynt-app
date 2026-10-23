import { askDealCopy as t } from "@/lib/copy/deal-summary";

/**
 * "Ask about this deal" from design/Deal-Summary.html: the ink spark mark,
 * the title and hint, and the deal's suggested questions as outlined pills.
 * The questions do nothing yet (Ask Cevrynt answers arrive later). No hover.
 */
export function AskDealCard({ prompts }: { prompts: string[] }) {
  return (
    <section
      aria-labelledby="h-ask"
      className="flex flex-wrap items-center gap-4 rounded-card-lg bg-card px-5 py-[18px] text-ink"
    >
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-ink text-mint">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
          <path d="M12 3l2 5.5L20 10l-6 1.5L12 17l-2-5.5L4 10l6-1.5z" />
        </svg>
      </span>
      <div className="flex-[1_1_200px]">
        <h2 id="h-ask" className="m-0 font-heading text-[17px] font-semibold">{t.title}</h2>
        <span className="text-label text-hint">{t.hint}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            className="h-9 cursor-pointer rounded-pill border border-line-soft bg-card px-3.5 text-[12.5px] text-ink"
          >
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}
