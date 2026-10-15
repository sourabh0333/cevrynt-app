"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SegmentedSwitch } from "@/components/ui/SegmentedSwitch";
import { Tabs } from "@/components/ui/Tabs";

// Client-side state for the gallery only. Pages will own their own state.
export function TabsDemo() {
  const [deal, setDeal] = useState("summary");
  const [type, setType] = useState("all");

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Card variant="white">
        <span className="text-cap font-semibold uppercase text-hint">
          Pill tabs, deal workspace (links)
        </span>
        <Tabs
          label="Deal sections"
          variant="pill"
          value={deal}
          onChange={setDeal}
          items={[
            { value: "summary", label: "Summary", href: "#" },
            { value: "cash", label: "Cash flow", href: "#", dot: "teal" },
            { value: "positions", label: "Positions & debt", href: "#", dot: "teal" },
            { value: "integrity", label: "Integrity", href: "#", dot: "amber" },
            { value: "business", label: "Business & owners", href: "#", dot: "teal" },
            {
              value: "conditions",
              label: "Conditions & stips",
              href: "#",
              count: 2,
              countColor: "amber",
            },
            { value: "offer", label: "Offer & disclosures", href: "#" },
            { value: "decision", label: "Decision & memo", href: "#" },
            { value: "activity", label: "Activity", href: "#" },
          ]}
        />
        <p className="text-label text-hint">
          Selected: <span className="font-mono">{deal}</span>. Try Left,
          Right, Home and End with the focus on a tab.
        </p>
      </Card>

      <Card variant="grey">
        <span className="text-cap font-semibold uppercase text-hint">
          Panel tabs with counts, Tasks
        </span>
        <Tabs
          label="Type"
          variant="panel"
          value={type}
          onChange={setType}
          items={[
            { value: "all", label: "All", dot: "grey", count: 7 },
            { value: "decision", label: "Decisions", dot: "blue", count: 1 },
            { value: "review", label: "Reviews", dot: "amber", count: 2 },
            { value: "alert", label: "Alerts", dot: "red", count: 1 },
            { value: "docs", label: "Documents", dot: "grey", count: 1 },
            { value: "renewal", label: "Renewals", dot: "teal", count: 1 },
            { value: "call", label: "Calls", dot: "purple", count: 1 },
          ]}
        />
      </Card>
    </div>
  );
}

export function SwitchDemo() {
  const [who, setWho] = useState("mine");
  const [range, setRange] = useState("today");

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card variant="grey">
        <span className="text-cap font-semibold uppercase text-hint">
          Teal, Mine / Team
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedSwitch
            label="Whose tasks"
            value={who}
            onChange={setWho}
            options={[
              { value: "mine", label: "Mine" },
              { value: "team", label: "Team" },
            ]}
          />
          <span className="text-label text-hint">
            Selected: <span className="font-mono">{who}</span>
          </span>
        </div>
      </Card>
      <Card variant="white">
        <span className="text-cap font-semibold uppercase text-hint">
          Soft, time range
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedSwitch
            label="Time range"
            variant="soft"
            value={range}
            onChange={setRange}
            options={[
              { value: "today", label: "Today" },
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days" },
            ]}
          />
          <span className="text-label text-hint">
            Selected: <span className="font-mono">{range}</span>
          </span>
        </div>
      </Card>
    </div>
  );
}
