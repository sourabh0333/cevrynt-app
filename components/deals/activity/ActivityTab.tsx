"use client";

import { useState } from "react";
import { activitySections, timelineCopy, toTimelineEvent, type TimelineEvent } from "@/lib/copy/deal-activity";
import type { ActivityTabData } from "@/lib/data/views/deal-tabs";
import { dayLabel } from "@/lib/format";
import { PaceRow } from "./PaceRow";
import { MessagesCard, NoteCard } from "./SideCards";
import { AccessCard, TimeSpentCard } from "./TimeCards";
import { Timeline } from "./Timeline";

const row = "grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-1";

/**
 * The Activity tab from design/Deal-Activity.html, for the deal in `data`
 * (from the data layer).
 * Row 1: the deal pace tiles. Row 2: the timeline (two columns) beside
 * the note and messages cards; the timeline matches their height and
 * scrolls inside. Row 3: where the time went and who opened it.
 * Posted notes live here so the timeline and the event count follow them.
 */
export function ActivityTab({ data }: { data: ActivityTabData }) {
  const { activity, now } = data;
  const [notes, setNotes] = useState<TimelineEvent[]>([]);
  const events = [...notes, ...activity.events.map(toTimelineEvent)];
  const today = notes.length + activity.events.filter((e) => dayLabel(e.at, now) === "Today").length;
  const day = timelineCopy.day(activity.events[0]?.at ?? now, now);

  return (
    <>
      <PaceRow activity={activity} deadline={data.deadline} eventsToday={today} />
      <section aria-label={activitySections.timeline} className={`${row} items-stretch`}>
        <Timeline events={events} day={day} />
        <div className="flex min-w-0 flex-col gap-3.5">
          <NoteCard mentions={data.mentions} followers={data.followers} onAdd={(text) => setNotes((n) => [timelineCopy.noteEvent(text, data.me), ...n])} />
          <MessagesCard threads={activity.threads} people={activity.people} me={data.me.name} />
        </div>
      </section>
      <section aria-label={activitySections.time} className={row}>
        <TimeSpentCard stages={activity.stages} arrivedAt={data.receivedAt} />
        <AccessCard rows={activity.access} />
      </section>
    </>
  );
}
