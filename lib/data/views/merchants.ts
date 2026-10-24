import "server-only";
import type { Advance, FundedBook, IsoDateTime, Merchant, MerchantBook, MerchantListing, Money, Policy, Relationship } from "@/lib/data/types";
import { getFundedBook } from "../advances";
import { getMerchantBook, listMerchantListings } from "../merchants";
import { getPolicy } from "../settings";
import { portfolio } from "./portfolio";

/** A directory row: the merchant, its listing, its live advance (if any) and where it stands. */
export type MerchantRow = {
  merchant: Merchant;
  listing: MerchantListing;
  advance: Advance | null;
  relationship: Relationship;
};

export type MerchantsData = {
  now: IsoDateTime;
  rows: MerchantRow[];
  book: MerchantBook;
  /** the funded book's counts and money still to collect */
  funded: Pick<FundedBook, "counts" | "outstanding">;
  /** merchants ready to renew under the saved rules, and the share repaid those rules ask for */
  readyCount: number;
  renewalLine: number;
  /** what's left to collect on every live advance, largest first */
  balances: { name: string; left: Money }[];
  concentration: Policy["concentration"];
};

/** Everything Merchants shows, loaded in parallel. */
export async function merchantsView(): Promise<MerchantsData> {
  const [p, listings, book, funded, policy] = await Promise.all([portfolio(), listMerchantListings(), getMerchantBook(), getFundedBook(), getPolicy()]);
  const rows = listings.map((listing): MerchantRow => {
    const merchant = p.merchants.find((m) => m.id === listing.merchantId)!;
    const advance: Advance | null = p.advances.find((a) => a.merchantId === listing.merchantId) ?? null;
    const relationship: Relationship = advance
      ? advance.status === "new"
        ? "new"
        : p.readyIds.includes(advance.id)
          ? "renew"
          : "active"
      : (listing.standing ?? "active");
    return { merchant, listing, advance, relationship };
  });
  return {
    now: p.now,
    rows,
    book,
    funded: { counts: funded.counts, outstanding: funded.outstanding },
    readyCount: p.readyIds.length,
    renewalLine: p.settings.rules.paid,
    balances: p.advances.map((a) => ({ name: a.merchant.name, left: a.payback - a.paid })).sort((a, b) => b.left - a.left),
    concentration: policy.concentration,
  };
}
