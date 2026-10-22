import { AuditView } from "@/components/settings/audit/AuditView";

export const metadata = { title: "Audit log · Settings · Cevrynt" };

// Settings → Audit log, from design/Settings-Audit.html and its prototype.
export default function AuditPage() {
  return <AuditView />;
}
