"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StateCard } from "@/components/ui/StateCard";
import { notFoundCopy } from "@/lib/copy/states";

/**
 * "There's no deal APP-… in Ridgeline Capital". The id comes from the URL,
 * since a not-found view gets no params; the workspace name from the
 * workspace record (props). Without either, it says "We couldn't find that deal".
 */
export function DealNotFoundCard({ workspace }: { workspace: string | null }) {
  const pathname = usePathname();
  const id = pathname?.split("/")[2] ? decodeURIComponent(pathname.split("/")[2]) : "";
  const c = notFoundCopy.deal;
  return (
    <StateCard title={id && workspace ? c.title(id, workspace) : c.titleNoId} text={c.text}>
      <Button href={c.action.href}>{c.action.label}</Button>
    </StateCard>
  );
}
