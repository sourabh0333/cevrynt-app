import { AppShell } from "@/components/shell/AppShell";

// Every internal page lives in this route group and gets the shell.
// Public pages (/m/[token], /apply) and /dev stay outside it.
export default function InternalLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
