import "server-only";
import type { Advance, FundedBook } from "@/lib/data/types";
import { source } from "./source";

/** Funded deals being repaid, in the order the book lists them. */
export async function listAdvances(): Promise<Advance[]> {
  return source.advances.list();
}

/** The book as a whole: counts, today's payments, warnings, the forecast and returns. */
export async function getFundedBook(): Promise<FundedBook> {
  return source.advances.getBook();
}
