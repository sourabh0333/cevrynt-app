import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scoreBand, securityScore } from "./security-score.ts";

// Expected figures follow design/prototypes/Settings-Security.dc.html.
const today = { mfa: true, sso: true, idle: true, newdev: true, ip: false, watermark: true, mask: true, bulk: true };

describe("security score", () => {
  it("today's protections score 86, Strong", () => {
    assert.equal(securityScore(today), 86);
    assert.equal(scoreBand(86), "strong");
  });

  it("turning on approved networks adds 6", () => {
    assert.equal(securityScore({ ...today, ip: true }), 92);
  });

  it("turning off 2-step login drops it to 66, could be stronger", () => {
    const s = securityScore({ ...today, mfa: false });
    assert.equal(s, 66);
    assert.equal(scoreBand(s), "fair");
  });

  it("with everything off only the base is left, Weak", () => {
    const s = securityScore({});
    assert.equal(s, 12);
    assert.equal(scoreBand(s), "weak");
  });
});
