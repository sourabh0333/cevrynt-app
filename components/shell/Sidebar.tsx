"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { toggleCollapsed, useCollapsed } from "./sidebar-state";
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
 * Open: 240px. Collapsed: a 76px icon rail. The width and the side padding
 * ease over 300ms (ease-sidebar, a smooth in-out curve); each row's left
 * padding eases by the same amount the other way, so the icons never move.
 * Texts are anchored absolutely, fade and slide out in 100ms on collapse,
 * and fade in after 120ms on expand, so nothing wraps or jumps. The two logos
 * crossfade and the toggle button glides from the top right to under the
 * mark. The head keeps a constant height so the list never shifts.
 *
 * State lives in <html data-sidebar> (see sidebar-state.ts). The drag and
 * double-click edge is on the content panel (ResizeHandle).
 */

// Text that leaves on collapse and returns once the rail has mostly opened.
const fade =
  "whitespace-nowrap transition-[opacity,transform,visibility] duration-[100ms] ease-out delay-[120ms] collapsed:invisible collapsed:-translate-x-1 collapsed:opacity-0 collapsed:delay-0";

// Padding that eases in step with the sidebar width.
const glide = "transition-[padding] duration-300 ease-sidebar";

/**
 * The sidebar with the current page lit. It reads the URL, so on dynamic
 * routes (deal pages) it must sit inside a Suspense boundary; AppShell
 * shows the plain Sidebar as the fallback until the path streams in.
 */
export function CurrentSidebar({ comingNote }: { comingNote?: ReactNode }) {
  const pathname = usePathname();
  return <Sidebar pathname={pathname} comingNote={comingNote} />;
}

