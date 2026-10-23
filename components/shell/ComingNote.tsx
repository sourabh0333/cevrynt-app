import { comingNote } from "@/lib/copy/coming";
import { countRoadmapFeatures } from "@/lib/data/roadmap";

/**
 * The sidebar's "10 new" next to What's coming, counted from the roadmap
 * through the data layer. A server component: the shell passes it into the
 * client sidebar inside its own Suspense with no placeholder, so the number
 * simply appears. It lives in the shell, so a failure here must not take
 * down every page: if the count can't be loaded, the note is left out.
 */
export async function ComingNote() {
  const count = await countRoadmapFeatures().catch(() => null);
  return count === null ? null : <>{comingNote(count)}</>;
}
