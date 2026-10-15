import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";
import { ProgressBar, type ProgressBarColor } from "./ProgressBar";

/**
 * StatTile — a key-number tile.
 *
 * Two looks from the design:
 *   design/Main.html ("Submitted 86"): white tile, 20px radius, 14px 16px
 *     padding, uppercase caption label, 24px number, an 8px bar and an
 *     11.5px footnote.
 *   design/Reports.html ("Funded $1.24M +12%"): 22px radius, 14px 16px 10px
 *     padding, 12px label with a change chip on the right, 26px number and
 *     a 120×28 sparkline (area + line) that draws in once.
 *
 * label      the caption. `caps` renders it as the uppercase caption (Main).
 * value      the big number.
 * change     { text, tone } chip at the top right. tone "good" is mint,
 *            "bad" is red, "neutral" is grey ("Flat", "YTD").
 * trend      numbers for the sparkline. `trendColor` teal (highlighted) or
 *            grey (default, as most Reports tiles).
 * bar        { value, color } draws an 8px ProgressBar under the number.
 * note       small hint line at the bottom ("41% of reviewed").
 * variant    "white" (default) or "mint" (the gradient tile).
 * delay      seconds, staggers the sparkline and bar entrance.
 */
export type StatTileChangeTone = "good" | "bad" | "neutral";

export type StatTileProps = {
  label: ReactNode;
  value: ReactNode;
  caps?: boolean;
  change?: { text: ReactNode; tone?: StatTileChangeTone };
  trend?: number[];
  trendColor?: "teal" | "grey";
  bar?: { value: number; color?: ProgressBarColor };
  note?: ReactNode;
  /** "teal" is the solid teal tile at the end of the pipeline (white text, mint bar). */
  variant?: "white" | "mint" | "teal";
  delay?: number;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const changeClass: Record<StatTileChangeTone, string> = {
  good: "bg-mint-bg text-teal-deep",
  bad: "bg-red-bg text-red-text",
  neutral: "bg-page text-hint",
};

/** 120×28 sparkline like the Reports KPI tiles: area under a 2px line. */
function Sparkline({
  points,
  color,
  delay,
}: {
  points: number[];
  color: "teal" | "grey";
  delay: number;
}) {
  const w = 120;
  const h = 28;
  const padX = 4;
  const top = 6;
  const bottom = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = points.length > 1 ? (w - padX * 2) / (points.length - 1) : 0;
  const coords = points.map((p, i) => {
    const x = padX + i * step;
    const y = bottom - ((p - min) / span) * (bottom - top);
    return [x.toFixed(1), y.toFixed(1)] as const;
  });
  const line = coords.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  const first = coords[0];
  const last = coords[coords.length - 1];
  const area = `${line} L${last[0]} ${h} L${first[0]} ${h} Z`;
  const stroke = color === "teal" ? "stroke-teal" : "stroke-grey-dot";
  const fill = color === "teal" ? "fill-teal/14" : "fill-grey-dot/14";
  const style: CSSProperties & { "--delay"?: string } = { "--delay": `${delay}s` };

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="block h-7 w-full"
    >
      <path d={area} className={`anim-fade ${fill}`} style={style} />
      <path
        d={line}
        pathLength={1}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`anim-draw ${stroke}`}
        style={style}
      />
    </svg>
  );
}

export function StatTile({
  label,
  value,
  caps = false,
  change,
  trend,
  trendColor = "grey",
  bar,
  note,
  variant = "white",
  delay = 0,
  className = "",
  ...rest
}: StatTileProps) {
  const teal = variant === "teal";
  const surface =
    variant === "mint"
      ? "rounded-[22px] bg-mint-card shadow-[inset_0_0_0_1px_#CDE6DE]"
      : teal
        ? "rounded-tile-lg bg-teal"
        : trend
          ? "rounded-[22px] bg-tile"
          : "rounded-tile-lg bg-tile";
  const padding = trend ? "px-4 pb-2.5 pt-3.5" : "px-4 py-3.5";
  const quiet = teal ? "text-mint-soft" : "text-hint";

  return (
    <div
      className={[
        "box-border flex min-w-0 flex-col",
        teal ? "text-white" : "text-ink",
        trend ? "gap-1.5" : "",
        surface,
        padding,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <span className="flex items-center justify-between gap-1.5">
        <span
          className={
            caps
              ? `text-cap font-semibold uppercase ${quiet}`
              : `whitespace-nowrap text-label ${teal ? "text-mint-soft" : "text-muted"}`
          }
        >
          {label}
        </span>
        {change ? (
          <span
            className={`whitespace-nowrap rounded-pill px-[7px] py-0.5 text-[10.5px] font-bold leading-[1.3] ${
              changeClass[change.tone ?? "neutral"]
            }`}
          >
            {change.text}
          </span>
        ) : null}
      </span>

      <b
        className={`block font-heading font-semibold tabular-nums tracking-[-0.03em] ${
          trend ? "text-[26px] leading-[1.05]" : "mt-1.5 text-[24px] leading-[1.15]"
        }`}
      >
        {value}
      </b>

      {trend ? <Sparkline points={trend} color={trendColor} delay={delay} /> : null}

      {bar ? (
        <ProgressBar
          className="mt-2.5"
          value={bar.value}
          height={8}
          color={bar.color ?? "teal"}
          track={teal ? "white" : "ink"}
          delay={delay}
        />
      ) : null}

      {note ? (
        <span className={`mt-1.5 block text-[11.5px] leading-[1.3] ${quiet}`}>{note}</span>
      ) : null}
    </div>
  );
}
