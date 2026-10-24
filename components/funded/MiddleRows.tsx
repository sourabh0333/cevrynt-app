import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { forecastCopy, reconciliationCopy, returnedCopy, vintagesCopy as vintages, warningsCopy as warnings } from "@/lib/copy/funded";
import type { FundedBook, IsoDateTime } from "@/lib/data/types";

type Delay = CSSProperties & { "--delay"?: string };
const d = (s: number): Delay => ({ "--delay": `${s}s` });
const title = "m-0 font-heading text-[19px] font-semibold";

/** "Early warnings": four signs spotted before a payment is missed, each linking to where to act. */
export function WarningsCard({ book }: { book: FundedBook }) {
  return (
    <article aria-labelledby="h-warn" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-warn" className={title}>{warnings.title}</h2>
          <span className="text-label text-muted">{warnings.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-card px-2.5 py-1 text-label-sm font-semibold text-red-text">{warnings.chip(book.warnings.length)}</span>
      </div>
      {book.warnings.map((w) => (
        <Link key={w.merchant} href={warnings.href[w.opens]} className="flex gap-2.5 rounded-tile bg-white/78 px-3 py-[11px] text-ink no-underline">
          <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${w.tone === "red" ? "bg-red" : "bg-amber"}`} />
          <span className="text-[12.5px]">
            <b>{w.merchant}</b> {w.what}
            <span className="block text-[11.5px] text-hint">{w.detail}</span>
          </span>
        </Link>
      ))}
    </article>
  );
}

const vintageColor = { "teal-ink": "bg-teal-ink", teal: "bg-teal", "teal-mid": "bg-teal-mid", "teal-soft": "bg-teal-soft", mint: "bg-mint" };

/** "How each month's deals perform": May to September, bars that grow in. */
export function VintagesCard({ book }: { book: FundedBook }) {
  const note = vintages.note(book.vintagesOnPlan);
  return (
    <Card as="article" aria-labelledby="h-vin" className="gap-3">
      <div>
        <h2 id="h-vin" className={title}>{vintages.title}</h2>
        <span className="text-label text-hint">{vintages.subtitle}</span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        {vintages.months(book).map((m, i) => (
          <div key={m.label} className="grid grid-cols-[54px_minmax(0,1fr)_44px] items-center gap-2.5 text-label">
            <span>{m.label}</span>
            <span className="h-3 rounded-[6px] bg-line">
              <span className={`anim-grow-x block h-3 rounded-[6px] ${vintageColor[m.color]}`} style={{ width: `${m.percent}%`, ...d(0.1 + i * 0.07) }} />
            </span>
            <b className="text-right font-heading font-semibold tabular-nums tracking-[-0.03em]">{m.percent}%</b>
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-2 rounded-tile bg-tile px-3 py-2.5 text-label">
        <span>{note.label}</span>
        <b className="text-teal-deep">{note.result}</b>
      </div>
    </Card>
  );
}

/** "Reconciliation requests": the coming-soon preview with Kestrel's request. */
export function ReconciliationCard({ book, now }: { book: FundedBook; now: IsoDateTime }) {
  const t = reconciliationCopy;
  const r = book.reconciliation;
  return (
    <article
      aria-labelledby="h-rec"
      className="box-border flex min-w-0 flex-col gap-3 rounded-card-lg border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)] p-5 text-ink"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-rec" className={title}>{t.title}</h2>
          <span className="text-label text-muted">{t.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-mint/18 px-2.5 py-1 text-label-sm font-semibold text-teal-deep">{t.chip}</span>
      </div>
      <div className="flex items-center gap-2.5 rounded-[16px] bg-teal/7 p-3">
        <span className="min-w-0 flex-1">
          <b className="block text-body-sm">{r.merchant}</b>
          <span className="text-[11.5px] text-muted">{t.detail(r, now)}</span>
        </span>
        <span className="text-right">
          <b className="block font-heading text-[15px] font-semibold tabular-nums tracking-[-0.03em]">{t.days(r, now)}</b>
          <span className="text-[10.5px] text-muted">{t.daysLabel}</span>
        </span>
      </div>
      <span className="text-label text-muted">{t.note}</span>
      <Button href={t.cta.href} glow className="mt-auto h-10 w-full text-[12.5px]">
        {t.cta.label}
      </Button>
    </article>
  );
}

/**
 * "Money coming in": six weekly columns rising one by one, each with its
 * striped at-risk cap appearing after the column, then the three totals.
 */
export function ForecastCard({ book }: { book: FundedBook }) {
  const t = forecastCopy;
  const weeks = book.forecast.map(t.week);
  return (
    <Card as="article" aria-labelledby="h-fc" padding={false} className="col-span-2 gap-3.5 p-[22px] max-[980px]:col-span-1">
      <div className="flex flex-wrap items-end justify-between gap-2.5">
        <div>
          <h2 id="h-fc" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
          <div className="mt-[3px] text-label text-hint">{t.subtitle}</div>
        </div>
        <div className="flex gap-3.5 text-label">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-teal" />
            {t.legend.expected}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="stripe-amber h-2.5 w-2.5 rounded-[3px] [--stripe:3px]" />
            {t.legend.atRisk}
          </span>
        </div>
      </div>
      <div role="img" aria-label={t.chartLabel(book)} className="flex items-end gap-2.5 rounded-tile-lg bg-tile p-3">
        {weeks.map((w, i) => (
          <div key={w.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <span className="font-heading text-label font-semibold tabular-nums tracking-[-0.03em]">{w.value}</span>
            <div className="anim-fc-col flex h-[150px] w-full max-w-[54px] flex-col justify-end gap-0.5" style={d(0.2 + i * 0.1)}>
              <span className="anim-fc-cap stripe-amber stripe-sm block rounded-[6px]" style={{ height: w.cap, ...d(0.2 + i * 0.1) }} />
              <span className="block rounded-[10px] border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]" style={{ height: w.bar }} />
            </div>
            <span className="whitespace-nowrap text-label-sm text-hint">{w.label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 max-[640px]:grid-cols-1">
        {t.tiles(book).map((x) => (
          <span key={x.label} className={`rounded-[16px] p-3 ${x.warn ? "bg-amber-tint" : "bg-tile"}`}>
            <span className={`text-[11.5px] ${x.warn ? "text-amber-mute" : "text-hint"}`}>{x.label}</span>
            <b className={`block ${x.small ? "mt-[3px] text-body-sm" : "font-heading text-[20px] font-semibold tabular-nums tracking-[-0.03em]"} ${x.warn ? "text-amber-deep" : ""}`}>{x.value}</b>
          </span>
        ))}
      </div>
    </Card>
  );
}

const retryChip = { amber: "bg-amber-bg text-amber-text", green: "bg-mint-bg text-teal-dark", red: "bg-red-bg text-red-text" };

/** "Returned payments": this week's returns with their retry status. */
export function ReturnedCard({ book }: { book: FundedBook }) {
  const t = returnedCopy;
  const items = book.returned.map((r) => ({ name: r.merchant, detail: t.detail(r), ...t.next(r) }));
  return (
    <article aria-labelledby="h-ret" className="box-border flex min-w-0 flex-col gap-2.5 rounded-card-lg bg-card-deep p-5 text-ink">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="h-ret" className={title}>{t.title}</h2>
          <span className="text-label text-muted">{t.subtitle}</span>
        </div>
        <span className="whitespace-nowrap rounded-pill bg-card px-2.5 py-1 text-label-sm font-semibold text-red-text">{t.chip(book)}</span>
      </div>
      {items.map((r) => (
        <div key={r.name} className="flex items-center gap-2.5 rounded-tile bg-white/78 px-3 py-[11px]">
          <span className="min-w-0 flex-1">
            <b className="block truncate text-body-sm">{r.name}</b>
            <span className="text-[11.5px] text-hint">{r.detail}</span>
          </span>
          <span className={`whitespace-nowrap rounded-pill px-[9px] py-[3px] text-label-sm font-semibold ${retryChip[r.tone]}`}>{r.status}</span>
        </div>
      ))}
      <span className="mt-auto text-[11.5px] text-muted">{t.note}</span>
    </article>
  );
}
