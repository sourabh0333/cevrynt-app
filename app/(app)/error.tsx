"use client";

import { Button } from "@/components/ui/Button";
import { StateCard } from "@/components/ui/StateCard";
import { errorCopy } from "@/lib/copy/states";

/**
 * A page inside the app failed to load its data. Stays in the shell; "Try
 * again" re-renders the page. Data functions throw on backend failures
 * instead of returning made-up data, so this is what people see then.
 */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const c = errorCopy.page;
  return (
    <StateCard tone="alert" title={c.title} text={c.text}>
      <Button onClick={reset}>{c.retry}</Button>
      <Button href={c.home.href} variant="secondary">
        {c.home.label}
      </Button>
    </StateCard>
  );
}
