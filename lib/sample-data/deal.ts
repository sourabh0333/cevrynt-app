/**
 * Sample data for the deal workspace frame shared by all nine deal tabs,
 * copied from design/prototypes/Deal-Summary.dc.html (look:
 * design/Deal-Summary.html). Real API calls replace this later behind the
 * same types.
 */
import { deals, statusInfo, type DealStatus } from "./submissions";

export type DealHeader = {
  id: string;
  name: string;
  initials: string;
  /** two gradient stops for the 64px tile */
  gradient: [string, string];
  status: DealStatus;
  /** "Bakery · Portland, ME · since 2016 · Owner Elena Brooks" */
  about: string;
  merchantNote: { label: string; href: string };
  score: number | null;
  requested: string;
  recommended: string;
  broker: string;
  underwriter: string;
  decisionDue: { label: string; percent: number };
};

export const dealActions = {
  secondary: ["Request documents", "Decline"],
  primary: "Make a decision",
};

/** The main sample deal, Harbor Street Bakery LLC. */
export const harborStreet: DealHeader = {
  id: "APP-7H2K4Q",
  name: "Harbor Street Bakery LLC",
  initials: "HB",
  gradient: ["#3FA58C", "#8FD9C3"],
  status: "ready",
  about: "Bakery · Portland, ME · since 2016 · Owner Elena Brooks",
  merchantNote: { label: "First deal with you · see merchant", href: "/merchants" },
  score: 88,
  requested: "$45,000",
  recommended: "$40,000",
  broker: "Apex Funding Partners",
  underwriter: "Maya Chen",
  decisionDue: { label: "In 1h 10m", percent: 70 },
};

/**
 * Header data for a deal id. Harbor Street has the full design data; the
 * other deals from the Submissions queue reuse what that list knows about
 * them so every "Open deal" link lands on a real frame. Unknown ids
 * return null (the page shows a 404).
 */
export function getDealHeader(id: string): DealHeader | null {
  if (id === harborStreet.id) return harborStreet;
  const row = deals.find((d) => d.id === id);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    gradient: row.gradient,
    status: row.status,
    about: `${row.broker} · received ${row.received}`,
    merchantNote: { label: "See merchant", href: "/merchants" },
    score: row.score,
    requested: row.requested,
    recommended: row.recommended.replace(/^.*?rec\. /i, ""),
    broker: row.broker,
    underwriter: row.owner?.name ?? "Not assigned yet",
    decisionDue: { label: row.sla, percent: row.slaPercent },
  };
}

export const dealStatusLabel = (status: DealStatus) => statusInfo[status].label;

/** The nine tabs, in design order. `path` is appended to /deals/[id]. */
export type DealTabKey =
  | "summary"
  | "cash-flow"
  | "positions"
  | "integrity"
  | "business"
  | "conditions"
  | "offer"
  | "decision"
  | "activity";

export type DealTab = {
  key: DealTabKey;
  label: string;
  path: string;
  /** small status dot after the label */
  dot?: "teal" | "amber";
  /** open items count after the label */
  count?: number;
  /** browser tab title */
  title: string;
};

export const dealTabs: DealTab[] = [
  { key: "summary", label: "Summary", path: "", title: "Deal summary" },
  { key: "cash-flow", label: "Cash flow", path: "/cash-flow", dot: "teal", title: "Deal cash flow" },
  { key: "positions", label: "Positions & debt", path: "/positions", dot: "teal", title: "Deal positions and debt" },
  { key: "integrity", label: "Integrity", path: "/integrity", dot: "amber", title: "Deal integrity" },
  { key: "business", label: "Business & owners", path: "/business", dot: "teal", title: "Deal business and owners" },
  { key: "conditions", label: "Conditions & stips", path: "/conditions", count: 2, title: "Deal conditions and stips" },
  { key: "offer", label: "Offer & disclosures", path: "/offer", title: "Deal offer and disclosures" },
  { key: "decision", label: "Decision & memo", path: "/decision", title: "Deal decision and memo" },
  { key: "activity", label: "Activity", path: "/activity", title: "Deal activity" },
];

export const dealTabHref = (id: string, tab: DealTab) => `/deals/${id}${tab.path}`;
