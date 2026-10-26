import type { MerchantLink } from "@/lib/data/types";

/**
 * The sample Merchant Links (design/prototypes/Merchant-Link.dc.html).
 * "demo" is Harbor Street Bakery's link to Elena Brooks: the code and the
 * statements are done, the photo ID and voided check follow the deal's
 * conditions, and the credit check, landlord letter and bank are still to do.
 */
const at = (time: string) => `2026-10-13T${time}:00-04:00`;

export const merchantLinks: MerchantLink[] = [
  {
    token: "demo",
    dealId: "APP-7H2K4Q",
    sentAt: at("09:43"),
    steps: [
      { key: "verify", optional: false, doneAt: at("09:43") },
      { key: "stmts", optional: false, doneAt: at("09:40") },
      { key: "id", optional: false, conditionId: "id" },
      { key: "void", optional: false, conditionId: "void" },
      { key: "consent", optional: false, doneAt: null },
      { key: "letter", optional: false, conditionId: "landlord" },
      { key: "bank", optional: true, doneAt: null },
    ],
  },
];
