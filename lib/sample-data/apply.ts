/**
 * Sample data for the public application form preview (/apply), copied from
 * design/prototypes/Apply-Form.dc.html (look: design/Apply-Form.html).
 * Public forms are "coming soon" (CLAUDE.md), so the page carries the blue
 * preview banner. The amount range comes from policyLimits, the same
 * $10K–$150K the Policy rules use. Nothing here is sent anywhere.
 */
import { policyLimits } from "@/lib/sample-data/policy";

export const applyBanner = {
  lead: "Preview · coming soon.",
  text: "This is how your public application form will look.",
  link: { label: "See the roadmap", href: "/whats-coming" },
};

export const applyHeader = { host: "apply.ridgeline.com · secure" };

export const applyHero = {
  title: "Funding for your business",
  text: "About 5 minutes. No effect on your credit score to apply.",
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
};

export const applySteps = [
  { label: "Business", title: "About the business", sub: "The basics, so we know who we’re talking to" },
  { label: "You", title: "About you", sub: "The owner applying today" },
  { label: "Funding", title: "What you need", sub: "A rough idea is fine" },
  { label: "Bank info", title: "Your bank activity", sub: "This is how we see what the business really earns" },
  { label: "Sign", title: "Review and sign", sub: "Two quick permissions and your signature" },
];

export const businessFields = {
  name: { label: "Legal business name", placeholder: "e.g. Harbor Street Bakery LLC" },
  industry: { label: "What does the business do?", options: ["Restaurant or food", "Health or dental", "Construction or trades", "Retail", "Other"] },
  start: { label: "When did it start?", placeholder: "Month and year" },
  state: { label: "State", placeholder: "e.g. Maine" },
  ein: { label: "EIN (optional)", placeholder: "12-3456789" },
};

export const ownerFields = {
  name: { label: "Your full name", placeholder: "First and last name" },
  own: { label: "How much do you own?", placeholder: "e.g. 100%" },
  email: { label: "Email", placeholder: "you@yourbusiness.com" },
  phone: { label: "Mobile", placeholder: "(207) 555-0100" },
  note: "We'll text a code to this number to keep your application safe.",
};

/** The amount slider spans the policy's offer range. */
export const amountRange = { min: policyLimits.minAmount, max: policyLimits.maxAmount, step: 5000, start: 40000 };

export const fundingFields = {
  amount: { label: "How much do you need?" },
  revenue: {
    label: "About how much comes in each month?",
    options: [
      { value: 20000, label: "Under $25,000" },
      { value: 40000, label: "$25,000 to $50,000" },
      { value: 75000, label: "$50,000 to $100,000" },
      { value: 150000, label: "Over $100,000" },
    ],
    start: 40000,
  },
  purpose: { label: "What's it for?", options: ["Equipment", "Inventory", "Payroll", "Growth", "Other"], start: "Equipment" },
  existing: { label: "Do you have other business funding right now?", options: ["No", "Yes, one", "More than one"], start: "Yes, one" },
};

export const bankStep = {
  connect: { title: "Connect your bank", text: "Fastest. About a minute, read-only, and you won't need to find statements.", action: "Connect" },
  or: "or",
  upload: { title: "Upload your last 4 bank statements", hint: "PDF from your bank, or clear photos", action: "Choose files" },
};

export const signStep = {
  permissions: [
    { key: "credit", title: "Check my credit", hint: "A soft check that doesn't affect your score" },
    { key: "true", title: "The information I gave is true", hint: "And I'm allowed to apply for this business" },
  ],
  signature: { label: "Type your name to sign", placeholder: "Full name" },
};

export const formNav = { back: "Back", saved: "Saved automatically", next: "Continue", send: "Send application" };

/**
 * A first look: about one month of revenue, rounded to $5K, never above the
 * policy's largest offer (the prototype's rule). Not an offer.
 */
const REVENUE_MULTIPLE = 1.0;
export const estimateUpTo = (monthlyRevenue: number) => Math.min(policyLimits.maxAmount, Math.round((monthlyRevenue * REVENUE_MULTIPLE) / 5000) * 5000);

export const firstLook = {
  title: "A first look",
  text: "Based on what you've told us so far",
  upTo: "You may be able to get up to",
  notOffer: "Not an offer. We confirm after looking at your bank activity.",
  fits: "What you asked for fits.",
  over: "You asked for more than we can usually offer at this revenue. You can still apply.",
};

export const haveReady = {
  title: "Have these ready",
  items: ["Your last 4 months of bank statements, or your online banking login", "A photo ID for each owner", "Your business details and start date"],
};

export const applyPrivacy = {
  title: "Private and secure",
  text: "Your details are encrypted and only used to review this application. Questions? Call (617) 555-0190.",
};

export const applySent = {
  title: "Application sent",
  text: "We usually reply the same business day. We'll text you a secure link if we need anything else.",
  steps: [
    { title: "Sent", text: "Just now", now: true },
    { title: "Review", text: "Usually today" },
    { title: "Offer", text: "Signed online" },
  ],
  restart: "Start again (preview)",
};
