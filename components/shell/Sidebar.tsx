"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useSyncExternalStore, type PointerEvent } from "react";
import { Icon } from "./icons";
import {
  activeNavKey,
  comingItem,
  currentUser,
  navSections,
  workspace,
  type NavItem,
} from "@/lib/nav";

/**
 * Sidebar matching the one rendered inside design/Main.html, with the
 * collapse behavior from design/prototypes/Sidebar.dc.html.
 *
 * Open: 240px. Collapsed: a 76px icon rail with the CY mark, the open
 * button, the RC badge, centered icons with the page name as a tooltip,
 * count badges as small dots, captions as thin dividers, the What's coming
 * icon and Maya's avatar. Three ways to switch: the button at the top,
 * dragging the right edge (left to collapse, right to open), or
 * double-clicking that edge. The choice is remembered in localStorage
 * "cevrynt-sidebar". The width eases over 220ms.
 *
 * The collapsed look is driven by the `collapsed:` Tailwind variant, which
 * keys off <html data-sidebar="collapsed">. An inline script in
 * app/layout.tsx sets that attribute before first paint, so there is no
 * flash and no hydration mismatch: the markup is the same in both states.
 */
const STORAGE_KEY = "cevrynt-sidebar";
const DRAG_THRESHOLD = 40;

function readCollapsed(): boolean {
  return document.documentElement.getAttribute("data-sidebar") === "collapsed";
}

function applyCollapsed(value: boolean) {
  const root = document.documentElement;
  if (value) root.setAttribute("data-sidebar", "collapsed");
  else root.removeAttribute("data-sidebar");
  try {
    localStorage.setItem(STORAGE_KEY, value ? "collapsed" : "open");
  } catch {}
}

// The <html data-sidebar> attribute is the source of truth. React subscribes
// to it, so the server snapshot (open) and the client snapshot stay in step
// with what the boot script painted.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-sidebar"],
  });
  return () => observer.disconnect();
}
const getServerSnapshot = () => false;

