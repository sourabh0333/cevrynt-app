import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { exceptions, goLive, liveTest, restricted, scoreWeights, versions } from "@/lib/copy/policy";
import { firstName } from "@/lib/copy/team";
import type { Policy } from "@/lib/data/types";
import { dateShort, percent } from "@/lib/format";

/** Team members' names by id, for who published, proposed or signed off. */
type Names = Record<string, string>;

/*
 * The design lays these rows out with auto-fit 220px columns and span-2
 * cards. Here: a fixed 3-column grid (the wide card spans 2) that stacks
 * to one column when the settings content itself is under 700px wide.
 */
const row3 = "grid grid-cols-3 gap-3.5 @max-[700px]:grid-cols-1";
const span2 = "col-span-2 @max-[700px]:col-span-1";

/* White and grey cards with the design's 30px radius and their own gaps (Card's variants fix both). */
const whiteCard = "box-border flex min-w-0 flex-col rounded-card-lg border border-line bg-tile p-5 text-ink";
const greyCard = "box-border flex min-w-0 flex-col rounded-card-lg bg-card p-5 text-ink";

const bandFill ={ red: "bg-red-bg", amber: "bg-amber-bg", green: "bg-mint-bg" } as const;
const bandText = { red: "text-red-text", amber: "text-amber-text", green: "text-teal-dark" } as const;

