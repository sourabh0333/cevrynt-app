/**
 * Sample data for the Bulk folder ZIP page, from design/Intake-Bulk.html
 * (its prototype has no script). Real parsing results replace this later
 * behind the same types.
 */
export const bulkUpload = {
  note: "Nothing is created until you press Create. Fix or skip any folder first.",
  file: {
    name: "deals_oct12_pm.zip",
    meta: "8 folders · 51 files · 88.6 MB · uploaded by you at 14:05",
  },
};

export type SummaryTile = {
  value: string;
  label: string;
  tone: "light" | "mint" | "cream" | "stone";
};
export const summary: SummaryTile[] = [
  { value: "8", label: "Folders found", tone: "light" },
  { value: "5", label: "Ready to create", tone: "mint" },
  { value: "2", label: "Need your attention", tone: "cream" },
  { value: "1", label: "Declined by policy", tone: "stone" },
];

export type FolderRow = {
  id: string;
  folder: string;
  business: string;
  /** shown under the business on attention rows */
  note?: string;
  files: number;
  statements: string;
  statementsWarn?: boolean;
  fit: { tone: "good" | "warn" | "bad" | "none"; text: string };
  result:
    | { kind: "chip"; label: "Ready" | "Declined" }
    | { kind: "actions"; primary: string; secondary: string };
  attention?: boolean;
  href: string;
};

export const folders: FolderRow[] = [
  { id: "harbor", folder: "Harbor_Street/", business: "Harbor Street Bakery LLC", files: 7, statements: "4 of 4", fit: { tone: "good", text: "Fits policy" }, result: { kind: "chip", label: "Ready" }, href: "/submissions" },
  { id: "lotus", folder: "GoldenLotus/", business: "Golden Lotus Restaurant", files: 6, statements: "4 of 4", fit: { tone: "good", text: "Fits policy" }, result: { kind: "chip", label: "Ready" }, href: "/submissions" },
  { id: "mesa", folder: "Mesa_Auto/", business: "Mesa Auto Repair", note: "Open deal already exists · APP-9K2M7R", files: 8, statements: "4 of 4", fit: { tone: "good", text: "Fits policy" }, result: { kind: "actions", primary: "Merge", secondary: "Skip" }, attention: true, href: "/submissions" },
  { id: "bright", folder: "Brightside/", business: "Brightside Cleaning Co", files: 5, statements: "3 of 4", statementsWarn: true, fit: { tone: "warn", text: "July missing, will be requested" }, result: { kind: "chip", label: "Ready" }, href: "/submissions" },
  { id: "pine", folder: "Pinecrest/", business: "Pinecrest Fitness Studio", files: 7, statements: "4 of 4", fit: { tone: "good", text: "Fits policy" }, result: { kind: "chip", label: "Ready" }, href: "/submissions" },
  { id: "oak", folder: "Oakview_Deli/", business: "Oakview Deli", files: 9, statements: "4 of 4", fit: { tone: "good", text: "Fits policy" }, result: { kind: "chip", label: "Ready" }, href: "/submissions" },
  { id: "lake", folder: "Lakeside_Florist/", business: "Lakeside Florist", files: 6, statements: "4 of 4", fit: { tone: "bad", text: "Revenue below policy minimum" }, result: { kind: "chip", label: "Declined" }, href: "/submissions" },
  { id: "misc", folder: "misc/", business: "No business found", note: "3 loose files, no application", files: 3, statements: "—", fit: { tone: "none", text: "Not checked" }, result: { kind: "actions", primary: "Pick business", secondary: "Skip" }, attention: true, href: "/submissions" },
];

export const batchOptions = {
  sentBy: "Apex Funding Partners",
  assign: "Share evenly across the team",
  tellBroker: true,
  requestMissing: true,
};

export const createCard = {
  cap: "Ready now",
  title: "5 deals will be created",
  text: "2 folders still need you. You can create these 5 now and come back to the rest.",
  cta: "Create 5 deals",
  href: "/submissions",
};

export const earlierBatch = {
  title: "Earlier today",
  file: "deals_oct12_am.zip",
  meta: "9 folders · created 9 deals at 09:14",
  href: "/submissions",
  steps: [
    { n: "01", label: "Uploaded" },
    { n: "02", label: "Sorted 63 files" },
    { n: "03", label: "Matched 9 businesses" },
    { n: "04", label: "Fit checked" },
    { n: "05", label: "9 deals in queue", done: true },
  ],
};
