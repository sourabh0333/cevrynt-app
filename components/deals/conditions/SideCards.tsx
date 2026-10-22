import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { finalChecks, recommended, terms } from "@/lib/sample-data/deal-conditions";

const title = "m-0 font-heading text-[19px] font-semibold";

/** "Terms of approval": three numbered terms on the sand card and "+ Add a term". */
export function TermsCard() {
  return (
    <article aria-labelledby="h-terms" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-terms" className={title}>{terms.title}</h2>
        <span className="rounded-pill bg-card px-[9px] py-[3px] text-label-sm font-semibold">{terms.chip}</span>
      </div>
      <span className="text-[12.5px] text-grey-text">{terms.intro}</span>
      <div className="flex flex-col gap-1.5">
        {terms.items.map((t, i) => (
          <span key={t} className="flex items-center gap-2.5 rounded-tile bg-white/75 px-3 py-2.5 text-[12.5px]">
            <b className="grid h-6 w-6 flex-none place-items-center rounded-full bg-teal font-heading text-label font-semibold text-white">{i + 1}</b>
            <span>{t}</span>
          </span>
        ))}
      </div>
      <button type="button" className="mt-auto cursor-pointer self-start border-0 bg-transparent p-0 text-[12.5px] font-semibold text-teal-deep">
        {terms.add}
      </button>
    </article>
  );
}

function Refresh() {
  return (
    <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[9px] bg-mint/16 text-teal">
      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />
      </svg>
    </span>
  );
}

/** "Final checks": the 2 by 3 grid of automatic rechecks and the last-check time. */
export function FinalChecksCard() {
  return (
    <article
      aria-labelledby="h-final"
      className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-center justify-between">
        <h2 id="h-final" className={title}>{finalChecks.title}</h2>
        <span className="rounded-pill bg-mint/18 px-[9px] py-[3px] text-label-sm font-semibold text-teal-deep">{finalChecks.chip}</span>
      </div>
      <span className="text-[12.5px] text-muted">{finalChecks.intro}</span>
      <div className="grid grid-cols-2 gap-1.5">
        {finalChecks.items.map((c) => (
          <span key={c} className="flex items-center gap-2 rounded-tile bg-teal/7 p-2.5 text-[12.5px]">
            <Refresh />
            {c}
          </span>
        ))}
      </div>
      <span className="mt-auto text-[11.5px] text-muted">{finalChecks.last}</span>
    </article>
  );
}

/** "Recommended": three optional items and the link to the policy settings. */
export function RecommendedCard() {
  return (
    <Card as="article" aria-labelledby="h-opt" className="gap-2.5">
      <div className="flex items-center justify-between">
        <h2 id="h-opt" className={title}>{recommended.title}</h2>
        <span className="rounded-pill bg-tile px-[9px] py-[3px] text-label-sm font-semibold">{recommended.chip}</span>
      </div>
      <span className="text-[12.5px] text-muted">{recommended.intro}</span>
      <div className="flex flex-col gap-1.5">
        {recommended.items.map((r) => (
          <span key={r.label} className="flex items-center justify-between gap-2 rounded-tile bg-tile px-3 py-[11px] text-[12.5px]">
            <span>{r.label}</span>
            <span className={`rounded-pill px-2 py-0.5 text-[10.5px] font-semibold ${r.sent ? "bg-amber-bg text-amber-text" : "bg-tile"}`}>{r.status}</span>
          </span>
        ))}
      </div>
      <Link href={recommended.link.href} className="mt-auto text-[12.5px] font-semibold text-teal-deep no-underline">
        {recommended.link.label}
      </Link>
    </Card>
  );
}
