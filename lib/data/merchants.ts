import "server-only";
import type { Merchant, MerchantBook, MerchantListing } from "@/lib/data/types";
import { source } from "./source";

/** Every merchant the workspace knows: name, avatar, industry and health. */
export async function listMerchants(): Promise<Merchant[]> {
  return source.merchants.list();
}

/** The merchant directory's first page, in the order "All merchants" lists it. */
export async function listMerchantListings(): Promise<MerchantListing[]> {
  return source.merchants.listListings();
}

/** The directory and portfolio as a whole: counts, mixes, repeat merchants and owner groups. */
export async function getMerchantBook(): Promise<MerchantBook> {
  return source.merchants.getBook();
}
