"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";

/**
 * SegmentedSwitch — a small pill switch with one selected option.
 *
 * Two looks from the design:
 *   teal  design/Tasks.html "Mine / Team". White round track, 4px padding;
 *         options 30px tall, round, 12.5px; the selected one is solid teal.
 *   soft  design/Settings-Audit.html "Today / 7 days / 30 days". #E8E4DB
 *         track, 16px radius; options 34px tall, 12px radius, 12px text;
 *         the selected one is white with a small shadow.
 *
 * Keyboard: Left / Right / Home / End move and select. No hover effects.
 */
export type SegmentedOption = { value: string; label: ReactNode };

export type SegmentedSwitchProps = {
  options: SegmentedOption[];
  value: string;
  onChange?: (value: string) => void;
  variant?: "teal" | "soft";
  /**
   * teal variant only. "white" (default) is the white track on a grey card;
   * "grey" is the #F5F3EF track with 34px options that sits on the white
   * panel (design/Reports.html period switch).
   */
  track?: "white" | "grey";
  label: string;
  className?: string;
};

export function SegmentedSwitch({
  options,
  value,
  onChange,
  variant = "teal",
  track: trackTone = "white",
  label,
  className = "",
}: SegmentedSwitchProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const onPanel = variant === "teal" && trackTone === "grey";

  const track =
    variant === "teal"
      ? `rounded-pill ${onPanel ? "bg-card" : "bg-tile"}`
      : "rounded-[16px] bg-track";

  const option =
    variant === "teal"
      ? onPanel
        ? "h-[34px] rounded-pill px-3.5 text-[12.5px]"
        : "h-[30px] rounded-pill px-4 text-[12.5px]"
      : "h-[34px] rounded-[12px] px-3 text-label";

  const selected =
    variant === "teal"
      ? "bg-teal text-white"
      : "bg-tile text-ink shadow-[0_2px_6px_-2px_rgba(15,21,19,.25)]";

  const idle =
    variant === "teal" ? "bg-transparent text-grey-text" : "bg-transparent text-muted";

  const pick = (index: number) => {
    const next = options[index];
    if (!next) return;
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[index]?.focus();
    if (next.value !== value) onChange?.(next.value);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = options.findIndex((o) => o.value === value);
    if (i < 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") pick((i + 1) % options.length);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      pick((i - 1 + options.length) % options.length);
    else if (e.key === "Home") pick(0);
    else if (e.key === "End") pick(options.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={["inline-flex flex-none gap-0.5 p-1", track, className]
        .filter(Boolean)
        .join(" ")}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange?.(o.value)}
            className={[
              "inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap border-0 font-semibold leading-none outline-none focus-visible:ring-2 focus-visible:ring-mint",
              option,
              on ? selected : idle,
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
