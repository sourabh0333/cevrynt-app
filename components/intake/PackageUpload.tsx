import Link from "next/link";
import { packageCopy as c, packageFitRows } from "@/lib/copy/intake";
import type { PackageData } from "@/lib/data/views/intake";
import { AssignCard } from "./AssignCard";

const cap = "text-cap font-semibold uppercase text-hint";

/**
 * Single package upload, from design/Intake-Single.html, for the package in
 * `data` (from the data layer). The fit check uses the policy's restricted
 * industries and the statement months it requires.
 */
export function PackageUpload({ data }: { data: PackageData }) {
  const p = data.pkg;
  const required = data.policy.requiredStatementMonths;
  const coveredCount = Math.min(p.statements.length, required);
  const covered = Array.from({ length: required }, (_, i) => i < coveredCount);
  const fitRows = packageFitRows(p, data.policy, Number(data.now.slice(0, 4)));
  const fits = !fitRows.some((r) => r.tone === "bad");
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
        <span className="inline-flex h-10 items-center gap-2 rounded-pill bg-mint-bg px-3.5 text-[12.5px] font-semibold text-teal-dark">
          <span className="h-2 w-2 rounded-full bg-teal" />
          {c.readIn(p.readSeconds)}
        </span>
      </header>

      {/* Drop strip */}
      <section
        aria-label={c.uploaded}
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
          <span className="text-[11.5px] text-hint">{c.fileMeta(p)}</span>
        </span>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-tile px-4 text-[12.5px] font-semibold text-ink">
          {c.addMore}
        </button>
        <button type="button" className="h-10 cursor-pointer rounded-pill border-0 bg-transparent px-4 text-[12.5px] font-semibold text-red-text">
          {c.remove}
        </button>
      </section>

      {/* Both columns stretch to the same height (layout rule 1). */}
      <div className="flex flex-wrap items-stretch gap-3.5">
        <section aria-labelledby="h-files" className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5">
          <article className="flex flex-1 flex-col gap-3.5 rounded-card-lg bg-card p-[22px] text-ink">
            <div className="flex flex-wrap items-end justify-between gap-2.5">
              <div>
                <h2 id="h-files" className="m-0 font-heading text-[21px] font-semibold">{c.found.title}</h2>
                <p className="mt-[3px] mb-0 text-[12.5px] text-hint">{c.found.subtitle}</p>
              </div>
              <span className="font-heading text-[24px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{p.statements.length + p.documents.length}</span>
            </div>

            <span className={`${cap} mt-1`}>{c.statementsCaption(p.bank)}</span>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
              {p.statements.map((s) => c.month(s)).map((m) => (
                <div key={m.label} className="rounded-[16px] bg-tile p-3">
                  <b className="text-body-sm">{m.label}</b>
                  <span className="block text-[11.5px] text-hint">{m.note}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-label text-muted">
                <span>{c.covered.label}</span>
                <b className="text-teal-deep">{c.covered.value(coveredCount, required)}</b>
              </div>
              <div className="mt-1.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${required}, minmax(0, 1fr))` }}>
                {covered.map((on, i) => (
                  <span key={i} className={`h-2 rounded-[4px] ${on ? "bg-teal" : "bg-ink/10"}`} />
                ))}
              </div>
            </div>

            <span className={`${cap} mt-1.5`}>{c.otherCaption}</span>
            <div className="flex flex-col gap-2">
              {p.documents.map((d) => (
                <div
                  key={d.file}
                  className={`flex items-center gap-3 rounded-[16px] px-3.5 py-3 ${d.state === "warn" ? "bg-amber-bg" : "bg-tile"}`}
                >
                  <span className="min-w-0 flex-1">
                    <b className="text-[13.5px]">{c.doc(d).title}</b>
                    <span className={`block truncate font-mono text-[11.5px] ${d.state === "warn" ? "text-amber-mute" : "text-hint"}`}>
                      {c.doc(d).file}
                    </span>
                  </span>
                  {d.state === "read" ? (
                    <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">{c.read}</span>
                  ) : (
                    <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
                      {c.action[d.state === "warn" ? "warn" : "ignored"]}
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
              {c.matched.tag}
            </span>
            <h2 id="h-match" className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">{p.business.name}</h2>
            <span className="text-[12.5px] text-muted">{c.matched.note(p.business, p.statements.length)}</span>
            <div className="grid grid-cols-2 gap-2.5 rounded-[18px] border border-white/20 bg-teal/7 px-3.5 py-3">
              <span>
                <span className="text-cap font-semibold uppercase text-muted">{c.matched.owner}</span>
                <b className="block text-body-sm">{c.matched.ownerLine(p.business)}</b>
              </span>
              <span>
                <span className="text-cap font-semibold uppercase text-muted">{c.matched.requested}</span>
                <b className="block font-heading text-[17px] font-semibold tabular-nums tracking-[-0.03em]">{c.matched.requestedValue(p.business.requested)}</b>
              </span>
            </div>
            <button type="button" className="cursor-pointer self-start border-0 bg-transparent p-0 text-[12.5px] font-semibold text-teal-deep">
              {c.matched.change}
            </button>
          </article>

          {/* Grows to absorb any height difference with the left card. */}
          <article aria-labelledby="h-fc" className="flex flex-1 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
            <div className="flex items-center justify-between">
              <h2 id="h-fc" className="m-0 font-heading text-[19px] font-semibold">{c.fit.title}</h2>
              <span className="rounded-pill bg-teal px-2.5 py-1 text-label-sm font-semibold text-white">{fits ? c.fit.verdict.fits : c.fit.verdict.not}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {fitRows.map((r) => (
                <span key={r.label} className="flex justify-between rounded-[12px] bg-white/65 px-3 py-[9px] text-[12.5px]">
                  <span>{r.label}</span>
                  <b className={r.tone === "good" ? "text-teal-deep" : r.tone === "bad" ? "text-red-text" : "text-amber-text"}>{r.value}</b>
                </span>
              ))}
            </div>
            <span className="mt-auto text-[11.5px] text-muted">{c.fit.note}</span>
          </article>

          <AssignCard sentBy={p.sentBy} />
        </aside>
      </div>
    </>
  );
}
