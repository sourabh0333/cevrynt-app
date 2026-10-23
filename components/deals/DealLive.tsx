"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Live = { waiting: number | null; setWaiting: (n: number | null) => void };

const LiveContext = createContext<Live | null>(null);

/**
 * Page state the deal frame follows while a tab is open. Today that is the
 * number of conditions still waiting: the Conditions tab reports it as the
 * underwriter marks items done or waives them, so the tab bar's count
 * follows the conditions on the page. Once the tab closes the count goes
 * back to the deal's saved conditions.
 */
export function DealLiveProvider({ children }: { children: ReactNode }) {
  const [waiting, setWaiting] = useState<number | null>(null);
  const value = useMemo(() => ({ waiting, setWaiting }), [waiting]);
  return <LiveContext value={value}>{children}</LiveContext>;
}

/** The conditions still waiting on the open Conditions tab, or null when it isn't open. */
export const useLiveWaiting = () => useContext(LiveContext)?.waiting ?? null;

/** Reports the conditions still waiting on this page to the tab bar, and clears it on leaving. */
export function useReportWaiting(n: number) {
  const setWaiting = useContext(LiveContext)?.setWaiting;
  useEffect(() => {
    setWaiting?.(n);
  }, [n, setWaiting]);
  useEffect(() => () => setWaiting?.(null), [setWaiting]);
}
