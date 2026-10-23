import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comingNote, comingHeader } from "@/lib/copy/coming";
import { listRoadmapFeatures } from "@/lib/data/roadmap";
import { ridgelinePolicy } from "@/lib/offer-math";
import { defaultRenewalRules, readiness } from "@/lib/renewal-rules";
import { auditHeader } from "@/lib/sample-data/audit";
import { COST_PER_DEAL, costPerDeal, dealsUsed, usageByChannel } from "@/lib/sample-data/plan";
import { policyLimits, ruleGroups } from "@/lib/sample-data/policy";
import { readinessMerchants } from "@/lib/sample-data/renewal-rules";
import { renewalsHeader } from "@/lib/sample-data/renewals";
import { unitEconomics } from "@/lib/sample-data/reports";
import { signIns, toFix } from "@/lib/sample-data/security";
import { DECISION_TARGET_HOURS, deals, teamWorkload } from "@/lib/sample-data/submissions";
import { people } from "@/lib/sample-data/team";
import { workingHours } from "@/lib/sample-data/workspace";

/*
 * Today's cross-page facts (DATA-PLAN.md, step 0). Several pages show the
 * same number; this test pins each one so converting a page to the data
 * layer can't quietly change it. Records already behind the data layer are
 * read through it (the roadmap); the rest are read from today's sample
 * files until their page is converted, then this test switches to the
 * data-layer getter for them.
 */

describe("What's coming", () => {
  it("has 10 features: 3 building now, 5 up next, 2 later, 341 votes", async () => {
    const f = await listRoadmapFeatures();
    assert.equal(f.length, 10);
    assert.deepEqual(["now", "next", "later"].map((l) => f.filter((x) => x.lane === l).length), [3, 5, 2]);
    assert.equal(f.reduce((s, x) => s + x.votes, 0), 341);
  });

  it("the sidebar note and the page header count the same list", async () => {
    const n = (await listRoadmapFeatures()).length;
    assert.equal(comingNote(n), "10 new");
    assert.equal(comingHeader.line(n), "10 features in the works · shaped by funders like you");
  });
});

describe("Renewals", () => {
  it("today's saved rules make exactly 9 merchants ready, as the Renewals page says", () => {
    const { ready } = readiness(readinessMerchants, defaultRenewalRules);
    assert.equal(ready.length, 9);
    assert.match(renewalsHeader.line, /^9 merchants ready/);
  });
});

describe("Deals by channel and cost per deal", () => {
  it("287 deals this month, split 132 / 98 / 39 / 18 (Plan & usage, Intake channels)", () => {
    assert.equal(dealsUsed, 287);
    assert.deepEqual(usageByChannel.map((c) => c.deals), [132, 98, 39, 18]);
  });

  it("$5.20 a deal, the same on Plan & usage and Reports", () => {
    assert.equal(COST_PER_DEAL, 5.2);
    assert.equal(costPerDeal, "$5.20");
    assert.equal(unitEconomics.facts.find((f) => f.label === "Cevrynt cost per deal")?.value, "$5.20");
  });
});

describe("Team", () => {
  it("underwriter workloads are 7 / 9 / 6 / 3 on Submissions and Team & roles", () => {
    assert.deepEqual(teamWorkload.people.map((p) => p.open), [7, 9, 6, 3]);
    const byIni = (ini: string) => people.find((p) => p.ini === ini)?.load;
    assert.deepEqual(["MC", "AK", "JR", "PS"].map(byIni), [7, 9, 6, 3]);
  });

  it("only Leo has no 2-step login, on Team & roles and Security", () => {
    assert.deepEqual(people.filter((p) => !p.mfa).map((p) => p.name), ["Leo Park"]);
    assert.ok(toFix.some((f) => f.title === "Leo Park has no 2-step login"));
    assert.equal(signIns.rows.find((r) => r.person === "Leo Park")?.result, "nomfa");
  });

  it("one failed sign-in, on Security and the Audit log", () => {
    assert.equal(signIns.rows.filter((r) => r.result === "blocked").length, 1);
    assert.equal(auditHeader.stats.find((s) => s.label === "Failed sign-ins")?.value, "1");
  });
});

describe("Policy limits", () => {
  it("offers run $10K to $150K; seniors approve over $45K and alone up to $100K", () => {
    assert.deepEqual(policyLimits, { minAmount: 10000, seniorAbove: 45000, seniorLimit: 100000, maxAmount: 150000 });
  });

  it("the Offer tab's approval limit is the policy's senior line", () => {
    assert.equal(ridgelinePolicy.approvalLimit, policyLimits.seniorAbove);
  });

  it("the Policy rules print the same limits", () => {
    const sentence = (id: string) =>
      ruleGroups
        .flatMap((g) => g.rules)
        .find((r) => r.id === id)!
        .parts.map((p) => (typeof p === "string" ? p : "value" in p ? p.value : ""))
        .join("");
    assert.match(sentence("amount"), /between \$10K and \$150K/);
    assert.match(sentence("senior"), /over \$45K/);
  });
});

describe("Decision target", () => {
  it("4 working hours: a new deal on Submissions starts with 4h left, and Workspace says the same", () => {
    assert.equal(DECISION_TARGET_HOURS, 4);
    assert.ok(deals.some((d) => d.status === "new" && d.sla === "4h left"));
    assert.equal(workingHours.rows.find((r) => r.label === "Decision target")?.value, "4 working hours");
  });
});
