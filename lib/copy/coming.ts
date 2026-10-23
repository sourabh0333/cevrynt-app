/**
 * Interface wording for What's coming (design/Coming.html). The feature
 * records come from the data layer (listRoadmapFeatures); this file only
 * holds what people read around them.
 */
import type { RoadmapLane } from "@/lib/data/types";

export const comingHeader = {
  title: "What's coming",
  line: (count: number) => `${count} features in the works · shaped by funders like you`,
};

/** The sidebar's note next to "What's coming". */
export const comingNote = (count: number) => `${count} new`;

export const comingHero = {
  chip: "Roadmap · updated Oct 1",
  title: "Built for the gaps no one else fills",
  text: "Vote for what matters to you, and join early access to try features before everyone else.",
};

export const lanes: { key: RoadmapLane; title: string; when: string }[] = [
  { key: "now", title: "Building now", when: "Building now · this quarter" },
  { key: "next", title: "Up next", when: "Up next · in the next 6 months" },
  { key: "later", title: "Later", when: "Later · next year" },
];

export const roadmap = {
  title: "Roadmap",
  stageLabel: "Stage",
  total: (count: number) => `${count} features in total`,
  votes: (n: number) => `${n} votes from funders`,
  /** opened on the first feature being built */
  start: { stage: "now" as RoadmapLane, feature: "mail" },
};

export const spotlight = {
  why: "Why it matters",
  can: "What you'll be able to do",
  vote: (n: number) => `▲ Vote · ${n}`,
  voted: (n: number) => `▲ Voted · ${n}`,
  join: "Join early access",
  joined: "On the early access list",
};

export const shipped = {
  title: "Recently shipped",
  text: "Already in your workspace",
  items: [
    { name: "Policy simulator", hint: "test rules on past deals", when: "Sep", href: "/settings/policy" },
    { name: "Renewal radar", hint: "see every renewal at a glance", when: "Sep", href: "/renewals" },
    { name: "Broker scorecards", hint: "quality, not just volume", when: "Aug", href: "/brokers" },
  ],
};

export const ideaBox = {
  title: "Have an idea?",
  text: "Tell us what slows your team down. We read every one.",
  label: "Your idea",
  placeholder: "e.g. Let brokers see the reason a deal was countered",
  send: "Send idea",
};
