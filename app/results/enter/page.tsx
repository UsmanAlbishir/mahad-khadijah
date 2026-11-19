import { AppShell } from "@/components/layout/app-shell";
import { ResultsWorkspace } from "@/components/results/results-workspace";

export default function EnterResultsPage() {
  return <AppShell><ResultsWorkspace panel="admin" view="entry" /></AppShell>;
}
