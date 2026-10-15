"use client";

import { useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Icon } from "./icons";

/**
 * Ask Cevrynt, from design/prototypes/Sidebar.dc.html (look: Main.html).
 *
 * First visit: a popup card at the bottom right of the content panel.
 * Closing it in any way (✕, Not now, Ask a question) remembers
 * "cevrynt-ask-seen" in localStorage, so it never opens by itself again.
 * After that a small teal sparkle button sits in the same spot and opens
 * the popup on demand. "Ask a question" only closes it for now.
 *
 * No flash: the boot script in app/layout.tsx sets <html data-ask="seen">
 * before first paint for people who already closed it, and this component
 * renders nothing on the server, so the right thing appears once on the
 * client. It is positioned inside the content panel's wrapper, so it can
 * never cover the sidebar, open or collapsed.
 */
const STORAGE_KEY = "cevrynt-ask-seen";

type Seen = "ssr" | "new" | "seen";

function readSeen(): Seen {
  return document.documentElement.getAttribute("data-ask") === "seen" ? "seen" : "new";
}
function markSeen() {
  document.documentElement.setAttribute("data-ask", "seen");
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {}
}
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-ask"],
  });
  return () => observer.disconnect();
}
const getServerSnapshot = (): Seen => "ssr";

export function AskCevrynt() {
  const seen = useSyncExternalStore(subscribe, readSeen, getServerSnapshot);
  // null = default for this visit (open on a first visit, closed otherwise)
  const [override, setOverride] = useState<boolean | null>(null);

  if (seen === "ssr") return null;

  const open = override ?? seen === "new";
  const close = () => {
    markSeen();
    setOverride(false);
  };
  const reopen = () => setOverride(true);

  if (!open) {
    return (
      <button
        type="button"
        onClick={reopen}
        aria-label="Ask Cevrynt"
        title="Ask Cevrynt"
        className="anim-rise absolute right-3.5 bottom-3.5 z-30 grid h-[52px] w-[52px] cursor-pointer place-items-center rounded-[18px] border-0 bg-teal text-white shadow-[0_16px_32px_-14px_rgba(14,107,92,.7)]"
      >
        <Icon name="star" size={20} strokeLinecap="butt" />
      </button>
    );
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") close();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="ask-cevrynt-title"
      onKeyDown={onKeyDown}
      className="anim-rise absolute right-3.5 bottom-3.5 z-30 box-border w-[320px] max-w-[calc(100%-28px)] rounded-card border border-mint-border bg-mint-card p-[18px] text-ink shadow-[0_24px_50px_-24px_rgba(15,21,19,.45)]"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-3 right-3 grid h-[30px] w-[30px] cursor-pointer place-items-center rounded-full border-0 bg-white/80 text-ink"
      >
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      <span className="mb-2.5 grid h-9 w-9 place-items-center rounded-[12px] bg-teal text-white">
        <Icon name="star" size={18} strokeLinecap="butt" />
      </span>
      <b id="ask-cevrynt-title" className="block font-heading text-[15px] font-bold">
        Ask Cevrynt
      </b>
      <p className="mt-1 mb-3.5 text-[12.5px] leading-[1.45] text-grey-text">
        Questions about any deal, merchant or broker, answered from your own
        data with links to the evidence.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={close}
          className="h-10 flex-1 cursor-pointer rounded-pill border-0 bg-teal text-[12.5px] font-semibold text-white"
        >
          Ask a question
        </button>
        <button
          type="button"
          onClick={close}
          className="h-10 cursor-pointer rounded-pill border-0 bg-white/80 px-3.5 text-[12.5px] font-semibold text-ink"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
