import Link from "next/link";
import type { CSSProperties } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { library, scheduled, team as teamFor, unitEconomics, type UnitTone } from "@/lib/copy/reports";
import type { ReportsData } from "@/lib/data/views/reports";

const unitBg: Record<UnitTone, string> = {
  ink: "bg-ink",
  "red-bar": "bg-red-bar",
  red: "bg-red",
  "grey-dot": "bg-grey-dot",
  teal: "bg-teal",
};

/** "What every $1 funded earns": the $1.32 summary, the split bar with its brackets, five tiles and four facts. */
export function UnitEconomics({ data }: { data: ReportsData }) {
  const ue = unitEconomics(data);
  const total = ue.parts.reduce((s, p) => s + p.cents, 0);
  const share = (c: number) => (c / total) * 100;
  const principal = share(ue.parts[0].cents);

  return (
    <section aria-labelledby="h-unit" className="box-border flex min-w-0 flex-col gap-3.5 rounded-card-lg border border-line bg-tile p-[22px] text-ink">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-unit" className="m-0 font-heading text-[20px] font-semibold">{ue.title}</h2>
          <div className="mt-[3px] text-label text-hint">{ue.subtitle}</div>
        </div>
        <span className="rounded-pill bg-mint-bg px-2.5 py-1 text-label-sm font-semibold text-teal-dark">{ue.chip}</span>
      </div>

      <div className="flex flex-wrap items-stretch gap-[18px] rounded-[22px] bg-card p-[18px]">
        <div className="flex flex-[1_1_200px] flex-col justify-center gap-1.5">
          <span className="text-[12.5px] text-muted">{ue.lead}</span>
          <b className="font-heading text-[40px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{ue.back}</b>
          <span className="text-[12.5px] text-muted">{ue.backNote}</span>
          <span className="inline-flex items-baseline gap-1.5 self-start rounded-pill bg-teal px-3.5 py-2 text-white">
            <b className="font-heading text-[22px] tabular-nums tracking-[-0.03em]">{ue.keep}</b>
            <span className="text-label">{ue.keepNote}</span>
          </span>
        </div>
        <div className="flex min-w-0 flex-[3_1_420px] flex-col justify-center gap-2.5">
          <div className="flex text-label-sm font-semibold text-muted">
            <span className="border-b-2 border-ink pb-1 text-center" style={{ flex: `0 0 ${principal.toFixed(2)}%` }}>
              {ue.brackets.principal}
            </span>
            <span className="ml-1 min-w-0 flex-1 truncate border-b-2 border-mint pb-1 text-center text-teal-deep">{ue.brackets.fees}</span>
          </div>
          <div role="img" aria-label={ue.barLabel} className="anim-grow-x flex h-[54px] gap-[3px] overflow-hidden rounded-[16px]" style={{ "--delay": "0.3s" } as CSSProperties}>
            {ue.parts.map((p) => (
              <span key={p.label} className={`grid min-w-1 place-items-center ${unitBg[p.tone]}`} style={{ flex: `0 0 ${share(p.cents).toFixed(2)}%` }}>
                {p.inBar ? <span className="whitespace-nowrap text-label font-bold text-white">{p.inBar}</span> : null}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
            {ue.parts.map((p) => (
              <span
                key={p.label}
                className={`flex min-w-0 flex-col gap-1 rounded-[16px] p-3 ${p.highlight ? "bg-mint-light shadow-[inset_0_0_0_1.5px_var(--color-mint)]" : "bg-tile"}`}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-[11.5px] leading-[1.25] text-muted">
                  <span className={`h-[9px] w-[9px] flex-none rounded-[3px] ${unitBg[p.tone]}`} />
                  <span className="min-w-0">{p.label}</span>
                </span>
                <b className="font-heading text-[18px] tabular-nums tracking-[-0.03em]">{p.value}</b>
                <span className="text-label-sm text-hint">{ue.shareNote(Math.round(share(p.cents)))}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        {ue.facts.map((f) => (
          <span key={f.label} className="rounded-[16px] bg-card p-3">
            <span className="block text-label-sm text-hint">{f.label}</span>
            <b className="font-heading text-[18px] tabular-nums tracking-[-0.03em]">{f.value}</b>
          </span>
        ))}
      </div>
    </section>
  );
}

/*
 * Design: minmax(160px,1.4fr) 80px 90px 90px 120px 80px with a 700px
 * minimum and sideways scroll. Here the name truncates instead, and
 * "Avg time" and "Approved" hide when the table itself is under 640px
 * (a container query, so a narrow content panel counts too).
 */
const teamCols =
  "grid grid-cols-[minmax(0,1.4fr)_80px_90px_90px_120px_80px] items-center gap-3 @max-[640px]:grid-cols-[minmax(0,1.4fr)_56px_minmax(0,120px)_56px] @max-[640px]:[&>:nth-child(3)]:hidden @max-[640px]:[&>:nth-child(4)]:hidden";

/** "Underwriting team": one row per underwriter with the "Agrees with Cevrynt" bar. */
export function TeamSection({ data }: { data: ReportsData }) {
  const team = teamFor(data);
  return (
    <section aria-labelledby="h-team" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-[22px] text-ink">
      <div>
        <h2 id="h-team" className="m-0 font-heading text-[20px] font-semibold">{team.title}</h2>
        <div className="mt-[3px] text-label text-hint">{team.subtitle}</div>
      </div>
      <div className="@container flex flex-col gap-1.5">
        <div className={`${teamCols} items-end px-3.5 pb-0.5 text-[10px] leading-[1.3] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {team.columns.map((c) => (
            <span key={c} className="min-w-0 break-words">
              {c}
            </span>
          ))}
        </div>
        {team.rows.map((r, i) => (
          <div key={r.name} className={`${teamCols} rounded-[16px] bg-tile px-3.5 py-[11px]`}>
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar initials={r.ini} color={r.avatar} size={32} />
              <b className="truncate text-body-sm">{r.name}</b>
            </span>
            <b className="font-heading tabular-nums tracking-[-0.03em]">{r.decided}</b>
            <span className="text-[12.5px]">{r.time}</span>
            <span className="text-[12.5px]">{r.approved}</span>
            <span className="flex min-w-0 items-center gap-2">
              <ProgressBar className="flex-1" value={r.agrees} height={6} track="line" delay={0.2 + i * 0.08} aria-label={`Agrees with Cevrynt ${r.agrees}%`} />
              <b className="text-label">{r.agrees}%</b>
            </span>
            <span className={`text-[12.5px] font-bold ${r.lateHigh ? "text-coral-text" : "text-teal-deep"}`}>{r.late}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** "Sent automatically" beside the "Report library"; library tiles link only where the page exists. */
export function SavedRow() {
  return (
    <section aria-label="Saved reports" className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1">
      <article aria-labelledby="h-sched" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-[22px] text-ink">
        <div className="flex items-center justify-between">
          <h2 id="h-sched" className="m-0 font-heading text-[19px] font-semibold">{scheduled.title}</h2>
          <Button variant="secondary" className="h-[34px]! px-3! text-label!">
            {scheduled.add}
          </Button>
        </div>
        {scheduled.items.map((s) => (
          <div key={s.title} className="flex items-center gap-3 rounded-[16px] bg-card px-3.5 py-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-tile bg-tile font-mono text-[10.5px] font-medium">{s.day}</span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-body-sm">{s.title}</b>
              <span className="block truncate text-[11.5px] text-hint">{s.sub}</span>
            </span>
          </div>
        ))}
      </article>

      <article aria-labelledby="h-lib" className="col-span-2 box-border flex min-w-0 flex-col gap-3 rounded-card-lg bg-card p-[22px] text-ink max-[980px]:col-span-1">
        <div>
          <h2 id="h-lib" className="m-0 font-heading text-[19px] font-semibold">{library.title}</h2>
          <span className="text-label text-hint">{library.subtitle}</span>
        </div>
        <div className="grid flex-1 auto-rows-fr grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-2">
          {library.items.map((it) => {
            const body = (
              <>
                <b className="text-[13.5px]">{it.title}</b>
                <span className="text-[11.5px] text-hint">{it.sub}</span>
              </>
            );
            const tile = "flex min-w-0 flex-col gap-1.5 rounded-[18px] bg-tile p-3.5 text-ink no-underline";
            return it.href ? (
              <Link key={it.title} href={it.href} className={tile}>
                {body}
              </Link>
            ) : (
              <div key={it.title} className={tile}>
                {body}
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
