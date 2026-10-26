import Link from "next/link";
import type { HeroDeal } from "@/lib/copy/home";

/**
 * "Next up in your queue" hero card from design/Main.html: mint gradient,
 * stats row, a revenue line chart that draws in, and the deal footer.
 */
export function NextDealCard({ deal }: { deal: HeroDeal }) {
  return (
    <article
      aria-labelledby="h-next"
      className="relative min-h-[310px] overflow-hidden rounded-card-lg border border-mint-border bg-mint-card text-ink"
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <span className="inline-flex items-center gap-[7px] rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-1.5 text-[11.5px] font-semibold">
          <span className="h-[7px] w-[7px] rounded-full bg-mint" />
          Next up in your queue
        </span>
        <span className="rounded-pill border border-teal/7 bg-teal/7 px-[11px] py-1.5 font-mono text-[11.5px]">
          {deal.id}
        </span>
      </div>

      <div className="flex gap-[22px] px-5 pt-3.5 text-[11.5px] text-muted">
        {deal.stats.map((s) => (
          <div key={s.label}>
            {s.label}
            <b className="block font-heading text-[19px] font-semibold tabular-nums tracking-[-0.03em] text-ink">
              {s.value}
            </b>
          </div>
        ))}
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className="absolute top-[104px] right-0 left-0 h-[110px] w-full"
      >
        <defs>
          <linearGradient id="hero-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#8FD9C3" stopOpacity=".45" />
            <stop offset="1" stopColor="#8FD9C3" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="anim-hero-area" d={deal.chart.area} fill="url(#hero-fill)" />
        <path
          className="anim-hero-line stroke-teal"
          pathLength={1}
          d={deal.chart.line}
          fill="none"
          strokeWidth="2"
        />
        <circle className="anim-hero-pulse fill-teal" cx={deal.chart.dot.x} cy={deal.chart.dot.y} r="4.5" />
        <circle className="anim-hero-dot fill-teal" cx={deal.chart.dot.x} cy={deal.chart.dot.y} r="4.5" />
      </svg>

      <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-3 rounded-tile-lg border border-teal/7 bg-teal/7 px-4 py-3.5">
        <div className="min-w-0">
          <h3 id="h-next" className="m-0 font-heading text-[21px] leading-[1.15] font-semibold">
            {deal.merchant}
          </h3>
          <span className="mt-1 block text-cap font-semibold uppercase text-muted">
            {deal.requested} · {deal.stage}
          </span>
        </div>
        <Link
          href={deal.href}
          className="inline-flex h-10 flex-none items-center gap-1.5 rounded-pill bg-card px-3.5 text-[12.5px] font-semibold text-ink no-underline"
        >
          Open deal
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
