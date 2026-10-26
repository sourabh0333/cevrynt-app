/**
 * Settings menu and section headings, from the "Settings sections" nav in
 * design/Settings.html and the other design/Settings-*.html pages. The
 * Policy entry's version badge and "active since" line are read from the
 * policy record (settingsMenuView).
 */
import type { IsoDateTime } from "@/lib/data/types";
import { dateShort } from "@/lib/format";

export type SettingsSection = { href: string; label: string; line: string };

/** The live policy version, for the Policy entry. */
export type PolicyMark = { version: number; liveSince: IsoDateTime };

export const settingsTitle = "Settings";
export const settingsNavLabel = "Settings sections";

export const settingsGroups: { label: string; items: SettingsSection[] }[] = [
  {
    label: "Underwriting",
    items: [
      { href: "/settings/policy", label: "Policy", line: "Policy" },
      { href: "/settings/pricing", label: "Pricing & disclosures", line: "Pricing & disclosures" },
    ],
  },
  {
    label: "Deal flow",
    items: [
      { href: "/settings/intake", label: "Intake channels", line: "Intake channels" },
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

/** "v3" beside Policy in the menu. */
export const policyBadge = (p: PolicyMark) => `v${p.version}`;

/** The heading line: "Policy · version 3, active since Sep 2" on Policy, the section's name elsewhere. */
export const sectionLine = (s: SettingsSection, policy: PolicyMark | null) =>
  s.href === "/settings/policy" && policy ? `${s.line} · version ${policy.version}, active since ${dateShort(policy.liveSince)}` : s.line;
