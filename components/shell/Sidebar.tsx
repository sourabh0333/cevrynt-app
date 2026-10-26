"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { fade, glide } from "./sidebar-classes";
import { toggleCollapsed, useCollapsed } from "./sidebar-state";
import { activeNavKey, comingItem, navSections, type NavBadge, type NavItem } from "@/lib/nav";

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

/**
 * The sidebar with the current page lit. It reads the URL, so on dynamic
 * routes (deal pages) it must sit inside a Suspense boundary; AppShell
 * shows the plain Sidebar as the fallback until the path streams in.
 */
export function CurrentSidebar(props: Omit<SidebarProps, "pathname">) {
  const pathname = usePathname();
  return <Sidebar pathname={pathname} {...props} />;
}

/** Badges counted on the server from the data layer, by nav key; they replace the item's own. */
export type NavBadges = Partial<Record<string, ReactNode>>;

/**
 * Parts rendered on the server from the data layer and passed in:
 * workspace: the workspace switcher (the workspace record).
 * profile: the signed-in person (getCurrentUser).
 * comingNote: the "10 new" beside What's coming.
 * badges: the counts beside nav items (My tasks, Submissions, Renewals, Stacking Watch).
 */
type SidebarProps = { pathname?: string | null; workspace?: ReactNode; profile?: ReactNode; comingNote?: ReactNode; badges?: NavBadges };

export function Sidebar({ pathname = null, workspace = null, profile = null, comingNote = null, badges = {} }: SidebarProps) {
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
      {workspace}

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
              <NavLink key={item.key} item={item} active={active === item.key} badge={badges[item.key]} />
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
      {profile}
    </aside>
  );
}

function NavLink({ item, active, badge }: { item: NavItem; active: boolean; badge?: ReactNode }) {
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
      {badge}
    </Link>
  );
}

/** A nav item's count. Open: the count pill. Collapsed: a small dot on the icon. */
export function NavBadgeMarks({ count, tone }: NavBadge) {
  return (
    <>
      <span
        className={`absolute top-1/2 right-2.5 -translate-y-1/2 rounded-pill px-[7px] py-px text-label-sm font-semibold ${fade} ${
          tone === "alert" ? "bg-coral/20 text-coral-text" : "bg-teal/7 text-muted"
        }`}
      >
        {count}
      </span>
      <span
        aria-hidden="true"
        className={`absolute top-1.5 right-[13px] h-[7px] w-[7px] rounded-full opacity-0 transition-opacity duration-[120ms] collapsed:opacity-100 collapsed:delay-150 ${
          tone === "alert" ? "bg-red" : "bg-teal"
        }`}
      />
    </>
  );
}
