/**
 * Sample data for the Manual lead form, from design/Intake-Manual.html and
 * design/prototypes/Intake-Manual.dc.html. Real lookups and policy rules
 * replace this later behind the same types.
 */
export const manualSteps = [
  { n: "01", title: "Company & owner", sub: "Who is applying" },
  { n: "02", title: "Request", sub: "Amount and positions" },
  { n: "03", title: "Documents", sub: "Upload or request" },
  { n: "04", title: "Review & start", sub: "Assign and begin" },
];

export type Position = { funder: string; payment: string; balance: string };

export type ManualLead = {
  business: {
    name: string;
    dba: string;
    ein: string;
    industry: string;
    start: string;
    address: string;
    phone: string;
    entity: string;
    state: string;
    website: string;
  };
  owner: {
    name: string;
    ownership: string;
    email: string;
    mobile: string;
    address: string;
  };
  request: {
    amount: string;
    revenue: string;
    uses: string[];
    hasPositions: boolean;
    positions: Position[];
    broker: string;
    /** the person at the broker, copied on Merchant Link when asked */
    brokerContact: string;
    commission: string;
  };
  documents: {
    merchantLinkSent: boolean;
    copyBroker: boolean;
  };
  review: {
    assignTo: string;
    priority: string;
  };
};

export const initialLead: ManualLead = {
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
};

export const useOfFunds = ["Equipment", "Inventory", "Payroll", "Expansion", "Pay off other advances", "Other"];

/** What the state registry returned for the sample business. */
export const registryMatch = "Found in Ohio registry · active since Mar 2021";

/** Documents your policy requires, with where the sample stands today. */
export type RequiredDoc = {
  id: string;
  title: string;
  note: string;
  status: "partial" | "received" | "missing";
  label: string;
};
export const requiredDocs: RequiredDoc[] = [
  { id: "statements", title: "Bank statements, last 4 months", note: "June – September 2026", status: "partial", label: "2 of 4" },
  { id: "application", title: "Signed application", note: "Copper Kettle application.pdf", status: "received", label: "Received" },
  { id: "id", title: "Owner photo ID", note: "Checked with a selfie through Merchant Link", status: "missing", label: "Missing" },
  { id: "check", title: "Voided check", note: "Or connect the bank account instead", status: "missing", label: "Missing" },
];
export const docsReceived = { received: 3, total: 7 };

/** The policy rules the live fit check runs against. */
export const policy = {
  allowedIndustries: ["restaurant", "café", "cafe", "dental", "hvac", "cleaning", "fitness", "auto", "plumbing", "retail", "florist", "towing", "medical", "salon"],
  blockedIndustries: ["cannabis", "firearm", "gambling", "adult", "crypto"],
  minMonthsInBusiness: 6,
  maxRequestToRevenue: 1.5,
  maxPositions: 2,
  /** "today" for time-in-business math */
  today: { year: 2026, month: 10 },
};

/** Past deals the duplicate check compares against. */
export const existingDeals = [
  { id: "APP-7H2K4Q", business: "Harbor Street Bakery LLC", owner: "Elena Brooks", phone: "(614) 555-0101" },
  { id: "APP-MA1", business: "Mesa Auto Repair", owner: "Luis Ortega", phone: "(614) 555-0177" },
  { id: "APP-NH1", business: "Northline HVAC Services", owner: "Tom Nash", phone: "(614) 555-0199" },
];
