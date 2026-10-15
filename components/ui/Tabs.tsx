"use client";

import Link from "next/link";
import {
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

/**
 * Tabs — a row of tabs on a rounded track.
 *
 * Two looks from the design:
 *   pill   design/Deal-Summary.html. Grey #F5F3EF track, 22px radius, 6px
 *          padding; tabs 38px tall, fully round, 12.5px, with a 7px dot or
 *          a count after the label. Active tab is solid teal.
 *   panel  design/Tasks.html. White track, 18px radius, 4px padding; tabs
 *          36px tall, 14px radius, stretched to fill, with a dot before the
 *          label and a count after it. Active tab is solid teal.
 *
 * Items can be buttons (pass `value` + `onChange`) or links (give each item
 * an `href`; the active one is still chosen by `value`). The row never
 * wraps: it scrolls sideways with a hidden scrollbar (layout rule 4).
 *
 * Keyboard: Left / Right / Home / End move between tabs and select them.
 * No hover effects.
 */
export type TabDotColor = "teal" | "mint" | "amber" | "red" | "blue" | "purple" | "grey";
export type TabCountColor = "neutral" | "amber" | "red" | "blue" | "green";

export type TabItem = {
  value: string;
  label: ReactNode;
  href?: string;
  dot?: TabDotColor;
  count?: ReactNode;
  countColor?: TabCountColor;
};

export type TabsProps = {
  items: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  variant?: "pill" | "panel";
  label: string;
  className?: string;
};

const dotClass: Record<TabDotColor, string> = {
  teal: "bg-teal",
  mint: "bg-mint",
  amber: "bg-amber",
  red: "bg-red",
  blue: "bg-blue",
  purple: "bg-purple",
  grey: "bg-grey-dot",
};

const countClass: Record<TabCountColor, string> = {
  neutral: "bg-card text-ink",
  amber: "bg-amber-bg text-amber-text",
  red: "bg-red-bg text-red-text",
  blue: "bg-blue-bg text-blue-text",
  green: "bg-mint-bg text-teal-dark",
};

export function Tabs({
  items,
  value,
  onChange,
  variant = "pill",
  label,
  className = "",
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const isLinks = items.some((i) => i.href);

  const track =
    variant === "pill"
      ? "gap-1 rounded-[22px] bg-card p-1.5"
      : "gap-0.5 rounded-[18px] bg-tile p-1";

  const tabBase =
    variant === "pill"
      ? "h-[38px] rounded-pill px-3.5"
      : "h-9 flex-[1_0_auto] justify-center rounded-tile px-3";

  const focusTab = (index: number) => {
    const tabs = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]');
    const el = tabs?.[index];
    el?.focus();
    const next = items[index];
    if (next && next.value !== value) onChange?.(next.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((it) => it.value === value);
    if (i < 0) return;
    if (e.key === "ArrowRight") focusTab((i + 1) % items.length);
    else if (e.key === "ArrowLeft") focusTab((i - 1 + items.length) % items.length);
    else if (e.key === "Home") focusTab(0);
    else if (e.key === "End") focusTab(items.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={[
        "scrollbar-none flex min-w-0 overflow-x-auto",
        track,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => {
        const active = item.value === value;
        const classes = [
          "inline-flex flex-none cursor-pointer select-none items-center gap-[7px] whitespace-nowrap border-0 text-[12.5px] font-semibold leading-none no-underline outline-none focus-visible:ring-2 focus-visible:ring-mint",
          tabBase,
          active ? "bg-teal text-white" : "bg-transparent text-grey-text",
        ].join(" ");

        const dot = item.dot ? (
          <span
            aria-hidden="true"
            className={`inline-block h-[7px] w-[7px] flex-none rounded-full ${
              active && variant === "panel" ? "bg-mint" : dotClass[item.dot]
            }`}
          />
        ) : null;

        const count =
          item.count !== undefined ? (
            <span
              className={`box-border inline-block min-w-[18px] rounded-pill px-[7px] py-px text-center text-[10.5px] font-semibold leading-[1.3] ${
                active
                  ? "bg-white/22 text-white"
                  : countClass[item.countColor ?? "neutral"]
              }`}
            >
              {item.count}
            </span>
          ) : null;

        const content = (
          <>
            {variant === "panel" ? dot : null}
            {item.label}
            {variant === "pill" ? dot : null}
            {count}
          </>
        );

        const shared = {
          role: "tab" as const,
          "aria-selected": active,
          tabIndex: active ? 0 : -1,
          className: classes,
        };

        if (isLinks && item.href) {
          return (
            <Link
              key={item.value}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={(e: MouseEvent) => {
                if (onChange) {
                  onChange(item.value);
                  if (!item.href || item.href === "#") e.preventDefault();
                }
              }}
              {...shared}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange?.(item.value)}
            {...shared}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
