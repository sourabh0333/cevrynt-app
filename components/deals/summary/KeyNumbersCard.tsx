import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { dealTabHref } from "@/lib/copy/deal";
import { balanceTrendLabel, keyNumbersCopy as t, signedPercent1, vsStated } from "@/lib/copy/deal-summary";
import type { DealTabsData } from "@/lib/data/views/deal-tabs";
import { debtToday, ofLimit, revenueTotals } from "@/lib/deal-figures";
import { moneyK } from "@/lib/format";

const tile = "flex min-w-0 flex-col gap-[5px] rounded-[18px] p-3 no-underline";
const big = "font-heading text-[23px] leading-none font-semibold tabular-nums tracking-[-0.03em]";
const note = "min-w-0 truncate text-[11.5px]";

/** A tiny sparkline: a line path and the matching closed area path (120×24 box). */
type Sparkline = { line: string; area: string; dot: { x: number; y: number } };

/*
 * The two sparklines are the design's drawn artwork for Harbor Street's
 * four months (design/Deal-Summary.html); they become drawn from the
 * monthly series when other deals have real data.
 */
const revenueSpark: Sparkline = {
  line: "M2 21 L40 17 L80 7 L118 5",
  area: "M2 21 L40 17 L80 7 L118 5 L118 24 L2 24Z",
  dot: { x: 118, y: 5 },
};
const balanceSpark: Sparkline = {
  line: "M2 11 C12 6 20 14 30 9 S48 5 56 12 S66 23 72 21 S86 8 96 9 S110 6 118 8",
  area: "M2 11 C12 6 20 14 30 9 S48 5 56 12 S66 23 72 21 S86 8 96 9 S110 6 118 8 L118 24 L2 24Z",
  dot: { x: 72, y: 21 },
};

function Head({ label, chip, onTeal = false, chipClass }: { label: string; chip: string; onTeal?: boolean; chipClass: string }) {
  return (
    <span className="flex items-center justify-between gap-1.5">
      <span className={`min-w-0 truncate text-[11.5px] ${onTeal ? "text-cap-on-teal" : "text-muted"}`}>{label}</span>
      <span className={`whitespace-nowrap rounded-pill px-[7px] py-0.5 text-[10px] font-semibold ${chipClass}`}>{chip}</span>
    </span>
  );
}

/** 120×24 sparkline: the area fades in, the line draws, the dot pops. */
function Spark({ data, onTeal = false, dotClass }: { data: Sparkline; onTeal?: boolean; dotClass: string }) {
  const style: CSSProperties & { "--delay"?: string } = { "--delay": "0.1s" };
  return (
    <svg aria-hidden="true" viewBox="0 0 120 24" preserveAspectRatio="none" className="h-[22px] w-full">
      <path d={data.area} className={`anim-fade ${onTeal ? "fill-mint/18" : "fill-teal/12"}`} style={{ "--delay": "-0.6s" } as CSSProperties} />
      <path
        d={data.line}
        pathLength={1}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`anim-draw ${onTeal ? "stroke-mint" : "stroke-teal"}`}
        style={style}
      />
      <circle cx={data.dot.x} cy={data.dot.y} r={onTeal ? 2.5 : 2.6} className={`anim-pop-svg ${dotClass}`} style={{ "--delay": "0.9s" } as CSSProperties} />
    </svg>
  );
}

/**
 * "Key numbers" from design/Deal-Summary.html: four tiles in a 2×2 grid
 * (True revenue on teal, Avg balance, Bounced, Existing debt), each a link
 * into its deal tab, with a mini chart that animates in once. The figures
 * come from the deal's statements and positions; the debt bar fills
 * against the policy's debt limit. No hover.
 */
