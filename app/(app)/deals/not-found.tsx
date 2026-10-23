"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { StateCard } from "@/components/ui/StateCard";
import { notFoundCopy } from "@/lib/copy/states";
import { workspace } from "@/lib/nav";

/**
 * A deal id that doesn't exist. It sits on /deals rather than /deals/[id]
 * because the deal layout is what calls notFound(), and a layout's
 * notFound() is caught one level up. The id comes from the URL, since a
 * not-found view gets no params.
 */
export default function DealNotFound() {
  const pathname = usePathname();
  const id = pathname?.split("/")[2] ? decodeURIComponent(pathname.split("/")[2]) : "";
  const c = notFoundCopy.deal;
  return (
    <StateCard title={id ? c.title(id, workspace.name) : c.titleNoId} text={c.text}>
      <Button href={c.action.href}>{c.action.label}</Button>
    </StateCard>
  );
}
