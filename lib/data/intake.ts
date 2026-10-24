import "server-only";
import type { BulkIntake, IntakeSummary, ManualDraft, PackageIntake } from "@/lib/data/types";
import { source } from "./source";

/** Today's arrivals by channel and the most recent intakes. */
export async function getIntakeSummary(): Promise<IntakeSummary> {
  return source.intake.getSummary();
}

/** The manual lead draft being typed, with the registry and duplicate lookups it runs against. */
export async function getManualDraft(): Promise<ManualDraft> {
  return source.intake.getManualDraft();
}

/** The single package just uploaded and what was read from it. */
export async function getPackageIntake(): Promise<PackageIntake> {
  return source.intake.getPackage();
}

/** The bulk ZIP just uploaded, one row per folder, and today's earlier batch. */
export async function getBulkIntake(): Promise<BulkIntake> {
  return source.intake.getBulk();
}