export function KeyNumbersCard({ data }: { data: DealTabsData }) {
  const { summary, cashFlow: cf, positions, policy, id } = data;
  const months = cf.months;
  const revenue = revenueTotals(cf).monthly;
  const clean = months.filter((m) => m.nsfs === 0 && m.daysBelowZero === 0);
  const nsfs = months.reduce((s, m) => s + m.nsfs, 0);
  const belowZero = months.reduce((s, m) => s + m.daysBelowZero, 0);
  const debt = debtToday(cf);
  const cashFlowHref = dealTabHref(id, { path: "/cash-flow" });

  return (
    <Card as="article" aria-labelledby="h-key">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-key" className="m-0 font-heading text-[20px] font-semibold">{t.title}</h2>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold text-muted">{t.range(months.map((m) => m.month))}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href={cashFlowHref} className={`${tile} bg-teal text-white`}>
          <Head label={t.revenue.label} chip={signedPercent1(summary.revenueGrowth)} onTeal chipClass="bg-mint/18 text-mint" />
          <b className={`${big} whitespace-nowrap`}>
            {moneyK(revenue)}
            <span className="text-label font-medium text-cap-on-teal">{t.revenue.suffix}</span>
          </b>
          <Spark data={revenueSpark} onTeal dotClass="fill-white" />
          <span className={`${note} text-cap-on-teal-light`}>{vsStated(revenue, summary.statedRevenue)}</span>
        </Link>

        <Link href={cashFlowHref} className={`${tile} bg-tile text-ink`}>
          <Head label={t.balance.label} chip={balanceTrendLabel(summary.balanceTrend)} chipClass="bg-card text-grey-text" />
          <b className={big}>{moneyK(cf.avgDailyBalance)}</b>
          <Spark data={balanceSpark} dotClass="fill-amber" />
          <span className={`${note} text-hint`}>{t.balance.low(cf.lowestBalance.amount, cf.lowestBalance.at)}</span>
        </Link>

        <Link href={dealTabHref(id, { path: "/integrity" })} className={`${tile} bg-tile text-ink`}>
          <Head
            label={t.bounced.label}
            chip={clean.length === months.length ? t.bounced.clean : t.bounced.found(months.length - clean.length)}
            chipClass="bg-mint-bg text-teal-dark"
          />
          <span className="flex items-baseline gap-3.5">
            <b className={big}>{nsfs}</b>
            <span className="whitespace-nowrap text-label-sm text-hint">{t.bounced.nsfs}</span>
            <b className={big}>{belowZero}</b>
            <span className="whitespace-nowrap text-label-sm text-hint">{t.bounced.belowZero}</span>
          </span>
          <span className="mt-1 grid grid-cols-4 gap-[3px]">
            {months.map((m, i) => (
              <Block key={i} delay={0.1 + i * 0.1} className={m.nsfs === 0 && m.daysBelowZero === 0 ? "bg-teal" : "bg-amber"} />
            ))}
          </span>
          <span className={`${note} text-hint`}>{t.bounced.note(clean.length, months.length)}</span>
        </Link>

        <Link href={dealTabHref(id, { path: "/positions" })} className={`${tile} bg-tile text-ink`}>
          <Head label={t.debt.label} chip={t.debt.chip(positions.positions.length)} chipClass="bg-card text-grey-text" />
          <b className={big}>{t.debt.value(debt.share)}</b>
          <span className="relative mt-1 block h-1.5 rounded-[3px] bg-card">
            <Block delay={0.2} className="bg-teal" width={`${ofLimit(debt.share, policy.maxDebtShare)}%`} />
            <span className="absolute top-[-3px] right-0 h-3 w-0.5 rounded-[1px] bg-red" />
          </span>
          <span className={`${note} text-hint`}>{t.debt.note(policy.maxDebtShare)}</span>
        </Link>
      </div>
    </Card>
  );
}

function Block({ delay, className, width }: { delay: number; className: string; width?: string }): ReactNode {
  const style: CSSProperties & { "--delay"?: string } = { "--delay": `${delay}s`, width };
  return <span className={`anim-grow-x block h-1.5 rounded-[3px] ${className}`} style={style} />;
}
