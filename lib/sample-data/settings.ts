/**
 * Settings menu and section headings, from the "Settings sections" nav in
 * design/Settings.html and the other design/Settings-*.html pages.
 */

/** built: the section has its own page folder, so the placeholder route skips it. */
export type SettingsSection = { href: string; label: string; line: string; badge?: string; built?: boolean };

export const settingsTitle = "Settings";
export const settingsNavLabel = "Settings sections";

export const settingsGroups: { label: string; items: SettingsSection[] }[] = [
  {
    label: "Underwriting",
    items: [
      { href: "/settings/policy", label: "Policy", line: "Policy · version 3, active since Sep 2", badge: "v3", built: true },
      { href: "/settings/pricing", label: "Pricing & disclosures", line: "Pricing & disclosures", built: true },
    ],
  },
  {
    label: "Deal flow",
    items: [
      { href: "/settings/intake", label: "Intake channels", line: "Intake channels", built: true },
      { href: "/settings/renewals", label: "Renewal rules", line: "Renewal rules" },
    ],
  },
  {
    label: "Organization",
    items: [
      { href: "/settings/team", label: "Team & roles", line: "Team & roles" },
      { href: "/settings/workspace", label: "Workspace", line: "Workspace" },
      { href: "/settings/plan", label: "Plan & usage", line: "Plan & usage" },
      { href: "/settings/security", label: "Security", line: "Security" },
      { href: "/settings/audit", label: "Audit log", line: "Audit log" },
    ],
  },
];

export const settingsSections = settingsGroups.flatMap((g) => g.items);
export const sectionFor = (pathname: string) => settingsSections.find((s) => pathname === s.href || pathname.startsWith(s.href + "/"));
