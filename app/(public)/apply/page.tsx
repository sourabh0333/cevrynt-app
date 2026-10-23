import { Suspense } from "react";
import { ApplyView } from "@/components/apply/ApplyView";
import { getPolicy } from "@/lib/data/settings";
import { funder } from "@/lib/sample-data/merchant-link";

export const metadata = { title: `${funder.name} · Apply for funding` };

// The public application form preview, from design/Apply-Form.html and its prototype.
// Public forms are coming soon (CLAUDE.md); the page says so in its banner.
export default function ApplyPage() {
  return (
    <Suspense fallback={null}>
      <ApplyData />
    </Suspense>
  );
}

/** The amount slider spans the live policy's offer range. */
async function ApplyData() {
  const { limits } = await getPolicy();
  return <ApplyView limits={{ minAmount: limits.minAmount, maxAmount: limits.maxAmount }} />;
}
