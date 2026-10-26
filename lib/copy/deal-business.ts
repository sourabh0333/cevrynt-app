/**
 * Interface wording for the deal Business & owners tab
 * (design/Deal-Business.html). The registry, owners and records come from
 * the data layer (businessTabView); this file words them and works out the
 * plain things people read: initials, years in business, "4 of 4".
 */
import type { DealBusiness, IsoDateTime, YearMonth } from "@/lib/data/types";
import { dateFull, dateShort, monthName, plural } from "@/lib/format";

const monthAndYear = (m: YearMonth) => `${monthName(m)} ${m.slice(0, 4)}`;
const firstName = (name: string) => name.split(" ")[0];
const yearOf = (iso: IsoDateTime) => iso.slice(0, 4);

/** "HB" from "Harbor Street Bakery LLC": first and last word, leaving out the company type. */
export const nameInitials = (name: string) => {
  const words = name.split(" ").filter((w) => !/^(LLC|Inc\.?|Corp\.?|Co\.?|Ltd\.?)$/i.test(w));
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

/** Whole years from one date to another: Apr 12, 2016 → Oct 13, 2026 is 10. */
export const wholeYears = (from: IsoDateTime, to: IsoDateTime) => {
  const a = new Date(from);
  const b = new Date(to);
  const years = b.getUTCFullYear() - a.getUTCFullYear();
  const before = b.getUTCMonth() < a.getUTCMonth() || (b.getUTCMonth() === a.getUTCMonth() && b.getUTCDate() < a.getUTCDate());
  return years - (before ? 1 : 0);
};

export type DetailTile = { label: string; value: string; code?: string; policy?: boolean };

export const businessCopy = {
  title: "The business",
  source: (b: DealBusiness) => `From the ${b.registry.state} Secretary of State, checked ${dateShort(b.registry.checkedAt)}, ${yearOf(b.registry.checkedAt)} · `,
  registryLink: { label: "View registry record", href: null },
  chip: (b: DealBusiness) => (b.registry.active ? (b.registry.goodStanding ? "Active · good standing" : "Active · not in good standing") : "Not active"),
  entity: (b: DealBusiness) => `${b.registry.entityType} · ${b.registry.state} · charter ${b.registry.charter}`,
  ageLabel: "In business",
  age: (years: number) => plural(years, "yr"),
  tiles: (b: DealBusiness, industryAllowed: boolean): DetailTile[] => [
    { label: "Formed", value: dateFull(b.registry.formedAt) },
    { label: "Registered agent", value: b.registry.agent },
    { label: "Last annual report", value: `${monthAndYear(b.registry.lastAnnualReport.month)}, ${b.registry.lastAnnualReport.onTime ? "on time" : "late"}` },
    { label: "Industry", value: b.industry.label, code: b.industry.naics },
    { label: "Your policy", value: industryAllowed ? "Industry allowed" : "Industry restricted", policy: true },
    { label: b.licence.label, value: `Active to ${monthAndYear(b.licence.activeUntil)}` },
    { label: "EIN check", value: b.einMatches ? "IRS name matches" : "IRS name doesn't match", policy: true },
    { label: "Trade name", value: b.tradeName },
    {
      label: "Ownership changes",
      value: `${b.registry.ownershipChanges ? b.registry.ownershipChanges : "None"} since ${yearOf(b.registry.formedAt)}`,
      policy: true,
    },
  ],
};

const addressKind: Record<DealBusiness["address"]["kind"], { chip: string; type: string }> = {
  retail: { chip: "Storefront", type: "Retail storefront" },
  office: { chip: "Office", type: "Office" },
  home: { chip: "Home based", type: "Home address" },
  virtual: { chip: "Virtual office", type: "Mailbox or virtual office" },
};

export const locationCopy = {
  title: "Location",
  chip: (a: DealBusiness["address"]) => addressKind[a.kind].chip,
  mapLabel: (street: string) => `Map with ${street} marked`,
  rows: (a: DealBusiness["address"]): { label: string; value: string; good?: boolean }[] => [
    { label: "Address type", value: addressKind[a.kind].type },
    { label: "Not a mailbox or virtual office", value: a.kind === "virtual" ? "Not confirmed" : "Confirmed", good: a.kind !== "virtual" },
    { label: "Sources that agree", value: `${a.sourcesAgree} of ${a.sources}` },
  ],
  link: { label: "Open street view", href: null },
};

export const crossCheckCopy = {
  title: "Does everything agree?",
  subtitle: "Each fact checked across every source we have",
  legend: [
    { label: "Matches", tone: "teal" },
    { label: "Close", tone: "amber" },
    { label: "Not available", tone: "stone" },
  ] as { label: string; tone: "teal" | "amber" | "stone" }[],
  columns: ["Fact", "Application", "State registry", "Bank statements", "Web & maps", "Credit bureau"],
  note: (owner: string) =>
    `Every fact that two sources can show agrees. The credit bureau column fills in once ${firstName(owner)} gives consent through Merchant Link.`,
};

export const ownerCopy = {
  caption: (share: number) => `Owner · ${share}%`,
  contact: (email: string, phone: string) => `${email} · ${phone}`,
  chips: { verified: "Identity verified", unverified: "Identity not verified", guarantee: "Will sign the personal guarantee" },
  addOwner: "+ Add owner",
  note: (total: number) => `Ownership adds up to ${total}%. Everyone with 20% or more is listed and checked.`,
  waiting: "Waiting",
  related: {
    title: (name: string) => `Also owns ${name}`,
    text: (r: NonNullable<DealBusiness["related"]>) =>
      `${r.note} Active since ${r.since}, ${r.openDeals ? plural(r.openDeals, "open deal") : "no open deals"} with you.`,
    link: "See the transfer",
  },
};

const recordLabel: Record<DealBusiness["publicRecords"][number]["kind"], [string, string]> = {
  ucc: ["UCC filing", "UCC filings"],
  taxLiens: ["Tax lien", "Tax liens"],
  judgments: ["Judgment", "Judgments"],
  court: ["Court case", "Court cases"],
  bankruptcies: ["Bankruptcy", "Bankruptcies"],
  funderSuits: ["Suit by a funder", "Suits by funders"],
};

export const publicRecordsCopy = {
  title: "Public records",
  /** UCC filings are the known positions; anything else counts against the business */
  chip: (records: DealBusiness["publicRecords"]) => (records.some((r) => r.kind !== "ucc" && r.count > 0) ? "Needs a look" : "Clean"),
  intro: "For the business and the owner, all states.",
  label: (r: DealBusiness["publicRecords"][number]) => recordLabel[r.kind][r.count === 1 ? 0 : 1],
  note: (at: IsoDateTime) => `Checked ${dateShort(at)}, ${yearOf(at)}. Rechecked automatically before funding.`,
};

const strength: Record<DealBusiness["online"]["strength"], string> = { strong: "Strong", some: "Some", none: "None found" };

export const onlineCopy = {
  title: "Online presence",
  subtitle: "A real, busy business that customers know",
  chip: (o: DealBusiness["online"]) => strength[o.strength],
  tiles: (o: DealBusiness["online"]): { label: string; value?: string; note?: string; rating?: string; ratingNote?: string }[] => [
    { label: "Website", value: o.website, note: `Online since ${o.since}` },
    { label: "Customer reviews", rating: o.rating.toFixed(1), ratingNote: ` / 5 · ${o.reviews} reviews` },
    { label: "Opening hours", value: o.hours, note: o.hoursNote },
    { label: "Recent activity", value: o.recent, note: o.recentNote },
  ],
};

export const businessSections = { business: "The business and its location", owner: "Owner and public records" };
