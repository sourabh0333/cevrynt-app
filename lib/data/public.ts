import "server-only";
import type { MerchantLink } from "@/lib/data/types";
import { source } from "./source";

/** The Merchant Link with this token; null if there's no such link. */
export async function getMerchantLink(token: string): Promise<MerchantLink | null> {
  return source.links.getByToken(token);
}
