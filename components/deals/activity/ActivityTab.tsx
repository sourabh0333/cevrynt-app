"use client";

import { useState } from "react";
import { timeline, type ActivityEvent } from "@/lib/sample-data/deal-activity";
import { PaceRow } from "./PaceRow";
import { MessagesCard, NoteCard } from "./SideCards";
import { AccessCard, TimeSpentCard } from "./TimeCards";
import { Timeline } from "./Timeline";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Activity tab from design/Deal-Activity.html.
 * Row 1: the deal pace tiles. Row 2: the timeline (two columns) beside
 * the note and messages cards; the timeline matches their height and
 * scrolls inside. Row 3: where the time went and who opened it.
 * Posted notes live here so the timeline and the event count follow them.
 */
export function ActivityTab() {
  const [notes, setNotes] = useState<ActivityEvent[]>([]);
  const events = [...notes, ...timeline.events];

  return (
    <>
      <PaceRow eventCount={events.length} />
      <section aria-label="Timeline, notes and messages" className={`${row} items-stretch`}>
        <Timeline events={events} />
        <div className="flex min-w-0 flex-col gap-3.5">
          <NoteCard onAdd={(text) => setNotes((n) => [timeline.noteEvent(text), ...n])} />
          <MessagesCard />
        </div>
      </section>
      <section aria-label="Where the time went and who opened it" className={row}>
        <TimeSpentCard />
        <AccessCard />
      </section>
    </>
  );
}
