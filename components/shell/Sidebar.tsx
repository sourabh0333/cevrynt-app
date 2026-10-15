"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
 * Sidebar, open state, matching the one rendered inside design/Main.html.
 *
 * Three parts: head (logo, close button, workspace) and foot (What's coming,
 * profile) never move; only the middle list scrolls, with a hidden
 * scrollbar. 240px wide, padding 10px 14px 4px 18px.
 *
 * Collapsing, drag-to-resize and the Ask Cevrynt popup come in later steps.
 */
export function Sidebar() {
  const pathname = usePathname();
  const active = activeNavKey(pathname);

  return (
    <aside
      aria-label="Main navigation"
      className="relative box-border flex h-full w-[240px] flex-col overflow-hidden pt-2.5 pr-3.5 pb-1 pl-[18px] text-body text-muted"
    >
      {/* Head: logo + collapse button */}
      <div className="flex flex-none items-center justify-between px-1 pt-1.5 pb-[18px]">
        <Link href="/" aria-label="Cevrynt home" className="flex items-center">
          <Image
            src="/brand/cevrynt-logo-full-onlight.png"
            alt="Cevrynt"
            width={118}
            height={42}
            priority
            className="h-[42px] w-auto"
          />
        </Link>
        <button
          type="button"
          aria-label="Close sidebar"
          title="Close sidebar"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-[10px] border-0 bg-teal/7 text-ink"
        >
          <Icon name="sidebar" size={16} />
        </button>
      </div>

      {/* Workspace switcher */}
      <button
        type="button"
        title={workspace.name}
        className="mb-2.5 flex flex-none cursor-pointer items-center gap-2.5 rounded-[16px] border border-teal/7 bg-teal/7 p-2.5 text-left text-muted"
      >
        <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-teal text-[12px] font-bold text-white">
          {workspace.initials}
        </span>
        <span className="min-w-0 flex-1">
          <b className="block text-body-sm">{workspace.name}</b>
          <span className="block text-[11.5px] text-muted">{workspace.kind}</span>
        </span>
        <Icon name="chevrons" size={14} strokeWidth={2} className="text-icon-soft" />
      </button>

      {/* Middle: the only part that scrolls */}
      <nav className="scrollbar-none -mx-1.5 flex min-h-0 flex-1 flex-col gap-px overflow-x-hidden overflow-y-auto px-1.5 pb-2">
        {navSections.map((section, i) => (
          <div key={section.label} className="contents">
            <div
              className={`text-cap font-semibold uppercase text-muted ${
                i === 0 ? "pt-3" : "pt-3.5"
              } px-2.5 pb-[5px]`}
            >
              {section.label}
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
          className={`flex items-center gap-3 rounded-[12px] border border-dashed border-line-dashed px-2.5 py-2 text-body-sm font-medium no-underline ${
            active === comingItem.key
              ? "bg-mint-bg font-semibold text-teal-dark"
              : "text-muted hover:bg-hover hover:text-ink"
          }`}
        >
          <Icon name="star" className="text-teal" />
          <span>{comingItem.label}</span>
          <span className="ml-auto text-[10.5px] font-semibold text-teal-deep">
            {comingItem.note}
          </span>
        </Link>
      </div>

      {/* Profile */}
      <div
        title={currentUser.name}
        className="flex flex-none items-center gap-2.5 px-1 pt-3 pb-2.5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[linear-gradient(140deg,#E8C9A1,#C99A6B)] text-[12.5px] font-bold text-sand-text">
          {currentUser.initials}
        </span>
        <span>
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
      className={`flex items-center gap-3 rounded-[12px] px-2.5 py-2 text-body-sm no-underline ${
        active
          ? "bg-mint-bg font-semibold text-teal-dark"
          : "font-medium text-muted hover:bg-hover hover:text-ink"
      }`}
    >
      <Icon name={item.icon} />
      <span>{item.label}</span>
      {item.badge ? (
        <span
          className={`ml-auto rounded-pill px-[7px] py-px text-label-sm font-semibold ${
            item.badge.tone === "alert"
              ? "bg-coral/20 text-coral-text"
              : "bg-teal/7 text-muted"
          }`}
        >
          {item.badge.count}
        </span>
      ) : null}
    </Link>
  );
}
