import type { IconName } from "@/components/shell/icons";

/**
 * Sidebar navigation. Labels, order and sections come from the
 * sidebar inside design/Main.html and design/prototypes/Sidebar.dc.html;
 * the badge counts come from the data layer (components/shell).
 * Routes come from the page map in BUILD-PLAN.md.
 */
export type NavBadge = { count: number; tone: "quiet" | "alert" };

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  badge?: NavBadge;
};

export type NavSection = { label: string; items: NavItem[] };

export const navSections: NavSection[] = [
  {
    label: "Work",
    items: [
      { key: "home", label: "Home", href: "/", icon: "home" },
      // My tasks, Submissions and Renewals count their badges from the records
      // through the data layer (components/shell/CountBadges.tsx).
      { key: "tasks", label: "My tasks", href: "/tasks", icon: "tasks" },
      { key: "intake", label: "Intake", href: "/intake", icon: "intake" },
      { key: "submissions", label: "Submissions", href: "/submissions", icon: "submissions" },
      { key: "offers", label: "Offers & funding", href: "/offers", icon: "offers" },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { key: "merchants", label: "Merchants", href: "/merchants", icon: "merchants" },
      { key: "funded", label: "Funded deals", href: "/funded", icon: "funded" },
      { key: "renewals", label: "Renewals", href: "/renewals", icon: "renewals" },
      // Its badge counts today's new alerts through the data layer (components/shell/StackingBadge.tsx).
      { key: "stacking", label: "Stacking Watch", href: "/stacking", icon: "stacking" },
    ],
  },
  {
    label: "Partners & insights",
    items: [
      { key: "brokers", label: "Brokers", href: "/brokers", icon: "brokers" },
      { key: "reports", label: "Reports", href: "/reports", icon: "reports" },
      { key: "settings", label: "Settings", href: "/settings/policy", icon: "settings" },
    ],
  },
];

// Its "10 new" note is counted from the roadmap through the data layer
// (components/shell/ComingNote.tsx), so the badge and the page agree.
export const comingItem: NavItem = {
  key: "coming",
  label: "What's coming",
  href: "/whats-coming",
  icon: "star",
};

export const workspace = {
  initials: "RC",
  name: "Ridgeline Capital",
  kind: "Funder workspace",
};

export const currentUser = {
  initials: "MC",
  name: "Maya Chen",
  role: "Underwriter",
};

/** Which nav key is active for a pathname. "/" is exact; others match by prefix. */
export function activeNavKey(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/settings")) return "settings";
  if (pathname.startsWith("/whats-coming")) return "coming";
  // Deal pages open from the queue, so Submissions stays lit (design/Deal-Summary.html).
  if (pathname.startsWith("/deals")) return "submissions";
  for (const section of navSections) {
    for (const item of section.items) {
      if (item.href !== "/" && pathname.startsWith(item.href)) return item.key;
    }
  }
  return null;
}
