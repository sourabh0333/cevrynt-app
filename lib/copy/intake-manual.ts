/**
 * Interface wording and the live checks for the Manual lead form
 * (design/Intake-Manual.html and its prototype). The draft, the registry
 * lookup and the past deals come from the data layer (manualLeadView);
 * every limit the fit check quotes comes from the shared policy, so
 * changing the policy changes the check.
 */
import type { IsoDateTime, ManualDraft, ManualLead, Policy } from "@/lib/data/types";
import { clockTime, monthName, WORKSPACE_TIME_ZONE } from "@/lib/format";

export type FitPolicy = Pick<Policy, "minBusinessMonths" | "maxRevenueMultiple" | "maxPositions" | "restrictedIndustries" | "approvedIndustries" | "requiredStatementMonths">;

export const manualSteps = [
  { n: "01", title: "Company & owner", sub: "Who is applying" },
  { n: "02", title: "Request", sub: "Amount and positions" },
  { n: "03", title: "Documents", sub: "Upload or request" },
  { n: "04", title: "Review & start", sub: "Assign and begin" },
];

export const useOfFunds = ["Equipment", "Inventory", "Payroll", "Expansion", "Pay off other advances", "Other"];

/** The year and month of a date in the workspace's zone: 2026, 10. */
function yearMonthOf(iso: IsoDateTime) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: WORKSPACE_TIME_ZONE, year: "numeric", month: "numeric" }).formatToParts(new Date(iso));
  return { year: Number(p.find((x) => x.type === "year")?.value), month: Number(p.find((x) => x.type === "month")?.value) };
}

/* ---------- the live fit check ---------- */

export type Status = "good" | "warn" | "bad" | "pending";
export type Check = { key: string; status: Status; title: string; detail: string };

const amountOf = (s: string) => Number(s.replace(/[^0-9.]/g, "")) || 0;
const fmtMoney = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Months in business from what was typed ("March 2021", "2019"), counted to now; null when it can't be read. */
export function monthsInBusiness(start: string, now: IsoDateTime): number | null {
  const today = yearMonthOf(now);
  const m = start.trim().toLowerCase().match(/([a-z]+)\s+(\d{4})/);
  if (m) {
    const mi = monthKeys.findIndex((x) => m[1].startsWith(x));
    if (mi < 0) return null;
    return (today.year - Number(m[2])) * 12 + (today.month - (mi + 1));
  }
  const y = start.trim().match(/^(\d{4})$/);
  if (y) return (today.year - Number(y[1])) * 12 + today.month - 1;
  return null;
}

function spanText(n: number) {
  const y = Math.floor(n / 12);
  const m = n % 12;
  const parts = [];
  if (y) parts.push(`${y} year${y === 1 ? "" : "s"}`);
  if (m || !y) parts.push(`${m} month${m === 1 ? "" : "s"}`);
  return parts.join(" ");
}

/** A policy industry as a match for what was typed: "Firearms" also catches "firearm store". */
const stem = (s: string) => s.toLowerCase().replace(/s$/, "");

export function runChecks(lead: ManualLead, policy: FitPolicy, now: IsoDateTime): { checks: Check[]; fits: boolean } {
  const checks: Check[] = [];
  const months = (n: number) => `${n} months`;

  const ind = lead.business.industry.trim().toLowerCase();
  if (!ind) checks.push({ key: "industry", status: "pending", title: "Industry", detail: "Type the industry to check it" });
  else if (policy.restrictedIndustries.some((b) => ind.includes(stem(b))))
    checks.push({ key: "industry", status: "bad", title: "Industry not allowed", detail: "This industry is on your excluded list" });
  else if (policy.approvedIndustries.some((a) => ind.includes(a.toLowerCase()))) {
    const first = lead.business.industry.split("·")[0].trim();
    const plural = first.endsWith("s") ? first : `${first}s`;
    checks.push({ key: "industry", status: "good", title: "Industry allowed", detail: `${plural} are on your approved list` });
  } else checks.push({ key: "industry", status: "warn", title: "Industry needs a look", detail: "Not on your approved or excluded list" });

  const mib = monthsInBusiness(lead.business.start, now);
  const needs = `Policy needs ${months(policy.minBusinessMonths)} or more`;
  if (mib === null) checks.push({ key: "time", status: "pending", title: "Time in business", detail: "Enter the start date as month and year" });
  else if (mib >= policy.minBusinessMonths) checks.push({ key: "time", status: "good", title: `Time in business: ${spanText(mib)}`, detail: needs });
  else checks.push({ key: "time", status: "bad", title: `Time in business: ${spanText(Math.max(0, mib))}`, detail: needs });

  const amt = amountOf(lead.request.amount);
  const rev = amountOf(lead.request.revenue);
  const multiple = policy.maxRevenueMultiple;
  if (!amt || !rev) checks.push({ key: "ratio", status: "pending", title: "Request vs revenue", detail: "Checked once the amount and revenue are in" });
  else {
    const ratio = amt / rev;
    const ok = ratio <= multiple;
    checks.push({
      key: "ratio",
      status: ok ? "good" : "bad",
      title: `Request is ${ratio.toFixed(2)}× stated revenue`,
      detail: ok ? `Policy allows up to ${multiple}×` : `Policy allows up to ${multiple}× · ${fmtMoney(rev * multiple)} max`,
    });
  }

  const n = lead.request.hasPositions ? lead.request.positions.filter((p) => p.funder.trim()).length : 0;
  if (n === 0) checks.push({ key: "positions", status: "good", title: "No existing positions", detail: "Nothing disclosed; the statements will confirm it" });
  else if (n <= policy.maxPositions)
    checks.push({ key: "positions", status: "warn", title: `${n} existing position${n === 1 ? "" : "s"}`, detail: "Allowed, but will be checked against the statements" });
  else checks.push({ key: "positions", status: "bad", title: `${n} existing positions`, detail: `Policy allows up to ${policy.maxPositions}` });

  if (lead.documents.merchantLinkSent)
    checks.push({ key: "docs", status: "warn", title: "Documents requested", detail: `Merchant Link sent to ${lead.owner.email || "the owner"}` });
  else checks.push({ key: "docs", status: "pending", title: "Documents", detail: "Checked once statements arrive" });

  return { checks, fits: !checks.some((c) => c.status === "bad") };
}

