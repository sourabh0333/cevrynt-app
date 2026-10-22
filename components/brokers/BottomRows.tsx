import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { appetite, applicants, ownership, paperwork, payout, portal, type ApplicantResult, type CheckState } from "@/lib/sample-data/brokers";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";
const span2 = "col-span-2 max-[980px]:col-span-1";

function CardHead({ id, title, subtitle, chip, chipClass }: { id: string; title: string; subtitle: string; chip: string; chipClass: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2.5">
      <div>
        <h2 id={id} className="m-0 font-heading text-[20px] font-semibold">{title}</h2>
        <div className="mt-[3px] text-label text-hint">{subtitle}</div>
      </div>
      <span className={`whitespace-nowrap rounded-pill px-2.5 py-1 text-label-sm font-semibold ${chipClass}`}>{chip}</span>
    </div>
  );
}

/* ---------- Row 1: ownership + payout ticket ---------- */

/** "Same merchant, two brokers": the winner in mint, the merchant in the middle, the other broker faded and dashed. */
function OwnershipCard() {
  const o = ownership;
  return (
    <Card as="article" aria-labelledby="h-dup" padding={false} className={`${span2} gap-3.5 p-[22px]`}>
      <CardHead id="h-dup" title={o.title} subtitle={o.subtitle} chip={o.chip} chipClass="bg-amber-bg text-amber-text" />
      {o.cases.map((c) => (
        <div key={c.merchant} className="grid grid-cols-[minmax(0,1fr)_minmax(0,max-content)_minmax(0,1fr)] items-center gap-2.5">
          <div className="min-w-0 rounded-[18px] border-[1.5px] border-mint bg-mint-light px-3.5 py-3">
            <span className="mb-1.5 inline-block rounded-pill bg-teal px-2 py-0.5 text-[10.5px] font-bold text-white">{o.winnerChip}</span>
            <b className="block truncate text-body-sm">{c.winner.name}</b>
            <span className="block truncate text-[11.5px] text-hint">{c.winner.sub}</span>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1">
            <span className="max-w-full truncate rounded-pill bg-ink px-3 py-[7px] text-[11.5px] font-semibold text-white">{c.merchant}</span>
            <span className="font-mono text-[10.5px] text-hint">{o.vs}</span>
          </div>
          <div className="min-w-0 rounded-[18px] border-[1.5px] border-dashed border-line-dash-soft bg-tile px-3.5 py-3 opacity-90">
            <span className="mb-1.5 inline-block rounded-pill bg-page px-2 py-0.5 text-[10.5px] font-bold text-grey-text">{c.other.tag}</span>
            <b className="block truncate text-body-sm">{c.other.name}</b>
            <span className="block truncate text-[11.5px] text-hint">{c.other.sub}</span>
          </div>
        </div>
      ))}
    </Card>
  );
}

/** The payout ticket: the amount, a dashed tear line with punched edges, receipt lines and the button. */
function PayoutCard() {
  const p = payout;
  return (
    <article aria-labelledby="h-pay" className="relative box-border flex min-w-0 flex-col gap-3 overflow-hidden rounded-card-lg bg-cream p-[22px] text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-pay" className="m-0 font-mono text-label font-medium tracking-[0.1em] uppercase text-hint">{p.title}</h2>
        <span className="rounded-pill bg-mint-bg px-[9px] py-[3px] text-label-sm font-semibold text-teal-dark">{p.chip}</span>
      </div>
      <b className="font-heading text-[36px] leading-none font-semibold tabular-nums tracking-[-0.03em]">{p.amount}</b>
      <span className="text-label text-hint">{p.sub}</span>
      {/* Tear line across the full ticket; the two punches sit on its ends, cut in the panel's white. */}
      <span aria-hidden="true" className="relative -mx-[22px] my-1.5 border-t-2 border-dashed border-amber-mute/25">
        <span className="absolute -top-[13px] -left-3 h-6 w-6 rounded-full bg-panel" />
        <span className="absolute -top-[13px] -right-3 h-6 w-6 rounded-full bg-panel" />
      </span>
      <div className="flex flex-col gap-2 font-mono text-label">
        {p.lines.map((l) => (
          <span key={l.label} className={`flex justify-between gap-2 ${l.clawback ? "text-coral-text" : ""}`}>
            <span>{l.label}</span>
            <b>{l.value}</b>
          </span>
        ))}
        <span className="flex justify-between gap-2 border-t border-amber-mute/20 pt-2">
          <span>{p.net.label}</span>
          <b>{p.net.value}</b>
        </span>
      </div>
      <Button className="mt-auto h-[42px] w-full text-[12.5px]">{p.cta}</Button>
    </article>
  );
}

