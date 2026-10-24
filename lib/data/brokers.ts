import "server-only";
import type { Broker, BrokerBook } from "@/lib/data/types";
import { source } from "./source";

/** The brokers on the scorecards, in the order they're listed. */
export async function listBrokers(): Promise<Broker[]> {
  return source.brokers.list();
}

/** Brokers as a whole: totals, clawbacks, deal ownership, applicants and paperwork. */
export async function getBrokerBook(): Promise<BrokerBook> {
  return source.brokers.getBook();
}
