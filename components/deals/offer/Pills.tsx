import type { ReactNode } from "react";

/**
 * The white pill groups in the offer builder (design/Deal-Offer.html):
 * equal-width options, the chosen one solid teal. No hover.
 */
export function Pills<T extends string | number>({
  label,
  options,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  /** tighter padding for groups of five, so they never overflow */
  compact?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-pill bg-tile p-1">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`h-[34px] min-w-0 flex-1 cursor-pointer whitespace-nowrap rounded-pill border-0 text-[12.5px] font-semibold ${compact ? "px-1" : "px-2"} ${on ? "bg-teal text-white" : "bg-transparent text-grey-text"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
