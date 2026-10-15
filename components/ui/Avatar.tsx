import type { ComponentPropsWithoutRef } from "react";

/**
 * Avatar — initials in a colored circle.
 *
 * Fills come from the finished pages (Main, Tasks, Merchants, Brokers):
 *   sand   #E8D9C1  (Maya Chen, default)
 *   blue   #DCE9F5  (Priya Shah)
 *   mint   #CFE6DD  (J. R.)
 *   red    #F6DED8  (Nina Ortiz)
 *   cream  #F2E7CF  (Sam Lee)
 *   purple #EDE4F7  (L. P.)
 *
 * Sizes: 28 / 32 / 40 px. Initials are bold and scale with the circle
 * (10 / 11 / 12 px), matching the 30–42px avatars in the design.
 * Pass `name` for an accessible label; the initials themselves are hidden
 * from screen readers.
 */
export type AvatarColor = "sand" | "blue" | "mint" | "red" | "cream" | "purple";
export type AvatarSize = 28 | 32 | 40;

export type AvatarProps = {
  initials: string;
  name?: string;
  color?: AvatarColor;
  size?: AvatarSize;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"span">, "color" | "children">;

const colorClass: Record<AvatarColor, string> = {
  sand: "bg-sand text-sand-text",
  blue: "bg-blue-bg text-ink",
  mint: "bg-mint-soft text-ink",
  red: "bg-red-bg text-ink",
  cream: "bg-cream text-ink",
  purple: "bg-purple-bg text-ink",
};

const sizeClass: Record<AvatarSize, string> = {
  28: "h-7 w-7 text-[10px]",
  32: "h-8 w-8 text-[11px]",
  40: "h-10 w-10 text-[12px]",
};

export function Avatar({
  initials,
  name,
  color = "sand",
  size = 32,
  className = "",
  ...rest
}: AvatarProps) {
  const classes = [
    "inline-grid flex-none place-items-center rounded-full font-bold leading-none select-none",
    colorClass[color],
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      role={name ? "img" : undefined}
      aria-label={name}
      {...rest}
    >
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}
