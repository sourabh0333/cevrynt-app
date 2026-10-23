import type { ReactNode } from "react";

/**
 * The message card for "not found" and error states inside the app shell
 * (DATA-PLAN.md, section 3): a grey card with an icon, a title, one line of
 * help and the actions. No hover. `tone` "alert" uses the red icon for
 * errors; "quiet" the grey one for not found.
 */
export function StateCard({ title, text, tone = "quiet", children }: { title: string; text: string; tone?: "quiet" | "alert"; children?: ReactNode }) {
  return (
    <section role={tone === "alert" ? "alert" : undefined} className="flex flex-col items-start gap-3.5 rounded-card-lg bg-card p-7 text-ink">
      <span aria-hidden="true" className={`grid h-11 w-11 place-items-center rounded-tile ${tone === "alert" ? "bg-red-bg text-red-text" : "bg-tile text-hint"}`}>
        {tone === "alert" ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 8v5M12 16.5v.5" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        )}
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="m-0 font-heading text-card-title-lg font-semibold">{title}</h1>
        <p className="m-0 text-body-sm text-muted">{text}</p>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </section>
  );
}
