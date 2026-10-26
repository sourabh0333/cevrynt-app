import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/shell/icons";
import type { KeyNumbers as KeyNumbersData } from "@/lib/copy/home";

const big = "font-heading text-[30px] leading-none font-semibold tabular-nums tracking-[-0.03em]";
const cap = "mt-1.5 text-cap font-semibold uppercase";
const tile = "box-border flex min-h-[176px] flex-col justify-between gap-3 rounded-card-lg p-5";
const pillLink =
  "grid h-10 place-items-center rounded-pill bg-card text-cap font-semibold uppercase text-ink no-underline";

/** "Key numbers" row from design/Main.html: five tiles, each its own look. */
export function KeyNumbers({ data }: { data: KeyNumbersData }) {
  const { submissions, offers, stacking, funded, renewals } = data;
  // A 170px minimum (the design says 190) keeps all five tiles on one row at
  // common widths instead of wrapping the fifth alone.
  return (
    <section
      aria-label="Key numbers"
      className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5 text-ink"
    >
      <article className={`${tile} bg-card`}>
        <div>
          <div className={big}>{submissions.value}</div>
          <div className={cap}>Submissions today</div>
          <div className="mt-[3px] text-label text-hint">
            <b className="text-teal">{submissions.change}</b> {submissions.changeNote}
          </div>
        </div>
        <div>
          <div className="h-1.5 rounded-[3px] bg-[linear-gradient(90deg,#CDE9DF,#8FD9C3_50%,#E9D7A9)]" />
          <div className="mt-[7px] flex justify-between text-[10px] font-semibold tracking-[0.08em] uppercase text-hint">
            {submissions.scale.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </article>

      <article className={`${tile} bg-cream`}>
        <div>
          <div className={big}>{offers.value}</div>
          <div className={cap}>Offers out</div>
          <div className="mt-[3px] text-label text-amber-text">
            <b>{offers.expiring}</b> {offers.expiringNote}
          </div>
        </div>
        <Link href={offers.href} className={pillLink}>
          View offers
        </Link>
      </article>

      <article className={`${tile} bg-card-stone`}>
        <div>
          <div className={big}>{stacking.value}</div>
          <div className={cap}>Stacking alerts</div>
          <div className="mt-[3px] text-label text-hint">
            <b className="text-coral-text">{stacking.lead}</b> {stacking.leadNote}
          </div>
        </div>
        <Link href={stacking.href} className={pillLink}>
          Review alerts
        </Link>
      </article>

      <article className={`${tile} border border-mint-edge bg-[linear-gradient(160deg,#F1F6F3,#FFFFFF)]`}>
        <Icon name="star" size={20} strokeLinecap="butt" className="text-teal" />
        <div className="rounded-tile-lg border border-teal/7 bg-teal/7 p-3.5">
          <div className="font-heading text-[26px] leading-none font-semibold tabular-nums tracking-[-0.03em]">
            {funded.value}
          </div>
          <div className="mt-1 text-label text-muted">
            <b className="text-teal-deep">{funded.change}</b> {funded.changeNote}
          </div>
          <div className="mt-1.5 text-cap font-semibold uppercase text-muted">Funded this month</div>
        </div>
      </article>

      <article className="relative min-h-[176px] overflow-hidden rounded-card-lg bg-[linear-gradient(160deg,#E4D9C3,#C3B28E)]">
        <svg
          aria-hidden="true"
          viewBox="0 0 220 180"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <circle className="anim-rn-sun" cx={renewals.sun.x} cy={renewals.sun.y} r={renewals.sun.r} fill="#F5EDDC" opacity=".8" />
          <g className="fill-teal" opacity=".85">
            {renewals.bars.map((b, i) => {
              const style: CSSProperties & { "--i"?: number } = { "--i": i };
              return <rect key={b.x} className="anim-rn-bar" style={style} x={b.x} y={b.y} width="34" height={b.h} rx="6" />;
            })}
          </g>
          <path
            className="anim-rn-line stroke-ink"
            pathLength={1}
            d={renewals.line}
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link
          href={renewals.href}
          className="absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-[16px] bg-white/70 px-3 py-2.5 text-ink no-underline backdrop-blur-[12px]"
        >
          <span>
            <span className="block text-cap font-semibold uppercase">Renewals ready</span>
            <span className="text-[11.5px] text-muted">{renewals.note}</span>
          </span>
          <b className="font-heading text-[24px] font-semibold tabular-nums tracking-[-0.03em]">{renewals.value}</b>
        </Link>
      </article>
    </section>
  );
}
