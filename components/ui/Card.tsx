import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

/**
 * Card — the basic surface used across every internal page.
 *
 * Variants, taken from design/Main.html and design/Submissions.html:
 * - grey:  #F5F3EF, 30px radius, no border. The default card on the white panel.
 * - white: #FFFFFF, 24px radius, 1px #ECE8E0 border. A white card on the white panel.
 * - mint:  the mint gradient, 30px radius, 1px #CDE6DE border. Highlight cards
 *          (next deal, what's coming, selected queue item).
 *
 * All variants: 20px padding, ink text, flex column with a 12px gap, no hover.
 * `padding={false}` removes the padding for cards that draw their own inner
 * layout (for example the "Next deal" card, which uses overflow: hidden).
 */
export type CardVariant = "grey" | "white" | "mint";

type CardOwnProps<T extends ElementType> = {
  as?: T;
  variant?: CardVariant;
  padding?: boolean;
  className?: string;
  children?: ReactNode;
};

export type CardProps<T extends ElementType = "div"> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

const variantClass: Record<CardVariant, string> = {
  grey: "bg-card rounded-card-lg",
  white: "bg-tile rounded-card border border-line",
  mint: "bg-mint-card rounded-card-lg border border-mint-border",
};

export function Card<T extends ElementType = "div">({
  as,
  variant = "grey",
  padding = true,
  className = "",
  children,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const classes = [
    "box-border flex min-w-0 flex-col gap-3 text-ink",
    variantClass[variant],
    padding ? "p-5" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