/** comingNote: the "10 new" beside What's coming, rendered on the server from the data layer. */
export function Sidebar({ pathname = null, comingNote = null }: { pathname?: string | null; comingNote?: ReactNode }) {
  const active = pathname ? activeNavKey(pathname) : null;
  const collapsed = useCollapsed();
  const toggleLabel = collapsed ? "Open sidebar" : "Close sidebar";

  return (
    <aside
      aria-label="Main navigation"
      className="relative box-border flex h-full w-[240px] flex-col overflow-hidden pt-2.5 pr-3.5 pb-1 pl-[18px] text-body text-muted transition-[width,padding] duration-300 ease-sidebar collapsed:w-[76px] collapsed:px-3"
    >
      {/* Head: constant 66px tall. Logos crossfade; the button glides. */}
      <div className="relative h-[66px] flex-none transition-[height] duration-300 ease-sidebar collapsed:h-[98px]">
        <Link
          href="/"
          aria-label="Cevrynt home"
          className="absolute top-0 left-0 block h-12 w-[130px]"
        >
          <Image
            src="/brand/cevrynt-logo-full-onlight.png"
            alt="Cevrynt"
            width={1029}
            height={366}
            priority
            style={{ height: 42, width: "auto" }}
            className="absolute top-1.5 left-1 block transition-opacity duration-150 collapsed:opacity-0"
          />
          <Image
            src="/brand/cevrynt-mark-solid.png"
            alt=""
            width={392}
            height={366}
            priority
            style={{ height: 34, width: "auto" }}
            className="absolute top-1.5 left-2 block opacity-0 transition-opacity duration-150 collapsed:opacity-100"
          />
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={toggleLabel}
          aria-expanded={!collapsed}
          title={toggleLabel}
          className="absolute top-[11px] left-[172px] grid h-8 w-8 cursor-pointer place-items-center rounded-[10px] border-0 bg-teal/7 text-ink transition-[left,top] duration-300 ease-sidebar collapsed:top-[52px] collapsed:left-2.5"
        >
          <Icon name="sidebar" size={16} />
        </button>
      </div>

      {/* Workspace switcher: the RC badge stays, the text fades. */}
      <button
        type="button"
        title={workspace.name}
        className="relative mb-2.5 flex h-[54px] flex-none cursor-pointer items-center overflow-hidden rounded-[16px] border border-teal/7 bg-teal/7 pl-2.5 text-left text-muted transition-[padding,height] duration-300 ease-sidebar collapsed:h-[46px] collapsed:pl-[9px]"
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-teal text-[12px] font-bold text-white">
          {workspace.initials}
        </span>
        <span className={`absolute top-1/2 left-[53px] -translate-y-1/2 ${fade}`}>
          <b className="block text-body-sm">{workspace.name}</b>
          <span className="block text-[11.5px] text-muted">{workspace.kind}</span>
        </span>
        <Icon
          name="chevrons"
          size={14}
          strokeWidth={2}
          className={`absolute top-1/2 right-2.5 -translate-y-1/2 text-icon-soft ${fade}`}
        />
      </button>

      {/* Middle: the only part that scrolls */}
      <nav className="scrollbar-none -mx-1.5 flex min-h-0 flex-1 flex-col gap-px overflow-x-hidden overflow-y-auto px-1.5 pb-2">
        {navSections.map((section, i) => (
          <div key={section.label} className="contents">
            <div
              className={`relative flex-none px-2.5 pb-[5px] text-cap font-semibold uppercase text-muted ${
                i === 0 ? "pt-3" : "pt-3.5"
              } before:absolute before:top-1/2 before:right-2 before:left-2 before:h-px before:bg-line-soft before:opacity-0 before:transition-opacity before:duration-150 before:content-[''] collapsed:before:opacity-100 collapsed:before:delay-150`}
            >
              <span className={`block ${fade}`}>{section.label}</span>
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
          className={`relative flex items-center overflow-hidden rounded-[12px] border border-dashed border-line-dashed py-2 pr-2.5 pl-2.5 text-body-sm font-medium no-underline collapsed:pl-4 ${glide} ${
            active === comingItem.key
              ? "bg-mint-bg font-semibold text-teal-dark"
              : "text-muted hover:bg-hover hover:text-ink"
          }`}
        >
          <Icon name="star" className="flex-none text-teal" />
          <span className={`ml-3 ${fade}`}>{comingItem.label}</span>
          <span
            className={`absolute top-1/2 right-2.5 -translate-y-1/2 text-[10.5px] font-semibold text-teal-deep ${fade}`}
          >
            {comingNote}
          </span>
        </Link>
      </div>

      {/* Profile: the avatar stays, the text fades. */}
      <div
        title={currentUser.name}
        className={`relative flex flex-none items-center pt-3 pb-2.5 pl-1 collapsed:pl-2 ${glide}`}
      >
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-[linear-gradient(140deg,#E8C9A1,#C99A6B)] text-[12.5px] font-bold text-sand-text">
          {currentUser.initials}
        </span>
        <span className={`absolute top-1/2 left-[50px] translate-y-[1px] ${fade}`}>
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
      className={`relative flex flex-none items-center overflow-hidden rounded-[12px] py-2 pr-2.5 pl-2.5 text-body-sm no-underline collapsed:pl-4 ${glide} ${
        active
          ? "bg-mint-bg font-semibold text-teal-dark"
          : "font-medium text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <Icon name={item.icon} className="flex-none" />
      <span className={`ml-3 ${fade}`}>{item.label}</span>
      {item.badge ? (
        <>
          {/* Open: count pill. Collapsed: a small dot on the icon. */}
          <span
            className={`absolute top-1/2 right-2.5 -translate-y-1/2 rounded-pill px-[7px] py-px text-label-sm font-semibold ${fade} ${
              item.badge.tone === "alert"
                ? "bg-coral/20 text-coral-text"
                : "bg-teal/7 text-muted"
            }`}
          >
            {item.badge.count}
          </span>
          <span
            aria-hidden="true"
            className={`absolute top-1.5 right-[13px] h-[7px] w-[7px] rounded-full opacity-0 transition-opacity duration-[120ms] collapsed:opacity-100 collapsed:delay-150 ${
              item.badge.tone === "alert" ? "bg-red" : "bg-teal"
            }`}
          />
        </>
      ) : null}
    </Link>
  );
}
