import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { autoApproveCount, defaultRenewalRules, notReadyReason, readiness } from "./renewal-rules.ts";
import { readinessMerchants } from "./sample-data/renewal-rules.ts";

// Expected figures follow design/prototypes/Settings-Renewals.dc.html.
const counts = (r: ReturnType<typeof readiness>) => r.funnel.map((f) => `${f.count}${f.drop ? `-${f.drop}` : ""}`);

describe("renewal readiness", () => {
  it("today's rules make exactly 9 of 13 ready, the Renewals page count", () => {
    const r = readiness(readinessMerchants, defaultRenewalRules);
    assert.equal(r.pool.length, 13);
    assert.equal(r.ready.length, 9);
    assert.equal(r.diff, 0);
    assert.deepEqual(counts(r), ["13", "9-4", "9", "9", "9", "9"]);
  });

  it("lowering repaid to 40% adds two merchants; Kestrel still has a returned payment", () => {
    const r = readiness(readinessMerchants, { ...defaultRenewalRules, paid: 40 });
    assert.equal(r.ready.length, 11);
    assert.equal(r.diff, 2);
    assert.equal(r.funnel[2].drop, 1);
  });

  it("a stricter score of 85 narrows it down and is reported as fewer", () => {
    const r = readiness(readinessMerchants, { ...defaultRenewalRules, score: 85 });
    assert.equal(r.ready.length, 5);
    assert.equal(r.diff, -4);
    assert.equal(r.funnel[4].drop, 4);
  });

  it("names the first rule a merchant fails", () => {
    const kestrel = readinessMerchants.find((m) => m.name === "Kestrel Plumbing")!;
    assert.equal(notReadyReason(kestrel, defaultRenewalRules), "Repaid 48%");
    assert.equal(notReadyReason(kestrel, { ...defaultRenewalRules, paid: 40 }), "Returned payment");
  });

  it("auto-approve at $50K sends about 6 of 9 straight to an offer", () => {
    assert.equal(autoApproveCount(9, 50), 6);
    assert.equal(autoApproveCount(9, 80), 9);
  });
});
