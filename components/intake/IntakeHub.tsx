import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  bulkTree,
  channelLabel,
  channels,
  fitCheck,
  fitLine,
  flowSections,
  flows,
  intakeHeader,
  manualStepChips as manualSteps,
  packageTypes,
  recentIntakes,
  todayByChannel,
  type ChannelCard,
  type FlowCard,
} from "@/lib/copy/intake";
import type { IntakeHubData } from "@/lib/data/views/intake";
import { timeOfDay } from "@/lib/format";

const arrow = (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const tealCta =
  "inline-flex h-[42px] items-center gap-2 rounded-pill bg-teal px-[18px] text-body-sm font-semibold text-white no-underline";

/** The Intake hub, from design/Intake.html, with today's arrivals and recent intakes from `data` (the data layer). */
export function IntakeHub({ data }: { data: IntakeHubData }) {
  const total = data.today.reduce((n, c) => n + c.count, 0);
  return (
    <>
      <header className="mb-1.5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">
            {intakeHeader.title}
          </h1>
          <a
            href={intakeHeader.lineHref}
            className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink no-underline"
          >
            {intakeHeader.line(total)}
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
        <PageActions newIntake={false} />
      </header>

      <section aria-label={flowSections} className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
        {flows.map((f) => (
          <Flow key={f.id} flow={f} />
        ))}
      </section>

      <FitCheck />
      <Channels />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <TodayByChannel today={data.today} total={total} />
        <RecentIntakes data={data} />
      </section>
    </>
  );
}

function Flow({ flow }: { flow: FlowCard }) {
  const base = "box-border flex min-h-[340px] flex-col gap-3.5 rounded-card-lg p-[22px] text-ink";

  if (flow.id === "package") {
    return (
      <article aria-labelledby="h-sin" className={`${base} relative overflow-hidden border border-mint-border bg-mint-card`}>
        <div className="flex items-center justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-[16px] border border-teal/7 bg-teal/7 text-teal">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3M7 8l5-5 5 5M5 21h14" />
            </svg>
          </span>
          <span className="inline-flex items-center gap-[7px] rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-1.5 text-[11.5px] font-semibold">
            <span className="h-[7px] w-[7px] rounded-full bg-mint" />
            {flow.tag}
          </span>
        </div>
        <div>
          <h2 id="h-sin" className="m-0 font-heading text-[24px] font-semibold">{flow.title}</h2>
          <p className="mt-1.5 mb-0 text-[13.5px] text-muted">{flow.text}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {packageTypes.map((t) => (
            <span key={t} className="rounded-[8px] bg-white/10 px-[9px] py-1 font-mono text-label-sm">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 rounded-tile-lg border border-teal/7 bg-teal/7 px-4 py-3.5">
          <span className="text-[12.5px] text-muted">{flow.footnote}</span>
          <Link
            href={flow.href}
            className="inline-flex h-[42px] flex-none items-center gap-2 rounded-pill bg-card px-[18px] text-body-sm font-semibold text-ink no-underline"
          >
            {flow.cta}
          </Link>
        </div>
      </article>
    );
  }

  const bulk = flow.id === "bulk";
  const headingId = bulk ? "h-blk" : "h-man";
  return (
    <article aria-labelledby={headingId} className={`${base} ${bulk ? "bg-card-deep" : "bg-card"}`}>
      <div className="flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-[16px] text-ink ${bulk ? "bg-white/65" : "bg-tile"}`}>
          {bulk ? (
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <path d="M12 11v6M9 14h6" />
            </svg>
          ) : (
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          )}
        </span>
        <span className={`rounded-pill px-2.5 py-1.5 text-cap font-semibold uppercase text-muted ${bulk ? "bg-white/65" : "bg-tile"}`}>
          {flow.tag}
        </span>
      </div>
      <div>
        <h2 id={headingId} className="m-0 font-heading text-[24px] font-semibold">{flow.title}</h2>
        <p className="mt-1.5 mb-0 text-[13.5px] text-muted">{flow.text}</p>
      </div>
      {bulk ? (
        <div className="flex flex-col gap-1.5 rounded-[18px] bg-white/60 px-3.5 py-3 font-mono text-label">
          <span>{bulkTree.file}</span>
          {bulkTree.folders.map((f) => (
            <span key={f} className="pl-3.5 text-muted">
              {f}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {manualSteps.map((s) => (
            <span key={s} className="rounded-pill bg-tile px-2.5 py-[5px] text-[11.5px] font-semibold">
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-2.5">
        <span className={`text-label ${bulk ? "text-muted" : "text-hint"}`}>{flow.footnote}</span>
        <Link href={flow.href} className={tealCta}>
          {flow.cta} {arrow}
        </Link>
      </div>
    </article>
  );
}

function FitCheck() {
  return (
    <section aria-labelledby="h-fit" className="flex flex-col gap-4 rounded-card-lg bg-cream p-[22px] text-ink">
      <SectionHeader
        title={fitCheck.title}
        titleId="h-fit"
        subtitle={<span className="text-[12.5px] text-muted">{fitCheck.subtitle}</span>}
        className="flex-wrap items-end"
        action={
          <Link href={fitCheck.policy.href} className="rounded-pill bg-card px-3.5 py-[9px] text-cap font-semibold uppercase text-ink no-underline">
            {fitCheck.policy.label}
          </Link>
        }
      />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {fitCheck.steps.map((s) => (
          <div key={s.n} className="rounded-tile-lg bg-white/70 p-4">
            <span className="font-mono text-label-sm text-hint">{s.n}</span>
            <b className="mt-1.5 block text-body">{s.title}</b>
            <span className="text-[12.5px] text-muted">{s.text}</span>
          </div>
        ))}
        <div className="flex flex-col gap-2 rounded-tile-lg bg-teal p-4 text-white">
          <span className="text-cap font-semibold uppercase text-cap-on-teal">{fitCheck.outcomeCap}</span>
          {fitCheck.outcomes.map((o) => (
            <span key={o.text} className="flex items-center gap-2 text-body-sm">
              <span className={`h-2 w-2 rounded-full ${o.dot}`} />
              {o.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const channelIcon: Record<ChannelCard["id"], React.ReactNode> = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  forms: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  api: <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" />,
};

/** The three channels that are not live yet (CLAUDE.md): dashed "Coming soon" cards, never working features. */
function Channels() {
  return (
    <section aria-labelledby="h-ch" className="flex flex-col gap-3 rounded-card-lg bg-card p-5 text-ink">
      <SectionHeader
        title={channels.title}
        titleId="h-ch"
        subtitle={channels.subtitle}
        className="flex-wrap items-end"
        action={
          <Link href={channels.roadmap.href} className="text-label font-semibold text-teal no-underline">
            {channels.roadmap.label}
          </Link>
        }
      />
      <div className="grid grid-cols-3 gap-2.5 max-[900px]:grid-cols-1">
        {channels.cards.map((c) => (
          <article
            key={c.id}
            className="relative flex flex-col gap-2.5 rounded-[26px] border-[1.5px] border-dashed border-line-dash-soft bg-tile p-[18px]"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-[13px] bg-card text-hint">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {channelIcon[c.id]}
                </svg>
              </span>
              <span className="rounded-pill bg-blue-bg px-[9px] py-[3px] text-[10.5px] font-bold text-blue-text">{c.tag}</span>
            </div>
            <div>
              <b className="block font-heading text-[16px] font-semibold">{c.title}</b>
              <span className="text-[12.5px] text-muted">{c.text}</span>
            </div>
            <span className="mt-auto flex gap-3.5">
              {c.links.map((l) => (
                <Link key={l.label} href={l.href} className={`text-label font-semibold no-underline ${l.quiet ? "text-muted" : "text-teal"}`}>
                  {l.label}
                </Link>
              ))}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function TodayByChannel({ today, total }: { today: IntakeHubData["today"]; total: number }) {
  return (
    <article
      aria-labelledby="h-today"
      className="flex flex-col gap-3.5 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <SectionHeader
        title={todayByChannel.title}
        titleId="h-today"
        subtitle={<span className="text-muted">{todayByChannel.subtitle(total)}</span>}
        className="items-start"
        action={
          <span className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
            {total}
          </span>
        }
      />
      <div className="flex flex-col gap-2.5">
        {today.map((r, i) => (
          <div key={r.channel}>
            <div className="flex justify-between text-[12.5px]">
              <span>{channelLabel[r.channel]}</span>
              <b>{r.count}</b>
            </div>
            <ProgressBar className="mt-[5px]" value={todayByChannel.percent(r.count, total)} height={6} color="teal" track="teal" delay={0.25 + i * 0.12} />
          </div>
        ))}
      </div>
    </article>
  );
}

const fitDot = { fits: "bg-teal", needs: "bg-amber", declined: "bg-red", unchecked: "bg-grey-dot" };
const cols = "grid grid-cols-[minmax(0,1.4fr)_120px_70px_minmax(0,1.5fr)_110px] gap-3";

function RecentIntakes({ data }: { data: IntakeHubData }) {
  const t = recentIntakes;
  return (
    <article
      id="recent"
      aria-labelledby="h-rec"
      className="flex flex-col gap-2.5 rounded-card-lg bg-card p-5 text-ink [grid-column:span_2] max-[760px]:[grid-column:auto]"
    >
      <SectionHeader title={t.title} titleId="h-rec" link={t.link} />
      <div className="scrollbar-none overflow-x-auto">
        <div className="min-w-[620px]">
          <div className={`${cols} px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.08em] uppercase text-hint`}>
            <span>{t.columns.merchant}</span>
            <span>{t.columns.channel}</span>
            <span>{t.columns.time}</span>
            <span>{t.columns.fit}</span>
            <span>{t.columns.assigned}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {data.recent.map((r) => (
              <Link key={r.id} href={t.href} className={`${cols} items-center rounded-[16px] bg-tile px-3 py-2.5 text-ink no-underline`}>
                <b className="truncate text-body-sm">{r.merchant}</b>
                <span className="text-[12.5px] text-muted">{channelLabel[r.channel]}</span>
                <span className="font-mono text-label text-muted">{timeOfDay(r.at)}</span>
                <span className="inline-flex min-w-0 items-center gap-1.5 text-[12.5px]">
                  <span className={`h-2 w-2 flex-none rounded-full ${fitDot[r.fit.result]}`} />
                  <span className="truncate">{fitLine(r.fit, data.policy)}</span>
                </span>
                <span className={`text-[12.5px] ${r.assignee ? "text-muted" : "text-hint"}`}>{r.assignee ?? t.unassigned}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
