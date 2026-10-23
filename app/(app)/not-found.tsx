import { Button } from "@/components/ui/Button";
import { StateCard } from "@/components/ui/StateCard";
import { notFoundCopy } from "@/lib/copy/states";

/** Any unknown page inside the app: shown in the shell, with the sidebar. */
export default function AppNotFound() {
  const c = notFoundCopy.page;
  return (
    <StateCard title={c.title} text={c.text}>
      <Button href={c.action.href}>{c.action.label}</Button>
    </StateCard>
  );
}
