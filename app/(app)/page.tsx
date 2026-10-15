import { DecisionsCard } from "@/components/home/DecisionsCard";
import { GlanceStrip } from "@/components/home/GlanceStrip";
import { HomeHeader } from "@/components/home/HomeHeader";
import { NextDealCard } from "@/components/home/NextDealCard";
import { QueueCard } from "@/components/home/QueueCard";
import { WeekCalendar } from "@/components/home/WeekCalendar";
import { homeData } from "@/lib/sample-data/home";

// Home, from design/Main.html. Top half for now: header, bento row
// (next deal, decisions, queue, calendar) and the glance strip.
// Key numbers, pipeline, speed, stips, brokers and activity come next.
export default function Home() {
  const d = homeData;
  return (
    <>
      <HomeHeader data={d.header} />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <NextDealCard deal={d.hero} />
        <DecisionsCard data={d.decisions} />
        <QueueCard data={d.queue} />
        <WeekCalendar data={d.calendar} />
      </section>

      <GlanceStrip items={d.glance} />
    </>
  );
}
