import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * SectionHeader — the title row at the top of a card or section.
 *
 * Taken from design/Main.html ("Recent activity" + "View all",
 * "My queue" + subtitle), Tasks.html ("Waiting on others" + hint),
 * Merchants.html and Brokers.html ("Paperwork on file" + chip).
 *
 * title     Bricolage Grotesque 600. size "lg" 20px (default), "md" 18px, "sm" 17px.
 * subtitle  12px hint text under the title, 3px gap.
 * link      { label, href } rendered on the right as the uppercase teal caption
 *           ("View all").
 * action    any node on the right instead of a link (a Chip, a Button, a hint).
 * as        heading level, default h2.
 *
 * The row is flex, space-between, vertically centered. Nothing hovers.
 */
export type SectionHeaderSize = "lg" | "md" | "sm";

export type SectionHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  link?: { label: ReactNode; href: string };
  action?: ReactNode;
  size?: SectionHeaderSize;
  as?: "h1" | "h2" | "h3" | "h4";
  titleId?: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"div">, "title">;

const sizeClass: Record<SectionHeaderSize, string> = {
  lg: "text-card-title-lg",
  md: "text-card-title",
  sm: "text-card-title-sm",
};

export function SectionHeader({
  title,
  subtitle,
  link,
  action,
  size = "lg",
  as: Heading = "h2",
  titleId,
  className = "",
  ...rest
}: SectionHeaderProps) {
  const right = link ? (
    <Link
      href={link.href}
      className="flex-none text-cap font-semibold uppercase text-teal no-underline"
    >
      {link.label}
    </Link>
  ) : (
    action
  );

  return (
    <div
      className={["flex items-center justify-between gap-3", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <div className="min-w-0">
        <Heading
          id={titleId}
          className={`m-0 font-heading font-semibold text-ink ${sizeClass[size]}`}
        >
          {title}
        </Heading>
        {subtitle ? (
          <div className="mt-[3px] text-label text-hint">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="flex flex-none items-center">{right}</div> : null}
    </div>
  );
}
