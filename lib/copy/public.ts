/**
 * Wording shared by the public, merchant-facing pages (Merchant Link, the
 * application form, their "not found" and error pages): the funder's legal
 * line and the footer. The funder itself is the workspace record.
 */
import type { PublicFunder } from "@/lib/data/views/public";

/** "Ridgeline Capital LLC · 100 Federal St, Boston, MA": the address without its ZIP code. */
export const legalLine = (f: Pick<PublicFunder, "legalName" | "address">) => `${f.legalName} · ${f.address.replace(/\s+\d{5}(-\d{4})?$/, "")}`;

/** "tel:6175550190" for a "(617) 555-0190" phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d]/g, "")}`;

/** "Ridgeline" from "Ridgeline Capital": how merchants hear the funder's name in passing. */
export const shortFunderName = (name: string) => name.split(" ")[0];

export const linkFooter = { privacy: "Privacy", terms: "Terms", powered: "Powered by", brand: "Cevrynt" };
