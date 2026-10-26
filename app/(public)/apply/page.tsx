import { Suspense } from "react";
import { ApplyView } from "@/components/apply/ApplyView";
import { pageTitle } from "@/lib/copy/apply";
import { applyView, publicFunder } from "@/lib/data/views/public";

export async function generateMetadata() {
  const funder = await publicFunder();
  return { title: pageTitle(funder.name) };
}

// The public application form preview, from design/Apply-Form.html and its prototype.
// Public forms are coming soon (CLAUDE.md); the page says so in its banner.
export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyData />
    </Suspense>
  );
}

/** The amount slider spans the live policy's offer range; the address and phone are the workspace's. */
async function ApplyData() {
  return <ApplyView data={await applyView()} />;
}
