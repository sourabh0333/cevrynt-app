import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { loadingLabel } from "@/lib/copy/states";

/**
 * Loading placeholders (DATA-PLAN.md, section 3). Static grey blocks in the
 * card grey that mirror each page's real layout, so nothing jumps when the
 * data arrives. They never shimmer or pulse; the content that replaces them
 * fades in quickly through <Arrive>.
 *
 * Skeleton   one grey block; size and radius come from className.
 * SkeletonOn the same block for use on a grey card (white, so it shows).
 * SkeletonPage  wraps a page's skeleton: announces "Loading" to screen
 *               readers and lays children out like the content panel.
 * Arrive     wraps the real content; fades it in over 0.2s (none with
 *            reduced motion) and keeps the panel's 14px column gap.
 */
type BlockProps = { className?: string } & Omit<ComponentPropsWithoutRef<"span">, "children">;

export function Skeleton({ className = "", ...rest }: BlockProps) {
  return <span aria-hidden="true" className={`block bg-card ${className}`} {...rest} />;
}

export function SkeletonOn({ className = "", ...rest }: BlockProps) {
  return <span aria-hidden="true" className={`block bg-tile ${className}`} {...rest} />;
}

export function SkeletonPage({ children }: { children: ReactNode }) {
  return (
    <div role="status" aria-label={loadingLabel} aria-busy="true" className="flex flex-col gap-3.5">
      {children}
    </div>
  );
}

export function Arrive({ children }: { children: ReactNode }) {
  return <div className="anim-arrive flex flex-col gap-3.5">{children}</div>;
}
