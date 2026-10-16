import type { IconName } from "@/components/shell/icons";

/**
 * Sidebar navigation. Labels, order, sections and counts come from the
 * sidebar inside design/Main.html and design/prototypes/Sidebar.dc.html.
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
      {
        key: "tasks",
        label: "My tasks",
        href: "/tasks",
        icon: "tasks",
        badge: { count: 7, tone: "quiet" },
      },
      { key: "intake", label: "Intake", href: "/intake", icon: "intake" },
      {
        key: "submissions",
        label: "Submissions",
        href: "/submissions",
        icon: "submissions",
        badge: { count: 28, tone: "quiet" },
      },
      { key: "offers", label: "Offers & funding", href: "/offers", icon: "offers" },
    ],
  },
  {
    label: "Portfolio",
    items: [
      { key: "merchants", label: "Merchants", href: "/merchants", icon: "merchants" },
      { key: "funded", label: "Funded deals", href: "/funded", icon: "funded" },
      {
        key: "renewals",
        label: "Renewals",
        href: "/renewals",
        icon: "renewals",
        badge: { count: 9, tone: "quiet" },
      },
      {
        key: "stacking",
        label: "Stacking Watch",
        href: "/stacking",
        icon: "stacking",
        badge: { count: 3, tone: "alert" },
      },
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

export const comingItem: NavItem & { note: string } = {
  key: "coming",
  label: "What's coming",
  href: "/whats-coming",
  icon: "star",
  note: "10 new",
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
