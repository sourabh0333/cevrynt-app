import type { Id, IsoDateTime } from "./common";
import type { Deal, DealQueueStats, DealQueueSummary } from "./deal";
import type { DealBusiness, DealCashFlow, DealConditions, DealIntegrity, DealPositions, DealSummary } from "./deal-tabs";
import type { Policy, Pricing } from "./policy";
import type { RoadmapFeature } from "./roadmap";
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
  };
}
