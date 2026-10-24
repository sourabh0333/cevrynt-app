import type { Merchant, MerchantBook, MerchantListing } from "@/lib/data/types";

/**
 * Sample merchants, copied from design/prototypes/Merchants.dc.html (look:
 * design/Merchants.html), plus the merchants Funded deals and Renewals
 * show. Balances, repaid shares and revenue are not here: they come from
 * each merchant's advance (advances.ts). Pages get these through
 * lib/data/merchants.
 */

const at = (date: string, time = "12:00") => `${date}T${time}:00-04:00`;

export const merchants: Merchant[] = [
  { id: "mer-cd", name: "Coastal Dental Group", shortName: "Coastal Dental", initials: "CD", colors: ["#24588A", "#4F86BD"], industry: "Dental", health: 92 },
  { id: "mer-hb", name: "Harbor Street Bakery LLC", initials: "HB", colors: ["#0E6B5C", "#3FA58C"], industry: "Bakery", health: 88 },
  { id: "mer-bn", name: "Bayview Nail Spa", initials: "BN", colors: ["#57418A", "#8670B8"], industry: "Nail salon", health: 81 },
  { id: "mer-kp", name: "Kestrel Plumbing", initials: "KP", colors: ["#2C5F73", "#5A90A6"], industry: "Plumbing", health: 61 },
  { id: "mer-od", name: "Oakview Deli", initials: "OD", colors: ["#8A5A2B", "#B98552"], industry: "Deli", health: 88 },
  { id: "mer-ma", name: "Mesa Auto Repair", initials: "MA", colors: ["#A3341F", "#C2412D"], industry: "Auto repair", health: 54 },
  { id: "mer-sr", name: "Summit Roofing LLC", initials: "SR", colors: ["#7A4A2A", "#B07A52"], industry: "Roofing", health: 84 },
  { id: "mer-lf", name: "Lakeside Florist", initials: "LF", colors: ["#3E4A46", "#6B7873"], industry: "Florist", health: null },
  { id: "mer-hv", name: "Harborview Bistro", shortName: "Harborview", initials: "HB", colors: ["#0A5E50", "#2F8F7A"], industry: "Restaurant", health: 94 },
  { id: "mer-pr", name: "Pine Ridge Vet Clinic", shortName: "Pine Ridge", initials: "PR", colors: ["#24588A", "#4F86BD"], industry: "Veterinary", health: 92 },
  { id: "mer-lc", name: "Lighthouse Coffee Co", shortName: "Lighthouse", initials: "LC", colors: ["#8A5A2B", "#B98552"], industry: "Café", health: 88 },
  { id: "mer-nf", name: "Northgate Fitness", initials: "NF", colors: ["#57418A", "#8670B8"], industry: "Gym", health: 81 },
  { id: "mer-bb", name: "Bluebird Bakery", initials: "BB", colors: ["#7A4A2A", "#B07A52"], industry: "Bakery", health: 76 },
  { id: "mer-mr", name: "Maple Ridge Florist", initials: "MR", colors: ["#4D6B2E", "#7FA05A"], industry: "Florist", health: 79 },
  { id: "mer-sp", name: "Summit Pet Supply", initials: "SP", colors: ["#2C5F73", "#5A90A6"], industry: "Pet supply", health: 77 },
  { id: "mer-sy", name: "Seaside Yoga Studio", initials: "SY", colors: ["#3E4A46", "#6B7873"], industry: "Fitness", health: 85 },
  { id: "mer-ms", name: "Maple St Barbers", initials: "MS", colors: ["#7A4A2A", "#B07A52"], industry: "Barber shop", health: 83 },
  { id: "mer-wa", name: "Westfield Auto Group", initials: "WA", colors: ["#4D6B2E", "#7FA05A"], industry: "Auto services", health: 58 },
  { id: "mer-bh", name: "Bayside Hardware", initials: "BH", colors: ["#24588A", "#4F86BD"], industry: "Hardware store", health: 80 },
  { id: "mer-gs", name: "Granite State Builders", initials: "GS", colors: ["#7A4A2A", "#B07A52"], industry: "Construction", health: 64 },
  { id: "mer-cs", name: "Cedar Street Pharmacy", initials: "CS", colors: ["#0A5E50", "#2F8F7A"], industry: "Pharmacy", health: 90 },
];