/** "How a change goes live": the three steps and the draft waiting for approval. */
function GoLiveCard({ draft, names }: { draft: Policy["draft"]; names: Names }) {
  return (
    <article aria-labelledby="h-chg" className={`${whiteCard} gap-3`}>
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-chg" className="m-0 font-heading text-card-title font-semibold">{goLive.title}</h2>
        <span className="whitespace-nowrap rounded-pill bg-amber-bg px-[9px] py-[3px] text-label-sm font-semibold text-amber-text">{goLive.chip}</span>
      </div>
      <ol className="m-0 flex list-none flex-col p-0">
        {goLive.steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[28px_1fr] gap-2.5 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-teal font-heading text-label font-bold text-white">{i + 1}</span>
            <span className="text-[12.5px]">
              <b>{s.title}</b>
              <span className="block text-hint">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      {draft ? (
        <div className="mt-auto rounded-[16px] bg-card px-3.5 py-3 text-label">
          <b>{goLive.waitingLabel}</b> {goLive.waiting(draft, firstName(names[draft.byId] ?? ""), firstName(names[draft.approverId] ?? ""))}
        </div>
      ) : null}
    </article>
  );
}

/** "Test on live deals": the 80 / 20 split that grows in, and three result tiles. */
function LiveTestCard({ test: x, version }: { test: NonNullable<Policy["liveTest"]>; version: number }) {
  const t = liveTest;
  const split = { test: Math.round(x.testShare * 100), current: Math.round((1 - x.testShare) * 100) };
  const results: { label: string; from?: string; to?: string; value?: string }[] = [
    { label: t.results.approval, from: percent(x.approvalRate.current), to: percent(x.approvalRate.test) },
    { label: t.results.late, from: percent(x.earlyLate.current, 1), to: percent(x.earlyLate.test, 1) },
    { label: t.results.deals, value: String(x.dealsInTest) },
  ];
  return (
    <Card as="article" variant="mint" aria-labelledby="h-test" className={span2}>
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <h2 id="h-test" className="m-0 font-heading text-card-title font-semibold">{t.title}</h2>
          <span className="text-label text-grey-text">{t.subtitle}</span>
        </div>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold text-teal-deep">{t.chip(x.day, x.days)}</span>
      </div>
      <div
        role="img"
        aria-label={t.splitAria(split.current, split.test)}
        className="anim-grow-x flex h-3 gap-0.5 overflow-hidden rounded-[6px]"
        style={{ "--delay": "0.3s" } as CSSProperties}
      >
        <span className="bg-ink" style={{ flex: split.current }} />
        <span className="bg-teal" style={{ flex: split.test }} />
      </div>
      <div className="flex flex-wrap justify-between gap-x-3 text-[11.5px] text-grey-text">
        <span>{t.splitLabel.current(split.current, version)}</span>
        <span className="font-semibold text-teal-deep">{t.splitLabel.test(split.test, x.name)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 @max-[420px]:grid-cols-1">
        {results.map((r) => (
          <span key={r.label} className="min-w-0 rounded-[16px] bg-tile p-3">
            <span className="block text-label-sm text-hint">{r.label}</span>
            <b className="font-heading text-card-title-sm font-semibold tabular-nums tracking-[-0.03em]">
              {r.value ?? (
                <>
                  {r.from} → <span className="text-teal-deep">{r.to}</span>
                </>
              )}
            </b>
          </span>
        ))}
      </div>
      <span className="text-label text-grey-text">{t.note}</span>
    </Card>
  );
}

/** "How the underwriting score is built": the five weights as bars that grow in, and the three bands. */
function ScoreCard({ weights, bands }: { weights: Policy["scoreWeights"]; bands: Policy["scoreBands"] }) {
  const s = scoreWeights;
  const parts = weights.map((w) => ({ ...s.parts[w.part], points: w.points }));
  const max = Math.max(...parts.map((p) => p.points));
  return (
    <Card as="article" aria-labelledby="h-score" className={span2}>
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div>
          <h2 id="h-score" className="m-0 font-heading text-card-title font-semibold">{s.title}</h2>
          <span className="text-label text-hint">{s.subtitle}</span>
        </div>
        <button type="button" className="h-[34px] cursor-pointer rounded-pill border-0 bg-tile px-3 text-label font-semibold text-ink">
          {s.adjust}
        </button>
      </div>
      <div className="flex flex-col gap-2.5 rounded-tile-lg bg-tile p-4">
        {parts.map((p, i) => (
          <div key={p.label} className="grid grid-cols-[minmax(0,1fr)_120px_44px] items-center gap-2.5 text-[12.5px]">
            <span className="truncate">{p.label}</span>
            <ProgressBar value={(p.points / max) * 100} height={8} track="line" color={p.tone} delay={0.2 + i * 0.08} aria-label={`${p.label} ${p.points} points`} />
            <b className="text-right font-heading tabular-nums tracking-[-0.03em]">
              {p.points} {s.unit}
            </b>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-label @max-[420px]:grid-cols-1">
        {s.bands(bands).map((b) => (
          <span key={b.range} className={`rounded-tile px-3 py-2.5 ${bandFill[b.tone]}`}>
            <b className={`block ${bandText[b.tone]}`}>{b.range}</b>
            {b.text}
          </span>
        ))}
      </div>
    </Card>
  );
}

/** "Exceptions this month": three senior sign-offs and the exception rate. */
function ExceptionsCard({ policy: p, names }: { policy: Policy; names: Names }) {
  const e = exceptions;
  return (
    <article aria-labelledby="h-over" className={`${whiteCard} gap-2.5`}>
      <div className="flex items-center justify-between">
        <h2 id="h-over" className="m-0 font-heading text-card-title font-semibold">{e.title}</h2>
        <b className="font-heading text-card-title tabular-nums tracking-[-0.03em]">{p.exceptions.length}</b>
      </div>
      <span className="text-[12.5px] text-muted">{e.text}</span>
      <div className="flex flex-col gap-1.5 text-[12.5px]">
        {p.exceptions.map((x) => (
          <span key={x.reason} className="flex justify-between gap-2 rounded-tile bg-card px-3 py-2.5">
            <span className="min-w-0">{x.reason}</span>
            <b>{firstName(names[x.byId] ?? "")}</b>
          </span>
        ))}
      </div>
      <span className="mt-auto text-[11.5px] text-hint">{e.note(p.exceptionRate, p.exceptionWatch)}</span>
    </article>
  );
}

/** "Restricted industries": the seven red chips. */
function RestrictedCard({ industries }: { industries: string[] }) {
  const r = restricted;
  return (
    <article aria-labelledby="h-ind" className={`${whiteCard} gap-2.5`}>
      <div className="flex items-center justify-between">
        <h2 id="h-ind" className="m-0 font-heading text-card-title font-semibold">{r.title}</h2>
        <button type="button" className="h-8 cursor-pointer rounded-pill border-0 bg-card px-3 text-label font-semibold text-ink">
          {r.edit}
        </button>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {industries.map((x) => (
          <li key={x} className="rounded-pill bg-red-bg px-3 py-1.5 text-label text-red-text">
            {x}
          </li>
        ))}
      </ul>
      <span className="mt-auto text-[11.5px] text-hint">{r.note}</span>
    </article>
  );
}

/** "Version history": v3 live, then v2 and v1. */
function VersionsCard({ items, names }: { items: Policy["versions"]; names: Names }) {
  return (
    <article aria-labelledby="h-ver" className={`${greyCard} gap-2`}>
      <h2 id="h-ver" className="m-0 font-heading text-card-title font-semibold">{versions.title}</h2>
      {items.map((v) => (
        <div key={v.version} className="flex items-center gap-2.5 rounded-tile bg-tile px-3 py-[11px]">
          <span className={`rounded-[8px] px-2 py-[3px] font-mono text-label-sm ${v.live ? "bg-mint-bg text-teal-dark" : "bg-page text-ink"}`}>{versions.tag(v)}</span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-[12.5px]">{v.title}</b>
            <span className="block truncate text-[11.5px] text-hint">{versions.sub(v, v.byId ? (names[v.byId] ?? null) : null, dateShort(v.at))}</span>
          </span>
        </div>
      ))}
    </article>
  );
}

/**
 * The rows under the rules and simulator on Settings → Policy
 * (design/Settings.html), from the live policy; `names` gives the team
 * members' names for who proposed, approved and published.
 */
export function PolicyBottom({ policy, names }: { policy: Policy; names: Names }) {
  return (
    <div className="@container flex flex-col gap-3.5">
      <section aria-label="Publishing and live tests" className={row3}>
        <GoLiveCard draft={policy.draft} names={names} />
        {policy.liveTest ? <LiveTestCard test={policy.liveTest} version={policy.version} /> : null}
      </section>
      <section aria-label="Score weights and exceptions" className={row3}>
        <ScoreCard weights={policy.scoreWeights} bands={policy.scoreBands} />
        <ExceptionsCard policy={policy} names={names} />
      </section>
      <section aria-label="Restricted industries and versions" className="grid grid-cols-2 gap-3.5 @max-[520px]:grid-cols-1">
        <RestrictedCard industries={policy.restrictedIndustries} />
        <VersionsCard items={policy.versions} names={names} />
      </section>
    </div>
  );
}
