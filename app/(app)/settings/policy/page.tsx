import { PolicyBottom } from "@/components/settings/policy/PolicyBottom";
import { PolicyTop } from "@/components/settings/policy/PolicyTop";

export const metadata = { title: "Policy · Settings · Cevrynt" };

// Settings → Policy, from design/Settings.html and its prototype.
export default function PolicyPage() {
  return (
    <>
      <PolicyTop />
      <PolicyBottom />
    </>
  );
}