/** The directory's first page, in the order "All merchants" lists it. */
export const merchantListings: MerchantListing[] = [
  {
    merchantId: "mer-cd", state: "ME", owner: "Dr. Ana Ruiz", standing: null, pastAdvances: 1, fundedBefore: 60000, openDeal: "renewal",
    lastActivity: { kind: "event", text: "Renewal accepted" },
    note: "Revenue is up 18% since funding and every payment has cleared. Renewal of $80K is accepted.",
    history: [
      { title: "Renewal accepted", detail: "$80,000 · Apex Funding", year: 2026, tone: "good" },
      { kind: "current", withFactor: true },
      { title: "First advance, paid off early", detail: "$60,000 · 8 months", year: 2025, tone: "done" },
    ],
  },
  {
    merchantId: "mer-hb", state: "ME", owner: "Elena Brooks", standing: "review", pastAdvances: 0, fundedBefore: 0, openDeal: "review",
    lastActivity: { kind: "update", at: at("2026-10-13", "10:20") },
    note: "First deal with you. Recommended $40,000; decision due today.",
    history: [{ title: "Application in review", detail: "$45,000 requested · Apex Funding", year: 2026, tone: "open" }],
  },
  {
    merchantId: "mer-bn", state: "ME", owner: "Linh Tran", standing: null, pastAdvances: 0, fundedBefore: 0, openDeal: null,
    lastActivity: { kind: "event", text: "Funded today" },
    note: "Funded this morning. First payment on Wednesday.",
    history: [{ title: "Funded", detail: "$25,000 · Summit Capital ISO", year: 2026, tone: "good" }],
  },
  {
    merchantId: "mer-kp", state: "MA", owner: "Sam Okafor", standing: null, pastAdvances: 0, fundedBefore: 0, openDeal: null,
    lastActivity: { kind: "event", text: "Paid today" },
    note: "On track. Close to the halfway point, so a renewal conversation can start soon.",
    history: [{ kind: "current", via: "Keystone Brokerage" }],
  },
  {
    merchantId: "mer-od", state: "ME", owner: "Rosa Marino", standing: null, pastAdvances: 0, fundedBefore: 0, openDeal: "renewal",
    lastActivity: { kind: "event", text: "Renewal offer sent" },
    note: "Revenue steady, no missed payments. Renewal offer sent last week.",
    history: [{ title: "Renewal offer sent", detail: "$35,000", year: 2026, tone: "open" }, { kind: "current" }],
  },
  {
    merchantId: "mer-ma", state: "AZ", owner: "Victor Salas", standing: "watch", pastAdvances: 0, fundedBefore: 0, openDeal: "review",
    lastActivity: { kind: "event", text: "Stacking alert" },
    note: "New UCC filing yesterday and a statement that does not reconcile. Review before any offer.",
    history: [
      { title: "Stacking alert", detail: "New UCC filing", year: 2026, tone: "risk" },
      { title: "Application in review", detail: "$35,000 · BlueRock", year: 2026, tone: "open" },
    ],
  },
  {
    merchantId: "mer-sr", state: "NH", owner: "Mike Dunn", standing: "active", pastAdvances: 1, fundedBefore: 70000, openDeal: "contract",
    lastActivity: { kind: "event", text: "Contract out" },
    note: "Paid off a 2025 advance on time. New $90K contract waiting on a second signature.",
    history: [
      { title: "Contract out", detail: "$90,000 · 1 of 2 signed", year: 2026, tone: "open" },
      { title: "Paid off on time", detail: "$70,000", year: 2025, tone: "done" },
    ],
  },
  {
    merchantId: "mer-lf", state: "VT", owner: "June Park", standing: "declined", pastAdvances: 0, fundedBefore: 0, openDeal: "declined",
    lastActivity: { kind: "event", text: "Declined today" },
    note: "Declined: revenue below your policy minimum. Can reapply in 90 days.",
    history: [{ title: "Declined", detail: "Revenue below policy minimum", year: 2026, tone: "risk" }],
  },
];

export const merchantBook: MerchantBook = {
  total: 312,
  inReview: 28,
  declined: 41,
  blocked: 3,
  onWatch: 5,
  repeat: { secondAdvance: 0.38, sizeMultiple: 1.3, lateFirst: 0.071, lateRepeat: 0.024 },
  industries: [
    { label: "Restaurants & food", share: 0.31 },
    { label: "Retail & other", share: 0.22 },
    { label: "Health & dental", share: 0.18 },
    { label: "Construction", share: 0.17 },
    { label: "Auto services", share: 0.12 },
  ],
  states: [
    { code: "ME", name: "Maine", active: 28 },
    { code: "NH", name: "New Hampshire", active: 19 },
    { code: "MA", name: "Massachusetts", active: 14 },
    { code: "VT", name: "Vermont", active: 11 },
    { code: "AZ", name: "Arizona", active: 8 },
  ],
  ownerGroups: [
    { owner: "Elena Brooks", initials: "EB", businesses: ["Harbor Street Bakery", "Harbor Street Catering"] },
    { owner: "Mike Dunn", initials: "MD", businesses: ["Summit Roofing", "Dunn Gutter Co"] },
  ],
  ownerGroupCount: 12,
};
