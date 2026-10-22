import { Suspense } from "react";
import { SettingsHeading, SettingsNav } from "@/components/settings/SettingsNav";
import { PageActions } from "@/components/shell/PageActions";
import { settingsTitle } from "@/lib/sample-data/settings";

/**
 * Every settings page shares this layout from design/Settings.html: the
 * "Settings" header with the section line, and the settings menu beside
 * the section's content. The menu sticks while the content scrolls.
 */
export default function SettingsLayout({ children }: LayoutProps<"/settings">) {
  return (
    <>
      <header className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="m-0 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.035em] text-ink">{settingsTitle}</h1>
          <Suspense fallback={<span className="mt-2.5 block h-[17px]" />}>
            <SettingsHeading />
          </Suspense>
        </div>
        <PageActions />
      </header>
      {/* @container so the menu and simulator can tell when the layout has stacked. */}
      <div className="@container">
        <div className="flex flex-wrap items-start gap-4">
          <Suspense fallback={<div className="flex-[0_0_220px]" />}>
            <SettingsNav />
          </Suspense>
          <div className="flex min-w-0 flex-[999_1_640px] flex-col gap-3.5">{children}</div>
        </div>
      </div>
    </>
  );
}
