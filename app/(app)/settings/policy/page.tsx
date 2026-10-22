import { PolicyTop } from "@/components/settings/policy/PolicyTop";

export const metadata = { title: "Policy · Settings · Cevrynt" };

// Settings → Policy, from design/Settings.html and its prototype.
// This step holds the header, rules and simulator; the rows below come next.
export default function PolicyPage() {
  return <PolicyTop />;
}
