/**
 * Sample data for the Business & owners tab, copied from
 * design/Deal-Business.html (its prototype has no script, so the finished
 * page is the whole spec). Real API calls replace this later behind the
 * same types.
 */

export type DetailTile = { label: string; value: string; code?: string; policy?: boolean };

export const business = {
  title: "The business",
  source: "From the Maine Secretary of State, checked Oct 12, 2026 · ",
  registryLink: { label: "View registry record", href: "#" },
  chip: "Active · good standing",
  initials: "HB",
  name: "Harbor Street Bakery LLC",
  entity: "Limited liability company · Maine · charter 20160412DC",
  ageLabel: "In business",
  age: "10 yrs",
  tiles: [
    { label: "Formed", value: "April 12, 2016" },
    { label: "Registered agent", value: "Elena Brooks" },
    { label: "Last annual report", value: "May 2026, on time" },
    { label: "Industry", value: "Retail bakery", code: "311811" },
    { label: "Your policy", value: "Industry allowed", policy: true },
    { label: "Food licence", value: "Active to Jun 2027" },
    { label: "EIN check", value: "IRS name matches", policy: true },
    { label: "Trade name", value: "Harbor Street" },
    { label: "Ownership changes", value: "None since 2016", policy: true },
  ] as DetailTile[],
};

export const location = {
  title: "Location",
  chip: "Storefront",
  pin: "418 Commercial St",
  rows: [
    { label: "Address type", value: "Retail storefront" },
    { label: "Not a mailbox or virtual office", value: "Confirmed", good: true },
    { label: "Sources that agree", value: "4 of 4" },
  ] as { label: string; value: string; good?: boolean }[],
  link: { label: "Open street view", href: "#" },
};

/** One cell of the cross-source matrix: a matching value, or a note when the source has nothing. */
export type MatchCell = { value: string; match: boolean };

const ok = (value: string): MatchCell => ({ value, match: true });
const na = (value: string): MatchCell => ({ value, match: false });
const consent = na("Waiting on consent");

export const crossCheck = {
  title: "Does everything agree?",
  subtitle: "Each fact checked across every source we have",
  legend: [
    { label: "Matches", tone: "teal" },
    { label: "Close", tone: "amber" },
    { label: "Not available", tone: "stone" },
  ] as { label: string; tone: "teal" | "amber" | "stone" }[],
  columns: ["Fact", "Application", "State registry", "Bank statements", "Web & maps", "Credit bureau"],
  rows: [
    { fact: "Legal name", cells: [ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery LLC"), ok("Harbor Street Bakery"), consent] },
    { fact: "Address", cells: [ok("418 Commercial St"), ok("418 Commercial St"), ok("418 Commercial St"), ok("418 Commercial St"), consent] },
    { fact: "Owner", cells: [ok("Elena Brooks"), ok("Elena Brooks, member"), na("—"), ok("Elena Brooks"), consent] },
    { fact: "EIN", cells: [ok("••-•••7740"), na("Not listed"), na("—"), na("—"), consent] },
    { fact: "Phone", cells: [ok("(207) 555-0164"), na("—"), na("—"), ok("(207) 555-0164"), consent] },
    { fact: "Started", cells: [ok("2016"), ok("Apr 2016"), na("Statements from 2026 only"), ok("Reviews since 2016"), consent] },
  ] as { fact: string; cells: [MatchCell, MatchCell, MatchCell, MatchCell, MatchCell] }[],
  note: "Every fact that two sources can show agrees. The credit bureau column fills in once Elena gives consent through Merchant Link.",
};

export type IdentityCheck = { label: string; detail: string; done: boolean };

export const owner = {
  initials: "EB",
  caption: "Owner · 100%",
  name: "Elena Brooks",
  contact: "elena@harborstreetbakery.com · (207) 555-0188",
  chips: { verified: "Identity verified", guarantee: "Will sign the personal guarantee" },
  addOwner: "+ Add owner",
  note: "Ownership adds up to 100%. Everyone with 20% or more is listed and checked.",
  checks: [
    { label: "Photo ID", detail: "Maine licence, genuine, not expired", done: true },
    { label: "Selfie match", detail: "Live selfie matches the ID photo", done: true },
    { label: "Sanctions lists", detail: "No match on OFAC or other lists", done: true },
    { label: "Home address", detail: "Matches ID and public records", done: true },
    { label: "Listed on registry", detail: "Member and registered agent", done: true },
    { label: "Credit report", detail: "Waiting on her consent", done: false },
  ] as IdentityCheck[],
  related: {
    title: "Also owns Harbor Street Catering LLC",
    text: "The source of the $12,000 August transfer. Active since 2021, no open deals with you.",
    link: { label: "See the transfer", href: "/deals/APP-7H2K4Q/integrity" },
  },
};

export const publicRecords = {
  title: "Public records",
  chip: "Clean",
  intro: "For the business and the owner, all states.",
  categories: [
    { count: 1, label: "UCC filing", detail: "Kingsway, Feb 2026" },
    { count: 0, label: "Tax liens" },
    { count: 0, label: "Judgments" },
    { count: 0, label: "Court cases" },
    { count: 0, label: "Bankruptcies" },
    { count: 0, label: "Suits by funders" },
  ] as { count: number; label: string; detail?: string }[],
  note: "Checked Oct 12, 2026. Rechecked automatically before funding.",
};

export const onlinePresence = {
  title: "Online presence",
  subtitle: "A real, busy business that customers know",
  chip: "Strong",
  tiles: [
    { label: "Website", value: "harborstreetbakery.com", note: "Online since 2016" },
    { label: "Customer reviews", rating: "4.7", ratingNote: " / 5 · 312 reviews" },
    { label: "Opening hours", value: "Tue – Sun, 6am – 3pm", note: "Weekend peak matches deposits" },
    { label: "Recent activity", value: "Reviews this week", note: "Open and trading today" },
  ] as { label: string; value?: string; note?: string; rating?: string; ratingNote?: string }[],
};
