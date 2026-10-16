import Link from "next/link";
import { PageActions } from "@/components/shell/PageActions";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { dealActions, dealStatusLabel, type DealHeader as DealHeaderData } from "@/lib/sample-data/deal";

/**
 * The deal header shared by all nine deal tabs, from design/Deal-Summary.html:
 * breadcrumb and tools row, then the mint hero card with the deal tile,
 * id and status, name, about line, action buttons and the five fact tiles
 * (Requested, Recommended, Broker, Underwriter, Decision due with its bar).
 * No hover effects; only the deadline bar grows in.
 */
export function DealHeader({ deal }: { deal: DealHeaderData }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-cap font-semibold uppercase text-muted">
          <Link href="/submissions" className="no-underline">Submissions</Link>
          <span aria-hidden="true">/</span>
          <span className="text-ink">{deal.name}</span>
        </nav>
        <PageActions newIntake={false} compact />
      </div>

      <section
        aria-labelledby="h-deal"
        className="relative flex flex-col gap-[18px] overflow-hidden rounded-[32px] border border-mint-border bg-mint-card p-6 text-ink"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="grid h-16 w-16 flex-none place-items-center rounded-tile-lg font-heading text-[22px] font-bold tracking-[-0.02em] text-teal-dark"
              style={{ background: `linear-gradient(140deg, ${deal.gradient[0]}, ${deal.gradient[1]})` }}
            >
              {deal.initials}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-pill bg-teal/7 px-[9px] py-1 font-mono text-[11.5px]">{deal.id}</span>
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-mint px-2.5 py-1 text-[11.5px] font-semibold text-teal-dark">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-dark" />
                  {dealStatusLabel(deal.status)}
                </span>
              </div>
              <h1 id="h-deal" className="mt-2 mb-0 font-heading text-[26px] leading-[1.05] font-semibold tracking-[-0.03em]">
                {deal.name}
              </h1>
              <span className="flex flex-wrap items-center gap-2 text-body-sm text-muted">
                {deal.about}
                <Link
                  href={deal.merchantNote.href}
                  className="rounded-pill bg-teal/7 px-2.5 py-[3px] text-[11.5px] font-semibold text-ink no-underline"
                >
                  {deal.merchantNote.label}
                </Link>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dealActions.secondary.map((label) => (
              <button
                key={label}
                type="button"
                className="h-11 cursor-pointer rounded-pill border border-teal/7 bg-teal/7 px-4 text-body-sm font-semibold text-ink"
              >
                {label}
              </button>
            ))}
            <button
              type="button"
              className="h-11 cursor-pointer rounded-pill border-0 bg-teal px-5 text-body-sm font-semibold text-white shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
            >
              {dealActions.primary}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
          <Fact label="Requested">
            <b className="block font-heading text-[22px] tabular-nums tracking-[-0.03em]">{deal.requested}</b>
          </Fact>
          <Fact label="Recommended">
            <b className="block font-heading text-[22px] tabular-nums tracking-[-0.03em] text-teal-deep">{deal.recommended}</b>
          </Fact>
          <Fact label="Broker">
            <b className="mt-1 block text-body">{deal.broker}</b>
          </Fact>
          <Fact label="Underwriter">
            <b className="mt-1 block text-body">{deal.underwriter}</b>
          </Fact>
          <Fact label="Decision due">
            <b className="mt-1 block text-body">{deal.decisionDue.label}</b>
            <ProgressBar value={deal.decisionDue.percent} color="mint" track="teal" height={4} className="mt-1.5" aria-label="Time left before the decision is due" />
          </Fact>
        </div>
      </section>
    </>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[18px] border border-teal/7 bg-white/10 px-3.5 py-3">
      <span className="text-cap text-[9.5px] font-semibold uppercase text-muted">{label}</span>
      {children}
    </div>
  );
}
