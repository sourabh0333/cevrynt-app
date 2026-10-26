"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { policyBadge, sectionFor, sectionLine, settingsGroups, settingsNavLabel, type PolicyMark } from "@/lib/copy/settings";

/**
 * The settings menu from design/Settings.html: three groups on a grey card,
 * the current section white with a soft shadow. It sticks to the top while
 * the settings content scrolls, but only when it sits beside the content;
 * once the layout stacks (container under 876px) it scrolls away normally.
 * Its own scrollbar is hidden. No hover. The Policy badge is the live
 * policy version (props, from the data layer).
 */
export function SettingsNav({ policy }: { policy: PolicyMark | null }) {
  const pathname = usePathname();
  const current = sectionFor(pathname)?.href;

  return (
    <nav
      aria-label={settingsNavLabel}
      className="scrollbar-none sticky top-0 z-[2] box-border flex max-h-[calc(100vh-60px)] max-w-full flex-[0_0_220px] flex-col gap-1 overflow-y-auto rounded-card bg-card p-2.5 @max-[876px]:static @max-[876px]:max-h-none"
    >
      {settingsGroups.map((g, gi) => (
        <div key={g.label} className="contents">
          <span className={`text-cap font-semibold uppercase text-hint ${gi === 0 ? "px-2.5 py-1.5" : "px-2.5 pt-3 pb-1.5"}`}>{g.label}</span>
          {g.items.map((it) => {
            const on = it.href === current;
            const badge = it.href === "/settings/policy" && policy ? policyBadge(policy) : null;
            return (
              <Link
                key={it.href}
                href={it.href}
                aria-current={on ? "page" : undefined}
                className={`flex items-center justify-between rounded-tile px-3 py-2.5 text-body-sm no-underline ${on ? "bg-tile font-semibold text-ink shadow-[0_6px_16px_-12px_rgba(15,21,19,.4)]" : "text-grey-text"}`}
              >
                {it.label}
                {badge ? (
                  <span className={`rounded-pill px-[7px] py-px text-[10.5px] font-normal ${on ? "bg-mint-bg text-teal-dark" : "bg-tile text-grey-text"}`}>{badge}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

/** The "Settings" page heading with the current section's line under it. */
export function SettingsHeading({ policy }: { policy: PolicyMark | null }) {
  const pathname = usePathname();
  const section = sectionFor(pathname);
  const line = section ? sectionLine(section, policy) : "";
  return (
    <span className="mt-2.5 inline-flex items-center gap-1.5 text-label font-semibold tracking-[0.06em] uppercase text-ink">{line}</span>
  );
}
