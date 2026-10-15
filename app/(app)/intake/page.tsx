import { IntakeHub } from "@/components/intake/IntakeHub";

export const metadata = { title: "Intake · Cevrynt" };

// Intake hub, from design/Intake.html. The three channels that arrive on
// their own are not live (CLAUDE.md) and show as "Coming soon" cards.
export default function IntakePage() {
  return <IntakeHub />;
}
