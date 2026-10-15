import Link from "next/link";
import { fitCheck, matchedBusiness, otherDocs, packageUpload } from "@/lib/sample-data/intake-package";
import { AssignCard } from "./AssignCard";

const cap = "text-cap font-semibold uppercase text-hint";

/** Single package upload, from design/Intake-Single.html. */
export function PackageUpload() {
  const p = packageUpload;
  const covered = Array.from({ length: p.statements.required }, (_, i) => i < p.statements.covered);
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
            Single package upload
          </h1>
        </div>
        <span className="inline-flex h-10 items-center gap-2 rounded-pill bg-mint-bg px-3.5 text-[12.5px] font-semibold text-teal-dark">
          <span className="h-2 w-2 rounded-full bg-teal" />
          {p.readIn}
        </span>
      </header>

      {/* Drop strip */}
      <section
        aria-label="Uploaded package"
        className="flex flex-wrap items-center gap-3.5 rounded-[26px] border-[1.5px] border-dashed border-line-dashed bg-tile px-4 py-3.5 text-ink"
      >
        <span className="grid h-[46px] w-[46px] place-items-center rounded-[15px] bg-ink text-mint">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M10 12h4M10 16h4" />
          </svg>
        </span>
        <span className="min-w-0 flex-[1_1_240px]">
          <b className="block truncate font-mono text-[13.5px]">{p.file.name}</b>
          <span className="text-[11.5px] text-hint">{p.file.meta}</span>
        </span>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
          Add more files
        </button>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-transparent px-4 text-[12.5px] font-semibold text-red-text">
          Remove
        </button>
      </section>

      {/* Both columns stretch to the same height (layout rule 1). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-files" className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5">
          <article className="flex flex-1 flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
            <div className="flex flex-wrap items-end justify-between gap-2.5">
              <div>
                <h2 id="h-files" className="m-0 font-heading text-[21px] font-semibold">{p.found.title}</h2>
                <p className="mt-[3px] mb-0 text-[12.5px] text-hint">{p.found.subtitle}</p>
              </div>
              <span className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{p.found.count}</span>
            </div>

            <span className={`${cap} mt-1`}>{p.statements.caption}</span>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
              {p.statements.months.map((m) => (
                <div key={m.label} className="rounded-[16px] bg-tile p-3">
                  <b className="text-body-sm">{m.label}</b>
                  <span className="block text-[11.5px] text-hint">{m.note}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-label text-muted">
                <span>Months covered</span>
                <b className="text-teal-deep">
                  {p.statements.covered} of {p.statements.required} required
                </b>
              </div>
              <div className="mt-1.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${p.statements.required}, minmax(0, 1fr))` }}>
                {covered.map((on, i) => (
                  <span key={i} className={`h-2 rounded-[4px] ${on ? "bg-teal" : "bg-ink/10"}`} />
                ))}
              </div>
            </div>

            <span className={`${cap} mt-1.5`}>Other documents</span>
            <div className="flex flex-col gap-2">
              {otherDocs.map((d) => (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 rounded-[16px] px-3.5 py-3 ${d.state === "warn" ? "bg-amber-bg" : "bg-tile"}`}
                >
                  <span className="min-w-0 flex-1">
                    <b className="text-[13.5px]">{d.title}</b>
                    <span className={`block truncate font-mono text-[11.5px] ${d.state === "warn" ? "text-amber-mute" : "text-hint"}`}>
                      {d.file}
                    </span>
                  </span>
                  {d.state === "read" ? (
                    <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">Read</span>
                  ) : (
                    <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
                      {d.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </article>
        </section>

        <aside className="flex min-w-0 max-w-full flex-[1_1_320px] flex-col gap-3.5">
          <article
            aria-labelledby="h-match"
            className="relative flex flex-col gap-3 overflow-hidden rounded-card-lg border border-mint-border bg-mint-card p-5 text-ink"
          >
            <span className="inline-flex items-center gap-[7px] self-start rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-1.5 text-[11.5px] font-semibold">
              <span className="h-[7px] w-[7px] rounded-full bg-mint" />
              {matchedBusiness.tag}
            </span>
            <h2 id="h-match" className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">{matchedBusiness.name}</h2>
            <span className="text-[12.5px] text-muted">{matchedBusiness.note}</span>
            <div className="grid grid-cols-2 gap-2.5 rounded-[18px] border border-white/20 bg-teal/7 px-3.5 py-3">
              <span>
                <span className="text-cap font-semibold uppercase text-muted">Owner</span>
                <b className="block text-body-sm">{matchedBusiness.owner}</b>
              </span>
              <span>
                <span className="text-cap font-semibold uppercase text-muted">Requested</span>
                <b className="block font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{matchedBusiness.requested}</b>
              </span>
            </div>
            <button type="button" className="cursor-pointer self-start border-0 bg-transparent p-0 text-[12.5px] font-semibold text-teal-deep">
              Not this business? Change
            </button>
          </article>

          {/* Grows to absorb any height difference with the left card. */}
          <article aria-labelledby="h-fc" className="flex flex-1 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
            <div className="flex items-center justify-between">
              <h2 id="h-fc" className="m-0 font-heading text-[19px] font-semibold">Fit check</h2>
              <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{fitCheck.verdict}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {fitCheck.rows.map((r) => (
                <span key={r.label} className="flex justify-between rounded-[12px] bg-white/65 px-3 py-[9px] text-[12.5px]">
                  <span>{r.label}</span>
                  <b className={r.tone === "good" ? "text-teal-deep" : "text-amber-text"}>{r.value}</b>
                </span>
              ))}
            </div>
            <span className="mt-auto text-[11.5px] text-muted">{fitCheck.note}</span>
          </article>

          <AssignCard />
        </aside>
      </div>
    </>
  );
}
