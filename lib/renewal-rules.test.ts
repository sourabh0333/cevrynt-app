import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renewalRulesView } from "./data/views/renewals.ts";
import { autoApproveCount, isReady, notReadyReason, readiness } from "./renewal-rules.ts";

// Expected figures follow design/prototypes/Settings-Renewals.dc.html. The
// merchants are every live advance and the rules are the saved ones, both
// read through the data layer as the settings page reads them.
const { merchants: readinessMerchants, settings } = await renewalRulesView();
const saved = settings.rules;
const counts = (r: ReturnType<typeof readiness>) => r.funnel.map((f) => `${f.count}${f.drop ? `-${f.drop}` : ""}`);

describe("renewal readiness", () => {
  it("the saved rules make exactly 9 of 13 ready, the Renewals page count", () => {
    const r = readiness(readinessMerchants, saved, saved);
    assert.equal(r.pool.length, 13);
    assert.equal(r.ready.length, 9);
    assert.equal(r.diff, 0);
    assert.deepEqual(counts(r), ["13", "9-4", "9", "9", "9", "9"]);
  });

  it("lowering repaid to 40% adds two merchants; Kestrel still has a returned payment", () => {
    const r = readiness(readinessMerchants, { ...saved, paid: 40 }, saved);
    assert.equal(r.ready.length, 11);
    assert.equal(r.diff, 2);
    assert.equal(r.funnel[2].drop, 1);
  });

  it("a stricter score of 85 narrows it down and is reported as fewer", () => {
    const r = readiness(readinessMerchants, { ...saved, score: 85 }, saved);
    assert.equal(r.ready.length, 5);
    assert.equal(r.diff, -4);
    assert.equal(r.funnel[4].drop, 4);
  });

  it("names the first rule a merchant fails", () => {
    const kestrel = readinessMerchants.find((m) => m.name === "Kestrel Plumbing")!;
    assert.equal(notReadyReason(kestrel, saved), "Repaid 48%");
    assert.equal(notReadyReason(kestrel, { ...saved, paid: 40 }), "Returned payment");
  });

  it("a stacking alert stops a merchant who passes everything else", () => {
    const granite = readinessMerchants.find((m) => m.name === "Granite State Builders")!;
    const paidUp = { ...granite, paid: 60, health: 80 };
    assert.equal(granite.stacking, true);
    assert.equal(isReady(paidUp, saved), false);
    assert.equal(notReadyReason(paidUp, saved), "Stacking alert");
    assert.equal(isReady(paidUp, { ...saved, noStack: false }), true);
  });

  it("auto-approve at $50K sends about 6 of 9 straight to an offer", () => {
    assert.equal(autoApproveCount(9, settings.autoApprove.upTo / 1000), 6);
    assert.equal(autoApproveCount(9, 80), 9);
  });
});
