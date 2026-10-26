"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicFunder } from "@/lib/data/views/public";

/**
 * The funder every public page is branded as, loaded once by the (public)
 * layout from the workspace record. A context, so the "not found" and
 * error pages (which can't load data themselves) are branded the same way.
 * null if the workspace couldn't be loaded: the pages then leave the
 * funder's name and legal line out.
 */
const FunderContext = createContext<PublicFunder | null>(null);

export function FunderProvider({ funder, children }: { funder: PublicFunder | null; children: ReactNode }) {
  return <FunderContext.Provider value={funder}>{children}</FunderContext.Provider>;
}

export const useFunder = () => useContext(FunderContext);