/* ---------- Row 2: applicants + paperwork rings ---------- */

const checkMark: Record<CheckState, { glyph: string; cls: string }> = {
  ok: { glyph: "✓", cls: "bg-teal text-white" },
  wait: { glyph: "…", cls: "bg-amber-light text-amber-ink" },
  bad: { glyph: "!", cls: "bg-red text-white" },
};
const resultChip: Record<ApplicantResult, string> = {
  approve: "bg-mint-bg text-teal-dark",
  waiting: "bg-amber-bg text-amber-text",
  decline: "bg-red-bg text-red-text",
};

/* Design: minmax(150px,1.4fr) repeat(3,70px) 90px with a 520px minimum and sideways scroll. Here the name truncates instead, the check columns are a touch wider so "Background" fits, and they narrow on small screens. */
const appCols =
  "grid grid-cols-[minmax(0,1.4fr)_repeat(3,80px)_90px] items-center gap-2.5 max-[560px]:grid-cols-[minmax(0,1fr)_repeat(3,30px)_72px] max-[560px]:gap-1.5";

/** "Brokers asking to join": three applicants with Background / Registered / References marks and the result. */
function ApplicantsCard() {
  const a = applicants;
  return (
    <article aria-labelledby="h-new" className={`${span2} box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg border border-line bg-tile p-[22px] text-ink`}>
      <CardHead id="h-new" title={a.title} subtitle={a.subtitle} chip={a.chip} chipClass="bg-card text-ink" />
      <div className="flex flex-col gap-1.5 rounded-[22px] bg-card p-1.5">
        <div className={`${appCols} px-3.5 pt-1.5 pb-0.5 text-[9.5px] font-semibold tracking-[0.08em] uppercase text-hint`}>
          {a.columns.map((c, i) => (
            <span key={c} title={c} className={`truncate ${i === 0 ? "" : i === 4 ? "text-right" : "text-center"}`}>
              {c}
            </span>
          ))}
        </div>
        {a.rows.map((r) => (
          <div key={r.name} className={`${appCols} rounded-[18px] bg-tile px-3.5 py-3`}>
            <span className="min-w-0">
              <b className="block truncate text-body-sm">{r.name}</b>
              <span className="block truncate text-[11.5px] text-hint">{r.sub}</span>
            </span>
            {r.checks.map((c, i) => (
              <span
                key={i}
                role="img"
                aria-label={`${a.columns[i + 1]}: ${a.checkLabel[c]}`}
                className={`grid h-[26px] w-[26px] place-items-center justify-self-center rounded-full text-label-sm font-bold ${checkMark[c].cls}`}
              >
                <span aria-hidden="true">{checkMark[c].glyph}</span>
              </span>
            ))}
            <span className={`justify-self-end whitespace-nowrap rounded-pill px-2.5 py-1 text-label-sm font-semibold ${resultChip[r.result]}`}>{a.resultLabel[r.result]}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

/** "Paperwork on file": three rings that sweep in; the incomplete one is amber. */
function PaperworkCard() {
  const p = paperwork;
  return (
    <Card as="article" aria-labelledby="h-comp" className="gap-3">
      <div className="flex items-center justify-between">
        <h2 id="h-comp" className="m-0 font-heading text-[18px] font-semibold">{p.title}</h2>
        <span className="rounded-pill bg-amber-bg px-[9px] py-[3px] text-label-sm font-semibold text-amber-text">{p.chip}</span>
      </div>
      <div className="flex gap-2">
        {p.items.map((it, i) => {
          const full = it.have === it.total;
          return (
            <div key={it.label} className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-tile-lg bg-tile px-2 py-3.5 text-center">
              <Ring
                value={(it.have / it.total) * 100}
                size={76}
                stroke={7}
                color={full ? "teal" : "amber"}
                delay={0.2 + i * 0.12}
                ariaLabel={`${it.label}: ${it.have} of ${it.total} on file`}
              >
                <b className="font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em] text-ink">
                  {it.have}/{it.total}
                </b>
              </Ring>
              <span className="text-label leading-[1.25] font-semibold">{it.label}</span>
            </div>
          );
        })}
      </div>
      <span className="text-[11.5px] text-hint">{p.note}</span>
    </Card>
  );
}

/* ---------- Row 3: appetite poster + portal ---------- */

/** "What we fund this week": the two-panel mint poster with industry tags and range bars that grow in. */
function AppetiteCard() {
  const a = appetite;
  return (
    <article aria-labelledby="h-app" className={`${span2} box-border flex min-w-0 flex-wrap overflow-hidden rounded-card-lg border border-mint-border bg-mint-card text-ink`}>
      <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5 p-[22px]">
        <span className="self-start rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold text-teal-deep">{a.chip}</span>
        <h2 id="h-app" className="m-0 font-heading text-[24px] leading-[1.15] font-semibold">{a.title}</h2>
        <span className="text-[12.5px] text-grey-text">{a.text}</span>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {a.industries.map((x) => (
            <span
              key={x.name}
              className={`rounded-pill px-3 py-1.5 text-label font-semibold ${x.out ? "bg-tile text-red-text line-through" : "bg-teal text-white"}`}
            >
              {x.out ? <span className="sr-only">Not funded: </span> : null}
              {x.name}
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_280px] flex-col justify-center gap-3.5 bg-white/60 p-[22px]">
        {a.ranges.map((r, i) => (
          <div key={r.label}>
            <div className="flex justify-between gap-2 text-label">
              <span>{r.label}</span>
              <b>{r.value}</b>
            </div>
            <div className="relative mt-1.5 h-2 rounded-[4px] bg-line-strong">
              <span
                aria-hidden="true"
                className="anim-grow-x absolute inset-y-0 rounded-[4px] bg-teal"
                style={{ left: `${r.left}%`, right: `${r.right}%`, ...d(0.3 + i * 0.15) }}
              />
            </div>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-1.5">
          {a.facts.map((f) => (
            <span key={f.label} className="rounded-tile bg-tile px-3 py-2.5 text-label">
              <span className="block text-muted">{f.label}</span>
              <b>{f.value}</b>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** "Broker portal": a dashed Coming soon card, never a working feature. */
function PortalCard() {
  const p = portal;
  return (
    <article aria-labelledby="h-portal" className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border-[1.5px] border-dashed border-line-dash-soft bg-tile p-5 text-ink">
      <div className="flex items-center justify-between">
        <h2 id="h-portal" className="m-0 font-heading text-[18px] font-semibold">{p.title}</h2>
        <span className="rounded-pill bg-blue-bg px-[9px] py-[3px] text-[10.5px] font-bold text-blue-text">{p.chip}</span>
      </div>
      <span className="text-[12.5px] text-muted">{p.text}</span>
      <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
        {p.items.map((it, i) => (
          <li key={it} className="flex items-center gap-2 rounded-tile bg-card px-3 py-2.5 text-[12.5px]">
            <span aria-hidden="true" className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-blue-bg text-[10px] font-bold text-blue-text">
              {i + 1}
            </span>
            {it}
          </li>
        ))}
      </ol>
      <Button href={p.cta.href} className="mt-auto h-[42px] w-full text-[12.5px]">
        {p.cta.label}
      </Button>
    </article>
  );
}

/** The three rows under the scorecards in design/Brokers.html. */
export function BottomRows() {
  return (
    <>
      <section aria-label="Deal ownership and payout" className={row}>
        <OwnershipCard />
        <PayoutCard />
      </section>
      <section aria-label="New brokers and paperwork" className={row}>
        <ApplicantsCard />
        <PaperworkCard />
      </section>
      <section aria-label="What we fund and the broker portal" className={row}>
        <AppetiteCard />
        <PortalCard />
      </section>
    </>
  );
}