export function Sidebar() {
  const pathname = usePathname();
  const active = activeNavKey(pathname);

  const collapsed = useSyncExternalStore(subscribe, readCollapsed, getServerSnapshot);

  const setCol = useCallback((value: boolean) => {
    applyCollapsed(value);
  }, []);

  const toggle = useCallback(() => setCol(!readCollapsed()), [setCol]);

  // Drag on the right edge: move 40px left to collapse, 40px right to open.
  const dragRef = useRef<{ x0: number; start: boolean } | null>(null);
  const onHandlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragRef.current = { x0: e.clientX, start: readCollapsed() };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const move = (ev: globalThis.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = ev.clientX - d.x0;
      if (!d.start && dx < -DRAG_THRESHOLD) {
        setCol(true);
        d.start = true;
        d.x0 = ev.clientX;
      } else if (d.start && dx > DRAG_THRESHOLD) {
        setCol(false);
        d.start = false;
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
  };

  const toggleLabel = collapsed ? "Open sidebar" : "Close sidebar";

  return (
    <aside
      aria-label="Main navigation"
      className="relative box-border flex h-full w-[240px] flex-col overflow-hidden pt-2.5 pr-3.5 pb-1 pl-[18px] text-body text-muted transition-[width] duration-[220ms] ease-[ease] collapsed:w-[76px] collapsed:px-3"
    >
      {/* Drag handle on the right edge. A thin mint line shows on hover. */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Drag to resize the sidebar"
        title="Drag or double-click to resize"
        onPointerDown={onHandlePointerDown}
        onDoubleClick={toggle}
        className="absolute top-0 right-0 bottom-0 z-[5] flex w-2.5 cursor-col-resize justify-center touch-none after:h-full after:w-[3px] after:rounded-[2px] after:bg-transparent after:transition-colors after:duration-150 after:content-[''] hover:after:bg-mint"
      />

      {/* Head: logo + collapse button */}
      <div className="flex flex-none items-center justify-between px-1 pt-1.5 pb-[18px] collapsed:flex-col collapsed:gap-3 collapsed:pb-3.5">
        <Link href="/" aria-label="Cevrynt home" className="flex items-center">
          <Image
            src="/brand/cevrynt-logo-full-onlight.png"
            alt="Cevrynt"
            width={1029}
            height={366}
            priority
            // next/image wants the auto dimension as an inline style
            style={{ height: 42, width: "auto" }}
            className="block collapsed:hidden"
          />
          <Image
            src="/brand/cevrynt-mark-solid.png"
            alt="Cevrynt"
            width={392}
            height={366}
            priority
            style={{ height: 34, width: "auto" }}
            className="hidden collapsed:block"
          />
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          className="grid h-8 w-8 flex-none cursor-pointer place-items-center rounded-[10px] border-0 bg-teal/7 text-ink"
        >
          <Icon name="sidebar" size={16} />
        </button>
      </div>

      {/* Workspace switcher */}
      <button
        type="button"
        title={workspace.name}
        className="mb-2.5 flex flex-none cursor-pointer items-center gap-2.5 rounded-[16px] border border-teal/7 bg-teal/7 p-2.5 text-left text-muted collapsed:justify-center collapsed:p-1.5"
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-teal text-[12px] font-bold text-white">
          {workspace.initials}
        </span>
        <span className="min-w-0 flex-1 collapsed:hidden">
          <b className="block text-body-sm">{workspace.name}</b>
          <span className="block text-[11.5px] text-muted">{workspace.kind}</span>
        </span>
        <Icon
          name="chevrons"
          size={14}
          strokeWidth={2}
          className="text-icon-soft collapsed:hidden"
        />
      </button>

      {/* Middle: the only part that scrolls */}
      <nav className="scrollbar-none -mx-1.5 flex min-h-0 flex-1 flex-col gap-px overflow-x-hidden overflow-y-auto px-1.5 pb-2">
        {navSections.map((section, i) => (
          <div key={section.label} className="contents">
            <div
              className={`px-2.5 pb-[5px] text-cap font-semibold uppercase text-muted ${
                i === 0 ? "pt-3" : "pt-3.5"
              } collapsed:mx-2 collapsed:border-t collapsed:border-line-soft collapsed:px-2.5 collapsed:pt-2 collapsed:pb-1.5`}
            >
              <span className="collapsed:hidden">{section.label}</span>
            </div>
            {section.items.map((item) => (
              <NavLink key={item.key} item={item} active={active === item.key} />
            ))}
          </div>
        ))}
      </nav>

      {/* Foot: What's coming */}
      <div className="flex-none border-t border-line-strong pt-2.5">
        <Link
          href={comingItem.href}
          title={comingItem.label}
          aria-current={active === comingItem.key ? "page" : undefined}
          className={`flex items-center gap-3 rounded-[12px] border border-dashed border-line-dashed px-2.5 py-2 text-body-sm font-medium no-underline collapsed:justify-center collapsed:px-0 collapsed:py-2.5 ${
            active === comingItem.key
              ? "bg-mint-bg font-semibold text-teal-dark"
              : "text-muted hover:bg-hover hover:text-ink"
          }`}
        >
          <Icon name="star" className="flex-none text-teal" />
          <span className="collapsed:hidden">{comingItem.label}</span>
          <span className="ml-auto text-[10.5px] font-semibold text-teal-deep collapsed:hidden">
            {comingItem.note}
          </span>
        </Link>
      </div>

      {/* Profile */}
      <div
        title={currentUser.name}
        className="flex flex-none items-center gap-2.5 px-1 pt-3 pb-2.5 collapsed:justify-center"
      >
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-[linear-gradient(140deg,#E8C9A1,#C99A6B)] text-[12.5px] font-bold text-sand-text">
          {currentUser.initials}
        </span>
        <span className="collapsed:hidden">
          <b className="block text-body-sm">{currentUser.name}</b>
          <span className="block text-label-sm text-muted">{currentUser.role}</span>
        </span>
      </div>
    </aside>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      title={item.label}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-[12px] px-2.5 py-2 text-body-sm no-underline collapsed:justify-center collapsed:px-0 collapsed:py-2.5 ${
        active
          ? "bg-mint-bg font-semibold text-teal-dark"
          : "font-medium text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <Icon name={item.icon} className="flex-none" />
      <span className="collapsed:hidden">{item.label}</span>
      {item.badge ? (
        <>
          {/* Open: count pill. Collapsed: a small dot on the icon. */}
          <span
            className={`ml-auto rounded-pill px-[7px] py-px text-label-sm font-semibold collapsed:hidden ${
              item.badge.tone === "alert"
                ? "bg-coral/20 text-coral-text"
                : "bg-teal/7 text-muted"
            }`}
          >
            {item.badge.count}
          </span>
          <span
            aria-hidden="true"
            className={`absolute top-1.5 right-[13px] hidden h-[7px] w-[7px] rounded-full collapsed:block ${
              item.badge.tone === "alert" ? "bg-red" : "bg-teal"
            }`}
          />
        </>
      ) : null}
    </Link>
  );
}