const digits = (s: string) => s.replace(/\D/g, "");

/** A past deal with the same business, owner or phone, if there is one. */
export function findDuplicate(lead: ManualLead, pastDeals: ManualDraft["pastDeals"]) {
  const name = lead.business.name.trim().toLowerCase();
  const owner = lead.owner.name.trim().toLowerCase();
  const phones = [digits(lead.business.phone), digits(lead.owner.mobile)].filter((p) => p.length >= 7);
  return pastDeals.find((d) => {
    const dn = d.business.toLowerCase();
    return (
      (name.length > 3 && (dn.includes(name) || name.includes(dn))) ||
      (owner.length > 3 && d.owner.toLowerCase() === owner) ||
      phones.includes(digits(d.phone))
    );
  });
}

/* ---------- the documents step ---------- */

export type RequiredDocView = { id: string; title: string; note: string; status: "partial" | "received" | "missing"; label: string };

/** "June – September 2026": the months of statements the policy needs, ending last month. */
function statementSpan(n: number, now: IsoDateTime) {
  const t = yearMonthOf(now);
  const ym = (offset: number) => {
    const total = t.year * 12 + (t.month - 1) - offset;
    return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`;
  };
  const first = ym(n);
  const last = ym(1);
  return `${monthName(first, "long")} – ${monthName(last, "long")} ${last.slice(0, 4)}`;
}

/** The documents the policy requires, and where the draft stands on each. */
export function requiredDocs(draft: ManualDraft, policy: FitPolicy, now: IsoDateTime): RequiredDocView[] {
  const need = policy.requiredStatementMonths;
  const got = (kind: ManualDraft["documents"][number]["kind"]) => draft.documents.find((d) => d.kind === kind);
  const status = (received: number, of: number): Pick<RequiredDocView, "status" | "label"> =>
    received >= of ? { status: "received", label: "Received" } : received > 0 ? { status: "partial", label: `${received} of ${of}` } : { status: "missing", label: "Missing" };
  const statements = got("statements")?.received ?? 0;
  const app = got("application");
  return [
    { id: "statements", title: `Bank statements, last ${need} months`, note: statementSpan(need, now), ...status(statements, need) },
    { id: "application", title: "Signed application", note: app?.file ?? "Not received yet", ...status(app?.received ?? 0, 1) },
    { id: "id", title: "Owner photo ID", note: "Checked with a selfie through Merchant Link", ...status(got("id")?.received ?? 0, 1) },
    { id: "check", title: "Voided check", note: "Or connect the bank account instead", ...status(got("check")?.received ?? 0, 1) },
  ];
}

export const manualCopy = {
  title: "New manual lead",
  back: { label: "Back to intake", href: "/intake" },
  saved: (at: IsoDateTime) => `Draft saved ${clockTime(at)}`,
  saveExit: { label: "Save and exit", href: "/intake" },
  /** "Found in Ohio registry · active since Mar 2021" */
  registryFound: (r: NonNullable<ManualDraft["registry"]>) => `Found in ${r.state} registry · active since ${monthName(r.activeSince)} ${r.activeSince.slice(0, 4)}`,
  registryNone: "No registry match yet · keep typing the legal name",
};
