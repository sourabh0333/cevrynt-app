import type { Advance, FundedBook } from "./advances";
import type { AuditEntry, AuditLog } from "./audit";
import type { Broker, BrokerBook } from "./brokers";
import type { Id, IsoDateTime } from "./common";
import type { FundingDesk, FundingSummary, PipelineOffer, QueuedFunding, Release } from "./funding";
import type { Deal, DealQueueStats, DealQueueSummary } from "./deal";
import type { DealActivity, DealBusiness, DealCashFlow, DealConditions, DealDecision, DealIntegrity, DealOffer, DealPositions, DealSummary } from "./deal-tabs";
import type { BulkIntake, IntakeChannelSettings, IntakeSummary, ManualDraft, PackageIntake } from "./intake";
import type { Merchant, MerchantBook, MerchantListing } from "./merchants";
import type { Plan } from "./plan";
import type { Policy, Pricing } from "./policy";
import type { RenewalCandidate, RenewalSettings, RenewalSummary } from "./renewals";
import type { Task, TaskBoard } from "./tasks";
import type { RoadmapFeature } from "./roadmap";
import type { ApiKey, SecuritySettings, SignIn } from "./security";
import type { StackingAlert, StackingSummary } from "./stacking";
import type { AccessReview, Invite, OutsideAccess, TeamMember } from "./team";
import type { NotificationRule, Workspace } from "./workspace";

/**
 * What a data source must provide. The sample source (lib/data/sample) and,
 * later, the API source (lib/data/api) both implement this, so pages never
 * change when an area moves to the real backend. Areas are added here one
 * at a time as pages are converted (DATA-PLAN.md, section 4).
 */
export interface DataSource {
  /** The current time. The sample world is fixed on one working day. */
  clock: {
    now(): Promise<IsoDateTime>;
  };
  roadmap: {
    listFeatures(): Promise<RoadmapFeature[]>;
  };
  deals: {
    list(): Promise<Deal[]>;
    get(id: Id): Promise<Deal | null>;
    getQueueSummary(): Promise<DealQueueSummary>;
    getQueueStats(): Promise<DealQueueStats>;
    getSummary(id: Id): Promise<DealSummary | null>;
    getCashFlow(id: Id): Promise<DealCashFlow | null>;
    getPositions(id: Id): Promise<DealPositions | null>;
    getIntegrity(id: Id): Promise<DealIntegrity | null>;
    getBusiness(id: Id): Promise<DealBusiness | null>;
    getConditions(id: Id): Promise<DealConditions | null>;
    getOffer(id: Id): Promise<DealOffer | null>;
    getDecision(id: Id): Promise<DealDecision | null>;
    getActivity(id: Id): Promise<DealActivity | null>;
  };
  funding: {
    listPipeline(): Promise<PipelineOffer[]>;
    listQueue(): Promise<QueuedFunding[]>;
    listReleases(): Promise<Release[]>;
    getDesk(): Promise<FundingDesk>;
    getSummary(): Promise<FundingSummary>;
  };
  advances: {
    list(): Promise<Advance[]>;
    getBook(): Promise<FundedBook>;
  };
  merchants: {
    /** every merchant the workspace knows */
    list(): Promise<Merchant[]>;
    /** the directory's first page, in list order */
    listListings(): Promise<MerchantListing[]>;
    getBook(): Promise<MerchantBook>;
  };
  renewals: {
    /** in the order the radar shows them */
    listCandidates(): Promise<RenewalCandidate[]>;
    getSettings(): Promise<RenewalSettings>;
    getSummary(): Promise<RenewalSummary>;
  };
  stacking: {
    listAlerts(): Promise<StackingAlert[]>;
    getSummary(): Promise<StackingSummary>;
  };
  brokers: {
    /** in the order the scorecards list them */
    list(): Promise<Broker[]>;
    getBook(): Promise<BrokerBook>;
  };
  tasks: {
    list(): Promise<Task[]>;
    getBoard(): Promise<TaskBoard>;
  };
  intake: {
    getSummary(): Promise<IntakeSummary>;
    getManualDraft(): Promise<ManualDraft>;
    getPackage(): Promise<PackageIntake>;
    getBulk(): Promise<BulkIntake>;
  };
  team: {
    /** the signed-in person's team member id */
    getCurrentUserId(): Promise<Id>;
    listMembers(): Promise<TeamMember[]>;
    listInvites(): Promise<Invite[]>;
    getAccessReview(): Promise<AccessReview>;
    getOutsideAccess(): Promise<OutsideAccess>;
  };
  settings: {
    getWorkspace(): Promise<Workspace>;
    listNotificationRules(): Promise<NotificationRule[]>;
    getPolicy(): Promise<Policy>;
    getPricing(): Promise<Pricing>;
    getIntakeChannels(): Promise<IntakeChannelSettings>;
    getPlan(): Promise<Plan>;
    getSecurity(): Promise<SecuritySettings>;
    /** today's sign-ins, newest first */
    listSignIns(): Promise<SignIn[]>;
    listApiKeys(): Promise<ApiKey[]>;
  };
  audit: {
    /** newest first */
    listEntries(): Promise<AuditEntry[]>;
    getLog(): Promise<AuditLog>;
  };
}
