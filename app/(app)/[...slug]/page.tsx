import { Suspense } from "react";
import { notFound } from "next/navigation";

/**
 * Any internal URL that isn't a page. Every page in BUILD-PLAN.md now has
 * its own route (a static route always wins over this catch-all), so this
 * only sends unknown URLs to app/(app)/not-found.tsx, shown in the shell.
 * With cacheComponents on, params are read inside a Suspense boundary, so
 * the shell streams first and navigation stays instant.
 */
export default function UnknownPage({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={null}>
      <Unknown params={params} />
    </Suspense>
  );
}

async function Unknown({ params }: { params: PageProps<"/[...slug]">["params"] }): Promise<never> {
  await params;
  notFound();
}
