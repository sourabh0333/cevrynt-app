"use client";

/**
 * Switch — the small on/off toggle from design/Settings.html (rule rows).
 * 38 × 22 pill: on is solid teal with the white knob on the right; off is
 * the warm grey track with the knob on the left. The knob slides over
 * 150ms (a state change, not a hover). Uses role="switch" so screen
 * readers announce on/off; pass a label naming what it turns on.
 */
export type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
};

export function Switch({ checked, onChange, label, className = "" }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] flex-none cursor-pointer rounded-pill border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-mint ${checked ? "bg-teal" : "bg-line-strong"} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[3px] left-[3px] h-4 w-4 rounded-full bg-tile shadow-[0_1px_2px_rgba(15,21,19,.2)] transition-transform duration-150 motion-reduce:transition-none ${checked ? "translate-x-4" : ""}`}
      />
    </button>
  );
}
