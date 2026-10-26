import { Suspense } from "react";
import { ActivityCard } from "@/components/home/ActivityCard";
import { BrokersCard } from "@/components/home/BrokersCard";
import { ComingSoonCard } from "@/components/home/ComingSoonCard";
import { DecisionsCard } from "@/components/home/DecisionsCard";
import { GlanceStrip } from "@/components/home/GlanceStrip";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { KeyNumbers } from "@/components/home/KeyNumbers";
import { NextDealCard } from "@/components/home/NextDealCard";
import { PipelineCard } from "@/components/home/PipelineCard";
import { QueueCard } from "@/components/home/QueueCard";
import { SpeedCard } from "@/components/home/SpeedCard";
import { StipsCard } from "@/components/home/StipsCard";
import { WeekCalendar } from "@/components/home/WeekCalendar";
import { Arrive } from "@/components/ui/Skeleton";
import { homeCards } from "@/lib/copy/home";
import { homeView } from "@/lib/data/views/home";

/**
 * Home, from design/Main.html, in the design's order. The server loads the
 * signed-in person's deals and tasks, offers, funding, the funded book,
 * intake, stacking alerts, renewals, the week's funnel, stips, brokers,
 * activity and the calendar through the data layer; every card is worked
 * out from those records.
 */
export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeData />
    </Suspense>
  );
}

async function HomeData() {
  const d = homeCards(await homeView());
  return (
    <Arrive>
      <HomeHeader data={d.header} />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <NextDealCard deal={d.hero} />
        <DecisionsCard data={d.decisions} />
        <QueueCard data={d.queue} />
        <WeekCalendar data={d.calendar} />
      </section>

      <GlanceStrip items={d.glance} />

      <KeyNumbers data={d.keyNumbers} />

      <PipelineCard data={d.pipeline} />

      <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3.5">
        <SpeedCard data={d.speed} />
        <StipsCard data={d.stips} />
        <BrokersCard data={d.brokers} />
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
        <ActivityCard data={d.activity} />
        <ComingSoonCard data={d.coming} />
      </section>
    </Arrive>
  );
}
