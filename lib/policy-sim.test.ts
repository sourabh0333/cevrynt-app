import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getPolicy } from "@/lib/data/settings";
import { simInputFrom, simulatePolicy as simulateWith, type SimInput } from "./policy-sim.ts";

// Expected figures follow the formulas in design/prototypes/Settings.dc.html.
// The starting point and the 3% late target are the live policy, read through the data layer.
const policy = await getPolicy();
const currentPolicy = simInputFrom(policy);
const simulatePolicy = (s: SimInput) => simulateWith(s, currentPolicy, policy.latePaymentTarget);
const view = (r: ReturnType<typeof simulatePolicy>) => r.tiles.map((t) => `${t.value} ${t.delta} ${t.tone}`);

describe("simulatePolicy", () => {
  it("shows today's policy unchanged", () => {
    const r = simulatePolicy(currentPolicy);
    assert.equal(r.changed, false);
    assert.equal(r.verdict, "current");
    assert.deepEqual(view(r), ["69 ±0 flat", "2.6% ±0.0 pts flat", "$1.24M ±0.00M flat", "$248K ±0.00M flat"]);
  });

  it("allowing 3 positions funds more but goes over the 3% late target", () => {
    const r = simulatePolicy({ ...currentPolicy, maxPos: 3 });
    assert.equal(r.verdict, "risky");
    assert.deepEqual(view(r), ["80 +11 good", "3.5% +0.9 pts bad", "$1.43M +0.19M good", "$271K +0.02M good"]);
  });

  it("allowing only 1 position is safer but funds less", () => {
    const r = simulatePolicy({ ...currentPolicy, maxPos: 1 });
    assert.equal(r.verdict, "safer");
    assert.deepEqual(view(r), ["60 −9 bad", "2.1% −0.5 pts good", "$1.08M −0.16M bad", "$222K −0.03M bad"]);
  });

  it("a 75% debt share adds deals and stays at the target", () => {
    const r = simulatePolicy({ ...currentPolicy, debt: 75 });
    assert.equal(r.risky, false);
    assert.equal(r.verdict, "better");
    assert.deepEqual(view(r).slice(0, 2), ["73 +4 good", "3.0% +0.4 pts bad"]);
  });

  it("a $25K minimum revenue cuts approvals and late payments", () => {
    const r = simulatePolicy({ ...currentPolicy, minRev: 25 });
    assert.equal(r.verdict, "safer");
    assert.deepEqual(view(r).slice(0, 3), ["57 −12 bad", "2.0% −0.6 pts good", "$1.02M −0.22M bad"]);
  });
});
