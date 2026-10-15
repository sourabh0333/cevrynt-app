import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Chip — a small rounded label for status, risk and severity.
 *
 * Taken from design/Submissions.html (status + risk columns),
 * design/Stacking.html (severity) and design/Tasks.html (dot chips).
 *
 * color: green | amber | red | blue | purple | grey
 * size:  "md" (default) 11.5px, 4px 10px — status chips ("In review", "Decision ready")
 *        "sm"           11px,   3px 9px  — risk and severity chips ("High", "Medium", "Low")
 * dot:   adds the 7px solid dot in front of the text ("Do this first", "Later today")
 * plain: white background with the color's text and dot, for chips that sit on a
 *        tinted card (the "Do this first · Now" chip in Tasks).
 *
 * Chips never wrap and have no hover state.
 */
export type ChipColor = "green" | "amber" | "red" | "blue" | "purple" | "grey";
export type ChipSize = "sm" | "md";

export type ChipProps = {
  color?: ChipColor;
  size?: ChipSize;
  dot?: boolean;
  plain?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "color">;

const fill: Record<ChipColor, string> = {
  green: "bg-mint-bg text-teal-dark",
  amber: "bg-amber-bg text-amber-text",
  red: "bg-red-bg text-red-text",
  blue: "bg-blue-bg text-blue-text",
  purple: "bg-purple-bg text-purple-text",
  grey: "bg-grey-bg text-grey-text",
};

// The small grey risk chip ("Not scored") is a touch lighter in the design.
const fillSmGrey = "bg-page text-hint";

const plainText: Record<ChipColor, string> = {
  green: "bg-tile text-teal-dark",
  amber: "bg-tile text-amber-text",
  red: "bg-tile text-red-text",
  blue: "bg-tile text-blue-text",
  purple: "bg-tile text-purple-text",
  grey: "bg-tile text-grey-text",
};

const dotColor: Record<ChipColor, string> = {
  green: "bg-teal",
  amber: "bg-amber",
  red: "bg-red",
  blue: "bg-blue",
  purple: "bg-purple",
  grey: "bg-grey-dot",
};

const sizeClass: Record<ChipSize, string> = {
  md: "text-[11.5px] px-2.5 py-1",
  sm: "text-[11px] px-[9px] py-[3px]",
};

export function Chip({
  color = "grey",
  size = "md",
  dot = false,
  plain = false,
  className = "",
  children,
  ...rest
}: ChipProps) {
  const colors = plain
    ? plainText[color]
    : size === "sm" && color === "grey"
      ? fillSmGrey
      : fill[color];

  const classes = [
    "inline-flex items-center whitespace-nowrap rounded-pill leading-[1.3]",
    dot ? "gap-[7px] font-bold" : "font-semibold",
    sizeClass[size],
    colors,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...rest}>
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block h-[7px] w-[7px] flex-none rounded-full ${dotColor[color]}`}
        />
      )}
      {children}
    </span>
  );
}
