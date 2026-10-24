import { newToday } from "@/lib/copy/stacking";
import { getNow } from "@/lib/data/clock";
import { listStackingAlerts } from "@/lib/data/stacking";
import { NavBadgeMarks } from "./Sidebar";

/**
 * The sidebar's Stacking Watch badge: today's new alerts, counted from the
 * alerts through the data layer with the same function the page header
 * uses. A server component in its own Suspense with no placeholder, so the
 * number simply appears; if the alerts can't be loaded, or none are new,
 * there is no badge.
 */
export async function StackingBadge() {
  const count = await Promise.all([listStackingAlerts(), getNow()])
    .then(([alerts, now]) => newToday(alerts, now))
    .catch(() => 0);
  return count ? <NavBadgeMarks count={count} tone="alert" /> : null;
}
