import { Suspense } from "react";
import { notFound } from "next/navigation";
import { comingItem, navSections } from "@/lib/nav";

/**
 * Simple placeholder for internal routes that are not built yet.
 * Each real page replaces this as it lands (a static route always wins
 * over this catch-all). Only the known routes from BUILD-PLAN.md render;
 * anything else is a 404.
 */
const placeholders: Record<string, string> = {
  "/tasks": "My tasks",
  "/intake": "Intake",
  "/intake/manual": "Manual lead",
  "/intake/package": "Package upload",
  "/intake/bulk": "Bulk upload",
  "/submissions": "Submissions",
  "/offers": "Offers & funding",
  "/merchants": "Merchants",
  "/funded": "Funded deals",
  "/renewals": "Renewals",
  "/stacking": "Stacking Watch",
  "/brokers": "Brokers",
  "/reports": "Reports",
  "/settings/policy": "Policy",
  "/settings/pricing": "Pricing",
  "/settings/intake": "Intake channels",
  "/settings/renewals": "Renewal rules",
  "/settings/team": "Team",
  "/settings/workspace": "Workspace",
  "/settings/plan": "Plan",
  "/settings/security": "Security",
  "/settings/audit": "Audit log",
  "/whats-coming": "What's coming",
};

export function generateStaticParams() {
  return Object.keys(placeholders).map((path) => ({
    slug: path.slice(1).split("/"),
  }));
}

// With cacheComponents on, params must be read inside a Suspense boundary
// so navigation stays instant.
export default function PlaceholderPage({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={null}>
      <PlaceholderContent params={params} />
    </Suspense>
  );
}

async function PlaceholderContent({
  params,
}: {
  params: PageProps<"/[...slug]">["params"];
}) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  // Deal pages (/deals/[id]...) arrive in Step 4 of the build plan.
  const title =
    placeholders[path] ?? (slug[0] === "deals" && slug[1] ? `Deal ${slug[1]}` : undefined);
  if (!title) notFound();

  const inNav =
    navSections
      .flatMap((s) => s.items)
      .find((i) => i.href !== "/" && path.startsWith(i.href.split("/").slice(0, 2).join("/")))
      ?.label ?? (path === comingItem.href ? comingItem.label : null);

  return (
    <>
      <header className="mb-1.5">
        <h1 className="font-heading text-page-title font-semibold leading-[1.05] tracking-[-0.035em] text-ink">
          {title}
        </h1>
        <p className="mt-2.5 text-label text-hint">
          {inNav ? `${inNav} · ` : ""}
          <span className="font-mono">{path}</span>
        </p>
      </header>
      <div className="rounded-card-lg bg-card p-5">
        <p className="text-body-sm text-muted">
          This page is built in a later step of BUILD-PLAN.md.
        </p>
      </div>
    </>
  );
}
