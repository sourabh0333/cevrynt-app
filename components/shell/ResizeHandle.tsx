"use client";

import { toggleCollapsed, useEdgeDrag } from "./sidebar-state";

/**
 * Invisible 8px strip on the left edge of the content panel. Shows the
 * col-resize cursor, drags the sidebar open or closed, and toggles on
 * double-click. Nothing is drawn.
 */
export function ResizeHandle() {
  const onPointerDown = useEdgeDrag();
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Drag to resize the sidebar"
      onPointerDown={onPointerDown}
      onDoubleClick={toggleCollapsed}
      className="absolute top-0 bottom-0 left-0 z-20 w-2 cursor-col-resize touch-none select-none"
    />
  );
}
