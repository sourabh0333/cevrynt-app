/**
 * Sample data for the Single package upload page, from
 * design/Intake-Single.html (its prototype has no script). Real parsing
 * results replace this later behind the same types.
 */
export const packageUpload = {
  readIn: "Read in 6 seconds",
  file: {
    name: "riverbend_landscaping_package.zip",
    meta: "9 files · 14.2 MB · uploaded by you at 10:42",
  },
  found: {
    title: "What we found",
    subtitle: "Every file is named by what it is. Fix anything we got wrong before you start.",
    count: 9,
  },
  statements: {
    caption: "Bank statements · Chase business ••4471",
    months: [
      { label: "June 2026", note: "6 pages · balances match" },
      { label: "July 2026", note: "5 pages · balances match" },
      { label: "August 2026", note: "6 pages · balances match" },
      { label: "September 2026", note: "7 pages · balances match" },
    ],
    covered: 4,
    required: 4,
  },
};

export type FoundDoc = {
  id: string;
  title: string;
  file: string;
  /** read = named and accepted; warn = needs a fix; ignored = not a deal document */
  state: "read" | "warn" | "ignored";
  action?: string;
};

export const otherDocs: FoundDoc[] = [
  { id: "app", title: "Signed application", file: "Riverbend_App_signed.pdf", state: "read" },
  { id: "id", title: "Owner photo ID", file: "DL_front.jpg", state: "read" },
  { id: "check", title: "Voided check", file: "void_check.pdf · account matches statements", state: "read" },
  { id: "blur", title: "Unreadable image", file: "IMG_2231.jpg · too blurry to read", state: "warn", action: "Replace" },
  { id: "notes", title: "Not a deal document", file: "notes.txt · ignored", state: "ignored", action: "Keep anyway" },
];

export const matchedBusiness = {
  tag: "Business matched",
  name: "Riverbend Landscaping LLC",
  note: "Found on the application and all four statements. Active in the Georgia registry since 2019.",
  owner: "Luis Ortega · 100%",
  requested: "$65,000",
};

export type FitRow = { label: string; value: string; tone: "good" | "warn" };
export const fitCheck = {
  verdict: "Fits policy",
  rows: [
    { label: "Industry", value: "Allowed", tone: "good" },
    { label: "Time in business", value: "7 years", tone: "good" },
    { label: "Required documents", value: "All present", tone: "good" },
    { label: "Seen before", value: "Funded once, 2024", tone: "warn" },
  ] as FitRow[],
  note: "Deeper checks (true revenue, positions, integrity) run as soon as the deal is created.",
};

export const assignment = {
  sentBy: "Summit Capital ISO",
  assignTo: "Auto-assign (next free underwriter)",
  cta: "Create deal and start underwriting",
  href: "/submissions",
};
