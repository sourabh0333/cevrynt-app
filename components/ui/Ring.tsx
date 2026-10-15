import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Ring — a circular progress ring with a number in the middle.
 *
 * Taken from the 34px score rings in design/Submissions.html
 * (r 13, stroke 3.5, 11px bold number), the 44px rings in Renewals.html
 * (an icon in a white center) and the 120px "done today" ring in Tasks.html
 * (stroke 12, 28px number with a small suffix and a caption).
 *
 * value    0–100, the filled part of the circle.
 * size     diameter in px (34, 44, 120 in the design). Default 34.
 * stroke   ring thickness; defaults to a tenth of the size.
 * color    "auto" (default) picks by value like the score rings:
 *          80 and up teal, 70–79 amber, below 70 red.
 *          Or set teal | mint | amber | red | blue | grey | ink directly.
 * label    text in the middle. Defaults to the value. Pass a ReactNode
 *          for "5/12"-style numbers, or `children` to replace the center
 *          entirely (an icon, a number with a caption).
 * caption  small hint text under the label, for big rings ("done today").
 * delay    seconds before the sweep starts, so lists can stagger.
 *
 * The ring sweeps clockwise from the top once when it first appears and
 * the number pops in. No hover. Reduced motion shows the final state.
 */
export type RingColor =
  | "auto"
  | "teal"
  | "mint"
  | "amber"
  | "red"
  | "blue"
  | "grey"
  | "ink";

export type RingProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: RingColor;
  label?: ReactNode;
  caption?: ReactNode;
  delay?: number;
  animate?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "color" | "children">;

const strokeClass: Record<Exclude<RingColor, "auto">, string> = {
  teal: "stroke-teal",
  mint: "stroke-mint",
  amber: "stroke-amber",
  red: "stroke-red",
  blue: "stroke-blue",
  grey: "stroke-grey-dot",
  ink: "stroke-ink",
};

export function ringColorFor(value: number): Exclude<RingColor, "auto"> {
  if (value >= 80) return "teal";
  if (value >= 70) return "amber";
  return "red";
}

export function Ring({
  value,
  size = 34,
  stroke,
  color = "auto",
  label,
  caption,
  delay = 0,
  animate = true,
  ariaLabel,
  className = "",
  children,
  ...rest
}: RingProps) {
  const pct = Math.max(0, Math.min(100, value));
  const sw = stroke ?? Math.round(size / 5) / 2; // 34→3.5, 44→4.5, 120→12
  const c = size / 2;
  const r = c - sw;
  const tone = color === "auto" ? ringColorFor(pct) : color;
  // 34→11px (Submissions), 44→12px, 120→28px (Tasks)
  const numberPx =
    size <= 36
      ? Math.round(size * 0.32)
      : size <= 60
        ? Math.round(size * 0.27)
        : Math.round(size * 0.23);
  const delayStyle: CSSProperties & { "--delay"?: string } = {
    "--delay": `${delay}s`,
  };

  return (
    <span
      role="img"
      aria-label={ariaLabel ?? `${Math.round(pct)}%`}
      className={[
        "relative inline-grid flex-none place-items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width: size, height: size, ...delayStyle }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="absolute inset-0"
      >
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          className="stroke-line"
          strokeWidth={sw}
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          pathLength={100}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${pct} 100`}
          transform={`rotate(-90 ${c} ${c})`}
          className={`${strokeClass[tone]} ${animate ? "anim-ring" : ""}`}
          style={delayStyle}
        />
      </svg>
      <span
        aria-hidden="true"
        className={`relative text-center leading-none ${animate ? "anim-pop" : ""}`}
        style={delayStyle}
      >
        {children ?? (
          <>
            <b
              className="block font-heading font-semibold tabular-nums tracking-[-0.03em] text-ink"
              style={{ fontSize: numberPx }}
            >
              {label ?? Math.round(pct)}
            </b>
            {caption ? (
              <span className="mt-0.5 block text-label-sm text-hint">
                {caption}
              </span>
            ) : null}
          </>
        )}
      </span>
    </span>
  );
}
