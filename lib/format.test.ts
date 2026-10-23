import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dateShort, dayAndTime, dayLabel, money, moneyCompact, moneyShort, percent, plural, timeOfDay } from "./format.ts";

describe("money and shares", () => {
  it("formats dollars the way the designs show them", () => {
    assert.equal(money(52800), "$52,800");
    assert.equal(money(418.95), "$419");
    assert.equal(moneyShort(40000), "$40K");
    assert.equal(moneyShort(9400), "$9.4K");
    assert.equal(moneyCompact(1240000), "$1.24M");
    assert.equal(moneyCompact(402000), "$402K");
    assert.equal(percent(0.254), "25%");
  });

  it("counts things in plain words", () => {
    assert.equal(plural(1, "step"), "1 step");
    assert.equal(plural(3, "step"), "3 steps");
    assert.equal(plural(2, "person", "people"), "2 people");
  });
});

describe("dates in the workspace's zone (Eastern)", () => {
  const now = "2026-10-14T15:00:00Z"; // 11:00 in Boston

  it("shows 24-hour times and short dates", () => {
    assert.equal(timeOfDay("2026-10-14T12:12:00Z"), "08:12");
    assert.equal(timeOfDay("2026-10-14T20:40:00Z"), "16:40");
    assert.equal(dateShort("2026-10-02T14:00:00Z"), "Oct 2");
  });

  it("says Today and Yesterday by the workspace's calendar, not UTC", () => {
    assert.equal(dayLabel("2026-10-14T12:12:00Z", now), "Today");
    // 01:30 UTC on the 14th is still the evening of the 13th in Boston.
    assert.equal(dayLabel("2026-10-14T01:30:00Z", now), "Yesterday");
    assert.equal(dayLabel("2026-10-11T14:00:00Z", now), "Oct 11");
    assert.equal(dayAndTime("2026-10-14T12:12:00Z", now), "Today 08:12");
  });
});
