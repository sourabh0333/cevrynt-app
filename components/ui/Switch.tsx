"use client";

/**
 * Switch — the small on/off toggle from design/Settings.html (rule rows).
 * 38 × 22 pill: on is solid teal with the white knob on the right; off is
 * the warm grey track (#D8D3C8, design/Settings-Workspace.html) with the
 * knob on the left. The knob slides over
 * 150ms (a state change, not a hover). Uses role="switch" so screen
 * readers announce on/off; pass a label naming what it turns on.
 */
export type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  /** "md" 38 × 22 (rule rows), "sm" 34 × 20 (outreach step cards in Settings › Renewal rules) */
  size?: "md" | "sm";
  className?: string;
};

const sizes = {
  md: { track: "h-[22px] w-[38px]", knob: "h-4 w-4", on: "translate-x-4" },
  sm: { track: "h-5 w-[34px]", knob: "h-3.5 w-3.5", on: "translate-x-3.5" },
};

export function Switch({ checked, onChange, label, size = "md", className = "" }: SwitchProps) {
  const s = sizes[size];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative ${s.track} flex-none cursor-pointer rounded-pill border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-mint ${checked ? "bg-teal" : "bg-line-dash-soft"} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[3px] left-[3px] ${s.knob} rounded-full bg-tile shadow-[0_1px_2px_rgba(15,21,19,.2)] transition-transform duration-150 motion-reduce:transition-none ${checked ? s.on : ""}`}
      />
    </button>
  );
}
