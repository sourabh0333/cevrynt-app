import { ApplyView } from "@/components/apply/ApplyView";
import { funder } from "@/lib/sample-data/merchant-link";

export const metadata = { title: `${funder.name} · Apply for funding` };

// The public application form preview, from design/Apply-Form.html and its prototype.
// Public forms are coming soon (CLAUDE.md); the page says so in its banner.
export default function ApplyPage() {
  return <ApplyView />;
}
