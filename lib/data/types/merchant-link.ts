import type { Id, IsoDateTime } from "./common";

/** The steps a Merchant Link can ask for, in the order the merchant sees them. */
export type LinkStepKey = "verify" | "stmts" | "id" | "void" | "consent" | "letter" | "bank";

/**
 * One step on a link. A step that stands for one of the deal's conditions
 * (photo ID, voided check, landlord letter) reads whether it's done, and
 * when, from that condition; the others keep their own time.
 */
export type MerchantLinkStep = { key: LinkStepKey; optional: boolean } & ({ conditionId: string } | { doneAt: IsoDateTime | null });

/**
 * A secure link sent to a deal's owner to finish the application
 * (/m/[token]). Who it's for, the business, the underwriter and the broker
 * all come from the deal; how long it works comes from Intake channels.
 */
export type MerchantLink = {
  token: string;
  dealId: Id;
  sentAt: IsoDateTime;
  steps: MerchantLinkStep[];
};
