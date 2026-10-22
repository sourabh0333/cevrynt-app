/**
 * The small check marks on the Integrity tab (design/Deal-Integrity.html).
 * round:  22px teal circle, white tick (document checks, application signals)
 * square: 28px teal square with a 10px radius (pattern checks)
 * Dash: the grey "does not apply" circle in the document table.
 */
export function Tick({ shape = "round", size = 22 }: { shape?: "round" | "square"; size?: number }) {
  return (
    <span
      aria-label="Passed"
      className={`grid flex-none place-items-center bg-teal text-white ${shape === "round" ? "rounded-full" : "rounded-[10px]"}`}
      style={{ width: size, height: size }}
    >
      <svg aria-hidden="true" width={shape === "round" && size <= 22 ? 10 : 12} height={shape === "round" && size <= 22 ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5 9-10" />
      </svg>
    </span>
  );
}

export function Dash() {
  return (
    <span aria-label="Does not apply" className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-line text-label font-bold text-hint-soft">
      –
    </span>
  );
}
