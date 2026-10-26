import Link from "next/link";
import type { ReactNode } from "react";
import { comingSoonHint } from "@/lib/copy/states";

/**
 * Wraps a disabled button whose page or action isn't built yet. The wrapper
 * carries the small "Coming soon" tooltip (a disabled button gets no pointer
 * events, so the hint sits on the wrapper), and ComingSoonNote tells screen
 * readers the same. className sizes the wrapper in its row (flex-1, a grid
 * cell); the button inside fills it.
 */
export function ComingSoon({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <span title={comingSoonHint} className={`inline-flex ${className}`}>
      {children}
    </span>
  );
}

/** The hint for screen readers, inside the disabled button. */
export function ComingSoonNote() {
  return <span className="sr-only"> ({comingSoonHint})</span>;
}

/**
 * A text link whose destination may not exist yet: with an href it's a
 * normal link; with none (href null in lib/copy) it's the same text as a
 * disabled button with the "Coming soon" tooltip. className is the text's
 * look; layout places it in its card (mt-auto, self-start) either way.
 */
export function MaybeLink({ href, className, layout = "", children }: { href: string | null; className: string; layout?: string; children: ReactNode }) {
  if (href)
    return (
      <Link href={href} className={`${layout} ${className}`}>
        {children}
      </Link>
    );
  return (
    <ComingSoon className={layout}>
      <button type="button" disabled className={`cursor-default border-0 bg-transparent p-0 text-left opacity-50 ${className}`}>
        {children}
        <ComingSoonNote />
      </button>
    </ComingSoon>
  );
}
