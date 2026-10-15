import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Button — pill-shaped action button.
 *
 * Taken from design/Main.html, Tasks.html, Merchants.html and Brokers.html.
 *
 * variant:
 *   primary   solid teal, white text ("Open the alert", "Review statements")
 *   secondary grey #F5F3EF, ink text ("Open deal", "All brokers")
 *   outline   white with a 1.5px teal border and teal text ("Message broker" alt)
 * size:
 *   md  42px tall, 13px text, 0 18px padding (default)
 *   sm  30px tall, 12.5px text, 0 14px padding ("Mine" / "Team", "Score")
 * icon:  icon-only round version: width equals height, no padding.
 *        Give it an aria-label.
 * glow:  adds the soft teal shadow some primary buttons have in the design.
 * href:  renders a Next.js Link instead of a <button>.
 *
 * No hover effects (CLAUDE.md). Text never wraps.
 */
export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "md" | "sm";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: boolean;
  glow?: boolean;
  className?: string;
  children?: ReactNode;
};

type AsButton = Common & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    keyof Common
  >;
type AsLink = Common & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    keyof Common | "href"
  >;

export type ButtonProps = AsButton | AsLink;

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-teal text-white",
  secondary: "bg-card text-ink",
  outline: "bg-tile text-teal border-[1.5px] border-teal",
};

const sizeClass: Record<ButtonSize, { text: string; icon: string }> = {
  md: { text: "h-[42px] px-[18px] text-body-sm", icon: "h-[42px] w-[42px]" },
  sm: { text: "h-[30px] px-[14px] text-[12.5px]", icon: "h-[30px] w-[30px]" },
};

function classesFor({
  variant = "primary",
  size = "md",
  icon = false,
  glow = false,
  className = "",
}: Common) {
  return [
    "box-border inline-flex flex-none cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-semibold leading-none no-underline",
    "disabled:cursor-default disabled:opacity-50",
    variantClass[variant],
    icon ? sizeClass[size].icon : sizeClass[size].text,
    glow && variant === "primary"
      ? "shadow-[0_10px_22px_-14px_rgba(14,107,92,.8)]"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: ButtonProps) {
  const { variant, size, icon, glow, className, children, ...rest } = props;
  const classes = classesFor({ variant, size, icon, glow, className });

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonRest } = rest as AsButton;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
