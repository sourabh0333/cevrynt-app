import "server-only";
import type { BulkIntake, IntakeSummary, IsoDateTime, ManualDraft, PackageIntake, Policy } from "@/lib/data/types";
import { getNow } from "../clock";
import { getBulkIntake, getIntakeSummary, getManualDraft, getPackageIntake } from "../intake";
import { getPolicy } from "../settings";
import { listTeam } from "../team";

/* Page-shaped joins for Intake: each page gets its record plus the policy values it quotes. */

export type IntakeHubData = {
  today: IntakeSummary["today"];
  /** the recent intakes, with the assignee's name from the team */
  recent: (IntakeSummary["recent"][number] & { assignee: string | null })[];
  policy: Pick<Policy, "minBusinessMonths">;
};

/** The Intake hub: today's arrivals and the recent intakes. */
export async function intakeHubView(): Promise<IntakeHubData> {
  const [summary, team, policy] = await Promise.all([getIntakeSummary(), listTeam(), getPolicy()]);
  return {
    today: summary.today,
    recent: summary.recent.map((r) => ({ ...r, assignee: r.assigneeId ? (team.find((m) => m.id === r.assigneeId)?.name ?? null) : null })),
    policy: { minBusinessMonths: policy.minBusinessMonths },
  };
}

export type ManualLeadData = {
  now: IsoDateTime;
  draft: ManualDraft;
  policy: Pick<Policy, "minBusinessMonths" | "maxRevenueMultiple" | "maxPositions" | "restrictedIndustries" | "approvedIndustries" | "requiredStatementMonths">;
};

/** The manual lead form: the draft, its lookups, and the policy the live fit check runs against. */
export async function manualLeadView(): Promise<ManualLeadData> {
  const [draft, policy, now] = await Promise.all([getManualDraft(), getPolicy(), getNow()]);
  return {
    now,
    draft,
    policy: {
      minBusinessMonths: policy.minBusinessMonths,
      maxRevenueMultiple: policy.maxRevenueMultiple,
      maxPositions: policy.maxPositions,
      restrictedIndustries: policy.restrictedIndustries,
      approvedIndustries: policy.approvedIndustries,
      requiredStatementMonths: policy.requiredStatementMonths,
    },
  };
}

export type PackageData = {
  now: IsoDateTime;
  pkg: PackageIntake;
  policy: Pick<Policy, "restrictedIndustries" | "requiredStatementMonths">;
};

/** The single package just uploaded, and the policy its fit check uses. */
export async function packageView(): Promise<PackageData> {
  const [pkg, policy, now] = await Promise.all([getPackageIntake(), getPolicy(), getNow()]);
  return { now, pkg, policy: { restrictedIndustries: policy.restrictedIndustries, requiredStatementMonths: policy.requiredStatementMonths } };
}

export type BulkData = {
  bulk: BulkIntake;
  policy: Pick<Policy, "minBusinessMonths" | "requiredStatementMonths">;
};

/** The bulk ZIP just uploaded, and the policy its rows quote. */
export async function bulkView(): Promise<BulkData> {
  const [bulk, policy] = await Promise.all([getBulkIntake(), getPolicy()]);
  return { bulk, policy: { minBusinessMonths: policy.minBusinessMonths, requiredStatementMonths: policy.requiredStatementMonths } };
}
