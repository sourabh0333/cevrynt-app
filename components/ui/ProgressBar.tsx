import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * ProgressBar — a rounded track with a colored fill.
 *
 * Taken from the stat tiles in design/Main.html (8px, ink on ink/8),
 * the repaid bars in design/Funded.html (6px, teal, 12px label row above)
 * and the mint bars on dark cards.
 *
 * value   0–100.
 * color   teal (default), mint, amber, red, blue, grey, ink,
 *         purple (the deep purple of the "failed final checks" bar on Offers),
 *         teal-soft, teal-mid, mint-deep, teal-ink (score-part colors).
 * height  4 | 5 | 6 | 8 | 10 px. The radius is always half the height.
 * track   "ink" (default, rgba ink 8%), "teal" (teal 7%, under mint fills),
 *         "white" (white 20%, on dark or teal cards).
 * label / value text  an optional 12px row above: label bold on the left,
 *         valueText in hint color on the right.
 * delay   seconds before the fill grows, so lists can stagger.
 *
 * The fill grows from the left once when it first appears. No hover.
 * With prefers-reduced-motion it shows the final state.
 */
export type ProgressBarColor =
  | "teal"
  | "mint"
  | "amber"
  | "red"
  | "blue"
  | "grey"
  | "ink"
  | "purple"
  | "teal-soft"
  | "teal-mid"
  | "mint-deep"
  | "teal-ink";
export type ProgressBarHeight = 4 | 5 | 6 | 8 | 10;
export type ProgressBarTrack = "ink" | "teal" | "white" | "faint" | "line";

export type ProgressBarProps = {
  value: number;
  color?: ProgressBarColor;
  height?: ProgressBarHeight;
  track?: ProgressBarTrack;
  label?: ReactNode;
  valueText?: ReactNode;
  delay?: number;
  animate?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

const fillClass: Record<ProgressBarColor, string> = {
  teal: "bg-teal",
  mint: "bg-mint",
  amber: "bg-amber",
  red: "bg-red",
  blue: "bg-blue",
  grey: "bg-grey-dot",
  ink: "bg-ink",
  purple: "bg-purple-text",
  "teal-soft": "bg-teal-soft",
  "teal-mid": "bg-teal-mid",
  "mint-deep": "bg-mint-deep",
  "teal-ink": "bg-teal-ink",
};

const trackClass: Record<ProgressBarTrack, string> = {
  ink: "bg-ink/8",
  teal: "bg-teal/7",
  white: "bg-white/20",
  faint: "bg-line-faint",
  line: "bg-line",
};

const heightClass: Record<ProgressBarHeight, string> = {
  4: "h-1 rounded-[2px]",
  5: "h-[5px] rounded-[2.5px]",
  6: "h-1.5 rounded-[3px]",
  8: "h-2 rounded-[4px]",
  10: "h-2.5 rounded-[5px]",
};

export function ProgressBar({
  value,
  color = "teal",
  height = 6,
  track = "ink",
  label,
  valueText,
  delay = 0,
  animate = true,
  className = "",
  ...rest
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const fillStyle: CSSProperties & { "--delay"?: string } = {
    width: `${pct}%`,
    "--delay": `${delay}s`,
  };

  return (
    <div className={["min-w-0", className].filter(Boolean).join(" ")} {...rest}>
      {label !== undefined || valueText !== undefined ? (
        <div className="mb-1 flex items-baseline justify-between gap-2 text-label">
          <b className="min-w-0 truncate font-semibold text-ink">{label}</b>
          {valueText !== undefined ? (
            <span className="flex-none text-hint">{valueText}</span>
          ) : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        className={`w-full overflow-hidden ${heightClass[height]} ${trackClass[track]}`}
      >
        <div
          className={`h-full ${heightClass[height]} ${fillClass[color]} ${
            animate ? "anim-grow-x" : ""
          }`}
          style={fillStyle}
        />
      </div>
    </div>
  );
}
