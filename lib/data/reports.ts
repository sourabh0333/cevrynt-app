import "server-only";
import type { ReportsBook, ReportSnapshot } from "@/lib/data/types";
import { source } from "./source";

/** The report for each period: week, month, quarter and year. */
export async function listReportSnapshots(): Promise<ReportSnapshot[]> {
  return source.reports.listSnapshots();
}

/** How the policy rules did, what every $1 earns and the team's quarter. */
export async function getReportsBook(): Promise<ReportsBook> {
  return source.reports.getBook();
}
