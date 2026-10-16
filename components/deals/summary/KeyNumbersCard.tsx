import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { keyNumbers, type Sparkline } from "@/lib/sample-data/deal";

const tile = "flex min-w-0 flex-col gap-[5px] rounded-[18px] p-3 no-underline";
const big = "font-heading text-[23px] leading-none font-semibold tabular-nums tracking-[-0.03em]";
const note = "min-w-0 truncate text-[11.5px]";

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
 * into its deal tab, with a mini chart that animates in once. No hover.
 */
export function KeyNumbersCard() {
  const { revenue, balance, bounced, debt } = keyNumbers;
  return (
    <Card as="article" aria-labelledby="h-key">
      <div className="flex items-center justify-between gap-2">
        <h2 id="h-key" className="m-0 font-heading text-[20px] font-semibold">{keyNumbers.title}</h2>
        <span className="rounded-pill bg-tile px-2.5 py-1 text-label-sm font-semibold text-muted">{keyNumbers.range}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href={revenue.href} className={`${tile} bg-teal text-white`}>
          <Head label={revenue.label} chip={revenue.chip} onTeal chipClass="bg-mint/18 text-mint" />
          <b className={`${big} whitespace-nowrap`}>
            {revenue.value}
            <span className="text-label font-medium text-cap-on-teal">{revenue.suffix}</span>
          </b>
          <Spark data={revenue.spark} onTeal dotClass="fill-white" />
          <span className={`${note} text-cap-on-teal-light`}>{revenue.note}</span>
        </Link>

        <Link href={balance.href} className={`${tile} bg-tile text-ink`}>
          <Head label={balance.label} chip={balance.chip} chipClass="bg-card text-grey-text" />
          <b className={big}>{balance.value}</b>
          <Spark data={balance.spark} dotClass="fill-amber" />
          <span className={`${note} text-hint`}>{balance.note}</span>
        </Link>

        <Link href={bounced.href} className={`${tile} bg-tile text-ink`}>
          <Head label={bounced.label} chip={bounced.chip} chipClass="bg-mint-bg text-teal-dark" />
          <span className="flex items-baseline gap-3.5">
            <b className={big}>{bounced.nsfs}</b>
            <span className="whitespace-nowrap text-label-sm text-hint">NSFs</span>
            <b className={big}>{bounced.belowZero}</b>
            <span className="whitespace-nowrap text-label-sm text-hint">below $0</span>
          </span>
          <span className="mt-1 grid grid-cols-4 gap-[3px]">
            {bounced.months.map((clean, i) => (
              <Block key={i} delay={0.1 + i * 0.1} className={clean ? "bg-teal" : "bg-amber"} />
            ))}
          </span>
          <span className={`${note} text-hint`}>{bounced.note}</span>
        </Link>

        <Link href={debt.href} className={`${tile} bg-tile text-ink`}>
          <Head label={debt.label} chip={debt.chip} chipClass="bg-card text-grey-text" />
          <b className={big}>{debt.value}</b>
          <span className="relative mt-1 block h-1.5 rounded-[3px] bg-card">
            <Block delay={0.2} className="bg-teal" width={`${debt.percent}%`} />
            <span className="absolute top-[-3px] right-0 h-3 w-0.5 rounded-[1px] bg-red" />
          </span>
          <span className={`${note} text-hint`}>{debt.note}</span>
        </Link>
      </div>
    </Card>
  );
}

function Block({ delay, className, width }: { delay: number; className: string; width?: string }): ReactNode {
  const style: CSSProperties & { "--delay"?: string } = { "--delay": `${delay}s`, width };
  return <span className={`anim-grow-x block h-1.5 rounded-[3px] ${className}`} style={style} />;
}
