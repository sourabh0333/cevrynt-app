import { redirect } from "next/navigation";

// /settings opens Policy, the first section.
export default function SettingsIndex() {
  redirect("/settings/policy");
}
