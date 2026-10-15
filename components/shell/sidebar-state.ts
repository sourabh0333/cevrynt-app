"use client";

import { useCallback, useRef, useSyncExternalStore, type PointerEvent } from "react";

/**
 * Sidebar open / collapsed state, shared by the Sidebar and the resize
 * handle on the content panel's edge.
 *
 * The <html data-sidebar="collapsed"> attribute is the source of truth. An
 * inline boot script in app/layout.tsx sets it from localStorage before the
 * first paint, the `collapsed:` Tailwind variant styles off it, and React
 * subscribes to it here, so the server snapshot (open) and the client stay
 * in step with what was painted.
 */
export const SIDEBAR_STORAGE_KEY = "cevrynt-sidebar";
const DRAG_THRESHOLD = 40;

export function readCollapsed(): boolean {
  return document.documentElement.getAttribute("data-sidebar") === "collapsed";
}

export function applyCollapsed(value: boolean) {
  const root = document.documentElement;
  if (value) root.setAttribute("data-sidebar", "collapsed");
  else root.removeAttribute("data-sidebar");
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, value ? "collapsed" : "open");
  } catch {}
}

export function toggleCollapsed() {
  applyCollapsed(!readCollapsed());
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-sidebar"],
  });
  return () => observer.disconnect();
}
const getServerSnapshot = () => false;

export function useCollapsed(): boolean {
  return useSyncExternalStore(subscribe, readCollapsed, getServerSnapshot);
}

/**
 * Drag on a vertical edge: 40px to the left collapses, 40px to the right
 * opens, and you can keep dragging to flip back before releasing.
 */
export function useEdgeDrag() {
  const dragRef = useRef<{ x0: number; collapsed: boolean } | null>(null);

  return useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { x0: e.clientX, collapsed: readCollapsed() };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const move = (ev: globalThis.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.x0;
      if (!d.collapsed && dx < -DRAG_THRESHOLD) {
        applyCollapsed(true);
        d.collapsed = true;
        d.x0 = ev.clientX;
      } else if (d.collapsed && dx > DRAG_THRESHOLD) {
        applyCollapsed(false);
        d.collapsed = false;
        d.x0 = ev.clientX;
      }
    };
    const up = () => {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }, []);
}
