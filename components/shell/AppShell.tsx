import type { ReactNode } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { Sidebar } from "./Sidebar";

/**
 * The page frame used by every internal page (design/Main.html).
 *
 * Warm grey page that never scrolls, the sidebar fixed on the left, and
 * the white rounded content panel on the right that scrolls on its own
 * with a thin grey scrollbar. Padding 14px on the top, right and bottom,
 * 6px gap between sidebar and panel. The panel is the flexible column, so
 * it resizes frame by frame as the sidebar animates. Its left edge carries
 * the invisible drag handle that collapses or opens the sidebar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="box-border flex h-dvh items-stretch gap-1.5 overflow-hidden bg-page py-3.5 pr-3.5 pl-0 text-body text-ink">
      <div className="z-10 h-full flex-none overflow-hidden">
        <Sidebar />
      </div>
      <div className="relative h-full min-w-0 flex-[999_1_560px]">
        <ResizeHandle />
        <main className="scrollbar-thin box-border flex h-full w-full min-w-0 flex-col gap-3.5 overflow-y-auto overscroll-contain rounded-panel border border-panel-border bg-panel px-6 pt-[22px] pb-7 shadow-[0_24px_60px_-32px_rgba(15,21,19,.28),0_2px_6px_rgba(15,21,19,.04)] [&>*]:flex-shrink-0">
          {children}
        </main>
      </div>
    </div>
  );
}
