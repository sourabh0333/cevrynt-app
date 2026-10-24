import type { BulkIntake, IntakeSummary, ManualDraft, PackageIntake } from "@/lib/data/types";

/**
 * Sample records for Intake, copied from design/Intake.html, Intake-Manual,
 * Intake-Single and Intake-Bulk (and the Manual lead prototype's script).
 * Pages get them through lib/data/intake.
 */

const at = (time: string) => `2026-10-13T${time}:00-04:00`;

export const intakeSummary: IntakeSummary = {
  today: [
    { channel: "package", count: 11 },
    { channel: "bulk", count: 7 },
    { channel: "manual", count: 3 },
    { channel: "merchant-link", count: 2 },
  ],
  recent: [
    { id: "r1", merchant: "Golden Lotus Restaurant", channel: "package", at: at("13:10"), fit: { result: "fits" }, assigneeId: "usr_maya" },
    { id: "r2", merchant: "Brightside Cleaning Co", channel: "merchant-link", at: at("12:05"), fit: { result: "needs", missingMonth: "2026-07" }, assigneeId: "usr_maya" },
    { id: "r3", merchant: "Tri-County Towing", channel: "bulk", at: at("11:48"), fit: { result: "declined", rule: "age" }, assigneeId: null },
    { id: "r4", merchant: "Pinecrest Fitness Studio", channel: "bulk", at: at("11:02"), fit: { result: "fits" }, assigneeId: "usr_jordan" },
    { id: "r5", merchant: "Lakeside Florist", channel: "package", at: at("10:37"), fit: { result: "declined", rule: "revenue" }, assigneeId: null },
    { id: "r6", merchant: "Northline HVAC Services", channel: "manual", at: at("09:20"), fit: { result: "fits" }, assigneeId: "usr_maya" },
  ],
};

export const packageIntake: PackageIntake = {
  file: { name: "riverbend_landscaping_package.zip", sizeMb: 14.2, uploadedAt: at("10:42") },
  readSeconds: 6,
  bank: { name: "Chase business", last4: "4471" },
  statements: [
    { month: "2026-06", pages: 6, balancesMatch: true },
    { month: "2026-07", pages: 5, balancesMatch: true },
    { month: "2026-08", pages: 6, balancesMatch: true },
    { month: "2026-09", pages: 7, balancesMatch: true },
  ],
  documents: [
    { kind: "application", file: "Riverbend_App_signed.pdf", state: "read" },
    { kind: "id", file: "DL_front.jpg", state: "read" },
    { kind: "check", file: "void_check.pdf", note: "account matches statements", state: "read" },
    { kind: "unreadable", file: "IMG_2231.jpg", note: "too blurry to read", state: "warn" },
    { kind: "other", file: "notes.txt", note: "ignored", state: "ignored" },
  ],
  business: {
    name: "Riverbend Landscaping LLC",
    industry: "Landscaping",
    state: "Georgia",
    since: 2019,
    owner: "Luis Ortega",
    share: 100,
    requested: 65000,
    funded: { count: 1, lastYear: 2024 },
  },
  sentBy: "Summit Capital ISO",
};

export const bulkIntake: BulkIntake = {
  file: { name: "deals_oct12_pm.zip", sizeMb: 88.6, uploadedAt: at("14:05") },
  folders: [
    { id: "harbor", folder: "Harbor_Street/", business: "Harbor Street Bakery LLC", files: 7, statements: 4, fit: { result: "fits" } },
    { id: "lotus", folder: "GoldenLotus/", business: "Golden Lotus Restaurant", files: 6, statements: 4, fit: { result: "fits" } },
    { id: "mesa", folder: "Mesa_Auto/", business: "Mesa Auto Repair", files: 8, statements: 4, fit: { result: "fits" }, existingDealId: "APP-9K2M7R" },
    { id: "bright", folder: "Brightside/", business: "Brightside Cleaning Co", files: 5, statements: 3, fit: { result: "needs", missingMonth: "2026-07" } },
    { id: "pine", folder: "Pinecrest/", business: "Pinecrest Fitness Studio", files: 7, statements: 4, fit: { result: "fits" } },
    { id: "oak", folder: "Oakview_Deli/", business: "Oakview Deli", files: 9, statements: 4, fit: { result: "fits" } },
    { id: "lake", folder: "Lakeside_Florist/", business: "Lakeside Florist", files: 6, statements: 4, fit: { result: "declined", rule: "revenue" } },
    { id: "misc", folder: "misc/", business: null, files: 3, statements: null, fit: { result: "unchecked" }, note: "3 loose files, no application" },
  ],
  options: { sentBy: "Apex Funding Partners", assign: "even", tellBroker: true, requestMissing: true },
  earlier: { file: "deals_oct12_am.zip", folders: 9, files: 63, matched: 9, created: 9, at: at("09:14") },
};

export const manualDraft: ManualDraft = {
  lead: {
    business: {
      name: "Copper Kettle Café LLC",
      dba: "Copper Kettle",
      ein: "••-•••4821",
      industry: "Restaurant · café",
      start: "March 2021",
      address: "218 Maple Ave, Columbus, OH 43215",
      phone: "(614) 555-0142",
      entity: "LLC",
      state: "Ohio",
      website: "copperkettlecafe.com",
    },
    owner: {
      name: "Dana Whitfield",
      ownership: "100%",
      email: "dana@copperkettlecafe.com",
      mobile: "(614) 555-0188",
      address: "74 Linden Ct, Worthington, OH 43085",
    },
    request: {
      amount: "$40,000",
      revenue: "$52,000",
      uses: ["Equipment", "Inventory"],
      hasPositions: true,
      positions: [{ funder: "Bluepeak Funding", payment: "$310 daily", balance: "$9,800" }],
      broker: "Apex Funding Partners",
      brokerContact: "Dana Ruiz",
      commission: "8 points",
    },
    documents: { merchantLinkSent: false, copyBroker: true },
    review: { assignTo: "Maya Chen (you)", priority: "Normal" },
  },
  savedAt: at("09:42"),
  registry: { matches: "copper kettle", state: "Ohio", activeSince: "2021-03" },
  documents: [
    { kind: "statements", received: 2 },
    { kind: "application", received: 1, file: "Copper Kettle application.pdf" },
    { kind: "id", received: 0 },
    { kind: "check", received: 0 },
  ],
  docsReceived: { received: 3, total: 7 },
  pastDeals: [
    { dealId: "APP-7H2K4Q", business: "Harbor Street Bakery LLC", owner: "Elena Brooks", phone: "(614) 555-0101" },
    { dealId: "APP-9K2M7R", business: "Mesa Auto Repair", owner: "Luis Ortega", phone: "(614) 555-0177" },
    { dealId: "APP-3QW8LP", business: "Northline HVAC Services", owner: "Tom Nash", phone: "(614) 555-0199" },
  ],
};
