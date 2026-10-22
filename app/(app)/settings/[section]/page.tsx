import { Suspense } from "react";
import { notFound } from "next/navigation";
import { settingsSections } from "@/lib/sample-data/settings";

/**
 * Placeholder for the settings sections that are not built yet. It renders
 * inside the settings layout so the menu works everywhere. Each real section
 * replaces it with its own folder (a static route wins over this one).
 */
export function generateStaticParams() {
  return settingsSections.filter((s) => !s.built).map((s) => ({ section: s.href.split("/")[2] }));
}

export default function SettingsSectionPlaceholder({ params }: PageProps<"/settings/[section]">) {
  return (
    <Suspense fallback={null}>
      <Placeholder params={params} />
    </Suspense>
  );
}

async function Placeholder({ params }: { params: PageProps<"/settings/[section]">["params"] }) {
  const { section } = await params;
  const s = settingsSections.find((x) => x.href === `/settings/${section}`);
  if (!s) notFound();
  return (
    <div className="rounded-card-lg bg-card p-5">
      <h2 className="m-0 font-heading text-[19px] font-semibold text-ink">{s.label}</h2>
      <p className="mt-1 text-body-sm text-muted">This section is built in a later step of BUILD-PLAN.md.</p>
    </div>
  );
}
