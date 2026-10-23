import type { Id } from "./common";

/** Where a feature sits on the roadmap. */
export type RoadmapLane = "now" | "next" | "later";

/** One feature on What's coming. Votes are the count before the viewer's own vote. */
export type RoadmapFeature = {
  id: Id;
  lane: RoadmapLane;
  name: string;
  /** one line for the list */
  short: string;
  votes: number;
  /** share built so far, 0–100, for the progress ring */
  progress: number;
  /** when it should ship, as funders are told ("Early 2027") */
  eta: string;
  /** the longer description in the spotlight */
  description: string;
  why: string;
  /** what you'll be able to do */
  outcomes: string[];
  /** the viewer is already on the early access list */
  joined: boolean;
};
